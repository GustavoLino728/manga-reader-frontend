'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Badge, Rating, Tooltip } from '@mantine/core';
import { Star } from 'lucide-react';

export interface MangaCardProps {
  id: string;
  title: string;
  coverImage: string;
  rating?: number;
  latestChapter?: string;
  isNew?: boolean;
  isHot?: boolean;
}

export function MangaCard({
  id,
  title,
  coverImage,
  rating,
  latestChapter,
  isNew,
  isHot,
}: MangaCardProps) {
  return (
    <Link href={`/manga/${id}`} className="group block">
      <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-muted">
        <Image
          src={coverImage}
          alt={title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
        />
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
        
        {/* Badges */}
        <div className="absolute left-2 top-2 flex flex-col gap-1">
          {rating && (
            <Badge
              leftSection={<Star size={12} fill="currentColor" />}
              className="bg-primary text-primary-foreground"
              size="sm"
            >
              {rating.toFixed(1)}
            </Badge>
          )}
          {isNew && (
            <Badge className="bg-frosted-blue text-jet-black" size="sm">
              Novo
            </Badge>
          )}
          {isHot && (
            <Badge className="bg-burnt-tangerine text-white" size="sm">
              Hot
            </Badge>
          )}
        </div>

        {/* Title on hover */}
        <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 transition-opacity group-hover:opacity-100">
          <Tooltip label={title} position="top" withArrow>
            <p className="line-clamp-2 text-sm font-medium text-white">{title}</p>
          </Tooltip>
        </div>
      </div>
      
      {/* Info below card */}
      <div className="mt-2 space-y-1">
        <h3 className="line-clamp-1 text-sm font-medium text-foreground group-hover:text-primary transition-colors">
          {title}
        </h3>
        {latestChapter && (
          <p className="text-xs text-muted-foreground">{latestChapter}</p>
        )}
        {rating && (
          <div className="flex items-center gap-1">
            <Rating value={rating / 2} fractions={2} size="xs" readOnly />
            <span className="text-xs text-muted-foreground">{rating.toFixed(1)}</span>
          </div>
        )}
      </div>
    </Link>
  );
}

// Compact version for Popular section
export function MangaCardCompact({
  id,
  title,
  coverImage,
  rating,
  genres,
  rank,
}: MangaCardProps & { genres?: string[]; rank?: number }) {
  return (
    <Link
      href={`/manga/${id}`}
      className="group flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-muted"
    >
      {rank && (
        <span
          className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
            rank === 1
              ? 'bg-burnt-tangerine text-white'
              : rank === 2
              ? 'bg-grey text-white'
              : rank === 3
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted text-muted-foreground'
          }`}
        >
          {rank}
        </span>
      )}
      <div className="relative h-14 w-10 shrink-0 overflow-hidden rounded-md">
        <Image
          src={coverImage}
          alt={title}
          fill
          className="object-cover"
          sizes="40px"
        />
      </div>
      <div className="min-w-0 flex-1">
        <h4 className="line-clamp-1 text-sm font-medium text-foreground group-hover:text-primary transition-colors">
          {title}
        </h4>
        {genres && (
          <p className="line-clamp-1 text-xs text-muted-foreground">
            Generos: {genres.join(', ')}
          </p>
        )}
        {rating && (
          <div className="flex items-center gap-1">
            <Rating value={rating / 2} fractions={2} size="xs" readOnly />
            <span className="text-xs text-muted-foreground">{rating.toFixed(1)}</span>
          </div>
        )}
      </div>
    </Link>
  );
}
