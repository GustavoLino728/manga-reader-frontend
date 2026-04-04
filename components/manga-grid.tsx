'use client';

import { useRef, useCallback, useState, useEffect } from 'react';
import { ActionIcon } from '@mantine/core';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { MangaCard, type MangaCardProps } from './manga-card';

interface MangaGridProps {
  mangas: MangaCardProps[];
  scrollable?: boolean;
}

export function MangaGrid({ mangas, scrollable = false }: MangaGridProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateScrollButtons = useCallback(() => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el || !scrollable) return;

    updateScrollButtons();
    el.addEventListener('scroll', updateScrollButtons);
    return () => el.removeEventListener('scroll', updateScrollButtons);
  }, [scrollable, updateScrollButtons]);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const scrollAmount = scrollRef.current.clientWidth * 0.8;
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  if (!scrollable) {
    return (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {mangas.map((manga) => (
          <MangaCard key={manga.id} {...manga} />
        ))}
      </div>
    );
  }

  return (
    <div className="relative group">
      {/* Scroll buttons */}
      {canScrollLeft && (
        <ActionIcon
          onClick={() => scroll('left')}
          className="absolute -left-3 top-1/3 z-10 bg-card/90 text-foreground shadow-lg opacity-0 transition-opacity group-hover:opacity-100 hover:bg-primary hover:text-primary-foreground"
          size="lg"
          radius="xl"
        >
          <ChevronLeft size={20} />
        </ActionIcon>
      )}
      {canScrollRight && (
        <ActionIcon
          onClick={() => scroll('right')}
          className="absolute -right-3 top-1/3 z-10 bg-card/90 text-foreground shadow-lg opacity-0 transition-opacity group-hover:opacity-100 hover:bg-primary hover:text-primary-foreground"
          size="lg"
          radius="xl"
        >
          <ChevronRight size={20} />
        </ActionIcon>
      )}

      {/* Scrollable container */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {mangas.map((manga) => (
          <div key={manga.id} className="w-36 shrink-0 sm:w-40 md:w-44">
            <MangaCard {...manga} />
          </div>
        ))}
      </div>
    </div>
  );
}
