'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  Button,
  TextInput,
  ActionIcon,
  Badge,
  Menu,
  ScrollArea,
  Skeleton,
  Loader,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
  Bookmark,
  Play,
  FastForward,
  Star,
  Book,
  Users,
  ChevronDown,
  ChevronUp,
  Search,
  SortDesc,
  SortAsc,
} from 'lucide-react';
import { useManga, useMangaChapters, useAddToLibrary, useRemoveFromLibrary, useLibrary } from '@/lib/api/hooks';
import { useAuthStore } from '@/store/auth-store';

function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);

  if (diffDays === 0) {
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    if (diffHours === 0) {
      return 'Agora';
    }
    return `${diffHours}h atras`;
  }
  if (diffDays === 1) return '1 dia atras';
  if (diffDays < 7) return `${diffDays} dias atras`;
  if (diffWeeks === 1) return '1 semana atras';
  if (diffWeeks < 4) return `${diffWeeks} semanas atras`;
  if (diffMonths < 12) {
    return date.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short', year: 'numeric' });
  }
  return date.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short', year: 'numeric' });
}

function MangaDetailSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <div className="flex flex-col gap-8 lg:flex-row">
        <div className="w-full shrink-0 lg:w-80">
          <Skeleton height={420} radius="lg" />
          <Skeleton height={40} radius="md" className="mt-4" />
          <Skeleton height={100} radius="lg" className="mt-4" />
        </div>
        <div className="flex-1">
          <Skeleton height={36} width="70%" radius="md" />
          <Skeleton height={20} width="90%" radius="md" className="mt-2" />
          <Skeleton height={120} radius="md" className="mt-4" />
          <div className="mt-6 flex gap-3">
            <Skeleton height={40} radius="md" className="flex-1" />
            <Skeleton height={40} radius="md" className="flex-1" />
            <Skeleton height={40} radius="md" className="flex-1" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MangaDetailPage() {
  const params = useParams();
  const mangaId = params.id as string;
  
  // API hooks
  const { data: manga, isLoading: mangaLoading, error: mangaError } = useManga(mangaId);
  const { data: chapters, isLoading: chaptersLoading } = useMangaChapters(mangaId);
  const { data: library } = useLibrary();
  const addToLibrary = useAddToLibrary();
  const removeFromLibrary = useRemoveFromLibrary();
  
  const { isAuthenticated } = useAuthStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [showFullDescription, { toggle: toggleDescription }] = useDisclosure(false);
  
  const isInLibrary = useMemo(() => {
    return library?.some((entry) => entry.mangaId === mangaId) ?? false;
  }, [library, mangaId]);

  const filteredChapters = useMemo(() => {
    if (!chapters) return [];
    
    let sorted = [...chapters];
    
    if (searchQuery) {
      sorted = sorted.filter(
        (ch) =>
          ch.chapter?.includes(searchQuery) ||
          ch.title?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Sort by chapter number
    sorted.sort((a, b) => {
      const aNum = parseFloat(a.chapter || '0');
      const bNum = parseFloat(b.chapter || '0');
      return sortOrder === 'newest' ? bNum - aNum : aNum - bNum;
    });
    
    return sorted;
  }, [chapters, searchQuery, sortOrder]);

  const handleLibraryToggle = async () => {
    if (!isAuthenticated) {
      // Could redirect to login or show a modal
      return;
    }
    
    if (isInLibrary) {
      removeFromLibrary.mutate(mangaId);
    } else {
      addToLibrary.mutate({ mangaId });
    }
  };

  if (mangaLoading) {
    return <MangaDetailSkeleton />;
  }

  if (mangaError || !manga) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground">Manga nao encontrado</h1>
          <p className="mt-2 text-muted-foreground">O manga que voce procura nao existe ou houve um erro.</p>
          <Link href="/">
            <Button className="mt-4 bg-primary text-primary-foreground hover:bg-primary/90">
              Voltar para Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const description = manga.description || '';
  const truncatedDescription = description.slice(0, 300);
  const needsTruncation = description.length > 300;
  const totalChapters = chapters?.length || 0;
  const firstChapter = chapters?.[chapters.length - 1];
  const lastChapter = chapters?.[0];

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Left Column - Cover and Stats */}
        <div className="w-full shrink-0 lg:w-80">
          {/* Cover Image */}
          <div className="relative aspect-[3/4] w-full overflow-hidden rounded-lg bg-card">
            {manga.coverUrl ? (
              <Image
                src={manga.coverUrl}
                alt={manga.title}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="flex h-full items-center justify-center text-muted-foreground">
                <Book size={48} />
              </div>
            )}
          </div>

          {/* Rating Button */}
          <Button
            variant="outline"
            fullWidth
            className="mt-4 border-border bg-card text-foreground hover:bg-muted"
            leftSection={<Star size={18} className="text-yellow-500 fill-yellow-500" />}
          >
            Avaliar
          </Button>

          {/* Stats */}
          <div className="mt-4 grid grid-cols-3 gap-2 rounded-lg bg-card p-4">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-lg font-bold text-yellow-500">
                <Star size={18} className="fill-yellow-500" />
                N/A
              </div>
              <div className="text-xs text-muted-foreground">Avaliacao</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-lg font-bold text-primary">
                <Book size={18} />
                {totalChapters}
              </div>
              <div className="text-xs text-muted-foreground">Capitulos</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-lg font-bold text-primary">
                <Bookmark size={18} />
                N/A
              </div>
              <div className="text-xs text-muted-foreground">Favoritos</div>
            </div>
          </div>

          {/* Status and Type */}
          <div className="mt-4 grid grid-cols-2 gap-4 rounded-lg bg-card p-4">
            <div>
              <div className="text-xs text-muted-foreground">Status</div>
              <div className="mt-1 flex items-center gap-2">
                <span
                  className={`h-2 w-2 rounded-full ${
                    manga.status === 'ongoing'
                      ? 'bg-green-500'
                      : manga.status === 'completed'
                      ? 'bg-blue-500'
                      : 'bg-yellow-500'
                  }`}
                />
                <span className="font-medium text-foreground capitalize">
                  {manga.status === 'ongoing' ? 'Em Andamento' : manga.status === 'completed' ? 'Completo' : manga.status}
                </span>
              </div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Ano</div>
              <div className="mt-1 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-primary" />
                <span className="font-medium text-foreground">{manga.year || 'N/A'}</span>
              </div>
            </div>
          </div>

          {/* Content Rating */}
          {manga.contentRating && (
            <div className="mt-4">
              <Badge
                variant="outline"
                className={`border-border ${
                  manga.contentRating === 'safe' 
                    ? 'text-green-500 border-green-500' 
                    : manga.contentRating === 'suggestive'
                    ? 'text-yellow-500 border-yellow-500'
                    : 'text-red-500 border-red-500'
                }`}
              >
                {manga.contentRating.toUpperCase()}
              </Badge>
            </div>
          )}
        </div>

        {/* Right Column - Details and Chapters */}
        <div className="flex-1">
          {/* Title */}
          <h1 className="text-2xl font-bold text-foreground md:text-3xl">{manga.title}</h1>

          {/* Description */}
          <div className="mt-4">
            <p className="text-foreground leading-relaxed whitespace-pre-line">
              {showFullDescription ? description : truncatedDescription}
              {!showFullDescription && needsTruncation && '...'}
            </p>
            {needsTruncation && (
              <button
                onClick={toggleDescription}
                className="mt-2 flex items-center gap-1 text-primary hover:text-primary/80 transition-colors"
              >
                {showFullDescription ? (
                  <>
                    Mostrar menos <ChevronUp size={16} />
                  </>
                ) : (
                  <>
                    Mostrar mais <ChevronDown size={16} />
                  </>
                )}
              </button>
            )}
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Button
              onClick={handleLibraryToggle}
              loading={addToLibrary.isPending || removeFromLibrary.isPending}
              className={`flex-1 ${
                isInLibrary
                  ? 'bg-primary/20 text-primary border border-primary hover:bg-primary/30'
                  : 'bg-primary text-primary-foreground hover:bg-primary/90'
              }`}
              leftSection={!addToLibrary.isPending && !removeFromLibrary.isPending && (
                <Bookmark size={18} className={isInLibrary ? 'fill-primary' : ''} />
              )}
            >
              {isInLibrary ? 'Na Biblioteca' : 'Adicionar'}
            </Button>
            {firstChapter && (
              <Link href={`/reader/${firstChapter.id}`} className="flex-1">
                <Button
                  variant="outline"
                  fullWidth
                  className="border-border bg-card text-foreground hover:bg-muted"
                  leftSection={<Play size={18} />}
                >
                  Primeiro Capitulo
                </Button>
              </Link>
            )}
            {lastChapter && (
              <Link href={`/reader/${lastChapter.id}`} className="flex-1">
                <Button
                  variant="outline"
                  fullWidth
                  className="border-border bg-card text-foreground hover:bg-muted"
                  leftSection={<FastForward size={18} />}
                >
                  Ultimo Capitulo
                </Button>
              </Link>
            )}
          </div>

          {/* Chapter List */}
          <div className="mt-8">
            {/* Chapter Header */}
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-foreground">
                {totalChapters} Capitulos
              </h2>
              <Menu shadow="md" width={150}>
                <Menu.Target>
                  <Button
                    variant="subtle"
                    className="text-foreground hover:bg-muted"
                    rightSection={sortOrder === 'newest' ? <SortDesc size={16} /> : <SortAsc size={16} />}
                  >
                    {sortOrder === 'newest' ? 'Mais Recente' : 'Mais Antigo'}
                  </Button>
                </Menu.Target>
                <Menu.Dropdown className="bg-card border-border">
                  <Menu.Item
                    className="text-foreground hover:bg-muted"
                    onClick={() => setSortOrder('newest')}
                    leftSection={<SortDesc size={16} />}
                  >
                    Mais Recente
                  </Menu.Item>
                  <Menu.Item
                    className="text-foreground hover:bg-muted"
                    onClick={() => setSortOrder('oldest')}
                    leftSection={<SortAsc size={16} />}
                  >
                    Mais Antigo
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </div>

            {/* Search */}
            <TextInput
              placeholder="Buscar capitulos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftSection={<Search size={16} />}
              className="mt-4"
              classNames={{
                input: 'bg-card border-border text-foreground placeholder:text-muted-foreground focus:border-primary',
              }}
            />

            {/* Chapter List */}
            {chaptersLoading ? (
              <div className="mt-8 flex justify-center">
                <Loader color="var(--primary)" />
              </div>
            ) : (
              <ScrollArea h={500} className="mt-4">
                <div className="space-y-1">
                  {filteredChapters.map((chapter) => (
                    <Link
                      key={chapter.id}
                      href={`/reader/${chapter.id}`}
                      className="flex items-center justify-between rounded-lg px-4 py-3 transition-colors text-foreground hover:bg-muted"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-medium">
                          {chapter.volume && `Vol. ${chapter.volume} `}
                          Cap. {chapter.chapter}
                        </span>
                        {chapter.title && (
                          <span className="text-muted-foreground">- {chapter.title}</span>
                        )}
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {formatRelativeTime(chapter.publishAt)}
                      </span>
                    </Link>
                  ))}
                  {filteredChapters.length === 0 && !chaptersLoading && (
                    <div className="py-8 text-center text-muted-foreground">
                      Nenhum capitulo encontrado
                    </div>
                  )}
                </div>
              </ScrollArea>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
