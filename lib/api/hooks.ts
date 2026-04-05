'use client';

import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { authService, userService, mangaService, readerService, libraryService, progressService } from './services';
import { apiClient } from './client';
import { useAuthStore } from '@/store/auth-store';
import type {
  LoginRequest,
  RegisterRequest,
  UpdateUserRequest,
  AddToLibraryRequest,
  UpdateLibraryStatusRequest,
  SaveProgressRequest,
  LibraryStatus,
} from './types';

// ==================== Auth Hooks ====================
export function useLogin() {
  const queryClient = useQueryClient();
  const { login: storeLogin } = useAuthStore();

  return useMutation({
    mutationFn: (data: LoginRequest) => authService.login(data),
    onSuccess: async (data) => {
      // Set tokens in HTTP client
      apiClient.setTokens(data.accessToken, data.refreshToken);
      // Fetch the authenticated user and sync with auth store
      const user = await userService.getMe();
      storeLogin(data.accessToken, data.refreshToken, user);
      queryClient.invalidateQueries({ queryKey: ['user', 'me'] });
    },
  });
}

export function useRegister() {
  const queryClient = useQueryClient();
  const { login: storeLogin } = useAuthStore();

  return useMutation({
    mutationFn: (data: RegisterRequest) => authService.register(data),
    onSuccess: async (data) => {
      // Set tokens in HTTP client
      apiClient.setTokens(data.accessToken, data.refreshToken);
      // Fetch the authenticated user and sync with auth store
      const user = await userService.getMe();
      storeLogin(data.accessToken, data.refreshToken, user);
      queryClient.invalidateQueries({ queryKey: ['user', 'me'] });
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  const { logout: storeLogout } = useAuthStore();

  return useMutation({
    mutationFn: () => {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        return authService.logout(refreshToken);
      }
      return Promise.resolve();
    },
    onSettled: () => {
      storeLogout();
      apiClient.clearTokens();
      queryClient.clear();
    },
  });
}

// ==================== User Hooks ====================
export function useUser() {
  return useQuery({
    queryKey: ['user', 'me'],
    queryFn: () => userService.getMe(),
    enabled: apiClient.isAuthenticated(),
    retry: false,
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateUserRequest) => userService.updateMe(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user', 'me'] });
    },
  });
}

// ==================== Manga Hooks ====================
export function useMangaSearch(query: string, options?: { lang?: string; limit?: number; enabled?: boolean }) {
  return useQuery({
    queryKey: ['manga', 'search', query, options?.lang, options?.limit],
    queryFn: () => mangaService.search(query, { lang: options?.lang, limit: options?.limit }),
    enabled: options?.enabled !== false && query.length >= 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useMangaSearchInfinite(query: string, options?: { lang?: string; limit?: number }) {
  return useInfiniteQuery({
    queryKey: ['manga', 'search', 'infinite', query, options?.lang],
    queryFn: ({ pageParam = 0 }) =>
      mangaService.search(query, { lang: options?.lang, limit: options?.limit || 20, offset: pageParam as number }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      const nextOffset = lastPage.offset + lastPage.limit;
      return nextOffset < lastPage.total ? nextOffset : undefined;
    },
    enabled: query.length >= 2,
    staleTime: 5 * 60 * 1000,
  });
}

export function useManga(mangaId: string, lang?: string) {
  return useQuery({
    queryKey: ['manga', mangaId, lang],
    queryFn: () => mangaService.getById(mangaId, lang),
    enabled: !!mangaId,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

export function useMangaChapters(mangaId: string, options?: { lang?: string; limit?: number }) {
  return useQuery({
    queryKey: ['manga', mangaId, 'chapters', options?.lang, options?.limit],
    queryFn: () => mangaService.getChapters(mangaId, { lang: options?.lang, limit: options?.limit || 500 }),
    enabled: !!mangaId,
    staleTime: 5 * 60 * 1000,
  });
}

export function useMangaChaptersInfinite(mangaId: string, options?: { lang?: string; limit?: number }) {
  return useInfiniteQuery({
    queryKey: ['manga', mangaId, 'chapters', 'infinite', options?.lang],
    queryFn: ({ pageParam = 0 }) =>
      mangaService.getChapters(mangaId, { lang: options?.lang, limit: options?.limit || 100, offset: pageParam as number }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      const totalFetched = allPages.flatMap((p) => p).length;
      return lastPage.length === (options?.limit || 100) ? totalFetched : undefined;
    },
    enabled: !!mangaId,
    staleTime: 5 * 60 * 1000,
  });
}

// ==================== Reader Hooks ====================
export function useReaderSession(chapterId: string) {
  return useQuery({
    queryKey: ['reader', chapterId],
    queryFn: () => readerService.getSession(chapterId),
    enabled: !!chapterId,
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
}

// ==================== Library Hooks ====================
export function useLibrary(status?: LibraryStatus) {
  return useQuery({
    queryKey: ['library', status],
    queryFn: () => libraryService.getLibrary(status),
    enabled: apiClient.isAuthenticated(),
    staleTime: 60 * 1000, // 1 minute
  });
}

export function useAddToLibrary() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: AddToLibraryRequest) => libraryService.addToLibrary(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['library'] });
    },
  });
}

export function useUpdateLibraryStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ mangaId, data }: { mangaId: string; data: UpdateLibraryStatusRequest }) =>
      libraryService.updateStatus(mangaId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['library'] });
    },
  });
}

export function useRemoveFromLibrary() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (mangaId: string) => libraryService.removeFromLibrary(mangaId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['library'] });
    },
  });
}

// ==================== Progress Hooks ====================
export function useProgress(mangaId: string) {
  return useQuery({
    queryKey: ['progress', mangaId],
    queryFn: () => progressService.getProgress(mangaId),
    enabled: !!mangaId && apiClient.isAuthenticated(),
    staleTime: 60 * 1000,
  });
}

export function useSaveProgress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ mangaId, data }: { mangaId: string; data: SaveProgressRequest }) =>
      progressService.saveProgress(mangaId, data),
    onSuccess: (_, { mangaId }) => {
      queryClient.invalidateQueries({ queryKey: ['progress', mangaId] });
    },
  });
}
