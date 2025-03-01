require('dotenv').config()
const { createClient } = require('@supabase/supabase-js')

// 初始化Supabase客户端
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function initStorage() {
  try {
    console.log('开始初始化存储...')

    // 1. 创建用户上传存储桶
    const { data: bucket, error } = await supabase.storage.createBucket('user-uploads', {
      public: true, // 公开访问
      fileSizeLimit: 1024 * 1024 * 2, // 2MB
      allowedMimeTypes: ['image/png', 'image/jpeg', 'image/gif', 'image/webp'] 
    })

    if (error) {
      if (error.message.includes('already exists')) {
        console.log('存储桶 user-uploads 已存在，跳过创建')
      } else {
        console.error('创建存储桶失败:', error)
        return
      }
    } else {
      console.log('成功创建存储桶:', bucket)
    }

    // 2. 设置存储桶策略
    console.log('开始设置存储桶策略...')
    
    // 清除现有的所有策略
    await clearAllPolicies()
    
    // 添加基本策略：允许所有人查看文件
    await addPolicy('user-uploads', 'policy_allow_public_read', 'SELECT', 'TRUE')
    
    // 添加上传策略：允许已登录用户上传文件到自己的用户文件夹
    // 修复：确保非匿名用户可以上传文件（即使用auth.uid()而不是auth.role()判断）
    await addPolicy(
      'user-uploads',
      'policy_allow_user_upload',
      'INSERT',
      "auth.uid() IS NOT NULL AND (storage.foldername(name))[1] = auth.uid()::text"
    )
    
    // 添加删除/更新策略：允许用户删除/修改自己上传的文件
    await addPolicy(
      'user-uploads',
      'policy_allow_user_delete',
      'DELETE',
      "auth.uid() IS NOT NULL AND (storage.foldername(name))[1] = auth.uid()::text"
    )
    
    await addPolicy(
      'user-uploads',
      'policy_allow_user_update',
      'UPDATE',
      "auth.uid() IS NOT NULL AND (storage.foldername(name))[1] = auth.uid()::text"
    )
    
    console.log('存储桶策略设置完成')
    
    console.log('存储初始化完成')
  } catch (err) {
    console.error('初始化存储时出错:', err)
  }
}

// 清除指定存储桶的所有策略
async function clearAllPolicies() {
  try {
    console.log('清除所有现有策略...')
    
    // 获取存储桶的所有策略
    const { data: policies, error } = await supabase.rpc('get_policies_for_bucket', {
      bucket_name: 'user-uploads'
    })
    
    if (error) {
      console.error('获取策略失败:', error)
      return
    }
    
    // 删除每个策略
    if (policies && policies.length > 0) {
      console.log(`找到 ${policies.length} 个现有策略，准备删除...`)
      
      for (const policy of policies) {
        const { error: dropError } = await supabase.rpc('drop_policy_for_bucket', {
          bucket_name: 'user-uploads',
          policy_name: policy.policyname
        })
        
        if (dropError) {
          console.error(`删除策略 ${policy.policyname} 失败:`, dropError)
        } else {
          console.log(`成功删除策略: ${policy.policyname}`)
        }
      }
    } else {
      console.log('没有找到现有策略')
    }
  } catch (err) {
    console.error('清除策略时出错:', err)
  }
}

// 添加策略辅助函数
async function addPolicy(bucketName, policyName, operation, expression) {
  try {
    // 使用SQL直接添加策略
    const sql = `
      CREATE POLICY ${policyName}
      ON storage.objects
      FOR ${operation}
      TO authenticated
      USING (bucket_id = '${bucketName}' AND ${expression});
    `
    
    const { error } = await supabase.sql(sql)
    
    if (error) {
      console.error(`添加策略 ${policyName} 失败:`, error)
    } else {
      console.log(`成功添加策略: ${policyName}`)
    }
  } catch (err) {
    // 如果策略已存在，忽略错误
    if (err.message && err.message.includes('already exists')) {
      console.log(`策略 ${policyName} 已存在，跳过创建`)
    } else {
      console.error(`创建策略 ${policyName} 时出错:`, err)
    }
  }
}

// 执行初始化
initStorage()
