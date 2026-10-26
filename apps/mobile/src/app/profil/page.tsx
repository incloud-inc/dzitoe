import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { SESSION_COOKIE_NAME, verifySessionToken } from '@dzitoe/auth';
import StudentProfileView from '@/components/profile/StudentProfileView';
import TeacherProfileView from '@/components/profile/TeacherProfileView';
import ParentProfileView from '@/components/profile/ParentProfileView';

export const metadata: Metadata = {
  title: 'Profil Pengguna',
  description: 'Halaman Profil Pengguna DZITOE SMAN 20 Kabupaten Tangerang.',
};

export default async function ProfilPage() {
  const cookieStore = cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  const user = token ? await verifySessionToken(token) : null;
  const role = user?.role;

  return (
    <main className="animate-fade-up">
      {role === 'GURU' || role === 'KEPALA_SEKOLAH' || role === 'TU' || role === 'ADMIN' ? (
        <TeacherProfileView user={user} />
      ) : role === 'ORANG_TUA' ? (
        <ParentProfileView user={user} />
      ) : (
        <StudentProfileView showIdentitasCard={true} hideAttendanceAndSchedule={true} />
      )}
    </main>
  );
}
