/**
 * DZITOE Utils — helper functions & formatters.
 * Task: A0.1
 */
export const UTILS_PACKAGE_NAME = '@dzitoe/utils' as const;

export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount);
}
