"use client"

import React, { useState, useRef, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { useUserConfig } from '@/context/user-config-context';

interface UserProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UserProfileDialog({ 
  open,
  onOpenChange
}: UserProfileDialogProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { config, updateUserName, updateUserAvatar } = useUserConfig();
  const [editName, setEditName] = useState(config.userName);

  // 当config更改时更新editName
  useEffect(() => {
    setEditName(config.userName);
  }, [config.userName]);

  // 处理头像上传
  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error('图片大小不能超过2MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          try {
            // 使用较小的图片，避免性能问题
            const img = new Image();
            img.onload = () => {
              // 创建一个canvas来压缩图片
              const canvas = document.createElement('canvas');
              const ctx = canvas.getContext('2d');
              
              // 设置最大尺寸
              const MAX_SIZE = 200;
              let width = img.width;
              let height = img.height;
              
              // 等比例缩小
              if (width > height) {
                if (width > MAX_SIZE) {
                  height *= MAX_SIZE / width;
                  width = MAX_SIZE;
                }
              } else {
                if (height > MAX_SIZE) {
                  width *= MAX_SIZE / height;
                  height = MAX_SIZE;
                }
              }
              
              canvas.width = width;
              canvas.height = height;
              
              ctx?.drawImage(img, 0, 0, width, height);
              
              // 转换为dataURL，质量0.8
              const optimizedDataUrl = canvas.toDataURL('image/jpeg', 0.8);
              
              // 保存为base64编码的数据URL
              updateUserAvatar(optimizedDataUrl);
              
              // 强制更新本地存储，确保数据同步
              localStorage.setItem('userConfig', JSON.stringify({
                ...config,
                userAvatar: optimizedDataUrl
              }));
              
              toast.success('头像已更新');
              
              // 强制刷新页面以确保所有组件更新
              setTimeout(() => {
                window.location.reload();
              }, 1000);
            };
            
            img.src = event.target.result as string;
          } catch (err) {
            console.error("处理头像时出错:", err);
            toast.error('处理头像时出错');
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // 处理用户名更新
  const handleSaveUserName = () => {
    if (editName.trim() === '') {
      toast.error('用户名不能为空');
      return;
    }
    updateUserName(editName);
    toast.success('用户名已更新');
  };

  // 触发文件选择框
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>个人中心</DialogTitle>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="flex flex-col items-center justify-center gap-4">
            <Avatar className="h-24 w-24 cursor-pointer relative group" onClick={triggerFileInput}>
              {config.userAvatar ? (
                <AvatarImage src={config.userAvatar} alt={config.userName} />
              ) : (
                <AvatarFallback className="avatar-user-bg text-white text-xl font-bold">
                  {config.userName.charAt(0)}
                </AvatarFallback>
              )}
              <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <span className="text-white text-xs">点击更换头像</span>
              </div>
            </Avatar>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarUpload}
            />
            <p className="text-sm text-muted-foreground">
              点击头像更换，支持JPG、PNG格式，大小不超过2MB
            </p>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="username">用户名</Label>
            <div className="flex gap-2">
              <Input
                id="username"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
              />
              <Button onClick={handleSaveUserName}>保存</Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
