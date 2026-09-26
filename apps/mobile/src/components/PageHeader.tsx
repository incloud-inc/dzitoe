'use client';

import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';

type PageHeaderProps = {
  title: string;
  subtitle?: string;
};

export default function PageHeader({ title, subtitle }: PageHeaderProps) {
  const router = useRouter();

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 pt-[calc(0.5rem+env(safe-area-inset-top,0px))] pb-2.5 backdrop-blur-md">
      <div className="flex items-center gap-2 px-3">
        <button
          type="button"
          onClick={() => router.back()}
          aria-label="Kembali"
          className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-slate-600 transition hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
        >
          <ChevronLeft className="h-5 w-5" aria-hidden />
        </button>

        <div className="min-w-0">
          <h1 className="truncate text-[15px] font-semibold leading-tight text-slate-900">
            {title}
          </h1>
          {subtitle ? (
            <p className="truncate text-[11px] leading-tight text-slate-500">
              {subtitle}
            </p>
          ) : null}
        </div>
      </div>
    </header>
  );
}
