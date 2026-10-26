'use client';

import React, { useState, useEffect } from 'react';
import {
  MapPin,
  GraduationCap,
  BookOpen,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ScheduleItem {
  id: string;
  kelasId: string;
  kelasNama: string;
  hari: 'SENIN' | 'SELASA' | 'RABU' | 'KAMIS' | 'JUMAT';
  jamMulai: string;
  jamSelesai: string;
  mapelId: string;
  mapelNama: string;
  guruId: string;
  guruNama: string;
  ruang: string;
}

const HARI_TABS: Array<'SENIN' | 'SELASA' | 'RABU' | 'KAMIS' | 'JUMAT'> = [
  'SENIN',
  'SELASA',
  'RABU',
  'KAMIS',
  'JUMAT',
];

export default function MobileJadwalPage() {
  const [activeHari, setActiveHari] = useState<'SENIN' | 'SELASA' | 'RABU' | 'KAMIS' | 'JUMAT'>('SENIN');
  const [schedules, setSchedules] = useState<ScheduleItem[]>([]);
  const [userRole, setUserRole] = useState<'MURID' | 'GURU' | 'ORANG_TUA' | 'KEPALA_SEKOLAH' | string>('MURID');
  const [userName, setUserName] = useState<string>('');
  const [kelasNama, setKelasNama] = useState('X.1');
  const [kelasId, setKelasId] = useState('kls-x-1');
  const [studentName, setStudentName] = useState('Siswa');
  const [loading, setLoading] = useState(true);

  // Automatically detect current day
  useEffect(() => {
    const dayIndex = new Date().getDay(); // 0 is Sun, 1 is Mon, 5 is Fri
    const dayMap: Record<number, 'SENIN' | 'SELASA' | 'RABU' | 'KAMIS' | 'JUMAT'> = {
      1: 'SENIN',
      2: 'SELASA',
      3: 'RABU',
      4: 'KAMIS',
      5: 'JUMAT',
    };
    if (dayMap[dayIndex]) {
      setActiveHari(dayMap[dayIndex]);
    }
  }, []);

  // Fetch session & student profile
  useEffect(() => {
    async function loadData() {
      try {
        const sessionRes = await fetch('/api/auth/session');
        const sessionJson = await sessionRes.json();
        if (sessionJson.authenticated && sessionJson.user) {
          setUserRole(sessionJson.user.role || 'MURID');
          setUserName(sessionJson.user.name || '');
        }

        if (sessionJson.user?.role !== 'GURU') {
          const profileRes = await fetch('/api/murid/profile');
          const profileJson = await profileRes.json();
          if (profileJson.success && profileJson.data) {
            if (profileJson.data.kelasNama) setKelasNama(profileJson.data.kelasNama);
            if (profileJson.data.kelasId) setKelasId(profileJson.data.kelasId);
            if (profileJson.data.nama) setStudentName(profileJson.data.nama);
          }
        }
      } catch (err) {
        console.warn('Could not load session/profile:', err);
      }
    }
    loadData();
  }, []);

  // Fetch real schedules for current context & day
  const fetchJadwal = async () => {
    setLoading(true);
    try {
      let url = '';
      if (userRole === 'GURU') {
        const queryGuru = userName ? encodeURIComponent(userName) : 'Budi';
        url = `/api/jadwal?guruId=${queryGuru}&hari=${activeHari}`;
      } else {
        const targetParam = kelasNama || kelasId || 'X.1';
        url = `/api/jadwal?kelasId=${encodeURIComponent(targetParam)}&hari=${activeHari}`;
      }

      const res = await fetch(url);
      const json = await res.json();
      if (json.success && json.data) {
        setSchedules(json.data);
      }
    } catch (err) {
      console.error('Fetch jadwal mobile error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJadwal();
  }, [userRole, userName, kelasId, kelasNama, activeHari]);

  // Check if a time slot is currently active
  const getSlotStatus = (jamMulai: string, jamSelesai: string) => {
    const now = new Date();
    const [startH, startM] = jamMulai.split(':').map((v) => parseInt(v, 10));
    const [endH, endM] = jamSelesai.split(':').map((v) => parseInt(v, 10));
    if (!startH || !endH) return 'Mendatang';

    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const startMinutes = (startH || 0) * 60 + (startM || 0);
    const endMinutes = (endH || 0) * 60 + (endM || 0);

    if (currentMinutes >= startMinutes && currentMinutes <= endMinutes) {
      return 'Sedang Berlangsung';
    }
    if (currentMinutes > endMinutes) {
      return 'Selesai';
    }
    return 'Mendatang';
  };

  const isTeacher = userRole === 'GURU' || userRole === 'KEPALA_SEKOLAH';
  const isParent = userRole === 'ORANG_TUA';

  return (
    <div className="mx-auto w-full max-w-2xl px-4 sm:px-6 pt-6 pb-24 font-sans">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">
              {isTeacher ? 'KBM PENDIDIK & TENDIK' : 'KBM SMAN 20 TANGERANG'}
            </span>
            <h1 className="text-xl font-extrabold text-slate-900 mt-0.5">
              {isTeacher ? 'Jadwal Mengajar KBM' : 'Jadwal Pelajaran'}
            </h1>
          </div>
          <span className="rounded-full bg-emerald-50 px-2 py-1 text-xs font-bold text-emerald-700 ring-1 ring-emerald-200">
            {isTeacher ? 'Jadwal Guru' : isParent ? 'Kelas X.1' : `Kelas ${kelasNama}`}
          </span>
        </div>
        <p className="text-[13px] text-slate-500 mt-1.5">
          {isTeacher ? (
            <>
              Fasilitasi kelas oleh <span className="font-semibold text-slate-700">{userName || 'Guru'}</span>
            </>
          ) : isParent ? (
            <>
              Memantau KBM <span className="font-semibold text-slate-700">Aisyah Putri Ramadhani</span>
            </>
          ) : (
            <>
              Jadwal fasilitasi belajar <span className="font-semibold text-slate-700">{studentName}</span>
            </>
          )}
        </p>
      </div>

      {/* Day Selector Tabs */}
      <div className="mb-5 flex items-center justify-between gap-1 rounded-2xl bg-slate-100 p-1">
        {HARI_TABS.map((hari) => (
          <button
            key={hari}
            onClick={() => setActiveHari(hari)}
            className={cn(
              'flex-1 py-2 text-center text-[13px] font-bold rounded-xl transition-all cursor-pointer',
              activeHari === hari
                ? 'bg-white text-emerald-700 shadow-sm ring-1 ring-slate-200/50'
                : 'text-slate-500 hover:text-slate-900'
            )}
          >
            {hari.slice(0, 3)}
          </button>
        ))}
      </div>

      {/* Elegant Vertical Timeline View */}
      <div className="relative mt-2">
        {loading ? (
          <div className="py-12 text-center text-[13px] text-slate-400">
            <div className="inline-flex items-center gap-2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#087f5b] border-t-transparent" />
              <span>Memuat jadwal hari {activeHari}...</span>
            </div>
          </div>
        ) : schedules.length === 0 ? (
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 text-center text-slate-400">
            <BookOpen className="mx-auto h-8 w-8 text-slate-300 mb-2.5" />
            <p className="text-[13px] font-medium">Tidak ada jadwal KBM pada hari {activeHari}.</p>
          </div>
        ) : (
          <div className="relative border-l-2 border-slate-200 ml-3 sm:ml-4 space-y-6 pb-6">
            {schedules.map((item) => {
              const status = getSlotStatus(item.jamMulai, item.jamSelesai);
              const isCurrent = status === 'Sedang Berlangsung';

              return (
                <div key={item.id} className="relative pl-7 sm:pl-8">
                  {/* Timeline Node Dot */}
                  <div
                    className={cn(
                      'absolute -left-[9px] top-1.5 h-4 w-4 rounded-full border-2 bg-white transition-all',
                      isCurrent
                        ? 'border-[#087f5b] bg-[#087f5b] ring-4 ring-[#087f5b]/20'
                        : status === 'Selesai'
                        ? 'border-slate-300 bg-slate-200'
                        : 'border-[#087f5b]'
                    )}
                  />

                  {/* Schedule Card with Time as Dominant Element */}
                  <div
                    className={cn(
                      'rounded-2xl p-4 transition-all shadow-xs border',
                      isCurrent
                        ? 'bg-[#087f5b] text-white shadow-md border-[#087f5b]'
                        : 'bg-white border-slate-200/90 hover:border-slate-300'
                    )}
                  >
                    {/* Time Header (Focused on Time Typography, No Clock Icon) */}
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-baseline gap-1.5">
                        <span
                          className={cn(
                            'font-mono text-sm font-black tracking-tight',
                            isCurrent ? 'text-white' : 'text-slate-900'
                          )}
                        >
                          {item.jamMulai}
                        </span>
                        <span
                          className={cn(
                            'text-[11px] font-mono',
                            isCurrent ? 'text-emerald-200' : 'text-slate-400'
                          )}
                        >
                          s/d {item.jamSelesai}
                        </span>
                      </div>

                      <span
                        className={cn(
                          'rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider',
                          isCurrent
                            ? 'bg-white text-[#087f5b]'
                            : status === 'Selesai'
                            ? 'bg-slate-100 text-slate-500'
                            : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        )}
                      >
                        {status}
                      </span>
                    </div>

                    {/* Subject & Teacher */}
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3
                          className={cn(
                            'text-sm font-extrabold truncate',
                            isCurrent ? 'text-white' : 'text-slate-900'
                          )}
                        >
                          {item.mapelNama}
                        </h3>
                        {isTeacher && (
                          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-white/20 text-white">
                            {item.kelasNama}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between text-xs pt-1">
                        <div
                          className={cn(
                            'flex items-center gap-1.5 truncate font-medium',
                            isCurrent ? 'text-emerald-100' : 'text-slate-600'
                          )}
                        >
                          <GraduationCap className="h-3.5 w-3.5 shrink-0" />
                          <span className="truncate">{item.guruNama}</span>
                        </div>

                        <div
                          className={cn(
                            'flex items-center gap-1 text-[11px] font-medium shrink-0 ml-2',
                            isCurrent ? 'text-emerald-200' : 'text-slate-500'
                          )}
                        >
                          <MapPin className="h-3 w-3" />
                          <span>{item.ruang}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
