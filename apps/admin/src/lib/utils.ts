import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Menggabungkan className secara kondisional dan menyelesaikan konflik Tailwind.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Format angka gaya Indonesia. Contoh: 1250 -> "1.250"
 */
export function formatNumberID(
  value: number,
  options?: Intl.NumberFormatOptions,
): string {
  return new Intl.NumberFormat("id-ID", options).format(value);
}

/**
 * Format persentase gaya Indonesia. Contoh: 94.6 -> "94,6%"
 */
export function formatPercentID(
  value: number,
  fractionDigits = 1,
): string {
  return new Intl.NumberFormat("id-ID", {
    style: "percent",
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(value / 100);
}

/**
 * Format tanggal panjang gaya Indonesia.
 */
export function formatDateID(
  date: Date,
  options?: Intl.DateTimeFormatOptions,
): string {
  return new Intl.DateTimeFormat(
    "id-ID",
    options ?? {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    },
  ).format(date);
}

/**
 * Ambil inisial dari nama lengkap. Contoh: "Adinda Prameswari" -> "AP"
 */
export function getInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

/**
 * Batasi nilai ke rentang 0–100.
 */
export function clampPercent(value: number): number {
  return Math.min(100, Math.max(0, value));
}
