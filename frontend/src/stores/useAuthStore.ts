'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { UserProfile, AcademySummary, AuthResponse, TokensResponse } from '@/types/auth';

interface AuthState {
  user: UserProfile | null;
  academy: AcademySummary | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isHydrated: boolean;

  // Actions
  setAuth: (data: AuthResponse) => void;
  setTokens: (tokens: TokensResponse) => void;
  setUser: (user: UserProfile) => void;
  setAcademy: (academy: AcademySummary) => void;
  logout: () => void;
  setHydrated: (hydrated: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      academy: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isHydrated: false,

      setAuth: (data: AuthResponse) => {
        if (typeof window !== 'undefined') {
          localStorage.setItem('classhelper_access_token', data.accessToken);
          localStorage.setItem('classhelper_refresh_token', data.refreshToken);
        }
        set({
          user: data.user,
          academy: data.academy,
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
          isAuthenticated: true,
        });
      },

      setTokens: (tokens: TokensResponse) => {
        if (typeof window !== 'undefined') {
          localStorage.setItem('classhelper_access_token', tokens.accessToken);
          localStorage.setItem('classhelper_refresh_token', tokens.refreshToken);
        }
        set({
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
          isAuthenticated: true,
        });
      },

      setUser: (user: UserProfile) => set({ user }),
      setAcademy: (academy: AcademySummary) => set({ academy }),

      logout: () => {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('classhelper_access_token');
          localStorage.removeItem('classhelper_refresh_token');
        }
        set({
          user: null,
          academy: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
        });
      },

      setHydrated: (hydrated: boolean) => set({ isHydrated: hydrated }),
    }),
    {
      name: 'classhelper-auth-storage',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    },
  ),
);
