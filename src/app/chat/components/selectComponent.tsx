import React, { useState, useEffect, useRef  } from 'react';
import Typewriter from 'typewriter-effect';
import { useChatStore } from '@/state/chatStore';
import { useChatHandler } from '@/hooks/useChatHandler';
import Spinner from '@shared/components/UI/Spinner';


type Props = {    
    onClickHandler: (value: string,type:string) => void;
    label:string;    
};
const Button = ({ label, onClickHandler }: Props) => {

  const [visible, setVisible] = useState(false);  

  return (
            <div 
                className={`border border-[#c8ceed] px-[20px] py-[10px] rounded-[5px] hover:border-[#0a1551] text-[#6C73A8] hover:bg-[#dadef3] cursor-pointer ${ visible ? "bg-[#0f1430] text-white" : "bg-white"}`}
                onClick={()=>{setVisible(true);onClickHandler();}}
            >
                <p className="font-bold leading-[28px]  text-[15px] break-all">{label}</p>
            </div>
  );
};

export default Button;
