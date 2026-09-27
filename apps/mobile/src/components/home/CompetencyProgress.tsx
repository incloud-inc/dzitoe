'use client';

import * as React from 'react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CAPAIAN_KOMPETENSI_LIST } from '@/lib/data';
import { Award, TrendingUp } from 'lucide-react';

export function CompetencyProgress() {
  return (
    <section className="dz-card-surface p-4" aria-labelledby="capaian-heading">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="grid h-8 w-8 place-items-center rounded-xl bg-indigo-50 text-indigo-600 shadow-sm border border-indigo-100">
            <Award className="h-4 w-4" />
          </div>
          <div>
            <h3 id="capaian-heading" className="text-xs font-bold text-slate-900 leading-tight">
              Capaian Belajar (Fase F)
            </h3>
            <p className="text-[10px] text-slate-500">Standar Permendikdasmen No. 1–6 Tahun 2026</p>
          </div>
        </div>
        <Badge variant="purple" className="text-[10px]">
          <TrendingUp className="h-3 w-3 mr-0.5" />
          Rata-rata 86%
        </Badge>
      </div>

      <div className="space-y-3 pt-1">
        {CAPAIAN_KOMPETENSI_LIST.map((item) => (
          <div key={item.id} className="group rounded-2xl bg-slate-50/80 p-2.5 transition-all hover:bg-slate-100/80">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-800 mb-1.5">
              <span className="truncate pr-2">{item.mataPelajaran}</span>
              <span className="font-mono text-brand-700 shrink-0 font-bold">{item.persentase}%</span>
            </div>
            <Progress
              value={item.persentase}
              className="h-2 bg-slate-200/70"
              indicatorClassName={
                item.persentase >= 90
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                  : 'bg-gradient-to-r from-brand-600 to-indigo-500'
              }
            />
            <div className="flex items-center justify-between mt-1 text-[10px] text-slate-500">
              <span className="truncate">{item.materiPokok}</span>
              <span className="font-medium text-slate-600 shrink-0">{item.taraf}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
