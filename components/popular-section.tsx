'use client';

import { useState } from 'react';
import { SegmentedControl } from '@mantine/core';
import { MangaCardCompact } from './manga-card';

type TimeFilter = 'weekly' | 'monthly' | 'alltime';

interface PopularManga {
  id: string;
  title: string;
  coverImage: string;
  rating: number;
  genres: string[];
}

interface PopularSectionProps {
  weeklyData: PopularManga[];
  monthlyData: PopularManga[];
  allTimeData: PopularManga[];
}

export function PopularSection({
  weeklyData,
  monthlyData,
  allTimeData,
}: PopularSectionProps) {
  const [filter, setFilter] = useState<TimeFilter>('weekly');

  const data = {
    weekly: weeklyData,
    monthly: monthlyData,
    alltime: allTimeData,
  };

  return (
    <div className="rounded-xl bg-card p-4">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold text-foreground">Populares</h2>
        <SegmentedControl
          size="xs"
          value={filter}
          onChange={(v) => setFilter(v as TimeFilter)}
          data={[
            { label: 'Semanal', value: 'weekly' },
            { label: 'Mensal', value: 'monthly' },
            { label: 'Sempre', value: 'alltime' },
          ]}
          classNames={{
            root: 'bg-muted',
            indicator: 'bg-primary',
            label: 'text-foreground data-[active]:text-primary-foreground',
          }}
        />
      </div>

      <div className="space-y-1">
        {data[filter].slice(0, 5).map((manga, index) => (
          <MangaCardCompact
            key={manga.id}
            {...manga}
            rank={index + 1}
            genres={manga.genres}
          />
        ))}
      </div>
    </div>
  );
}
