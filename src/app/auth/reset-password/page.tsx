'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { validateEmail, validatePassword, validConfirmPassword, getPasswordStrength } from '@/utils/validation';

import AuthLayout from '@/app/layout/AuthLayout';
import CustomInput from '@/app/shared/components/UI/CustomInput';
import CustomButton from '@/app/shared/components/UI/CustomButton';
import PasswordStrengthIndicator from '@/app/auth/components/PasswordStrengthIndicator';
import { useRouter } from 'next/navigation';
import { passwordReset } from '@/hooks/useAuth';


const ResetPassword = () => {
  const router = useRouter();
  const { mutate, status } = passwordReset();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordStrength, setPasswordStrength] = useState('');
  const [passwordShow, setPasswordShow] = useState(false);
  const [errors, setErrors] = useState<{ email?:string; password?: string; confirmPassword?: string } | null>(null);

  // Temporary state
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    setPasswordStrength(getPasswordStrength(password));
  }, [password]);

  const togglePasswordVisibility = () => {
    setPasswordShow(!passwordShow);
  };

  interface ValidationErrors {
    password?: string;
    email?: string;
    confirmPassword?: string;
  }
  
  const validationErrors: ValidationErrors = {};
  
  

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) validationErrors.password = 'パスワードは必須です';  
    if (!validateEmail(email)) validationErrors.email = '無効なメールアドレスです';
    if (password !== confirmPassword)
      validationErrors.confirmPassword = 'パスワードと確認パスワードが一致しません';
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    
    const resetData = { email, password };
    console.log(resetData);
    
    mutate(resetData, {
      onSuccess: (data) => {
        router.push('/auth/login');
      },
      onError: (error: any) => {
        setErrors({ email: '無効な資格情報' }); // General error handling
      },
    });
  };

  return (
    <AuthLayout>
     <div className="mt-[100px] w-[70%]">
        <div className="flex justify-center">
          <img src="/assets/images/logo.png" alt="logo" className="mb-2　w-20 h-20 mt-[30px]" />
        </div>
       
        <div className="border-b border-gray-300 p-5 flex flex-col justify-center ">
          <h2 className="text-2xl font-semibold text-gray-800 text-center">パスワードリセット</h2>
          <p className="text-gray-400 text-center">詳細を入力してください</p>
        </div>
        <form onSubmit={handleSubmit}  autoComplete="on" noValidate>
          <div className="reset-info-input border-b border-gray-300 px-5 py-5">
            <CustomInput
              value={email}
              onChangeHandler={setEmail} 
              error={errors?.email || undefined}
              placeholder="メールアドレス"
              id="email"
              icon="error-feed"
              iconVisible={!!errors?.email}
              autoComplete="email"
            />
            <CustomInput
              value={password}
              onChangeHandler={setPassword} 
              error={errors?.password || undefined}
              placeholder="パスワード-最低8文字"
              id="password"
              type={passwordShow ? "text" : "password"}
              icon={passwordShow ? "hide" : "show"}
              onIconClickHandler={togglePasswordVisibility}
              iconVisible={true}
              autoComplete="current-password"
            />

            <PasswordStrengthIndicator 
              password={password}
              strength={passwordStrength}
            />

            <CustomInput
              value={confirmPassword}
              onChangeHandler={setConfirmPassword} 
              error={errors?.confirmPassword || undefined}                  
              placeholder="パスワード-最低8文字"
              id="cpassword"
              type={passwordShow ? "text" : "password"}
              icon={passwordShow ? "hide" : "show"}
              onIconClickHandler={togglePasswordVisibility}
              iconVisible={true}
              autoComplete="new-password"
            />
           
          </div>
          <div className="flex justify-between p-5 items-center">
            <CustomButton
              type="submit"
              isLoading={false}
              label={`${verified ? 'パスワードの変更' : 'リセット'}`}
              className="hover:opacity-80"
              // icon={verified ? <DoubleCheckIcon className="w-6 h-6 text-[#00A0FF]" /> : <ArrowIcon className="w-6 h-6 text-[#00a0ff]" />}
            />
            <Link href="/auth/login" className="flex rounded-lg bg-white">
              <h4 className="hover:text-blue-800">ログインに戻る</h4>
            </Link>
          </div>
        </form>
      </div>
      
    </AuthLayout>
  );
};

export default ResetPassword;
