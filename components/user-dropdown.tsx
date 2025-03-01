"use client"

import { useState, useEffect } from 'react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuGroup
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useTheme } from 'next-themes';
import { User, Moon, Sun, Store, CreditCard, Settings, LogOut } from 'lucide-react';
import { useUserConfig } from '@/context/user-config-context';
import { UserProfileDialog } from './user-profile-dialog';

interface UserDropdownProps {
  email?: string;
  onModelMarketClick: () => void;
  onSubscriptionClick: () => void;
  onLogout?: () => void;
}

export function UserDropdown({ 
  email = "user@example.com", 
  onModelMarketClick,
  onSubscriptionClick,
  onLogout
}: UserDropdownProps) {
  const { config } = useUserConfig();
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button variant="ghost" className="w-full p-2 justify-start hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-lg">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 shrink-0 rounded-full bg-gray-200 dark:bg-gray-700"></div>
          <div className="flex flex-col items-start">
            <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-3 w-24 bg-gray-100 dark:bg-gray-800 rounded mt-1"></div>
          </div>
        </div>
      </Button>
    );
  }

  return (
    <>
      <UserProfileDialog
        open={profileOpen}
        onOpenChange={setProfileOpen}
      >
        <span className="hidden">用户资料</span>
      </UserProfileDialog>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="w-full p-2 justify-start hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-lg">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 shrink-0">
                {config.userAvatarUrl ? (
                  <AvatarImage src={config.userAvatarUrl} alt={config.userName} />
                ) : config.userAvatar ? (
                  <AvatarImage src={config.userAvatar} alt={config.userName} />
                ) : (
                  <AvatarFallback className="avatar-user-bg text-white font-bold">
                    {config.userName.charAt(0)}
                  </AvatarFallback>
                )}
              </Avatar>
              <div className="flex flex-col items-start">
                <div className="font-medium text-sm text-zinc-800 dark:text-zinc-200">{config.userName}</div>
                <div className="text-xs text-zinc-500 dark:text-zinc-400">{email}</div>
              </div>
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56 border border-zinc-200 dark:border-zinc-700 shadow-sm bg-white dark:bg-zinc-950 rounded-lg focus:outline-none p-1">
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{config.userName}</p>
              <p className="text-xs leading-none text-muted-foreground">
                {email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={() => setProfileOpen(true)}>
              <User className="mr-2 h-4 w-4" />
              <span>个人中心</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}>
              {resolvedTheme === 'dark' ? (
                <Sun className="mr-2 h-4 w-4" />
              ) : (
                <Moon className="mr-2 h-4 w-4" />
              )}
              <span>{resolvedTheme === 'dark' ? '浅色模式' : '深色模式'}</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onModelMarketClick}>
              <Store className="mr-2 h-4 w-4" />
              <span>模型市场</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onSubscriptionClick}>
              <CreditCard className="mr-2 h-4 w-4" />
              <span>套餐订阅</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>设置</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          {onLogout && (
            <DropdownMenuItem onClick={onLogout} className="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300">
              <LogOut className="mr-2 h-4 w-4" />
              <span>退出登录</span>
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
