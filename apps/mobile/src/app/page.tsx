import AppHeader from '@/components/AppHeader';
import AnnouncementList from '@/components/AnnouncementList';
import QuickAbsenCard from '@/components/QuickAbsenCard';
import ScheduleCard from '@/components/ScheduleCard';
import SectionHeader from '@/components/SectionHeader';
import StatGrid from '@/components/StatGrid';

export default function BerandaPage() {
  return (
    <div className="animate-fade-up">
      <AppHeader />

      <div className="-mt-12 space-y-6 px-4">
        <QuickAbsenCard />

        <StatGrid />

        <section aria-labelledby="jadwal-heading">
          <SectionHeader
            id="jadwal-heading"
            title="Jadwal Fasilitasi Belajar"
            subtitle="Hari ini · 5 sesi terjadwal"
          />
          <ScheduleCard />
        </section>

        <section aria-labelledby="pengumuman-heading">
          <SectionHeader
            id="pengumuman-heading"
            title="Pengumuman"
            subtitle="Informasi terbaru untuk Murid"
          />
          <AnnouncementList />
        </section>
      </div>
    </div>
  );
}
