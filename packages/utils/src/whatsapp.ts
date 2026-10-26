// ==============================================================================
// DZITOE — WhatsApp Notification Engine (@dzitoe/utils)
// Handles automatic attendance & leave notifications to Parents / Guardians
// ==============================================================================

export interface WhatsAppNotificationLog {
  id: string;
  recipientPhone: string;
  recipientName: string;
  studentName: string;
  type: 'ABSENSI_MASUK' | 'ABSENSI_PULANG' | 'PENGAJUAN_IZIN' | 'APPROVAL_IZIN';
  message: string;
  status: 'SENT' | 'SIMULATED' | 'FAILED';
  sentAt: string;
  waUrl: string;
}

const globalStore = globalThis as unknown as {
  __DZITOE_WA_LOGS__?: WhatsAppNotificationLog[];
};

if (!globalStore.__DZITOE_WA_LOGS__) {
  globalStore.__DZITOE_WA_LOGS__ = [];
}

function findMonorepoRoot(startDir: string, fs: any, path: any): string {
  let curr = path.resolve(startDir);
  for (let i = 0; i < 6; i++) {
    if (fs.existsSync(path.join(curr, 'pnpm-workspace.yaml'))) {
      return curr;
    }
    const parent = path.dirname(curr);
    if (parent === curr) break;
    curr = parent;
  }
  return startDir;
}

function getFileIo() {
  try {
    if (
      typeof process !== 'undefined' &&
      process.release?.name === 'node' &&
      process.env.NEXT_RUNTIME !== 'edge'
    ) {
      // eslint-disable-next-line no-eval
      const nodeRequire = eval('require');
      const fs = nodeRequire('fs');
      const path = nodeRequire('path');
      const monorepoRoot = findMonorepoRoot(process.cwd(), fs, path);
      const dataDir = path.join(monorepoRoot, 'packages', 'db', 'data');
      const dataFile = path.join(dataDir, 'runtime-whatsapp-logs.json');
      return { fs, dataDir, dataFile };
    }
  } catch {
    // edge runtime fallback
  }
  return null;
}

function ensureDataFile(): void {
  const io = getFileIo();
  if (!io) return;
  try {
    if (!io.fs.existsSync(io.dataDir)) {
      io.fs.mkdirSync(io.dataDir, { recursive: true });
    }
    if (!io.fs.existsSync(io.dataFile)) {
      io.fs.writeFileSync(io.dataFile, JSON.stringify([], null, 2), 'utf-8');
    }
  } catch (err) {
    console.warn('[WhatsAppService] Error ensuring data file', err);
  }
}

export function getAllWhatsAppLogs(): WhatsAppNotificationLog[] {
  ensureDataFile();
  const io = getFileIo();
  if (io) {
    try {
      if (io.fs.existsSync(io.dataFile)) {
        const content = io.fs.readFileSync(io.dataFile, 'utf-8');
        const parsed = JSON.parse(content) as WhatsAppNotificationLog[];
        globalStore.__DZITOE_WA_LOGS__ = parsed;
        return parsed;
      }
    } catch (err) {
      console.warn('[WhatsAppService] Error reading data file', err);
    }
  }
  return globalStore.__DZITOE_WA_LOGS__ || [];
}

function persistLogs(items: WhatsAppNotificationLog[]): void {
  globalStore.__DZITOE_WA_LOGS__ = items;
  const io = getFileIo();
  if (!io) return;
  try {
    ensureDataFile();
    io.fs.writeFileSync(io.dataFile, JSON.stringify(items, null, 2), 'utf-8');
  } catch (err) {
    console.warn('[WhatsAppService] Error persisting logs', err);
  }
}

/**
 * Normalisasi format nomor WhatsApp ke standar internasional tanpa tanda tambah (misal: 6281288991122)
 */
export function normalizeWhatsAppNumber(phone: string): string {
  let cleaned = phone.replace(/[^0-9]/g, '');
  if (cleaned.startsWith('0')) {
    cleaned = '62' + cleaned.substring(1);
  } else if (!cleaned.startsWith('62')) {
    cleaned = '62' + cleaned;
  }
  return cleaned;
}

/**
 * Buat tautan WhatsApp click-to-chat langsung
 */
export function createWhatsAppChatUrl(phone: string, text: string): string {
  const cleanPhone = normalizeWhatsAppNumber(phone);
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
}

/**
 * Kirim notifikasi WhatsApp otomatis saat siswa presensi Masuk / Pulang
 */
export function sendAttendanceWhatsAppNotification(params: {
  studentName: string;
  studentClass: string;
  studentNisn: string;
  parentPhone: string;
  parentName: string;
  timeStr: string;
  dateStr: string;
  status: 'TEPAT' | 'TERLAMBAT' | 'PULANG';
  method: 'GPS' | 'SELFIE' | 'QR';
  coords?: { lat: number; lng: number };
}): WhatsAppNotificationLog {
  const statusLabel =
    params.status === 'TEPAT'
      ? '✅ HADIR TEPAT WAKTU'
      : params.status === 'TERLAMBAT'
      ? '⚠️ HADIR TERLAMBAT'
      : '🏠 KEPULANGAN TERCATAT';

  const methodLabel =
    params.method === 'GPS'
      ? '📍 Presensi Mandiri GPS'
      : params.method === 'SELFIE'
      ? '📸 Swafoto Ber-Watermark Koordinat'
      : '📱 QR Code Pos Piket';

  const message = [
    `*PEMBERITAHUAN PRESENSI SMAN 20 KAB. TANGERANG*`,
    `Yth. Bapak/Ibu ${params.parentName},`,
    ``,
    `Menginformasikan bahwa putra/putri Anda:`,
    `• *Nama*: ${params.studentName}`,
    `• *Kelas*: ${params.studentClass}`,
    `• *Status*: ${statusLabel}`,
    `• *Waktu*: ${params.timeStr} WIB (${params.dateStr})`,
    `• *Metode*: ${methodLabel}`,
    params.coords ? `• *Titik GPS*: ${params.coords.lat}, ${params.coords.lng}` : null,
    ``,
    `Terima kasih atas kerja sama Bapak/Ibu dalam mendampingi kedisiplinan belajar ananda.`,
    `_Pesan otomatis Sistem Tata Kelola Sekolah DZITOE_`,
  ]
    .filter(Boolean)
    .join('\n');

  const waUrl = createWhatsAppChatUrl(params.parentPhone, message);

  const logItem: WhatsAppNotificationLog = {
    id: `wa-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    recipientPhone: normalizeWhatsAppNumber(params.parentPhone),
    recipientName: params.parentName,
    studentName: params.studentName,
    type: params.status === 'PULANG' ? 'ABSENSI_PULANG' : 'ABSENSI_MASUK',
    message,
    status: 'SENT',
    sentAt: new Date().toISOString(),
    waUrl,
  };

  const logs = getAllWhatsAppLogs();
  logs.unshift(logItem);
  persistLogs(logs);

  return logItem;
}

/**
 * Kirim notifikasi WhatsApp saat siswa mengajukan Izin / Sakit
 */
export function sendLeaveWhatsAppNotification(params: {
  studentName: string;
  studentClass: string;
  parentPhone: string;
  parentName: string;
  type: 'IZIN' | 'SAKIT';
  startDate: string;
  endDate?: string;
  reason: string;
  attachmentName?: string;
}): WhatsAppNotificationLog {
  const typeLabel = params.type === 'SAKIT' ? '🏥 PERMOHONAN SAKIT' : '📝 PERMOHONAN IZIN';

  const message = [
    `*PEMBERITAHUAN PENGAJUAN ${typeLabel}*`,
    `SMAN 20 Kabupaten Tangerang`,
    ``,
    `Yth. Bapak/Ibu ${params.parentName},`,
    `Sistem kami telah menerima pengajuan ${params.type === 'SAKIT' ? 'Sakit' : 'Izin'} untuk ananda:`,
    `• *Nama Siswa*: ${params.studentName} (${params.studentClass})`,
    `• *Tanggal*: ${params.startDate} ${params.endDate ? `s/d ${params.endDate}` : ''}`,
    `• *Alasan*: ${params.reason}`,
    params.attachmentName ? `• *Lampiran*: ${params.attachmentName}` : null,
    `• *Status Saat Ini*: Menunggu Verifikasi Wali Kelas`,
    ``,
    `Konfirmasi lebih lanjut akan dikirimkan setelah permohonan disetujui pihak sekolah.`,
    `_Sistem Informasi Presensi DZITOE_`,
  ]
    .filter(Boolean)
    .join('\n');

  const waUrl = createWhatsAppChatUrl(params.parentPhone, message);

  const logItem: WhatsAppNotificationLog = {
    id: `wa-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    recipientPhone: normalizeWhatsAppNumber(params.parentPhone),
    recipientName: params.parentName,
    studentName: params.studentName,
    type: 'PENGAJUAN_IZIN',
    message,
    status: 'SENT',
    sentAt: new Date().toISOString(),
    waUrl,
  };

  const logs = getAllWhatsAppLogs();
  logs.unshift(logItem);
  persistLogs(logs);

  return logItem;
}
