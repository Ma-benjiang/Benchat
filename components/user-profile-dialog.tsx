"use client"

import React, { useState, useRef, useEffect } from 'react';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { useUserConfig } from '@/context/user-config-context';
import { Loader2, Camera, Upload, User, CheckCircle, AlertCircle, FileText } from 'lucide-react';

interface UserProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

export function UserProfileDialog({ 
  open, 
  onOpenChange,
  children
}: UserProfileDialogProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { config, updateUserName, updateUserAvatar } = useUserConfig();
  const [editName, setEditName] = useState(config.userName);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  // 当config更改时更新editName
  useEffect(() => {
    setEditName(config.userName);
  }, [config.userName]);

  // 处理头像上传
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    
    try {
      setIsUploading(true);
      setUploadError('');
      setUploadSuccess(false);
      
      // 验证文件大小
      if (file.size > 2 * 1024 * 1024) {
        setUploadError('图片大小不能超过2MB');
        setIsUploading(false);
        return;
      }
      
      // 验证文件类型
      if (!['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(file.type)) {
        setUploadError('仅支持JPEG, PNG, GIF和WEBP格式的图片');
        setIsUploading(false);
        return;
      }
      
      // 读取文件为 Base64
      const reader = new FileReader();
      reader.onload = async (event) => {
        // 确保 result 是字符串
        const base64 = event.target?.result as string;
        
        try {
          // 先在本地预览
          setPreviewImage(base64);
          
          // 上传到服务器
          await updateUserAvatar(base64, file.type);
          
          // 成功提示
          setUploadSuccess(true);
          toast.success('头像上传成功');
          
          // 3秒后隐藏成功状态
          setTimeout(() => {
            setUploadSuccess(false);
          }, 3000);
        } catch (error: any) {
          console.error('上传处理出错:', error);
          setUploadError(`上传失败: ${error.message || '未知错误'}`);
          // 重置预览图，仅当上传失败时
          setPreviewImage(config.userAvatarUrl || config.userAvatar || null);
        } finally {
          setIsUploading(false);
        }
      };
      
      reader.onerror = () => {
        setUploadError('读取文件失败');
        setIsUploading(false);
      };
      
      reader.readAsDataURL(file);
    } catch (error: any) {
      console.error('处理文件出错:', error);
      setUploadError(`处理文件出错: ${error.message}`);
      setIsUploading(false);
    }
  };

  // 处理用户名更新
  const handleSaveUserName = () => {
    if (editName.trim()) {
      updateUserName(editName.trim());
      toast.success('用户名已更新');
    }
  };

  // 点击保存按钮
  const handleSubmit = () => {
    handleSaveUserName();
    onOpenChange(false);
  };

  const handleAvatarClick = () => {
    if (!isUploading) {
      fileInputRef.current?.click();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md bg-white dark:bg-zinc-900 border-none shadow-xl rounded-2xl p-0 overflow-hidden">
        <div className="p-6 border-b border-gray-100 dark:border-zinc-800">
          <DialogHeader className="p-0 space-y-2">
            <DialogTitle className="text-xl font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <User className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              个人信息
            </DialogTitle>
            <DialogDescription className="text-gray-500 dark:text-gray-400">
              自定义您的个人资料
            </DialogDescription>
          </DialogHeader>
        </div>
        
        <div className="flex flex-col p-6">
          {/* 头像上传区域 */}
          <div className="flex flex-col items-center">
            <div 
              className="relative z-10 group"
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              <div 
                className={`w-24 h-24 rounded-full overflow-hidden transition-all duration-300 cursor-pointer ${
                  isHovering ? 'ring-2 ring-gray-300 dark:ring-gray-600 shadow-md' : 
                  uploadSuccess ? 'ring-2 ring-green-400 shadow-md' : 
                  'ring-2 ring-gray-200 dark:ring-gray-700'
                }`}
                onClick={handleAvatarClick}
              >
                {isUploading ? (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-zinc-800">
                    <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
                  </div>
                ) : (
                  <div className="w-full h-full relative">
                    {previewImage ? (
                      <div 
                        className="w-full h-full bg-cover bg-center" 
                        style={{ backgroundImage: `url(${previewImage})` }}
                      />
                    ) : config.userAvatarUrl ? (
                      <div 
                        className="w-full h-full bg-cover bg-center" 
                        style={{ backgroundImage: `url(${config.userAvatarUrl})` }}
                      />
                    ) : config.userAvatar ? (
                      <div 
                        className="w-full h-full bg-cover bg-center" 
                        style={{ backgroundImage: `url(${config.userAvatar})` }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-2xl font-medium">
                        {config.userName.charAt(0).toUpperCase()}
                      </div>
                    )}
                    
                    <div 
                      className={`absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-40 transition-opacity duration-200 ${
                        isHovering ? 'opacity-100' : 'opacity-0'
                      }`}
                    >
                      <Camera className="h-6 w-6 text-white mb-1" strokeWidth={2} />
                    </div>
                  </div>
                )}
              </div>
              
              {/* 上传成功标志 */}
              {uploadSuccess && (
                <div className="absolute -top-1 -right-1 bg-white dark:bg-zinc-800 rounded-full p-1 shadow-sm">
                  <CheckCircle className="h-5 w-5 text-green-500" strokeWidth={2.5} />
                </div>
              )}
            </div>
            
            {uploadError && (
              <div className="mt-4 px-4 py-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-sm text-red-600 dark:text-red-400 max-w-[300px] text-center">
                <div className="font-medium flex items-center justify-center mb-1">
                  <AlertCircle className="h-4 w-4 mr-1.5" />
                  上传失败
                </div>
                <div className="text-xs">{uploadError}</div>
              </div>
            )}
            
            <input
              id="avatar-upload"
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/gif,image/webp"
              className="hidden"
              onChange={handleAvatarChange}
              disabled={isUploading}
            />
            
            <div className="flex flex-col items-center mt-3 text-center">
              <div className="inline-flex items-center justify-center text-xs text-gray-500 dark:text-gray-400 mt-3 py-1.5">
                <FileText className="h-3 w-3 mr-1.5" />
                支持JPEG、PNG、GIF和WEBP格式，最大2MB
              </div>
            </div>
          </div>
          
          {/* 用户名输入框 */}
          <div className="w-full space-y-3 mt-8">
            <Label htmlFor="name" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              用户名
            </Label>
            <Input
              id="name"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="w-full bg-white dark:bg-zinc-800 border-gray-300 dark:border-zinc-700 focus-visible:ring-gray-400 focus-visible:border-gray-400 rounded-lg"
              placeholder="输入您的用户名"
            />
          </div>
        </div>
        
        <DialogFooter className="flex px-6 py-4 gap-3 border-t border-gray-100 dark:border-zinc-800">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            className="flex-1 border-gray-300 dark:border-zinc-700 hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-700 dark:text-gray-300 rounded-lg"
          >
            取消
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={isUploading}
            className="flex-1 bg-gray-700 hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-500 text-white rounded-lg"
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                上传中...
              </>
            ) : (
              '保存修改'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
