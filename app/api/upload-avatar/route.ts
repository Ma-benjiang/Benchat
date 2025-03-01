import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

export async function POST(request: NextRequest) {
  try {
    // 从请求中获取 cookies
    const cookieStore = cookies();
    
    // 创建服务器端 Supabase 客户端
    const supabaseServer = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
      {
        cookies: {
          get(name) {
            return cookieStore.get(name)?.value;
          },
          set(name, value, options) {
            cookieStore.set({ name, value, ...options });
          },
          remove(name, options) {
            cookieStore.set({ name, value: '', ...options });
          },
        },
      }
    );
    
    // 获取会话
    const { data: { session } } = await supabaseServer.auth.getSession();
    
    if (!session) {
      return NextResponse.json({ error: '未授权' }, { status: 401 });
    }
    
    const userId = session.user.id;
    
    // 解析请求体
    const formData = await request.formData();
    const file = formData.get('avatar') as File;
    
    if (!file) {
      return NextResponse.json({ error: '未提供文件' }, { status: 400 });
    }
    
    // 验证文件类型
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: '文件必须是图片' }, { status: 400 });
    }
    
    // 验证文件大小 (不超过2MB)
    if (file.size > 2 * 1024 * 1024) {
      return NextResponse.json({ error: '图片大小不能超过2MB' }, { status: 400 });
    }
    
    // 文件名格式：avatar_时间戳.扩展名
    const fileExt = file.name.split('.').pop();
    const fileName = `avatar_${Date.now()}.${fileExt}`;
    // 修改文件路径，将用户ID作为第一级目录
    const filePath = `${userId}/avatars/${fileName}`;
    
    // 上传到Supabase Storage
    const { data, error } = await supabaseServer.storage
      .from('user-uploads')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });
    
    if (error) {
      console.error('文件上传错误:', error);
      return NextResponse.json({ error: '文件上传失败' }, { status: 500 });
    }
    
    // 获取公共URL
    const { data: { publicUrl } } = supabaseServer.storage
      .from('user-uploads')
      .getPublicUrl(filePath);
    
    // 更新用户档案中的头像URL
    const { error: profileError } = await supabaseServer
      .from('profiles')
      .update({ avatar_url: publicUrl })
      .eq('id', userId);
    
    if (profileError) {
      console.error('更新用户资料错误:', profileError);
      return NextResponse.json({ error: '更新用户资料失败' }, { status: 500 });
    }
    
    return NextResponse.json({ 
      success: true, 
      avatarUrl: publicUrl 
    });
    
  } catch (error) {
    console.error('头像上传处理错误:', error);
    return NextResponse.json(
      { error: '服务器处理出错' }, 
      { status: 500 }
    );
  }
}
