'use client';
import Link from 'next/link';
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
       
      <div className="flex flex-col items-center justify-center min-h-screen mt-0">
        <div className="flex justify-center">
          <img src="/assets/images/logo.png" alt="logo" className="mb-2　w-20 h-20 mt-[30px]" />
        </div>
       
        <div className="p-5 flex flex-col justify-center mb-[50px]">
          <h2 className="text-4xl font-semibold text-gray-800 text-center">404
            ページ
          </h2>
          <p className="text-gray-400 text-center">該当するペッジが見つかりません。正しい経路を確認してください。</p>
        </div>
        <Link href="/chat">
          <h2 className="text-4xl font-semibold text-blue-800 text-center">予約ページへ</h2>
        </Link>
      </div>
       
  );
};


