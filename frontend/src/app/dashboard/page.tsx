'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  GraduationCap,
  Users,
  BookOpen,
  CalendarCheck2,
  CreditCard,
  LogOut,
  ShieldCheck,
  Building2,
  Key,
  RefreshCw,
  Sparkles,
  ArrowUpRight,
  Code2,
  Loader2,
} from 'lucide-react';
import { useAuthStore } from '@/stores/useAuthStore';
import { authService } from '@/lib/auth-service';
import { api } from '@/lib/api';

export default function DashboardPage() {
  const router = useRouter();
  const { user, academy, accessToken, refreshToken, isAuthenticated, isHydrated, logout } =
    useAuthStore();
  const [apiResponse, setApiResponse] = useState<any>(null);
  const [isApiLoading, setIsApiLoading] = useState(false);
  const [activeTest, setActiveTest] = useState<string | null>(null);

  // Authentication guard
  useEffect(() => {
    if (isHydrated && !isAuthenticated) {
      router.replace('/login');
    }
  }, [isHydrated, isAuthenticated, router]);

  if (!isHydrated || !isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-400" />
          <p className="text-sm text-slate-400">인증 상태를 확인하고 있습니다...</p>
        </div>
      </div>
    );
  }

  const handleLogout = async () => {
    await authService.logout();
    logout();
    router.push('/login');
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'OWNER':
        return { label: '원장님 (OWNER)', color: 'bg-amber-500/20 text-amber-300 border-amber-500/40' };
      case 'ADMIN':
        return { label: '실장/관리자 (ADMIN)', color: 'bg-purple-500/20 text-purple-300 border-purple-500/40' };
      case 'TEACHER':
        return { label: '담당 강사 (TEACHER)', color: 'bg-blue-500/20 text-blue-300 border-blue-500/40' };
      case 'STAFF':
        return { label: '조교/직원 (STAFF)', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' };
      default:
        return { label: role, color: 'bg-slate-500/20 text-slate-300 border-slate-500/40' };
    }
  };

  const roleBadge = getRoleBadge(user.role);

  const testGetMe = async () => {
    setIsApiLoading(true);
    setActiveTest('GET /auth/me');
    try {
      const data = await authService.getMe();
      setApiResponse(data);
    } catch (err: any) {
      setApiResponse(err.response?.data || err.message);
    } finally {
      setIsApiLoading(false);
    }
  };

  const testGetStudents = async () => {
    setIsApiLoading(true);
    setActiveTest('GET /students');
    try {
      const res = await api.get('/students');
      setApiResponse(res.data);
    } catch (err: any) {
      setApiResponse(err.response?.data || err.message);
    } finally {
      setIsApiLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      {/* Top Navigation Bar */}
      <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center shadow-md shadow-indigo-500/30">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                Class<span className="text-indigo-400">Helper</span>
              </span>
            </Link>

            {academy && (
              <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs text-slate-300">
                <Building2 className="w-3.5 h-3.5 text-indigo-400" />
                <span>{academy.name}</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            {/* User Badge */}
            <div className="hidden md:flex flex-col items-end mr-1">
              <span className="text-sm font-semibold text-white">{user.name}</span>
              <span className="text-xs text-slate-400">{user.email}</span>
            </div>

            <span
              className={`text-xs px-2.5 py-1 rounded-full font-medium border ${roleBadge.color}`}
            >
              {roleBadge.label}
            </span>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-rose-500/20 border border-slate-700 hover:border-rose-500/40 text-xs text-slate-300 hover:text-rose-300 transition-all cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>로그아웃</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Welcome Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900/60 via-purple-900/40 to-slate-900 border border-indigo-500/30 p-6 sm:p-8 shadow-xl">
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/40 text-xs font-semibold text-indigo-300 mb-3">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>학원 통합 관리 시스템 정상 작동 중</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              안녕하세요, <span className="text-indigo-300">{user.name}</span> {user.role === 'OWNER' ? '원장님' : '선생님'}!
            </h1>
            <p className="mt-2 text-sm sm:text-base text-slate-300 max-w-2xl">
              <span className="font-semibold text-white">{academy?.name}</span>의 출결, 수업 진도, 원비 수납 현황을 실시간으로 관리할 수 있습니다.
            </p>
          </div>
        </div>

        {/* 4 Core Domain Quick Cards */}
        <div>
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span>핵심 4대 관리 기능</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* 1. 학생 관리 */}
            <div className="group p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-900 transition-all shadow-lg flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-4 group-hover:scale-110 transition-transform">
                  <Users className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white group-hover:text-blue-300 transition-colors">
                  원생 관리
                </h3>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                  재원생 등록, 학년/상태 필터링 및 학부모 비상 연락처 관리
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-blue-400 font-semibold">
                <span>API 구축 완료</span>
                <ArrowUpRight className="w-4 h-4" />
              </div>
            </div>

            {/* 2. 반 및 수강 관리 */}
            <div className="group p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-purple-500/50 hover:bg-slate-900 transition-all shadow-lg flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-4 group-hover:scale-110 transition-transform">
                  <BookOpen className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white group-hover:text-purple-300 transition-colors">
                  반 & 수강 배정
                </h3>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                  개설 반 관리, 담당 강사 배정, 수강생 매핑 및 시간표
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-purple-400 font-semibold">
                <span>Phase 3-3 예정</span>
                <ArrowUpRight className="w-4 h-4" />
              </div>
            </div>

            {/* 3. 1초 출결 체크 */}
            <div className="group p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-900 transition-all shadow-lg flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4 group-hover:scale-110 transition-transform">
                  <CalendarCheck2 className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors">
                  1초 출결 체크
                </h3>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                  모바일/태블릿 원터치 출결(출석, 결석, 지각) 및 보강 관리
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-emerald-400 font-semibold">
                <span>Phase 4 예정</span>
                <ArrowUpRight className="w-4 h-4" />
              </div>
            </div>

            {/* 4. 수강료 & 수납 */}
            <div className="group p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-amber-500/50 hover:bg-slate-900 transition-all shadow-lg flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-4 group-hover:scale-110 transition-transform">
                  <CreditCard className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors">
                  수강료 & 수납 관리
                </h3>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                  매월 자동 청구서 발행, 결제 수단별 수납 및 미납자 관리
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-amber-400 font-semibold">
                <span>Phase 5 예정</span>
                <ArrowUpRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>

        {/* Live JWT & Security Status Card */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* JWT Status */}
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-white text-base">JWT 이중 토큰 보안 상태</h3>
              </div>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                정상 가동 중
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800/80">
                <div className="text-slate-400 font-semibold mb-1 flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Access Token (수명: 15분, API 호출용)</span>
                </div>
                <p className="font-mono text-slate-300 break-all truncate">
                  {accessToken?.slice(0, 45)}...
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800/80">
                <div className="text-slate-400 font-semibold mb-1 flex items-center gap-1.5">
                  <RefreshCw className="w-3.5 h-3.5 text-purple-400" />
                  <span>Refresh Token (수명: 7일, DB 해시 보관 & RTR 적용)</span>
                </div>
                <p className="font-mono text-slate-300 break-all truncate">
                  {refreshToken?.slice(0, 45)}...
                </p>
              </div>
            </div>
          </div>

          {/* Interactive API Tester */}
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-400">
                  <Code2 className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-white text-base">실시간 백엔드 API 호출 테스트</h3>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                현재 로그인된 토큰이 헤더에 자동으로 첨부되어 실제 백엔드와 실시간 통신합니다.
              </p>

              <div className="flex gap-2">
                <button
                  onClick={testGetMe}
                  disabled={isApiLoading}
                  className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white transition-all disabled:opacity-50 cursor-pointer"
                >
                  GET /auth/me
                </button>
                <button
                  onClick={testGetStudents}
                  disabled={isApiLoading}
                  className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-xs font-semibold text-white transition-all disabled:opacity-50 cursor-pointer"
                >
                  GET /students
                </button>
              </div>
            </div>

            {/* API Result Box */}
            <div className="mt-4 p-3 rounded-2xl bg-slate-950 border border-slate-800 min-h-[120px] max-h-[160px] overflow-y-auto font-mono text-xs">
              {isApiLoading ? (
                <div className="h-full flex items-center justify-center text-slate-500 gap-2 py-6">
                  <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
                  <span>{activeTest} 요청 중...</span>
                </div>
              ) : apiResponse ? (
                <pre className="text-emerald-400">{JSON.stringify(apiResponse, null, 2)}</pre>
              ) : (
                <p className="text-slate-500 text-center py-6">
                  위 버튼을 눌러 실제 API 응답을 확인해보세요.
                </p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
