import { FeaturedCarousel } from '@/components/featured-carousel';
import { SectionHeader } from '@/components/section-header';
import { MangaGrid } from '@/components/manga-grid';
import { LatestUpdates } from '@/components/latest-updates';
import {
  featuredMangas,
  trendingMangas,
  latestUpdates,
} from '@/lib/mock-data';

export default function HomePage() {
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
