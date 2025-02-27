'use client';

import { ReactNode } from 'react';
import LeftImageContainer from '@/app/auth/components/LeftImageContainer';
type SettingLayoutProps = {
  children: ReactNode;
};

const SettingLayout = ({ children }: { children: React.ReactNode }) => {
  console.log(children)
  return (
    <div className="auth relative min-h-screen flex flex-col bg-cover bg-no-repeat sm:flex-row">

      {/* Background - Fixed position */}
      <div className="fixed inset-0 bg-[url('/assets/images/Mask_pattern.png')] bg-cover bg-no-repeat opacity-[10%] pointer-events-none z-[-1]"></div>

      {/* Right Side - Centered Dynamic Content */}
      <div className="absolute w-[521px] h-auto inset-0 gap-[60px] flex flex-col justify-center items-center mx-auto">
        {...[children]}
      </div>

    </div>
  );
};

export default SettingLayout;
