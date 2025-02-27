'use client';

import { useState } from 'react';
import { useLogin } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { validateEmail, validatePassword } from '@/utils/validation';

import AuthLayout from '@/app/layout/AuthLayout';
import CustomInput from '@shared/components/UI/CustomInput';
import CustomButton from '@shared/components/UI/CustomButton';
import ArrowRightIcon from '@/../../public/assets/icons/arrow-right.svg';
import Spinner from '@shared/components/UI/Spinner';

type Props = {};

const Login = (props: Props) => {
  const router = useRouter();
  const { mutate, status } = useLogin();
  const isLoading = status === 'pending';

  // State management
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [passwordShow, setPasswordShow] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string } | null>(null);

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setPasswordShow(!passwordShow);
  };

  // Form validation logic
  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};

    if (!validateEmail(email)) {
      newErrors.email = 'Invalid email address';
    }
    if (validatePassword(password)) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    return newErrors;
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();      
    const validationErrors = validateForm();
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors(null);

    const loginData = { email, password };
    
    mutate(loginData, {
      onSuccess: (data) => {
        const userRole = data?.role;
        console.log("userRole is like:", userRole);
        router.push('/dashboard');
        if (userRole === 'user') {
          router.push('/chat');
        } else if (userRole === 'manager') {
          router.push('/dashboard');
        } else {
          router.push('/chat'); // Fallback route
        }
      },
      onError: (error: any) => {
        setErrors({ email: 'Invalid credentials' }); // General error handling
      },
    });
  };

  return (
    <AuthLayout>     

      {/* Login Form */}
      <div className="mt-[100px] w-[70%]">
        <div className="flex justify-center">
          <img src="/assets/images/logo.png" alt="logo" className="mb-2　w-20 h-20 mt-[30px]" />
        </div>
       
        <div className="border-b border-gray-300 p-5 flex flex-col justify-center ">
          <h2 className="text-2xl font-semibold text-gray-800 text-center">ログイン</h2>
          <p className="text-gray-400 text-center">詳細を入力してください</p>
        </div>
        <form onSubmit={handleSubmit} autoComplete="on" noValidate>
          <div className="login-info-input border-b border-gray-300 p-5">
            {/* Email Field */}
            <CustomInput
              value={email}
              onChangeHandler={setEmail}
              error={errors?.email}
              label="メールアドレス"
              placeholder="e.g. john.doe@gmail.com"
              id="email"
              icon="error-feed"
              iconVisible={!!errors?.email}
              autoComplete="email"
            />

            {/* Password Field */}
            <CustomInput
              value={password}
              onChangeHandler={setPassword}
              error={errors?.password}
              label="パスワード"
              placeholder="最低8文字"
              id="password"
              type={passwordShow ? 'text' : 'password'}
              icon={passwordShow ? 'hide' : 'show'}
              onIconClickHandler={togglePasswordVisibility}
              iconVisible
              autoComplete="current-password"
            />

            {/* Remember Me and Forgot Password */}
            <div className="flex justify-between mt-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="rememberMe"
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                  className="h-4 w-4 text-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="rememberMe" className="ml-2 text-sm text-gray-600">
                  ログイン状態を保持
                </label>
              </div>
              <Link href="/auth/reset-password" className="text-sm hover:text-blue-800 text-black underline ml-5">
                  パスワードをお忘れの方
              </Link>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end p-5">
            <Link href="/auth/register" className="flex justify-between mt-35 rounded-lg bg-white p-5 shadow-sm">
              <div>
                <h4 className="text-black-600 hover:text-black-800">サインアップ</h4>
              </div>
              <ArrowRightIcon className="w-6 h-6 text-black-800" />
            </Link>
            <CustomButton
              type="submit"
              isLoading={isLoading}
              label="ログイン"
            />
          </div>
        </form>
      </div>

      {/* Signup Link */}
      {/* Spinner Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex items-center justify-center">
          <Spinner />
        </div>
      )}
    </AuthLayout>
  );
};

export default Login;
