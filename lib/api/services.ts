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

  // Send refreshToken in request body as expected by Spring Boot backend
  refresh: (refreshToken: string) =>
    apiClient.post<AuthResponse>('/auth/refresh', { refreshToken }),

  // Send refreshToken in request body as expected by Spring Boot backend
  logout: (refreshToken: string) =>
    apiClient.post<void>('/auth/logout', { refreshToken }),
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
  getSession: (chapterId: string) =>
    apiClient.get<ReaderSessionResponse>(`/reader/${chapterId}`),

  getPageUrl: (chapterId: string, pageIndex: number) => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
    return `${baseUrl}/reader/${chapterId}/page/${pageIndex}`;
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
