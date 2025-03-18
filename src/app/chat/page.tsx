'use client';
import Link from 'next/link';
import ChatIcon from '@public/assets/images/icon/chat-icon.svg';
import EyeIcon from '@public/assets/icons/eye_icon.svg';
import LoginIcon from '@public/assets/icons/login.svg';
import ChatContainer from '@/app/chat/components/chat';

const Chat = () => {
 
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
        >
          <Link href="/auth/login"><LoginIcon className="w-8 h-8 text-white hover:text-[#00f04f]" /></Link>
        </div>
      </div>
      <div className="flex flex-col inset-0 bg-[url('/assets/images/download.webp')] bg-cover bg-no-repeat  py-[7vh] ">
        <div className="flex bg-white h-[80vh] mx-[5vw] rounded-[30px] p-5 relative gap-5">
          <div className="flex flex-col w-full bg-[#FFFFFF] p-5 rounded-[20px] relative overflow-y-auto custom-scrollbar">
            <ChatContainer />
          </div>
        </div>
      </div>
    </div>
  
  );
  

}
export default Chat;
