export interface StudentProfile {
  name: string;
  nisn: string;
  className: string;
  school: string;
  avatarUrl: string;
}

export const STUDENT_PROFILE: StudentProfile = {
  name: 'Maya Chen',
  nisn: '1029384756',
  className: 'Kelas XII IPA 1',
  school: 'SMAN 20',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
};

export interface MetricItem {
  value: string;
  label: string;
  highlightColor?: string;
}

export const STUDENT_METRICS: MetricItem[] = [
  { value: '5', label: 'prestasi' },
  { value: '98%', label: 'kehadiran' },
  { value: '12', label: 'kegiatan' },
  { value: '0', label: 'poin pelanggaran' },
];

export type AttendanceLevel = 'exact' | 'partial' | 'excused' | 'absent' | 'weekend';

export interface HeatmapDay {
  id: number;
  dayIndex: number; // 0-6 (Sun-Sat)
  weekIndex: number;
  dateStr: string;
  level: AttendanceLevel;
  checkIn: string | null;
  checkOut: string | null;
  duration: string | null;
  statusLabel: string;
}

export const ATTENDANCE_LOGS = [
  {
    id: 1,
    type: 'in' as const,
    title: 'Tap In Pagi',
    time: '06:45 WIB',
    status: 'Tepat Waktu',
    location: 'Gerbang Utama (RFID Reader 02)',
    recorded: true,
  },
  {
    id: 2,
    type: 'out' as const,
    title: 'Tap Out Pulang',
    time: 'Belum tercatat',
    status: 'Sesi Aktif',
    location: 'Jam Pulang: 15:30 WIB',
    recorded: false,
  },
];

export const CLASS_SCHEDULES = [
  {
    id: 1,
    time: '07:00 - 08:30',
    subject: 'Matematika Lanjut',
    teacher: 'Ratna Wulandari, S.Pd.',
    room: 'Ruang XII IPA 1',
    status: 'Selesai',
  },
  {
    id: 2,
    time: '08:30 - 10:00',
    subject: 'Fisika Eksperimental',
    teacher: 'Hendra Gunawan, M.Pd.',
    room: 'Lab Fisika',
    status: 'Sedang Berlangsung',
  },
  {
    id: 3,
    time: '10:15 - 11:45',
    subject: 'Bahasa Indonesia',
    teacher: 'Sari Melati, S.Si.',
    room: 'Ruang XII IPA 1',
    status: 'Mendatang',
  },
  {
    id: 4,
    time: '13:00 - 14:30',
    subject: 'Biologi Molekuler',
    teacher: 'Dewi Lestari, M.Si.',
    room: 'Lab Biologi',
    status: 'Mendatang',
  },
  {
    id: 5,
    time: '14:30 - 16:00',
    subject: 'Kimia Analitik',
    teacher: 'Yusuf Maulana, M.Pd.',
    room: 'Lab Kimia',
    status: 'Mendatang',
  },
];

// Generator data heatmap 13 minggu (91 hari) deterministik
export function generateSemesterHeatmap(): HeatmapDay[] {
  const weeks = 15;
  const daysPerWeek = 7;
  const days: HeatmapDay[] = [];
  const namaBulan = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei'];
  const namaHari = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

  let idCounter = 0;
  for (let w = 0; w < weeks; w++) {
    for (let d = 0; d < daysPerWeek; d++) {
      const isWeekend = d === 0 || d === 6;
      let level: AttendanceLevel = 'exact';
      let checkIn: string | null = '06:45';
      let checkOut: string | null = '15:30';
      let duration: string | null = '8j 45m';
      let statusLabel = 'Tepat Waktu (Sesuai Durasi)';

      if (isWeekend) {
        level = 'weekend';
        checkIn = null;
        checkOut = null;
        duration = null;
        statusLabel = 'Libur Akhir Pekan';
      } else {
        // Pola deterministik
        const seed = (w * 13 + d * 7) % 23;
        if (seed === 3 || seed === 17) {
          level = 'partial';
          checkIn = '07:15';
          checkOut = '15:30';
          duration = '8j 15m';
          statusLabel = 'Durasi Parsial (Terlambat 15 menit)';
        } else if (seed === 9) {
          level = 'excused';
          checkIn = null;
          checkOut = null;
          duration = null;
          statusLabel = 'Izin Resmi (Lomba Sains)';
        } else if (seed === 19 && w > 8) {
          level = 'absent';
          checkIn = null;
          checkOut = null;
          duration = null;
          statusLabel = 'Alpa (Tidak Ada Tap Presensi)';
        }
      }

      const bulanIdx = Math.min(Math.floor(w / 3), namaBulan.length - 1);
      const tanggal = (w * 2 + d + 1) % 28 + 1;
      const dateStr = `${namaHari[d]}, ${tanggal} ${namaBulan[bulanIdx]}`;

      days.push({
        id: idCounter++,
        dayIndex: d,
        weekIndex: w,
        dateStr,
        level,
        checkIn,
        checkOut,
        duration,
        statusLabel,
      });
    }
  }

  return days;
}
