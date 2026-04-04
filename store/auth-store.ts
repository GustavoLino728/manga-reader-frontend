'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserResponse } from '@/lib/api/types';
import { apiClient } from '@/lib/api/client';

interface AuthState {
  user: UserResponse | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // Actions
  setUser: (user: UserResponse | null) => void;
  setLoading: (loading: boolean) => void;
  login: (accessToken: string, refreshToken: string, user: UserResponse) => void;
  logout: () => void;
  checkAuth: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: true,

      setUser: (user) => set({ user, isAuthenticated: !!user }),
      
      setLoading: (isLoading) => set({ isLoading }),

      login: (accessToken, refreshToken, user) => {
        apiClient.setTokens(accessToken, refreshToken);
        set({ user, isAuthenticated: true, isLoading: false });
      },

      logout: () => {
        apiClient.clearTokens();
        set({ user: null, isAuthenticated: false, isLoading: false });
      },

      checkAuth: () => {
        const isAuth = apiClient.isAuthenticated();
        if (!isAuth) {
          set({ user: null, isAuthenticated: false, isLoading: false });
        }
        return isAuth;
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Check if tokens still exist after rehydration
          const isAuth = apiClient.isAuthenticated();
          if (!isAuth) {
            state.user = null;
            state.isAuthenticated = false;
          }
          state.isLoading = false;
        }
      },
    }
  )
);
