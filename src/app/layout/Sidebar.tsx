'use client';
import { useEffect, useState } from 'react';
import { useLogout, useGetUserRole } from '@/hooks/useAuth';
import Image from "next/image";
import { useAlbumStore } from '@/state/albumStore';
import { useAuthStore } from '@/state/authStore';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import CollapseIcon from '@public/assets/icons/collapse.svg';
import DashboardIcon from '@public/assets/icons/dashboard.svg';

import LogoutIcon from '@public/assets/icons/logout.svg';
import UserIcon from '@public/assets/images/icon/user_icon.svg';
import AgendarIcon from '@public/assets/images/icon/agendar_icon.svg';
import CalendarIcon from '@public/assets/images/icon/calendar_icon.svg';
import BuildingIcon from '@public/assets/images/icon/building_icon.svg';
import ErrorIcon from '@public/assets/images/icon/error_icon.svg';
import FileIcon from '@public/assets/images/icon/file_icon.svg';
import HistoryIcon from '@public/assets/images/icon/history_icon.svg';
import ApiIcon from '@public/assets/images/icon/api_icon.svg';
import AlertIcon from '@public/assets/icons/alert_icon.svg';
import { useNotificationData } from '@/state/notificationNum';
import MessageIcon from '@public/assets/icons/message_icon.svg';

const Sidebar = () => {
  const pathname = usePathname();
  
  const { mutate: logout } = useLogout();
  const { isSidebarOpen, toggleSidebar } = useAlbumStore();
  const [isListsCollapsed, setIsListsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { NotificationNum } = useNotificationData();


  const clearAuth = useAuthStore((state) => state.clearAuth);
  const handleCollapseClick = () => {
    isMobile ? setIsListsCollapsed(!isListsCollapsed) : toggleSidebar();
  };

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    await logout();
    clearAuth(); // Clear auth state on logout
  }; 

  const menuItems = [
    { path: '/dashboard', Icon: DashboardIcon, label: 'ダッシュボード', authority: ['manager', 'member', 'user'] },
    { path: '/dashboard/calendar', Icon: CalendarIcon, label: 'カレンダー', authority: ['manager'] },
    { path: '/dashboard/flat', Icon: BuildingIcon, label: '物件一覧', authority: ['manager', "member"] },
    { path: '/dashboard/work', Icon: AgendarIcon, label: '案件一覧', authority: ['manager', 'member'] },
    { path: '/dashboard/user', Icon: UserIcon, label: 'ユーザー管理', authority: ['manager'] },
    { path: '/dashboard/history', Icon: HistoryIcon, label: '変更履歴', authority: ['manager'] },
    { path: '/dashboard/api_history', Icon: ApiIcon, label: 'APIログ', authority: ['manager'] },
    { path: '/dashboard/error_log', Icon: ErrorIcon, label: 'エラーログ', authority: ['manager'] },
    { path: '/dashboard/file', Icon: FileIcon, label: 'ファイル', authority: ['manager'] },
    { path: '/dashboard/alert', Icon: AlertIcon, label: '警告', authority: ['manager'] },
    { path: '/dashboard/message', Icon: MessageIcon, label: 'メッセージ', authority: ['manager', "member","user"] },
  ];

  const renderMenuItem = (path: string, Icon: any, label: string, authority: string[]) => {
    if (!authority.includes(NotificationNum.userRole)) return null;    
    const isActive = pathname === path;
    return (
      <li
        key={path}
        className={`${
          isActive ? 'bg-[#ff8892] text-white' : ''
        } rounded-lg p-3 hover:bg-[#ff8892] text-white transition-all duration-100`}
      >
        <Link href={path} className="flex items-center">
          <Icon className={`w-[18px] h-[18px] ${isActive && "text-[#FFFFFF]"}`} />
          {(isSidebarOpen || isMobile) && <span className={`ml-2 ${isActive && "text-[#FFFFFF]"}`}>{label}</span>}
        </Link>
      </li>
    );
  };

  return (
    <div
      className={`sticky top-0 z-30 bg-gray-800 transition-all min-h-screen duration-100 rounded-r-[20px] border-r-[1px]  
        ${isSidebarOpen ? 'w-full md:w-64' : 'w-full md:w-20'} 
        ${!isMobile ? 'fixed ' : ''}`}
    >
      <div className="p-4">
        <div className={`flex justify-between items-center mt-2 ${isMobile ? 'mb-3' : 'mb-16' } }`}>
          <div className="flex items-center">
            {isSidebarOpen ? (
              <div className="flex justify-center items-center">
                <Image src="/assets/images/auth/dash_logo.png" alt="logo" width={60} height={60} style={{ width: "auto", height: "auto" }}  priority />
                <p className="font-bold text-[60px] text-[#FFFFFF]"><span className="text-[#e6494f] text-[60px]">in</span>g</p>
              </div>
            ):(
              <Image src="/assets/images/auth/dash_logo.png" alt="logo" width={60} height={60} priority />
            )}
          </div>
          <div className={`${(!isSidebarOpen && !isMobile) && 'absolute top-[90px] left-[27px]'}`}>
            <button className="" onClick={handleCollapseClick}>
              <CollapseIcon className="w-7 h-7" />
            </button>
          </div>
        </div>

        <ul
          className={`space-y-2 ${
            !isListsCollapsed ? 'hidden' : 'block pt-2'
          } md:block md:space-y-4 transition-all duration-100`}
        >
          {menuItems.map((item) => 
            renderMenuItem(item.path, item.Icon, item.label, item.authority)
          )}
          
          <li className="rounded-lg p-3 hover:bg-[#ff8892] text-white transition-all duration-100" onClick={handleLogout}>
            <Link href="" className="flex items-center">
              <LogoutIcon className="w-[18px] text-[#F3A0FF] h-[18px]" />
              {(isSidebarOpen || isMobile) && <span className="ml-2">ログアウト</span>}
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
