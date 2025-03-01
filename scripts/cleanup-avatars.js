require('dotenv').config()
const { createClient } = require('@supabase/supabase-js')

// 初始化Supabase客户端
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

/**
 * 清理未使用的头像文件
 * 1. 获取所有用户的profiles
 * 2. 获取存储桶中所有的头像文件
 * 3. 找出未被任何用户profile引用的头像
 * 4. 删除这些未使用的头像
 */
async function cleanupAvatars() {
  try {
    console.log('开始清理未使用的头像文件...')

    // 1. 获取所有用户profiles中的avatar_url
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, avatar_url')
    
    if (profilesError) {
      console.error('获取用户profiles失败:', profilesError)
      return
    }

    console.log(`找到 ${profiles.length} 个用户profiles`)
    
    // 收集所有活跃使用中的avatar路径
    const activeAvatarPaths = []
    profiles.forEach(profile => {
      if (profile.avatar_url) {
        // 从URL中提取存储路径
        const urlMatch = profile.avatar_url.match(/\/storage\/v1\/object\/public\/user-uploads\/(.+)/)
        if (urlMatch && urlMatch[1]) {
          // 提取不带查询参数的路径
          const path = urlMatch[1].split('?')[0]
          activeAvatarPaths.push(path)
        }
      }
    })

    console.log(`找到 ${activeAvatarPaths.length} 个活跃使用中的头像路径`)
    
    // 2. 获取存储桶中所有的头像文件
    const { data: usersFolder, error: folderError } = await supabase
      .storage
      .from('user-uploads')
      .list('', {
        limit: 1000
      })
    
    if (folderError) {
      console.error('获取存储桶列表失败:', folderError)
      return
    }

    // 遍历所有用户文件夹
    let storedAvatarPaths = []
    
    for (const item of usersFolder) {
      if (item.name && !item.name.includes('.')) { // 可能是用户文件夹
        const userId = item.name
        
        // 检查用户的avatars文件夹
        const { data: avatarsFolder, error: avatarsError } = await supabase
          .storage
          .from('user-uploads')
          .list(`${userId}/avatars`, {
            limit: 1000
          })
        
        if (avatarsError) {
          console.log(`获取用户 ${userId} 的头像列表失败:`, avatarsError)
          continue
        }
        
        if (avatarsFolder && avatarsFolder.length > 0) {
          // 收集这个用户的所有头像路径
          avatarsFolder.forEach(avatar => {
            storedAvatarPaths.push(`${userId}/avatars/${avatar.name}`)
          })
        }
      }
    }

    console.log(`存储桶中找到 ${storedAvatarPaths.length} 个头像文件`)
    
    // 3. 找出未被任何用户引用的头像
    const unusedAvatarPaths = storedAvatarPaths.filter(path => 
      !activeAvatarPaths.some(activePath => activePath.includes(path))
    )
    
    console.log(`找到 ${unusedAvatarPaths.length} 个未使用的头像文件`)
    
    // 4. 删除未使用的头像
    if (unusedAvatarPaths.length > 0) {
      console.log('准备删除以下未使用的头像:')
      unusedAvatarPaths.forEach(path => console.log(` - ${path}`))
      
      // 分批删除文件，每次最多删除100个
      const batchSize = 100
      for (let i = 0; i < unusedAvatarPaths.length; i += batchSize) {
        const batch = unusedAvatarPaths.slice(i, i + batchSize)
        const { error: deleteError } = await supabase
          .storage
          .from('user-uploads')
          .remove(batch)
        
        if (deleteError) {
          console.error(`删除第 ${i/batchSize + 1} 批头像失败:`, deleteError)
        } else {
          console.log(`成功删除第 ${i/batchSize + 1} 批头像，共 ${batch.length} 个文件`)
        }
      }
    }
    
    console.log('头像清理完成')
    
  } catch (err) {
    console.error('清理过程中出错:', err)
  }
}

// 执行清理
cleanupAvatars()
