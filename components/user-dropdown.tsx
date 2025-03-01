"use client"

import { useState, useEffect } from 'react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useTheme } from 'next-themes';
import { User, Moon, Sun, Store, CreditCard, Settings, LogOut } from 'lucide-react';
import { useUserConfig } from '@/context/user-config-context';

interface UserDropdownProps {
  email?: string;
  onProfileClick: () => void; 
  onModelMarketClick: () => void;
  onSubscriptionClick: () => void;
  onLogout?: () => void;
}

export function UserDropdown({ 
  email = "user@example.com", 
  onProfileClick,
  onModelMarketClick,
  onSubscriptionClick,
  onLogout
}: UserDropdownProps) {
  const { config } = useUserConfig();
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

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
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="w-full p-2 justify-start hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-lg">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 shrink-0">
              {config.userAvatar ? (
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
        <DropdownMenuItem onClick={onProfileClick}>
          <User className="mr-2 h-4 w-4" />
          <div>个人中心</div>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}>
          {resolvedTheme === 'dark' ? (
            <Sun className="mr-2 h-4 w-4" />
          ) : (
            <Moon className="mr-2 h-4 w-4" />
          )}
          <div>{resolvedTheme === 'dark' ? '浅色模式' : '深色模式'}</div>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onModelMarketClick}>
          <Store className="mr-2 h-4 w-4" />
          <div>模型市场</div>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onSubscriptionClick}>
          <CreditCard className="mr-2 h-4 w-4" />
          <div>套餐订阅</div>
        </DropdownMenuItem>
        
        {onLogout && (
          <>
            <DropdownMenuSeparator className="my-1 h-px bg-zinc-200 dark:bg-zinc-800" />
            <DropdownMenuItem onClick={onLogout} className="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300">
              <LogOut className="mr-2 h-4 w-4" />
              <div>退出登录</div>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
