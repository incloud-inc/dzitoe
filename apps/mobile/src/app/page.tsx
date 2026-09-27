import AppHeader from '@/components/AppHeader';
import { QuickActionBar } from '@/components/home/QuickActionBar';
import { CompetencyProgress } from '@/components/home/CompetencyProgress';
import { HomeTabs } from '@/components/home/HomeTabs';
import AnnouncementList from '@/components/AnnouncementList';
import SectionHeader from '@/components/SectionHeader';

export default function BerandaPage() {
  return (
    <div className="animate-fade-up">
      {/* Header dengan Identitas Sekolah & Kartu Pelajar QR */}
      <AppHeader />

      {/* Konten Utama */}
      <div className="-mt-9 space-y-5 px-3.5 pb-6">
        {/* Tombol Aksi Cepat (Presensi GPS, Kartu QR, Absensi, Tagihan) */}
        <QuickActionBar />

        {/* Tab Interaktif: Jadwal Hari Ini, Tugas & Asesmen, Disiplin Positif */}
        <HomeTabs />

        {/* Capaian Kompetensi Kurikulum Merdeka (Radix Progress) */}
        <CompetencyProgress />

        {/* Pengumuman Sekolah */}
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
  );
}
