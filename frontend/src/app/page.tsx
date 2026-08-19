'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  GraduationCap,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CalendarCheck2,
  Users,
  CreditCard,
  BookOpen,
} from 'lucide-react';
import { useAuthStore } from '@/stores/useAuthStore';

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated, isHydrated } = useAuthStore();

  useEffect(() => {
    if (isHydrated && isAuthenticated) {
      router.replace('/dashboard');
    }
  }, [isHydrated, isAuthenticated, router]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col justify-between selection:bg-indigo-500 selection:text-white">
      {/* Header */}
      <header className="border-b border-slate-800/80 bg-slate-900/40 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-black tracking-tight text-white">
              Class<span className="text-indigo-400">Helper</span>
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-all"
            >
              로그인
            </Link>
            <Link
              href="/register"
              className="px-4 py-2 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-500/25 transition-all"
            >
              학원 무료 시작
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 flex flex-col items-center text-center justify-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-xs sm:text-sm font-semibold text-indigo-300 mb-8 shadow-sm">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>선생님과 원장님을 위한 스마트 학원 통합 솔루션</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white max-w-4xl leading-tight">
          학원 관리의 모든 것, <br />
          <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">
            터치 한 번으로 스마트하게.
          </span>
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-slate-400 max-w-2xl leading-relaxed">
          복잡한 서류 작업과 엑셀은 이제 그만. 1초 출결 체크부터 수강료 청구/수납, 수업 진도 일지까지 한곳에서 관리하세요.
        </p>

        {/* Action Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Link
            href="/login"
            className="flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white font-bold text-base shadow-xl shadow-indigo-500/30 transition-all hover:scale-105"
          >
            <span>지금 로그인하기</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            href="/register"
            className="flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold text-base transition-all hover:border-slate-600"
          >
            <span>학원 신규 개설 (원장님)</span>
          </Link>
        </div>

        {/* Feature Highlights Grid */}
        <div className="mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full text-left">
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800/80 shadow-lg">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 mb-4">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white mb-1">원생 관리</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              원생 등록, 학년별/재원 상태별 필터링과 학부모 연락처 통합 관리
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800/80 shadow-lg">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-4">
              <CalendarCheck2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white mb-1">1초 출결 체크</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              교실 안에서 모바일/태블릿 터치 한 번으로 출결 기록 및 보강 관리
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800/80 shadow-lg">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400 mb-4">
              <CreditCard className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white mb-1">수강료 & 수납</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              매월 자동 청구서 발행, 결제 수단별 수납 이력 및 미납자 관리
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800/80 shadow-lg">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400 mb-4">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white mb-1">수업 일지 & 진도</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              회차별 진도 범위 및 과제 완성도 기록, 학부모 상담용 피드백 축적
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 py-8 text-center text-xs text-slate-500">
        <p>© 2026 ClassHelper. All rights reserved. 올인원 학원 통합 관리 플랫폼</p>
      </footer>
    </div>
  );
}
