'use client';

import { useRef, useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Carousel } from '@mantine/carousel';
import { Badge } from '@mantine/core';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import type { EmblaCarouselType } from 'embla-carousel';

interface FeaturedManga {
  id: string;
  title: string;
  coverImage: string;
  rating?: number;
  isNew?: boolean;
}

interface FeaturedCarouselProps {
  mangas: FeaturedManga[];
}

export function FeaturedCarousel({ mangas }: FeaturedCarouselProps) {
  const [embla, setEmbla] = useState<EmblaCarouselType | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => embla?.scrollPrev(), [embla]);
  const scrollNext = useCallback(() => embla?.scrollNext(), [embla]);

  useEffect(() => {
    if (!embla) return;

    const onSelect = () => {
      setSelectedIndex(embla.selectedScrollSnap());
    };

    embla.on('select', onSelect);
    return () => {
      embla.off('select', onSelect);
    };
  }, [embla]);

  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-b from-secondary/50 to-background py-4">
      <div className="mx-auto max-w-7xl px-4">
        <Carousel
          getEmblaApi={setEmbla}
          slideSize={{ base: '40%', sm: '30%', md: '20%', lg: '14%' }}
          slideGap="md"
          align="center"
          loop
          dragFree
          withControls={false}
          classNames={{
            root: 'relative',
          }}
        >
          {mangas.map((manga, index) => (
            <Carousel.Slide key={manga.id}>
              <Link href={`/manga/${manga.id}`} className="group block">
                <div
                  className={`relative aspect-[3/4] overflow-hidden rounded-lg transition-all duration-300 ${
                    index === selectedIndex
                      ? 'scale-110 shadow-xl shadow-primary/20'
                      : 'scale-100 opacity-70'
                  }`}
                >
                  <Image
                    src={manga.coverImage}
                    alt={manga.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 40vw, (max-width: 1024px) 20vw, 14vw"
                    priority={index < 5}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  
                  {/* Rating badge */}
                  {manga.rating && (
                    <Badge
                      leftSection={<Star size={10} fill="currentColor" />}
                      className="absolute left-2 top-2 bg-primary text-primary-foreground"
                      size="xs"
                    >
                      {manga.rating.toFixed(1)}
                    </Badge>
                  )}

                  {/* Title overlay - only on active */}
                  {index === selectedIndex && (
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <h3 className="line-clamp-2 text-sm font-medium text-white">
                        {manga.title}
                      </h3>
                    </div>
                  )}
                </div>
              </Link>
            </Carousel.Slide>
          ))}
        </Carousel>

        {/* Navigation buttons */}
        <button
          onClick={scrollPrev}
          className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-card/80 p-2 text-foreground shadow-lg backdrop-blur-sm transition-colors hover:bg-primary hover:text-primary-foreground"
          aria-label="Anterior"
        >
          <ChevronLeft size={24} />
        </button>
        <button
          onClick={scrollNext}
          className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-card/80 p-2 text-foreground shadow-lg backdrop-blur-sm transition-colors hover:bg-primary hover:text-primary-foreground"
          aria-label="Proximo"
        >
          <ChevronRight size={24} />
        </button>
      </div>
    </section>
  );
}
