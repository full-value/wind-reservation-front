
'use client';
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image'; 

import ChatIcon from '@public/assets/images/icon/chat-icon.svg';
import EyeIcon from '@public/assets/icons/eye_icon.svg';
import { useDashboard } from '@/hooks/useDashboard';
import { Timezone } from 'next-intl';
import Typewriter from 'typewriter-effect';
import LoginIcon from '@public/assets/icons/login.svg';
import Button from '@/app/chat/components/buttonComponent';

const WorkView = () => {  
  const { getWorkData } = useDashboard();
  const [works, setWorks] = useState<{ id: number, work_name: string, flat_name:string, room_num:number, start_time:Timezone, end_time:Timezone }[]>([]);
  const [currentPage] = useState(1);
  const itemsPerPage = 10;
  const message = "現在予約可能なタスクは次のとおりです。";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getWorkData();
        setWorks(data);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };
    fetchData();
  }, []); 
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
        <div className="flex flex-col justify-center items-center gap-2 cursor-pointer">
          <Link href="/auth/login">
            <LoginIcon className="w-8 h-8 text-white hover:text-[#00f04f]" />
          </Link>
        </div>
      </div>
      <div className="flex flex-col inset-0 bg-[url('/assets/images/download.webp')] bg-cover bg-no-repeat py-[9.5vh] ">
        <div className="flex bg-white h-[70vh] mx-[5vw] rounded-[30px] p-5 relative gap-5">
          <div className="flex flex-col w-[70%] bg-[#FFFFFF] p-5 rounded-[20px] relative overflow-y-auto">
            <div className={`flex gap-2 mt-3`}>
              <Image
                src="/assets/images/avatars/avatar.png"
                alt="Avatar"
                width={100}   
                height={100} 
                className="flex w-[80px] h-[80px] rounded-full border-2 border-[#83d0e4]"
              />
              <div className="flex flex-col flex-wrap w-full relative font-normal leading-[28px] text-[#6C73A8] text-[17px] break-all">
                <Typewriter
                  options={{
                    strings: message,
                    autoStart: true,
                    loop: false,
                    deleteSpeed: 0,
                    delay: 20, // Adjusted delay for a better effect
                  }}
                />
                <table className="w-full bg-gray-800 text-gray-600 rounded-lg overflow-hidden mt-5">
                  <thead>
                    <tr className="bg-gray-300">
                      {["番号", "案件名", "物件名","部屋番号","開始時間","終了時間"].map((column) => (
                        <th key={column} className="px-6 py-3 text-left text-[15px] font-medium uppercase tracking-wider cursor-pointer">
                          <div className="flex items-center">
                            {column.charAt(0).toUpperCase() + column.slice(1)}
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {works.map((work, index) => (
                      <tr key={work.id} className={`${index % 2 === 0 ? "bg-gray-100" : "bg-gray-100"} hover:bg-gray-200 text-slate-500`}>
                        <td className="px-3 py-3 whitespace-nowrap">{(currentPage-1)*itemsPerPage+index+1}</td>
                        <td className="px-3 py-3 whitespace-nowrap">{work.work_name}</td>
                        <td className="px-3 py-3 whitespace-nowrap">{work.flat_name}</td>
                        <td className="px-3 py-3 whitespace-nowrap">{work.room_num}</td>
                        <td className="px-3 py-3 whitespace-nowrap">{work.start_time ? new Date(work.start_time).toISOString().split('T')[0] : 'N/A'}</td>
                        <td className="px-3 py-3 whitespace-nowrap">{work.end_time ? new Date(work.end_time).toISOString().split('T')[0] : 'N/A'}</td>
                      </tr>
                    ))}
                  </tbody>         
                </table>
                <div className="flex justify-start w-[200px] mt-5 right-0">
                  <Link href="/chat">
                    <Button label="予約ページに戻る" onClickHandler={() => console.log("dd")} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkView;
