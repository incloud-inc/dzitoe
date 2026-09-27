import type { Metadata } from 'next';
import StudentProfileView from '@/components/profile/StudentProfileView';

export const metadata: Metadata = {
  title: 'Profil Siswa',
  description: 'Halaman Profil Siswa DZITOE SMAN 20 Kabupaten Tangerang.',
};

export default function ProfilPage() {
  return (
    <main className="animate-fade-up">
      <StudentProfileView />
    </main>
  );
}
