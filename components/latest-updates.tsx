'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@mantine/core';
import { Lock, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Chapter {
  id: string;
  number: string;
  title?: string;
  isPremium?: boolean;
  releasedAt: Date;
}

interface MangaUpdate {
  id: string;
  title: string;
  coverImage: string;
  chapters: Chapter[];
}

interface LatestUpdatesProps {
  updates: MangaUpdate[];
}

export function LatestUpdates({ updates }: LatestUpdatesProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {updates.map((manga) => (
        <div
          key={manga.id}
          className="flex gap-3 rounded-lg bg-card p-3 transition-colors hover:bg-surface-elevated"
        >
          {/* Cover */}
          <Link
            href={`/manga/${manga.id}`}
            className="relative h-24 w-16 shrink-0 overflow-hidden rounded-md"
          >
            <Image
              src={manga.coverImage}
              alt={manga.title}
              fill
              className="object-cover"
              sizes="64px"
            />
          </Link>

          {/* Info */}
          <div className="min-w-0 flex-1">
            <Link
              href={`/manga/${manga.id}`}
              className="line-clamp-1 font-medium text-foreground hover:text-primary transition-colors"
            >
              {manga.title}
            </Link>

            {/* Chapters */}
            <div className="mt-2 space-y-1">
              {manga.chapters.slice(0, 2).map((chapter) => (
                <Link
                  key={chapter.id}
                  href={`/manga/${manga.id}/chapter/${chapter.id}`}
                  className="flex items-center justify-between text-sm hover:text-primary transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-foreground">
                      Capitulo {chapter.number}
                    </span>
                    {chapter.isPremium && (
                      <Lock size={12} className="text-burnt-tangerine" />
                    )}
                    {chapter.title && (
                      <span className="text-muted-foreground">
                        - {chapter.title}
                      </span>
                    )}
                  </div>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock size={12} />
                    {formatDistanceToNow(chapter.releasedAt, {
                      addSuffix: false,
                      locale: ptBR,
                    })}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
