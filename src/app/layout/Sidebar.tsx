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
import { Span } from 'next/dist/trace';
import Dropdown from '@public/assets/icons/dropdown_icon.svg';
import MemberIcon from '@public/assets/icons/member.svg';

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
    { path: '/dashboard/company', Icon: BuildingIcon, label: '工事会社管理', authority: ['manager'] },
    { path: '/dashboard/member', Icon: MemberIcon, label: '工事職員管理', authority: ['manager'] },
    // { path: '/dashboard', Icon: DashboardIcon, label: 'ダッシュボード', authority: ['manager', 'member', 'user'] },
    { path: '/dashboard/calendar', Icon: CalendarIcon, label: 'カレンダー', authority: ['manager,member'] },
    // { path: '/dashboard/flat', Icon: BuildingIcon, label: '物件一覧', authority: ['manager', "member"] },
    // { path: '/dashboard/work', Icon: AgendarIcon, label: '案件一覧', authority: ['manager', 'member'] },
    { path: '/dashboard/user', Icon: UserIcon, label: 'ユーザー管理', authority: ['manager'] },
    // { path: '/dashboard/history', Icon: HistoryIcon, label: '変更履歴', authority: ['manager'] },
    { path: '/dashboard/api_history', Icon: ApiIcon, label: 'APIログ', authority: ['manager'] },
    // { path: '/dashboard/error_log', Icon: ErrorIcon, label: 'エラーログ', authority: ['manager'] },
    // { path: '/dashboard/file', Icon: FileIcon, label: 'ファイル', authority: ['manager'] },
    { path: '/dashboard/alert', Icon: AlertIcon, label: '警告', authority: ['manager'] },
   
    

    // { path: '/dashboard/message', Icon: MessageIcon, label: 'メッセージ', authority: ['manager', "member","user"] },
  ];

  const renderMenuItem = (path: string, Icon: any, label: string, authority: string[]) => {
  if (!authority.includes(NotificationNum.userRole)) return null;    
  
  const isActive = pathname === path;
  const isSubActive = pathname === "/dashboard/company/work-time";

  return (
    <>
      <li
        key={`${path}-mainli`}
        className={`w-full text-white mt-0 ${isActive ? 'bg-[#1e293a] text-white' : ''} 
          ${isMobile ? 'flex justify-center' : ''} p-3 hover:bg-[#1e293a] text-red-500 transition-all duration-100`}
        style={{ marginTop: "0px" }}
      >
        <Link href={path} className={`flex items-center ${!(isSidebarOpen || isMobile) && "justify-center"}`}>
          <div className='flex items-center justify-between relative'>
            <Icon className="w-[20px] h-[20px] text-[#3d4859]" />
            {(isSidebarOpen || isMobile) && <span className={`ml-4 text-[15px] ${isActive && "m-0"}`}>{label}</span>}
            {(path === "/dashboard/company" || path === "/dashboard/member") && (isSidebarOpen || isMobile) && (
                <Dropdown         
                  className={`absolute h-6 w-6 mt-5 right-[-90px] transform text-white -translate-y-1/2 cursor-pointer transition-transform duration-500 ${
                    pathname.startsWith(path) ? 'rotate-180' : 'rotate-0'
                  }`}
                />        
            )}          
          </div>   
        </Link> 
      </li>

      {/* Nested Menu Item for Work Time */}
      {path === "/dashboard/company" && pathname.startsWith("/dashboard/company") && (
        <>
          <li
            key={`${path}-company1`}
            className={`w-full text-white mt-0 ${pathname === "/dashboard/company/work-time" ? 'bg-[#1e293a] text-white' : ''} 
              ${isMobile ? 'flex justify-center' : ''} p-3 hover:bg-[#1e293a] text-red-500 transition-all duration-100`}
            style={{ marginTop: "0px" }} // Removed !important
          >
            <Link href="/dashboard/company/work-time" className="flex items-center">
            <span className={`text-[15px] ${isSubActive && "m-0"} ${(isSidebarOpen || isMobile) ? "ml-9" : "ml-3"}`}>
                {(isSidebarOpen || isMobile) ? "標準所要時間" : "時間"}
              </span>
            </Link>
          </li>
          <li
            key={`${path}-company2`}
            className={`w-full text-white mt-0 ${pathname === "/dashboard/company/alert" ? 'bg-[#1e293a] text-white' : ''} 
              ${isMobile ? 'flex justify-center' : ''} p-3 hover:bg-[#1e293a] text-red-500 transition-all duration-100`}
            style={{ marginTop: "0px" }} // Removed !important
          >
            <Link href="/dashboard/company/alert" className="flex items-center">
              <span className={`text-[15px] ${isSubActive && "m-0"} ${(isSidebarOpen || isMobile) ? "ml-9" : "ml-3"}`}>
                {(isSidebarOpen || isMobile) ? "通知管理" : "通知"}
              </span>
            </Link>
          </li>
          <li
            key={`${path}-company3`}
            className={`w-full text-white mt-0 ${pathname === "/dashboard/company/reservation-history" ? 'bg-[#1e293a] text-white' : ''} 
              ${isMobile ? 'flex justify-center' : ''} p-3 hover:bg-[#1e293a] text-red-500 transition-all duration-100`}
            style={{ marginTop: "0px" }} // Removed !important
          >
            <Link href="/dashboard/company/reservation-history" className="flex">
            <span className={`text-[15px] ${isSubActive && "m-0"} ${(isSidebarOpen || isMobile) ? "ml-9" : "ml-3"}`}>
                {(isSidebarOpen || isMobile) ? "過去予約履歴" : "履歴"}
              </span>
            </Link>
          </li>
          <li
            key={`${path}-company4`}
            className={`w-full text-white mt-0 ${pathname === "/dashboard/company/chat" ? 'bg-[#1e293a] text-white' : ''} 
              ${isMobile ? 'flex justify-center' : ''} p-3 hover:bg-[#1e293a] text-red-500 transition-all duration-100`}
            style={{ marginTop: "0px" }}
          >
            <Link href="/dashboard/company/chat" className="flex">
            <span className={`text-[15px] ${isSubActive && "m-0"} ${(isSidebarOpen || isMobile) ? "ml-9" : "ml-3"}`}>
                {(isSidebarOpen || isMobile) ? "チャットフロー管理" : "チャ"}
              </span>
            </Link>
          </li>
        </>  
      )}
      {path === "/dashboard/member" && pathname.startsWith("/dashboard/member") && (
        <>
          <li
            key={`${path}-company1`}
            className={`w-full text-white mt-0 ${pathname === "/dashboard/member/view" ? 'bg-[#1e293a] text-white' : ''} 
              ${isMobile ? 'flex justify-center' : ''} p-3 hover:bg-[#1e293a] text-red-500 transition-all duration-100`}
            style={{ marginTop: "0px" }} // Removed !important
          >
            <Link href="/dashboard/member/view" className="flex items-center">
            <span className={`text-[15px] ${isSubActive && "m-0"} ${(isSidebarOpen || isMobile) ? "ml-9" : "ml-3"}`}>
                {(isSidebarOpen || isMobile) ? "工事職員ー覧" : "職員"}
              </span>
            </Link>
          </li>
          <li
            key={`${path}-company2`}
            className={`w-full text-white mt-0 ${pathname === "/dashboard/member/schedule" ? 'bg-[#1e293a] text-white' : ''} 
              ${isMobile ? 'flex justify-center' : ''} p-3 hover:bg-[#1e293a] text-red-500 transition-all duration-100`}
            style={{ marginTop: "0px" }} // Removed !important
          >
            <Link href="/dashboard/member/schedule" className="flex items-center">
              <span className={`text-[15px] ${isSubActive && "m-0"} ${(isSidebarOpen || isMobile) ? "ml-9" : "ml-3"}`}>
                {(isSidebarOpen || isMobile) ? "工事職員日程閲覧" : "日程"}
              </span>
            </Link>
          </li>
        </>  
      )}
    </>
  );
};


  return (
    <div
      className={`sticky top-0 z-30 bg-[#233044] transition-all min-h-screen duration-100 
        ${isSidebarOpen ? 'w-full md:w-64' : 'w-full md:w-20'} 
        ${!isMobile ? 'fixed ' : 'mb-2'}`}
    >
      <div className="">
        <div className={`flex justify-between items-center px-3 ${isMobile ? ' mb-5' : 'mt-3 mb-10' } }`}>
          <div className="flex items-center ">
            {isSidebarOpen ? (
              <div className="flex justify-center items-center">
                <Image src="/assets/images/auth/dash_logo.png" alt="logo" width={60} height={60} style={{ width: "auto", height: "auto" }}  priority />
                <p className="font-bold text-[60px] text-[#FFFFFF]"><span className="text-[#e6494f] text-[60px]">in</span>g</p>
              </div>
            ):(
              <Image src="/assets/images/auth/dash_logo.png" alt="logo" width={60} height={60} priority />
            )}
          </div>
          <div className={`${(!isSidebarOpen && !isMobile) && 'absolute top-[65px] left-[27px]'}`}>
            <button className="" onClick={handleCollapseClick}>
              <CollapseIcon className="w-7 h-7 mb-3" />
            </button>
          </div>
        </div>
        <ul
          className={`space-y-2 ${
            !isListsCollapsed ? 'hidden' : 'block'
          } md:block md:space-y-4 transition-all duration-100`}
        >     
          {menuItems.map((item) =>
          <div key={item.path} style={{ marginTop: "0px" }}>
            {renderMenuItem(item.path, item.Icon, item.label, item.authority)}
          </div> 
            
          )}
          
          <li className={`flex rounded-lg p-3 hover:bg-[#1e293a] text-white transition-all duration-100 ${!(isSidebarOpen || isMobile) && "justify-center"}`} onClick={handleLogout}>
            <Link href="" className="flex items-center">
              <LogoutIcon className="w-[25px] text-[#3d4859] h-[20px]" />
              {(isSidebarOpen || isMobile) && <span className="ml-2 text-[15px]">ログアウト</span>}
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
