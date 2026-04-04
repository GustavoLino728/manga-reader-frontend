import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ReadingMode = 'single' | 'double' | 'webtoon';
export type ReadingDirection = 'ltr' | 'rtl';

interface ReadingProgress {
  mangaId: string;
  chapterId: string;
  page: number;
  timestamp: number;
}

interface Bookmark {
  mangaId: string;
  mangaTitle: string;
  coverImage: string;
  lastChapter: string;
  timestamp: number;
}

interface ReaderSettings {
  mode: ReadingMode;
  direction: ReadingDirection;
  fitToWidth: boolean;
  fitToHeight: boolean;
  showPageNumber: boolean;
  preloadPages: number;
  brightness: number;
}

interface ReaderState {
  // Reading progress
  readingProgress: Record<string, ReadingProgress>;
  setReadingProgress: (mangaId: string, chapterId: string, page: number) => void;
  getReadingProgress: (mangaId: string) => ReadingProgress | undefined;
  
  // Bookmarks
  bookmarks: Bookmark[];
  addBookmark: (bookmark: Omit<Bookmark, 'timestamp'>) => void;
  removeBookmark: (mangaId: string) => void;
  isBookmarked: (mangaId: string) => boolean;
  
  // Reader settings
  settings: ReaderSettings;
  updateSettings: (settings: Partial<ReaderSettings>) => void;
  
  // UI State
  isReaderOpen: boolean;
  setReaderOpen: (open: boolean) => void;
  currentMangaId: string | null;
  setCurrentMangaId: (id: string | null) => void;
  
  // Search history
  searchHistory: string[];
  addSearchHistory: (query: string) => void;
  clearSearchHistory: () => void;
}

export const useReaderStore = create<ReaderState>()(
  persist(
    (set, get) => ({
      // Reading progress
      readingProgress: {},
      setReadingProgress: (mangaId, chapterId, page) =>
        set((state) => ({
          readingProgress: {
            ...state.readingProgress,
            [mangaId]: {
              mangaId,
              chapterId,
              page,
              timestamp: Date.now(),
            },
          },
        })),
      getReadingProgress: (mangaId) => get().readingProgress[mangaId],

      // Bookmarks
      bookmarks: [],
      addBookmark: (bookmark) =>
        set((state) => ({
          bookmarks: [
            ...state.bookmarks.filter((b) => b.mangaId !== bookmark.mangaId),
            { ...bookmark, timestamp: Date.now() },
          ],
        })),
      removeBookmark: (mangaId) =>
        set((state) => ({
          bookmarks: state.bookmarks.filter((b) => b.mangaId !== mangaId),
        })),
      isBookmarked: (mangaId) =>
        get().bookmarks.some((b) => b.mangaId === mangaId),

      // Reader settings
      settings: {
        mode: 'single',
        direction: 'ltr',
        fitToWidth: true,
        fitToHeight: false,
        showPageNumber: true,
        preloadPages: 3,
        brightness: 100,
      },
      updateSettings: (newSettings) =>
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        })),

      // UI State
      isReaderOpen: false,
      setReaderOpen: (open) => set({ isReaderOpen: open }),
      currentMangaId: null,
      setCurrentMangaId: (id) => set({ currentMangaId: id }),

      // Search history
      searchHistory: [],
      addSearchHistory: (query) =>
        set((state) => ({
          searchHistory: [
            query,
            ...state.searchHistory.filter((q) => q !== query),
          ].slice(0, 10),
        })),
      clearSearchHistory: () => set({ searchHistory: [] }),
    }),
    {
      name: 'manga-reader-storage',
      partialize: (state) => ({
        readingProgress: state.readingProgress,
        bookmarks: state.bookmarks,
        settings: state.settings,
        searchHistory: state.searchHistory,
      }),
    }
  )
);
