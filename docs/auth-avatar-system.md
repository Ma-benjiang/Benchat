# Supabase 认证和头像系统文档

本文档介绍了 BenChat 应用中使用 Supabase 进行用户认证和头像管理的实现细节和常见问题解决方案。

## 架构概述

BenChat 使用 Supabase 提供的认证和存储服务来管理用户账户和头像图片：

1. **认证服务**：使用 Supabase Auth 处理用户注册、登录和会话管理
2. **用户资料**：在 `profiles` 表中存储用户信息，包括头像 URL
3. **文件存储**：使用 Supabase Storage 的 `user-uploads` 存储桶存储用户头像

## 头像管理流程

1. 用户上传头像图片
2. 前端将图片转换为 Base64 格式进行预览
3. 将图片文件上传到 Supabase Storage 的用户专属路径
4. 更新用户的 `profiles` 表记录，设置 `avatar_url` 字段
5. 客户端缓存头像 URL，并在会话刷新时自动更新

## 关键文件和组件

- `components/auth-refresh.tsx`: 会话状态检查和刷新组件
- `components/auth-debug.tsx`: 认证和存储诊断工具
- `components/supabase-session-provider.tsx`: 全局会话提供者组件
- `context/user-config-context.tsx`: 用户配置上下文，包含头像管理功能
- `app/api/upload-avatar/route.ts`: 头像上传 API 端点

## 初始化和设置脚本

系统包含多个实用脚本用于设置和维护存储系统：

- `scripts/init-storage.js`: 初始化 Supabase 存储桶和权限
- `scripts/ensure-profiles-table.js`: 确保 `profiles` 表正确创建
- `scripts/check-session.js`: 诊断会话和用户资料问题
- `scripts/cleanup-avatars.js`: 清理未使用的头像文件

## 运行脚本

```bash
# 初始化存储桶
npm run init-storage

# 确保profiles表创建
npm run setup-profiles

# 检查会话和用户状态
npm run check-session

# 清理未使用的头像
npm run cleanup-avatars
```

## 常见问题排查

### 1. 用户登录但头像不显示

**可能原因**：
- 用户资料表中缺少记录
- 头像 URL 存在但文件已被删除
- 会话状态未正确刷新

**解决方案**：
1. 检查用户是否有对应的 profile 记录：`npm run check-session`
2. 刷新用户会话：使用应用中的"诊断工具"按钮
3. 确保存储桶权限设置正确：`npm run init-storage`

### 2. 上传头像失败

**可能原因**：
- 存储桶权限设置不正确
- 文件大小超过限制（当前限制为 2MB）
- 网络连接问题

**解决方案**：
1. 检查控制台错误信息
2. 确认存储桶权限：`npm run init-storage`
3. 压缩图片后再次尝试上传

### 3. 登录会话频繁过期

**可能原因**：
- Supabase 会话默认有效期为 1 小时
- 刷新令牌配置不正确

**解决方案**：
1. 确保启用自动会话刷新：`<AuthRefresh>` 组件应包含在应用布局中
2. 在 Supabase 控制台中调整会话有效期

## 存储桶安全策略

我们实施了以下权限策略来保护用户数据：

- 用户只能上传文件到自己的文件夹路径（`{userId}/avatars/`）
- 用户只能删除自己上传的文件
- 头像文件是公开可读的，以便显示在应用中
- 存储操作要求有效的认证会话

## 高级功能和改进计划

- 添加图片压缩以减少存储空间使用
- 实现头像裁剪功能
- 优化头像加载性能
- 增加头像历史记录和回滚功能
