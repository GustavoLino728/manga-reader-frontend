'use client';

import { FeaturedCarousel } from '@/components/featured-carousel';
import { SectionHeader } from '@/components/section-header';
import { MangaGrid } from '@/components/manga-grid';
import { LatestUpdates } from '@/components/latest-updates';
import { useMangaSearch } from '@/lib/api/hooks';

export default function HomePage() {
  // Fetch trending/featured mangas from the real API
  const { data: trendingData, isLoading: trendingLoading } = useMangaSearch('one piece', {
    limit: 10,
    enabled: true,
  });

  const { data: featuredData, isLoading: featuredLoading } = useMangaSearch('naruto', {
    limit: 5,
    enabled: true,
  });

  const { data: latestData, isLoading: latestLoading } = useMangaSearch('bleach', {
    limit: 20,
    enabled: true,
  });

  const trendingMangas = trendingData?.results ?? [];
  const featuredMangas = featuredData?.results ?? [];
  const latestUpdates = latestData?.results ?? [];

  return (
    <div className="min-h-screen">
      {/* Featured Carousel */}
      <FeaturedCarousel mangas={featuredMangas} />

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="space-y-10">
          {/* Trending Today */}
          <section>
            <SectionHeader title="Em Alta Hoje" href="/trending" />
            <MangaGrid mangas={trendingMangas} scrollable />
          </section>

          {/* Latest Updates */}
          <section>
            <SectionHeader title="Ultimas Atualizacoes" href="/updates" />
            <LatestUpdates updates={latestUpdates} />
          </section>
        </div>
      </div>
    </div>
  );
}
