'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { MangaResponse } from '@/lib/api/types';

interface LatestUpdatesProps {
  updates: MangaResponse[];
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
            {manga.coverUrl ? (
              <Image
                src={manga.coverUrl}
                alt={manga.title}
                fill
                className="object-cover"
                sizes="64px"
              />
            ) : (
              <div className="h-full w-full bg-muted rounded-md" />
            )}
          </Link>

          {/* Info */}
          <div className="min-w-0 flex-1">
            <Link
              href={`/manga/${manga.id}`}
              className="line-clamp-1 font-medium text-foreground hover:text-primary transition-colors"
            >
              {manga.title}
            </Link>
            {manga.description && (
              <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                {manga.description}
              </p>
            )}
            <p className="mt-1 text-xs text-muted-foreground">
              {manga.status?.toLowerCase().replace('_', ' ')}
              {manga.year ? ` • ${manga.year}` : ''}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
