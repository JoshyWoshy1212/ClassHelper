'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  GraduationCap,
  Building2,
  User,
  Mail,
  Lock,
  Phone,
  MapPin,
  FileText,
  Loader2,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { authService } from '@/lib/auth-service';
import { useAuthStore } from '@/stores/useAuthStore';

const registerSchema = z
  .object({
    // 학원 정보
    academyName: z.string().min(2, { message: '학원 이름은 최소 2자 이상이어야 합니다.' }),
    businessNumber: z.string().optional(),
    academyPhone: z.string().optional(),
    address: z.string().optional(),

    // 원장님 계정 정보
    name: z.string().min(2, { message: '원장님 성함을 입력해주세요.' }),
    email: z.string().email({ message: '올바른 이메일 주소를 입력해주세요.' }),
    phone: z.string().optional(),
    password: z.string().min(6, { message: '비밀번호는 최소 6자 이상이어야 합니다.' }),
    confirmPassword: z.string().min(6, { message: '비밀번호 확인을 입력해주세요.' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: '비밀번호가 일치하지 않습니다.',
    path: ['confirmPassword'],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [step, setStep] = useState<1 | 2>(1);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      academyName: '',
      businessNumber: '',
      academyPhone: '',
      address: '',
      name: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
    },
  });

  const handleNextStep = async () => {
    const isValid = await trigger(['academyName', 'businessNumber', 'academyPhone', 'address']);
    if (isValid) {
      setErrorMessage(null);
      setStep(2);
    }
  };

  const onSubmit = async (values: RegisterFormValues) => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await authService.registerOwner({
        academyName: values.academyName,
        businessNumber: values.businessNumber || undefined,
        academyPhone: values.academyPhone || undefined,
        address: values.address || undefined,
        name: values.name,
        email: values.email,
        phone: values.phone || undefined,
        password: values.password,
      });

      setAuth(response);
      router.push('/dashboard');
    } catch (err: any) {
      const message =
        err.response?.data?.message ||
        (Array.isArray(err.response?.data?.message)
          ? err.response.data.message.join(', ')
          : '회원가입 처리 중 오류가 발생했습니다.');
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-slate-100">
      <div className="sm:mx-auto sm:w-full sm:max-w-xl text-center">
        {/* Brand Logo */}
        <Link href="/" className="inline-flex items-center gap-3 group">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/30 group-hover:scale-105 transition-transform duration-300">
            <GraduationCap className="w-7 h-7 text-white" />
          </div>
          <span className="text-2xl font-black tracking-tight text-white">
            Class<span className="text-indigo-400">Helper</span>
          </span>
        </Link>
        <h2 className="mt-6 text-3xl font-extrabold tracking-tight text-white">
          학원 신규 개설 & 원장님 가입
        </h2>
        <p className="mt-2 text-sm text-slate-400">
          학원을 등록하고 1분 만에 스마트 출결 및 원생 관리를 시작하세요.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl px-4">
        <div className="bg-slate-800/80 backdrop-blur-xl py-8 px-6 sm:px-10 shadow-2xl rounded-3xl border border-slate-700/60">
          {/* Step Indicator */}
          <div className="mb-8 flex items-center justify-center gap-4">
            <div
              className={`flex items-center gap-2 text-sm font-semibold ${
                step === 1 ? 'text-indigo-400' : 'text-slate-400'
              }`}
            >
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs ${
                  step === 1 ? 'bg-indigo-500 text-white shadow-md shadow-indigo-500/50' : 'bg-emerald-500 text-white'
                }`}
              >
                {step === 2 ? <CheckCircle2 className="w-4 h-4" /> : '1'}
              </div>
              <span>1. 학원 정보</span>
            </div>

            <div className="w-12 h-0.5 bg-slate-700"></div>

            <div
              className={`flex items-center gap-2 text-sm font-semibold ${
                step === 2 ? 'text-indigo-400' : 'text-slate-500'
              }`}
            >
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs ${
                  step === 2 ? 'bg-indigo-500 text-white shadow-md shadow-indigo-500/50' : 'bg-slate-700 text-slate-400'
                }`}
              >
                2
              </div>
              <span>2. 원장님 계정</span>
            </div>
          </div>

          {/* Error Message Alert */}
          {errorMessage && (
            <div className="mb-6 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm flex items-start gap-3 animate-in fade-in duration-200">
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* STEP 1: 학원 기본 정보 */}
            {step === 1 && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-1.5">
                    학원 명칭 <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative rounded-2xl shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <input
                      type="text"
                      placeholder="예: 클래스헬퍼 어학원 대치본원"
                      className={`block w-full pl-10 pr-4 py-3 bg-slate-900/80 border ${
                        errors.academyName ? 'border-rose-500 focus:ring-rose-500' : 'border-slate-700 focus:border-indigo-500 focus:ring-indigo-500'
                      } rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition-all text-sm`}
                      {...register('academyName')}
                    />
                  </div>
                  {errors.academyName && (
                    <p className="mt-1.5 text-xs text-rose-400">{errors.academyName.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-200 mb-1.5">
                      사업자등록번호 (선택)
                    </label>
                    <div className="relative rounded-2xl shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <FileText className="w-5 h-5" />
                      </div>
                      <input
                        type="text"
                        placeholder="123-45-67890"
                        className="block w-full pl-10 pr-4 py-3 bg-slate-900/80 border border-slate-700 focus:border-indigo-500 focus:ring-indigo-500 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition-all text-sm"
                        {...register('businessNumber')}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-200 mb-1.5">
                      학원 대표번호 (선택)
                    </label>
                    <div className="relative rounded-2xl shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Phone className="w-5 h-5" />
                      </div>
                      <input
                        type="text"
                        placeholder="02-1234-5678"
                        className="block w-full pl-10 pr-4 py-3 bg-slate-900/80 border border-slate-700 focus:border-indigo-500 focus:ring-indigo-500 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition-all text-sm"
                        {...register('academyPhone')}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-1.5">
                    학원 위치 / 주소 (선택)
                  </label>
                  <div className="relative rounded-2xl shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <input
                      type="text"
                      placeholder="서울시 강남구 테헤란로 123"
                      className="block w-full pl-10 pr-4 py-3 bg-slate-900/80 border border-slate-700 focus:border-indigo-500 focus:ring-indigo-500 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition-all text-sm"
                      {...register('address')}
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleNextStep}
                  className="w-full mt-4 flex justify-center items-center gap-2 py-3.5 px-4 rounded-2xl shadow-lg shadow-indigo-500/25 text-sm font-semibold text-white bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all cursor-pointer"
                >
                  <span>다음: 원장님 계정 설정</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* STEP 2: 원장님 계정 정보 */}
            {step === 2 && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-1.5">
                    원장님 성함 <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative rounded-2xl shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <User className="w-5 h-5" />
                    </div>
                    <input
                      type="text"
                      placeholder="김원장"
                      className={`block w-full pl-10 pr-4 py-3 bg-slate-900/80 border ${
                        errors.name ? 'border-rose-500 focus:ring-rose-500' : 'border-slate-700 focus:border-indigo-500 focus:ring-indigo-500'
                      } rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition-all text-sm`}
                      {...register('name')}
                    />
                  </div>
                  {errors.name && (
                    <p className="mt-1.5 text-xs text-rose-400">{errors.name.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-200 mb-1.5">
                      로그인 이메일 <span className="text-rose-400">*</span>
                    </label>
                    <div className="relative rounded-2xl shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Mail className="w-5 h-5" />
                      </div>
                      <input
                        type="email"
                        placeholder="owner@academy.kr"
                        className={`block w-full pl-10 pr-4 py-3 bg-slate-900/80 border ${
                          errors.email ? 'border-rose-500 focus:ring-rose-500' : 'border-slate-700 focus:border-indigo-500 focus:ring-indigo-500'
                        } rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition-all text-sm`}
                        {...register('email')}
                      />
                    </div>
                    {errors.email && (
                      <p className="mt-1.5 text-xs text-rose-400">{errors.email.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-200 mb-1.5">
                      원장님 휴대폰 (선택)
                    </label>
                    <div className="relative rounded-2xl shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Phone className="w-5 h-5" />
                      </div>
                      <input
                        type="text"
                        placeholder="010-1234-5678"
                        className="block w-full pl-10 pr-4 py-3 bg-slate-900/80 border border-slate-700 focus:border-indigo-500 focus:ring-indigo-500 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition-all text-sm"
                        {...register('phone')}
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-200 mb-1.5">
                      비밀번호 (6자 이상) <span className="text-rose-400">*</span>
                    </label>
                    <div className="relative rounded-2xl shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Lock className="w-5 h-5" />
                      </div>
                      <input
                        type="password"
                        placeholder="비밀번호"
                        className={`block w-full pl-10 pr-4 py-3 bg-slate-900/80 border ${
                          errors.password ? 'border-rose-500 focus:ring-rose-500' : 'border-slate-700 focus:border-indigo-500 focus:ring-indigo-500'
                        } rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition-all text-sm`}
                        {...register('password')}
                      />
                    </div>
                    {errors.password && (
                      <p className="mt-1.5 text-xs text-rose-400">{errors.password.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-200 mb-1.5">
                      비밀번호 확인 <span className="text-rose-400">*</span>
                    </label>
                    <div className="relative rounded-2xl shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Lock className="w-5 h-5" />
                      </div>
                      <input
                        type="password"
                        placeholder="비밀번호 재입력"
                        className={`block w-full pl-10 pr-4 py-3 bg-slate-900/80 border ${
                          errors.confirmPassword ? 'border-rose-500 focus:ring-rose-500' : 'border-slate-700 focus:border-indigo-500 focus:ring-indigo-500'
                        } rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition-all text-sm`}
                        {...register('confirmPassword')}
                      />
                    </div>
                    {errors.confirmPassword && (
                      <p className="mt-1.5 text-xs text-rose-400">{errors.confirmPassword.message}</p>
                    )}
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="w-1/3 flex justify-center items-center gap-1 py-3.5 px-4 rounded-2xl border border-slate-700 hover:bg-slate-700/50 text-sm font-semibold text-slate-300 transition-all cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>이전</span>
                  </button>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-2/3 flex justify-center items-center gap-2 py-3.5 px-4 rounded-2xl shadow-lg shadow-indigo-500/25 text-sm font-semibold text-white bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>학원 등록 중...</span>
                      </>
                    ) : (
                      <>
                        <span>학원 개설 및 가입 완료</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </form>

          {/* Link to Login */}
          <div className="mt-6 text-center text-sm text-slate-400">
            이미 등록된 계정이 있으신가요?{' '}
            <Link
              href="/login"
              className="font-semibold text-indigo-400 hover:text-indigo-300 underline underline-offset-4 transition-colors"
            >
              로그인하기
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
