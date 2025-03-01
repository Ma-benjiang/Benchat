// 设置 Supabase 存储权限策略
// 使用方法: node setup-storage-policies.js

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

// 设置存储桶权限策略
async function setupStoragePolicies() {
  try {
    console.log('开始设置 Supabase 存储权限策略...');

    // 确保存储桶存在
    const { data: buckets, error: bucketError } = await supabase
      .storage
      .listBuckets();

    if (bucketError) {
      throw bucketError;
    }

    const userUploadsBucket = buckets.find(b => b.name === 'user-uploads');
    if (!userUploadsBucket) {
      console.error('错误: 未找到 user-uploads 存储桶, 请先创建存储桶');
      process.exit(1);
    }

    console.log('找到 user-uploads 存储桶，正在设置权限策略...');

    // 设置策略的 SQL 命令
    const createPoliciesSql = `
    -- 移除现有策略以避免冲突
    DROP POLICY IF EXISTS "Authenticated users can upload avatars" ON storage.objects;
    DROP POLICY IF EXISTS "Users can update their own avatars" ON storage.objects;
    DROP POLICY IF EXISTS "Avatar images are publicly accessible" ON storage.objects;
    DROP POLICY IF EXISTS "Users can only delete their own avatars" ON storage.objects;
    
    -- 创建新策略
    CREATE POLICY "Authenticated users can upload avatars"
      ON storage.objects FOR INSERT
      TO authenticated
      WITH CHECK (
        bucket_id = 'user-uploads' AND
        auth.uid()::text = (storage.foldername(name))[1]
      );
    
    CREATE POLICY "Users can update their own avatars"
      ON storage.objects FOR UPDATE
      TO authenticated
      USING (
        bucket_id = 'user-uploads' AND
        auth.uid()::text = (storage.foldername(name))[1]
      );
    
    CREATE POLICY "Avatar images are publicly accessible"
      ON storage.objects FOR SELECT
      TO public
      USING (bucket_id = 'user-uploads');
    
    CREATE POLICY "Users can only delete their own avatars"
      ON storage.objects FOR DELETE
      TO authenticated
      USING (
        bucket_id = 'user-uploads' AND
        auth.uid()::text = (storage.foldername(name))[1]
      );
    `;

    // 执行SQL
    const { error: sqlError } = await supabase.rpc('maintenance', { 
      sql_query: createPoliciesSql 
    });

    if (sqlError) {
      console.log('警告: 使用 rpc 方法设置策略失败, 这可能需要在 Supabase 控制台手动设置');
      console.error('错误详情:', sqlError.message);
      
      // 提供手动设置说明
      console.log('\n=====================================================');
      console.log('请在 Supabase 控制台手动设置以下权限策略:');
      console.log('1. 登录 Supabase 控制台');
      console.log('2. 进入 Storage > Policies');
      console.log('3. 为 "user-uploads" 存储桶添加以下策略:');
      console.log('   - 允许认证用户上传文件，前提是路径以用户ID开头');
      console.log('   - 允许认证用户更新自己上传的文件');
      console.log('   - 允许公开访问所有文件');
      console.log('   - 允许认证用户删除自己上传的文件');
      console.log('=====================================================\n');
    } else {
      console.log('成功设置存储权限策略!');
    }

    console.log('提示：请确保您的文件上传路径符合权限策略要求，以 userId 作为第一级目录');
    console.log('例如: 对于用户ID为 abc123，文件路径应为 abc123/avatars/image.jpg');

  } catch (error) {
    console.error('设置存储权限策略时出错:', error.message);
    process.exit(1);
  }
}

// 执行设置
setupStoragePolicies();
