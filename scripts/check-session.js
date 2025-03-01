require('dotenv').config()
const { createClient } = require('@supabase/supabase-js')

// 初始化Supabase客户端
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function checkAuthData() {
  console.log('-------------- 会话检查工具 --------------')
  
  // 检查环境变量
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    console.error('错误: 未找到 NEXT_PUBLIC_SUPABASE_URL 环境变量')
    return
  }
  
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('错误: 未找到 SUPABASE_SERVICE_ROLE_KEY 环境变量')
    return
  }
  
  console.log(`Supabase URL: ${process.env.NEXT_PUBLIC_SUPABASE_URL}`)

  try {
    // 1. 获取所有用户账户
    const { data: users, error: usersError } = await supabase.auth.admin.listUsers()
    
    if (usersError) {
      console.error('获取用户列表失败:', usersError)
      return
    }
    
    console.log(`总用户数: ${users.users.length}`)
    
    // 打印用户概要
    console.log('\n用户列表:')
    users.users.forEach((user, index) => {
      console.log(`${index + 1}. ID: ${user.id} | 邮箱: ${user.email} | 创建时间: ${new Date(user.created_at).toLocaleString()}`)
    })
    
    // 2. 检查profiles表
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*')
    
    if (profilesError) {
      console.error('获取profiles表失败:', profilesError)
    } else {
      console.log(`\n总profile数: ${profiles.length}`)
      
      // 检查是否有用户没有对应的profile
      const userIds = users.users.map(user => user.id)
      const profileIds = profiles.map(profile => profile.id)
      
      const missingProfiles = userIds.filter(id => !profileIds.includes(id))
      
      if (missingProfiles.length > 0) {
        console.log('\n警告: 以下用户没有对应的profile记录:')
        missingProfiles.forEach(id => {
          const user = users.users.find(u => u.id === id)
          console.log(`ID: ${id} | 邮箱: ${user?.email}`)
        })
      } else {
        console.log('\n所有用户都有对应的profile记录 ✅')
      }
    }
    
    // 3. 检查存储桶
    const { data: bucket, error: bucketError } = await supabase.storage.getBucket('user-uploads')
    
    if (bucketError) {
      console.error('\n获取存储桶信息失败:', bucketError)
    } else {
      console.log('\n存储桶信息:')
      console.log(`名称: ${bucket.name}`)
      console.log(`公开: ${bucket.public ? '是' : '否'}`)
      console.log(`创建时间: ${new Date(bucket.created_at).toLocaleString()}`)
    }
    
    // 4. 检查几个用户的头像存储路径
    if (profiles && profiles.length > 0) {
      console.log('\n检查用户头像:')
      
      for (let i = 0; i < Math.min(profiles.length, 5); i++) {
        const profile = profiles[i]
        if (profile.avatar_url) {
          console.log(`用户 ${profile.username || profile.id}: 头像URL = ${profile.avatar_url}`)
          
          // 提取存储路径
          const urlMatch = profile.avatar_url.match(/\/storage\/v1\/object\/public\/([^?]+)/)
          if (urlMatch && urlMatch[1]) {
            const storagePath = urlMatch[1]
            console.log(`  存储路径: ${storagePath}`)
            
            // 检查文件是否存在
            try {
              await supabase.storage.from('user-uploads').download(storagePath.replace('user-uploads/', ''))
              console.log('  文件存在 ✅')
            } catch (err) {
              console.log('  文件不存在 ❌')
            }
          }
        } else {
          console.log(`用户 ${profile.username || profile.id}: 未设置头像`)
        }
      }
    }
    
  } catch (err) {
    console.error('执行检查时出错:', err)
  }
  
  console.log('\n-------------- 检查完成 --------------')
}

// 执行检查
checkAuthData()
