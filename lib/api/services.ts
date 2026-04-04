import { apiClient } from './client';
import type {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  UserResponse,
  UpdateUserRequest,
  MangaResponse,
  MangaSearchResponse,
  ChapterResponse,
  ReaderSessionResponse,
  LibraryEntryResponse,
  AddToLibraryRequest,
  UpdateLibraryStatusRequest,
  ProgressResponse,
  SaveProgressRequest,
  LibraryStatus,
} from './types';

// ==================== Auth Service ====================
export const authService = {
  login: (data: LoginRequest) =>
    apiClient.post<AuthResponse>('/auth/login', data),

  register: (data: RegisterRequest) =>
    apiClient.post<AuthResponse>('/auth/register', data),

  refresh: (token: string) =>
    apiClient.post<AuthResponse>('/auth/refresh', undefined, { token }),

  logout: (token: string) =>
    apiClient.post<void>('/auth/logout', undefined, { token }),
};

// ==================== User Service ====================
export const userService = {
  getMe: () => apiClient.get<UserResponse>('/users/me'),

  updateMe: (data: UpdateUserRequest) =>
    apiClient.patch<UserResponse>('/users/me', data),
};

// ==================== Manga Service ====================
export const mangaService = {
  search: (q: string, options?: { lang?: string; limit?: number; offset?: number }) =>
    apiClient.get<MangaSearchResponse>('/manga/search', {
      q,
      lang: options?.lang || 'pt-br',
      limit: options?.limit || 20,
      offset: options?.offset || 0,
    }),

  getById: (mangaId: string, lang?: string) =>
    apiClient.get<MangaResponse>(`/manga/${mangaId}`, { lang: lang || 'pt-br' }),

  getChapters: (mangaId: string, options?: { lang?: string; limit?: number; offset?: number }) =>
    apiClient.get<ChapterResponse[]>(`/manga/${mangaId}/chapters`, {
      lang: options?.lang || 'pt-br',
      limit: options?.limit || 100,
      offset: options?.offset || 0,
    }),
};

// ==================== Reader Service ====================
export const readerService = {
  getSession: (chapterId: string, quality?: 'data' | 'dataSaver') =>
    apiClient.get<ReaderSessionResponse>(`/reader/${chapterId}`, {
      quality: quality || 'data',
    }),

  getPageUrl: (chapterId: string, pageIndex: number, quality?: 'data' | 'dataSaver') => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
    return `${baseUrl}/reader/${chapterId}/page/${pageIndex}?quality=${quality || 'data'}`;
  },
};

// ==================== Library Service ====================
export const libraryService = {
  getLibrary: (status?: LibraryStatus) =>
    apiClient.get<LibraryEntryResponse[]>('/library', status ? { status } : undefined),

  addToLibrary: (data: AddToLibraryRequest) =>
    apiClient.post<LibraryEntryResponse>('/library', data),

  updateStatus: (mangaId: string, data: UpdateLibraryStatusRequest) =>
    apiClient.patch<LibraryEntryResponse>(`/library/${mangaId}`, data),

  removeFromLibrary: (mangaId: string) =>
    apiClient.delete<void>(`/library/${mangaId}`),
};

// ==================== Progress Service ====================
export const progressService = {
  getProgress: (mangaId: string) =>
    apiClient.get<ProgressResponse>(`/progress/${mangaId}`),

  saveProgress: (mangaId: string, data: SaveProgressRequest) =>
    apiClient.put<ProgressResponse>(`/progress/${mangaId}`, data),
};
