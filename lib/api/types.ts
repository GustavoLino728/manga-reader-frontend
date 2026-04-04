// API Types matching the Spring Boot backend DTOs

// ==================== Auth ====================
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
}

// ==================== User ====================
export interface UserResponse {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  createdAt: string;
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
  avatarUrl?: string;
}

// ==================== Manga ====================
export interface MangaResponse {
  id: string;
  title: string;
  description: string;
  status: string;
  year: number | null;
  contentRating: string;
  coverUrl: string;
}

export interface MangaSearchResponse {
  results: MangaResponse[];
  total: number;
  offset: number;
  limit: number;
}

export interface ChapterResponse {
  id: string;
  title: string | null;
  volume: string | null;
  chapter: string;
  translatedLanguage: string;
  pages: number;
  publishAt: string;
}

// ==================== Reader ====================
export interface ReaderSessionResponse {
  chapterId: string;
  totalPages: number;
  pages: string[]; // URLs for each page
}

// ==================== Library ====================
export type LibraryStatus = 'READING' | 'COMPLETED' | 'ON_HOLD' | 'DROPPED' | 'PLAN_TO_READ';

export interface LibraryEntryResponse {
  id: string;
  mangaId: string;
  title: string;
  coverUrl: string;
  status: LibraryStatus;
  createdAt: string;
  updatedAt: string;
}

export interface AddToLibraryRequest {
  mangaId: string;
  status?: LibraryStatus;
}

export interface UpdateLibraryStatusRequest {
  status: LibraryStatus;
}

// ==================== Progress ====================
export interface ProgressResponse {
  mangaId: string;
  chapterId: string;
  page: number;
  updatedAt: string;
}

export interface SaveProgressRequest {
  chapterId: string;
  page: number;
}

// ==================== API Error ====================
export interface ApiError {
  message: string;
  status: number;
  timestamp?: string;
}
