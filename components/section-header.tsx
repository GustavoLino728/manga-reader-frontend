'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface SectionHeaderProps {
  title: string;
  href?: string;
  children?: React.ReactNode;
}

export function SectionHeader({ title, href, children }: SectionHeaderProps) {
  return (
    <div className="mb-4 flex items-center justify-between">
      <h2 className="text-xl font-bold text-foreground md:text-2xl">{title}</h2>
      <div className="flex items-center gap-4">
        {children}
        {href && (
          <Link
            href={href}
            className="flex items-center gap-1 text-sm text-primary hover:underline"
          >
            Ver todos
            <ChevronRight size={16} />
          </Link>
        )}
      </div>
    </div>
  );
}
