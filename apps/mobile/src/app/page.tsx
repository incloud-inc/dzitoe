import { cookies } from 'next/headers';
import { SESSION_COOKIE_NAME, verifySessionToken } from '@dzitoe/auth';
import StudentProfileView from '@/components/profile/StudentProfileView';
import { TeacherHomeView } from '@/components/TeacherHomeView';
import { ParentHomeView } from '@/components/ParentHomeView';

export default async function BerandaPage() {
  const cookieStore = cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  const user = token ? await verifySessionToken(token) : null;

  const role = user?.role;

  return (
    <main className="flex flex-col flex-1 animate-fade-up">
      {role === 'GURU' || role === 'KEPALA_SEKOLAH' || role === 'TU' || role === 'ADMIN' ? (
        <TeacherHomeView user={user} />
      ) : role === 'ORANG_TUA' ? (
        <ParentHomeView user={user} />
      ) : (
        <StudentProfileView showIdentitasCard={false} />
      )}
    </main>
  );
}
