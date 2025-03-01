// 确保 profiles 表存在
// 用法: node ensure-profiles-table.js

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// 从环境变量获取 Supabase 配置
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('错误: 请在 .env 文件中设置 NEXT_PUBLIC_SUPABASE_URL 和 SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

// 创建 Supabase 客户端
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function ensureProfilesTable() {
  try {
    console.log('开始检查 profiles 表...');

    // 执行SQL创建profiles表(如果不存在)和添加avatar_url列
    const sql = `
    -- 创建profiles表，用于存储用户资料
    CREATE TABLE IF NOT EXISTS profiles (
      id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      username TEXT,
      avatar_url TEXT,
      settings JSONB DEFAULT '{}'::jsonb
    );

    -- 启用RLS (行级安全)
    ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

    -- 创建profiles表的触发器，在用户注册时自动创建一个资料记录
    CREATE OR REPLACE FUNCTION public.handle_new_user() 
    RETURNS TRIGGER AS $$
    BEGIN
      INSERT INTO public.profiles (id, username)
      VALUES (NEW.id, NEW.email)
      ON CONFLICT (id) DO NOTHING;
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql SECURITY DEFINER;

    -- 创建触发器
    DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
    CREATE TRIGGER on_auth_user_created
      AFTER INSERT ON auth.users
      FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

    -- 添加profiles表的安全策略
    CREATE POLICY IF NOT EXISTS "Users can view their own profile"
      ON profiles FOR SELECT
      USING (auth.uid() = id);

    CREATE POLICY IF NOT EXISTS "Users can update their own profile"
      ON profiles FOR UPDATE
      USING (auth.uid() = id);
    `;

    // 使用rpc执行SQL
    const { error } = await supabase.rpc('maintenance', { sql_query: sql });

    if (error) {
      console.warn('警告: 使用RPC执行SQL失败，这可能需要在Supabase控制台手动设置');
      console.error('错误详情:', error.message);
      
      // 尝试使用原始查询
      console.log('尝试使用原始查询检查表是否存在...');
      
      // 检查表是否存在
      const { data: existingTables, error: tableCheckError } = await supabase
        .from('pg_tables')
        .select('tablename')
        .eq('schemaname', 'public')
        .eq('tablename', 'profiles');
        
      if (tableCheckError) {
        console.error('检查表失败:', tableCheckError.message);
      } else if (!existingTables || existingTables.length === 0) {
        console.error('未找到profiles表，请在Supabase控制台手动创建');
        console.log('\n=====================================================');
        console.log('请在 Supabase 控制台的 SQL 编辑器中执行以下 SQL:');
        console.log(sql);
        console.log('=====================================================\n');
      } else {
        console.log('profiles表已存在');
        
        // 检查用户ID与当前登录用户对应的行是否存在
        console.log('请确保当前登录用户在profiles表中有对应记录');
      }
    } else {
      console.log('profiles表检查/创建成功!');
      
      // 列出所有用户
      const { data: users, error: usersError } = await supabase
        .from('auth.users')
        .select('id, email');
        
      if (usersError) {
        console.warn('无法获取用户列表:', usersError.message);
      } else {
        console.log(`找到 ${users?.length || 0} 个用户`);
        
        // 检查每个用户是否有profiles记录
        for (const user of (users || [])) {
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('id')
            .eq('id', user.id)
            .single();
            
          if (profileError || !profile) {
            console.log(`为用户 ${user.email} 创建profile记录...`);
            const { error: insertError } = await supabase
              .from('profiles')
              .insert({ id: user.id, username: user.email });
              
            if (insertError) {
              console.error(`为用户 ${user.email} 创建profile失败:`, insertError.message);
            } else {
              console.log(`已为用户 ${user.email} 创建profile记录`);
            }
          } else {
            console.log(`用户 ${user.email} 已有profile记录`);
          }
        }
      }
    }

    console.log('profiles表检查完成!');
  } catch (error) {
    console.error('检查profiles表时出错:', error.message);
    process.exit(1);
  }
}

// 执行检查
ensureProfilesTable();
