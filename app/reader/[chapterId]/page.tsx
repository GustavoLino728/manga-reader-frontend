'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  ActionIcon,
  Slider,
  Menu,
  Drawer,
  Loader,
} from '@mantine/core';
import { useDisclosure, useHotkeys, useFullscreen } from '@mantine/hooks';
import {
  ChevronLeft,
  ChevronRight,
  Home,
  Settings,
  Maximize,
  Minimize,
  List,
  Sun,
  Moon,
} from 'lucide-react';
import { useReaderSession, useSaveProgress } from '@/lib/api/hooks';
import { readerService } from '@/lib/api/services';
import { useReaderStore } from '@/store/reader-store';
import { useAuthStore } from '@/store/auth-store';

export default function ReaderPage() {
  const params = useParams();
  const router = useRouter();
  const chapterId = params.chapterId as string;

  const { data: session, isLoading, error } = useReaderSession(chapterId);
  const saveProgress = useSaveProgress();
  const { isAuthenticated } = useAuthStore();
  const { settings, updateSettings } = useReaderStore();

  const [currentPage, setCurrentPage] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [settingsOpened, { open: openSettings, close: closeSettings }] = useDisclosure(false);
  const { toggle: toggleFullscreen, fullscreen } = useFullscreen();

  const totalPages = session?.totalPages || 0;

  // Auto-hide controls
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (showControls) {
      timeout = setTimeout(() => setShowControls(false), 3000);
    }
    return () => clearTimeout(timeout);
  }, [showControls, currentPage]);

  // Save progress when page changes
  useEffect(() => {
    if (isAuthenticated && session && currentPage > 0) {
      // Debounce save progress
      const timeout = setTimeout(() => {
        // Note: mangaId would need to be passed or fetched
        // saveProgress.mutate({ mangaId: '...', data: { chapterId, page: currentPage } });
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [currentPage, chapterId, isAuthenticated, session]);

  const goToPage = useCallback((page: number) => {
    if (page >= 0 && page < totalPages) {
      setCurrentPage(page);
      setShowControls(true);
    }
  }, [totalPages]);

  const nextPage = useCallback(() => {
    if (settings.direction === 'rtl') {
      goToPage(currentPage - 1);
    } else {
      goToPage(currentPage + 1);
    }
  }, [currentPage, goToPage, settings.direction]);

  const prevPage = useCallback(() => {
    if (settings.direction === 'rtl') {
      goToPage(currentPage + 1);
    } else {
      goToPage(currentPage - 1);
    }
  }, [currentPage, goToPage, settings.direction]);

  // Keyboard navigation
  useHotkeys([
    ['ArrowRight', nextPage],
    ['ArrowLeft', prevPage],
    ['Space', nextPage],
    ['f', toggleFullscreen],
    ['Escape', () => setShowControls(true)],
  ]);

  const handleClick = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const width = rect.width;
    
    // Click on left third = prev, right third = next, middle = toggle controls
    if (x < width / 3) {
      prevPage();
    } else if (x > (width * 2) / 3) {
      nextPage();
    } else {
      setShowControls(!showControls);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-black">
        <Loader color="var(--primary)" size="xl" />
      </div>
    );
  }

  if (error || !session) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-black text-white">
        <h1 className="text-xl font-bold">Erro ao carregar capitulo</h1>
        <p className="mt-2 text-gray-400">Nao foi possivel carregar as paginas.</p>
        <Link href="/" className="mt-4 text-primary hover:underline">
          Voltar para Home
        </Link>
      </div>
    );
  }

  const pageUrl = readerService.getPageUrl(chapterId, currentPage, 'data');

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-black">
      {/* Reader Content */}
      <div
        className="flex h-full w-full cursor-pointer items-center justify-center"
        onClick={handleClick}
      >
        {settings.mode === 'webtoon' ? (
          // Webtoon (vertical scroll) mode
          <div className="h-full w-full overflow-y-auto">
            <div className="mx-auto max-w-3xl">
              {session.pages.map((_, index) => (
                <div key={index} className="relative w-full">
                  <Image
                    src={readerService.getPageUrl(chapterId, index, 'data')}
                    alt={`Pagina ${index + 1}`}
                    width={800}
                    height={1200}
                    className="w-full h-auto"
                    priority={index < 3}
                  />
                </div>
              ))}
            </div>
          </div>
        ) : (
          // Single page mode
          <div className="relative h-full w-full">
            <Image
              src={pageUrl}
              alt={`Pagina ${currentPage + 1}`}
              fill
              className={`object-contain ${settings.fitToWidth ? 'object-contain' : ''}`}
              style={{
                filter: `brightness(${settings.brightness}%)`,
              }}
              priority
            />
          </div>
        )}
      </div>

      {/* Top Controls */}
      <div
        className={`absolute left-0 right-0 top-0 bg-gradient-to-b from-black/80 to-transparent p-4 transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-2">
            <ActionIcon
              variant="subtle"
              color="white"
              size="lg"
              onClick={() => router.back()}
            >
              <ChevronLeft size={24} />
            </ActionIcon>
            <Link href="/">
              <ActionIcon variant="subtle" color="white" size="lg">
                <Home size={20} />
              </ActionIcon>
            </Link>
          </div>

          <div className="text-sm text-white">
            Pagina {currentPage + 1} de {totalPages}
          </div>

          <div className="flex items-center gap-2">
            <ActionIcon
              variant="subtle"
              color="white"
              size="lg"
              onClick={toggleFullscreen}
            >
              {fullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
            </ActionIcon>
            <ActionIcon
              variant="subtle"
              color="white"
              size="lg"
              onClick={openSettings}
            >
              <Settings size={20} />
            </ActionIcon>
          </div>
        </div>
      </div>

      {/* Bottom Controls */}
      <div
        className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      >
        <div className="mx-auto max-w-3xl">
          {/* Page Slider */}
          <Slider
            value={currentPage}
            onChange={goToPage}
            min={0}
            max={totalPages - 1}
            label={(value) => `${value + 1}`}
            color="violet"
            className="mb-4"
          />

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between">
            <ActionIcon
              variant="filled"
              color="violet"
              size="xl"
              onClick={prevPage}
              disabled={currentPage === 0}
            >
              <ChevronLeft size={24} />
            </ActionIcon>

            <div className="flex items-center gap-4">
              <span className="text-lg font-medium text-white">
                {currentPage + 1} / {totalPages}
              </span>
            </div>

            <ActionIcon
              variant="filled"
              color="violet"
              size="xl"
              onClick={nextPage}
              disabled={currentPage === totalPages - 1}
            >
              <ChevronRight size={24} />
            </ActionIcon>
          </div>
        </div>
      </div>

      {/* Settings Drawer */}
      <Drawer
        opened={settingsOpened}
        onClose={closeSettings}
        title="Configuracoes do Leitor"
        position="right"
        classNames={{
          content: 'bg-card',
          header: 'bg-card',
          title: 'text-foreground font-bold',
        }}
      >
        <div className="space-y-6">
          {/* Reading Mode */}
          <div>
            <label className="text-sm font-medium text-foreground">Modo de Leitura</label>
            <div className="mt-2 grid grid-cols-3 gap-2">
              {(['single', 'double', 'webtoon'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => updateSettings({ mode })}
                  className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    settings.mode === mode
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-foreground hover:bg-muted/80'
                  }`}
                >
                  {mode === 'single' ? 'Simples' : mode === 'double' ? 'Duplo' : 'Webtoon'}
                </button>
              ))}
            </div>
          </div>

          {/* Reading Direction */}
          <div>
            <label className="text-sm font-medium text-foreground">Direcao de Leitura</label>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <button
                onClick={() => updateSettings({ direction: 'ltr' })}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  settings.direction === 'ltr'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-foreground hover:bg-muted/80'
                }`}
              >
                Esquerda → Direita
              </button>
              <button
                onClick={() => updateSettings({ direction: 'rtl' })}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  settings.direction === 'rtl'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-foreground hover:bg-muted/80'
                }`}
              >
                Direita → Esquerda
              </button>
            </div>
          </div>

          {/* Brightness */}
          <div>
            <label className="text-sm font-medium text-foreground">
              Brilho: {settings.brightness}%
            </label>
            <Slider
              value={settings.brightness}
              onChange={(value) => updateSettings({ brightness: value })}
              min={20}
              max={100}
              className="mt-2"
              color="violet"
            />
          </div>

          {/* Show Page Number */}
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-foreground">Mostrar numero da pagina</label>
            <button
              onClick={() => updateSettings({ showPageNumber: !settings.showPageNumber })}
              className={`relative h-6 w-11 rounded-full transition-colors ${
                settings.showPageNumber ? 'bg-primary' : 'bg-muted'
              }`}
            >
              <span
                className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
                  settings.showPageNumber ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </Drawer>
    </div>
  );
}
