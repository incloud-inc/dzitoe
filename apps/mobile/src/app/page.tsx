'use client';

import * as React from 'react';
import CosmicHeader, { ContributionHeatmap } from '@/components/CosmicHeader';
import { QuickActionBar } from '@/components/home/QuickActionBar';
import { CompetencyProgress } from '@/components/home/CompetencyProgress';
import AnnouncementList from '@/components/AnnouncementList';
import SectionHeader from '@/components/SectionHeader';
import {
  JADWAL_HARI_INI,
  TUGAS_ASESMEN_LIST,
  DISIPLIN_POSITIF_FEED,
} from '@/lib/data';
import { Badge } from '@/components/ui/badge';
import {
  Clock,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  UserCheck,
  HeartHandshake,
} from 'lucide-react';

export default function BerandaPage() {
  const [activeTab, setActiveTab] = React.useState('Overview');

  return (
    <div className="animate-fade-up bg-slate-50 min-h-full">
      {/* Header Kosmik Cosmic Game + Avatar Ksatria Chibi + 4 Statistik + Tabs Underline */}
      <CosmicHeader activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Konten Berdasarkan Tab yang Dipilih */}
      {activeTab === 'Overview' && (
        <div className="space-y-4">
          {/* Matriks Heatmap Kontribusi (Gaya GitHub Commit Heatmap) */}
          <ContributionHeatmap />

          {/* Quick Action Bar & Widget Konten */}
          <div className="space-y-4 px-3.5 pb-6">
            <QuickActionBar />

            {/* Capaian Kompetensi Fase F */}
            <CompetencyProgress />

            {/* Pengumuman Terkini */}
            <section aria-labelledby="pengumuman-heading" className="space-y-2.5">
              <SectionHeader
                id="pengumuman-heading"
                title="Pengumuman SMAN 20"
                subtitle="Informasi resmi & agenda sekolah terkini"
              />
              <AnnouncementList />
            </section>
          </div>
        </div>
      )}

      {activeTab === 'Jadwal' && (
        <div className="space-y-3 px-3.5 pt-4 pb-6">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-semibold text-slate-500">
              Hari ini · 5 Sesi Fasilitasi
            </span>
            <Badge variant="success" className="text-[10px]">
              Sesi 1 Aktif
            </Badge>
          </div>

          <div className="space-y-2.5">
            {JADWAL_HARI_INI.map((sesi, idx) => {
              const isCurrent = idx === 0;
              return (
                <div
                  key={sesi.id}
                  className={`dz-card-surface p-3.5 transition-all ${
                    isCurrent
                      ? 'border-[#22c55e]/50 bg-gradient-to-r from-emerald-50/70 to-white ring-2 ring-[#22c55e]/20 shadow-md'
                      : 'border-slate-200/80 bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="flex items-center gap-1 text-[11px] font-bold text-[#16a34a]">
                          <Clock className="h-3 w-3" />
                          {sesi.jamMulai} - {sesi.jamSelesai}
                        </span>
                        {isCurrent && (
                          <span className="rounded-full bg-[#22c55e] px-1.5 py-0.2 text-[9px] font-bold text-white uppercase tracking-wider animate-pulse">
                            Aktif
                          </span>
                        )}
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 mt-1 truncate">
                        {sesi.mataFasilitasi}
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-0.5 truncate">
                        {sesi.pendidik}
                      </p>
                    </div>

                    <div className="shrink-0 flex items-center gap-1 rounded-xl bg-slate-100 px-2 py-1 text-[10px] font-semibold text-slate-600">
                      <MapPin className="h-3 w-3 text-slate-400" />
                      <span>{sesi.ruang}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === 'Tugas & Asesmen' && (
        <div className="space-y-3 px-3.5 pt-4 pb-6">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-semibold text-slate-500">
              Asesmen Berkelanjutan
            </span>
            <Badge variant="info" className="text-[10px]">
              Kurikulum Merdeka
            </Badge>
          </div>

          <div className="space-y-2.5">
            {TUGAS_ASESMEN_LIST.map((tugas) => (
              <div
                key={tugas.id}
                className="dz-card-surface p-3.5 flex items-start justify-between gap-3 bg-white"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        tugas.tipe === 'Formatif'
                          ? 'info'
                          : tugas.tipe === 'Sumatif'
                          ? 'danger'
                          : 'purple'
                      }
                      className="text-[9px] px-2 py-0"
                    >
                      {tugas.tipe}
                    </Badge>
                    <span className="text-[10px] font-medium text-slate-400">
                      {tugas.mataPelajaran}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 mt-1 leading-snug">
                    {tugas.judul}
                  </h4>
                  <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-1">
                    <AlertCircle className="h-3 w-3 text-amber-500 shrink-0" />
                    <span>Tenggat: {tugas.tenggat}</span>
                  </div>
                </div>

                <div className="shrink-0 pt-1">
                  {tugas.sudahKumpul ? (
                    <div className="flex flex-col items-end">
                      <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="h-3 w-3" />
                        Tuntas
                      </span>
                      {tugas.nilai && (
                        <span className="text-[10px] font-mono text-emerald-600 font-bold mt-0.5">
                          Skor: {tugas.nilai}
                        </span>
                      )}
                    </div>
                  ) : (
                    <button
                      type="button"
                      className="rounded-xl bg-[#22c55e] px-3 py-1 text-[11px] font-bold text-white shadow-sm hover:bg-[#16a34a] active:scale-95 dz-interactive-mobile"
                    >
                      Unggah
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'Disiplin' && (
        <div className="space-y-3 px-3.5 pt-4 pb-6">
          <div className="rounded-2xl bg-gradient-to-r from-amber-50 to-emerald-50 p-3.5 border border-amber-200/60">
            <div className="flex items-center gap-2 text-amber-800 font-bold text-xs">
              <Sparkles className="h-4 w-4 text-amber-500" />
              <span>Prinsip Disiplin Positif</span>
            </div>
            <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
              Membangun budaya sekolah yang aman, inklusif, dan ramah anak melalui apresiasi karakter Profil Pelajar Pancasila.
            </p>
          </div>

          <div className="space-y-2.5">
            {DISIPLIN_POSITIF_FEED.map((item) => (
              <div
                key={item.id}
                className="dz-card-surface p-3.5 flex items-start gap-3 bg-white"
              >
                <div
                  className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ${
                    item.tipe === 'apresiasi'
                      ? 'bg-amber-100 text-amber-700'
                      : 'bg-indigo-100 text-indigo-700'
                  }`}
                >
                  {item.tipe === 'apresiasi' ? (
                    <UserCheck className="h-4.5 w-4.5" />
                  ) : (
                    <HeartHandshake className="h-4.5 w-4.5" />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      {item.tanggal}
                    </span>
                    {item.poin > 0 && (
                      <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200">
                        +{item.poin} Poin
                      </span>
                    )}
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 mt-0.5">
                    {item.kategori}
                  </h4>
                  <p className="text-[11px] text-slate-600 mt-0.5 leading-snug">
                    {item.deskripsi}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
