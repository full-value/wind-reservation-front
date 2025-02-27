'use client';

import { useState } from 'react';
import { useLogout } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import ChatIcon from '@public/assets/images/icon/chat-icon.svg';
import EyeIcon from '@public/assets/icons/eye_icon.svg';
import LogoutIcon from '@public/assets/icons/logout.svg';
import ChatContainer from '@/app/chat/components/chat';

type Props = {};

const Chat = (props: Props) => {
  const router = useRouter();
  const { mutate, status } = useLogout();  

  const logout = ()=>{
    router.push('/auth/login');
    useLogout();
         
  }

  return (
    <div className="w-full">
      <div data-ui-testid="navBar" className="flex items-center bg-gradient-to-r from-[#7924dd] to-blue-400 px-20 justify-end gap-[10px]">
        <ul className="previewMode-list border-l border-r border-white border-opacity-30 px-[20px] gap-[10px] sm:flex withAnimation" role="tablist">
          <li aria-selected="false" className="shrink-0" role="tab" data-selected="false">
            <Link href="/chat">
              <button className="flex flex-col border-0 p-3 w-full h-full items-center justify-center gap-2 text-xs text-white overflow-hidden bg-transparent text-capitalize hover:bg-transparent cursor-pointer duration-300 ease-in-out" type="button">
                <ChatIcon className="w-8 h-8 text-white hover:text-[#00f04f]" />              
              </button>
            </Link>
          </li>
          <li aria-selected="false" className="shrink-0" role="tab" data-selected="false">
            <Link href="/chat/view">
              <button className="flex flex-col border-0 p-3 w-full h-full items-center justify-center gap-2 text-xs text-white overflow-hidden bg-transparent text-capitalize hover:bg-transparent cursor-pointer duration-300 ease-in-out" type="button">
                <EyeIcon className="w-8 h-8 text-white hover:text-[#00f04f]" />              
              </button>
            </Link>
          </li>
        </ul>
        <div 
          className="flex flex-col justify-center items-center gap-2 cursor-pointer"
          onClick={()=>logout()}
        >
          <Link href="/auth/reset-password"><LogoutIcon className="w-8 h-8 text-white hover:text-[#00f04f]" /></Link>
        </div>
      </div>
      <div className="flex flex-col inset-0 bg-[url('/assets/images/download.webp')] bg-cover bg-no-repeat  py-[9.5vh] ">
        <div className="flex bg-white h-[70vh] mx-[5vw] rounded-[30px] p-5 relative gap-5">
          <div className="flex flex-col w-[70%] bg-[#FFFFFF] p-5 rounded-[20px] relative overflow-y-auto">
            <ChatContainer />
          </div>
          <div className="flex flex-col w-[30%] bg-[#83d0e4] p-5 rounded-[20px] relative items-center text-center pointer-events-none">
            <img
              src="/assets/images/consultant.png"
              alt="consultant"
              className="absolute bottom-0 left-1/2 w-[300px] h-auto select-none ease-in-out duration-200 transform -translate-x-1/2"
            />
          </div>
        </div>
      </div>
    </div>
  
  );
  

}
export default Chat;
