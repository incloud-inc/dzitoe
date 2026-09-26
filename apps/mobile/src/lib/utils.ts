import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

const NAMA_HARI = [
  'Minggu',
  'Senin',
  'Selasa',
  'Rabu',
  'Kamis',
  'Jumat',
  'Sabtu',
] as const;

const NAMA_BULAN = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember',
] as const;

export function formatTanggalPanjang(date: Date): string {
  const hari = NAMA_HARI[date.getDay()] ?? '';
  const bulan = NAMA_BULAN[date.getMonth()] ?? '';
  return `${hari}, ${date.getDate()} ${bulan} ${date.getFullYear()}`;
}

export function formatJamSingkat(date: Date): string {
  const jam = String(date.getHours()).padStart(2, '0');
  const menit = String(date.getMinutes()).padStart(2, '0');
  return `${jam}.${menit}`;
}

export function getSalam(date: Date): string {
  const jam = date.getHours();
  if (jam < 11) return 'Selamat pagi';
  if (jam < 15) return 'Selamat siang';
  if (jam < 18) return 'Selamat sore';
  return 'Selamat malam';
}

export function getInisial(nama: string): string {
  const bagian = nama.trim().split(/\s+/).filter(Boolean);
  const first = bagian[0];
  if (!first) return '?';
  if (bagian.length === 1) return first.slice(0, 2).toUpperCase();
  const last = bagian[bagian.length - 1];
  return `${first[0] ?? ''}${last?.[0] ?? ''}`.toUpperCase();
}

export function formatRupiah(nilai: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(nilai);
}
