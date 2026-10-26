"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  BookOpenCheck,
  CalendarCheck,
  GraduationCap,
  HeartHandshake,
  LayoutDashboard,
  Settings,
  ShieldCheck,
  Trophy,
  Users,
  UserCheck,
  ArrowLeftRight,
  Sparkles,
  HeartPulse,
  Award,
  Medal,
  FileText,
  DollarSign,
  CreditCard,
  Receipt,
  Clock,
  AlertTriangle,
  X,
  Info,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";
import { canAccessRoute } from "@dzitoe/auth/rbac";

export interface ComingSoonInfo {
  phase: string;
  phaseNumber: string;
  title: string;
  description: string;
}

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
  title?: string;
  comingSoon?: boolean;
  comingSoonInfo?: ComingSoonInfo;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

const ALL_NAV_GROUPS: NavGroup[] = [
  {
    title: "Utama",
    items: [
      { label: "Dashboard", href: "/", icon: LayoutDashboard },
      {
        label: "Murid (Siswa)",
        href: "/murid",
        icon: Users,
        title: "Murid (Siswa)",
      },
      {
        label: "Orang Tua / Wali",
        href: "/orangtua",
        icon: UserCheck,
        title: "Data Orang Tua / Wali Murid",
      },
      {
        label: "Mutasi Murid",
        href: "/murid/mutasi",
        icon: ArrowLeftRight,
        title: "Mutasi & Pindah Sekolah Murid",
      },
      {
        label: "Kenaikan Kelas",
        href: "/murid/kenaikan-kelas",
        icon: Sparkles,
        badge: "Wizard",
        title: "Wisaya Kenaikan Kelas Cerdas",
      },
      {
        label: "Alumni & Tracer",
        href: "/alumni",
        icon: Award,
        badge: "Tracer",
        title: "Database Alumni & Tracer Study",
        comingSoon: true,
        comingSoonInfo: {
          phase: "Fase 6: Alumni & Portal PPID",
          phaseNumber: "Fase 6",
          title: "Database Alumni & Tracer Study",
          description:
            "Direktori lulusan angkatan, survei tracer study kelulusan ke PTN/PTS, dunia kerja, wirausaha, serta pelaporan akreditasi sekolah.",
        },
      },
      { label: "Guru", href: "/guru", icon: GraduationCap },
    ],
  },
  {
    title: "Akademik",
    items: [
      {
        label: "Jadwal & Mapel",
        href: "/jadwal",
        icon: BookOpenCheck,
        badge: "30 Rombel",
        title: "Jadwal KBM & Mata Pelajaran",
      },
      {
        label: "Kurikulum Merdeka",
        href: "/kurikulum",
        icon: GraduationCap,
        badge: "Baru",
        title: "Manajemen Kurikulum Merdeka",
        comingSoon: true,
        comingSoonInfo: {
          phase: "Fase 4: Bank Soal Siap Cetak",
          phaseNumber: "Fase 4",
          title: "Manajemen Kurikulum Merdeka",
          description:
            "Database Capaian Pembelajaran (CP), Tujuan Pembelajaran (TP), Alur Tujuan Pembelajaran (ATP), dan materi pokok Fase E & F.",
        },
      },
      {
        label: "Bank Soal",
        href: "/bank-soal",
        icon: FileText,
        badge: "Cetak",
        title: "Bank Soal & Naskah Cetak",
        comingSoon: true,
        comingSoonInfo: {
          phase: "Fase 4: Bank Soal Siap Cetak",
          phaseNumber: "Fase 4",
          title: "Bank Soal & Naskah Siap Cetak",
          description:
            "Repositori butir soal manual 9 tipe (LaTeX formula, stimulus teks bersama) dan generator naskah ujian cetak fisik (A4/Folio).",
        },
      },
    ],
  },
  {
    title: "Layanan & Karakter Murid",
    items: [
      {
        label: "Layanan BK",
        href: "/bk",
        icon: HeartHandshake,
        badge: "Restitusi",
        title: "Bimbingan Konseling & Disiplin Positif",
        comingSoon: true,
        comingSoonInfo: {
          phase: "Fase 5: Layanan & Karakter Murid",
          phaseNumber: "Fase 5",
          title: "Bimbingan Konseling & Disiplin Positif",
          description:
            "Pencatatan konseling murid, pembinaan karakter disiplin positif berbasis pendekatan restitusi (Permendikdasmen 2026), dan jadwal konseling tatap muka.",
        },
      },
      {
        label: "Kesehatan UKS",
        href: "/kesehatan",
        icon: HeartPulse,
        badge: "Rekam Medis",
        title: "Rekam Medis & Kesehatan Siswa UKS",
        comingSoon: true,
        comingSoonInfo: {
          phase: "Fase 5: Layanan & Karakter Murid",
          phaseNumber: "Fase 5",
          title: "Rekam Medis & Kesehatan Siswa UKS",
          description:
            "Manajemen kunjungan ruang UKS, telemetri tanda vital klinis, live occupancy kasur rawat tidur UKS, dan cetak surat izin pulang/istirahat.",
        },
      },
      { label: "Presensi (Kehadiran)", href: "/presensi", icon: CalendarCheck },
      {
        label: "Ekstrakurikuler",
        href: "/ekskul",
        icon: Trophy,
        badge: "10 Ekskul",
        title: "Ekstrakurikuler & Minat Bakat",
      },
    ],
  },
  {
    title: "Keterbukaan Informasi",
    items: [
      {
        label: "Portal PPID",
        href: "/ppid",
        icon: FileText,
        badge: "Publik",
        title: "Keterbukaan Informasi Publik (PPID)",
        comingSoon: true,
        comingSoonInfo: {
          phase: "Fase 6: Alumni & Portal PPID",
          phaseNumber: "Fase 6",
          title: "Portal Keterbukaan Informasi Publik (PPID)",
          description:
            "Pengelolaan keterbukaan informasi publik sekolah, disposisi tiket permohonan informasi warga (UU KIP No. 14/2008), dan arsip publikasi dokumen.",
        },
      },
    ],
  },
  {
    title: "Tata Kelola Keuangan",
    items: [
      {
        label: "Portal Keuangan",
        href: "/keuangan",
        icon: DollarSign,
        badge: "TU",
        title: "Pusat Tata Kelola Keuangan",
        comingSoon: true,
        comingSoonInfo: {
          phase: "Fase 3: Tata Kelola Keuangan",
          phaseNumber: "Fase 3",
          title: "Pusat Tata Kelola Keuangan Sekolah",
          description:
            "Pusat tata kelola keuangan sekolah mencakup billing tagihan murid, pengelolaan cicilan, kasir kas pembayaran, dan rekapitulasi piutang/tunggakan.",
        },
      },
      {
        label: "Pos Tagihan",
        href: "/keuangan/jenis",
        icon: CreditCard,
        title: "Master Jenis Tagihan & Periode",
        comingSoon: true,
        comingSoonInfo: {
          phase: "Fase 3: Tata Kelola Keuangan",
          phaseNumber: "Fase 3",
          title: "Master Jenis Tagihan & Periode",
          description:
            "Standardisasi klasifikasi tarif dan pos biaya pendidikan resmi (DSP, SPP/Iuran Komite, Ujian, dll.) per jenjang rombel.",
        },
      },
      {
        label: "Daftar Tagihan",
        href: "/keuangan/tagihan",
        icon: FileText,
        badge: "Massal",
        title: "Billing & Penagihan Siswa",
        comingSoon: true,
        comingSoonInfo: {
          phase: "Fase 3: Tata Kelola Keuangan",
          phaseNumber: "Fase 3",
          title: "Billing & Penagihan Murid",
          description:
            "Pembuatan tagihan massal per kelas, pencetakan invoice murid, serta monitoring status pelunasan.",
        },
      },
      {
        label: "Skema Cicilan",
        href: "/keuangan/cicilan",
        icon: Clock,
        title: "Monitoring Jadwal Angsuran",
        comingSoon: true,
        comingSoonInfo: {
          phase: "Fase 3: Tata Kelola Keuangan",
          phaseNumber: "Fase 3",
          title: "Skema Angsuran & Cicilan",
          description:
            "Penjadwalan angsuran pembayaran pendidikan bagi wali murid dengan pengawasan sisa pokok dan termin angsuran.",
        },
      },
      {
        label: "Pembayaran & Kas",
        href: "/keuangan/pembayaran",
        icon: Receipt,
        title: "Kasir Pembayaran & Cetak Kwitansi",
        comingSoon: true,
        comingSoonInfo: {
          phase: "Fase 3: Tata Kelola Keuangan",
          phaseNumber: "Fase 3",
          title: "Kasir Pembayaran & Cetak Kwitansi",
          description:
            "Loket penerimaan transaksi (tunai, transfer, QRIS), verifikasi bukti pembayaran, dan pencetakan kwitansi bendahara.",
        },
      },
      {
        label: "Monitoring Tunggakan",
        href: "/keuangan/tunggakan",
        icon: AlertTriangle,
        badge: "Piutang",
        title: "Tunggakan Siswa & Blast WA",
        comingSoon: true,
        comingSoonInfo: {
          phase: "Fase 3: Tata Kelola Keuangan",
          phaseNumber: "Fase 3",
          title: "Monitoring Piutang Tunggakan",
          description:
            "Rekapitulasi piutang tagihan jatuh tempo dan fasilitas pengiriman pengingat ramah via pesan resmi WhatsApp orang tua/wali.",
        },
      },
    ],
  },
  {
    title: "Pelaporan Terpadu",
    items: [
      {
        label: "Portal Laporan",
        href: "/laporan",
        icon: FileText,
        badge: "Dinas",
        title: "Pusat Pelaporan Terpadu",
      },
      {
        label: "Laporan Absensi",
        href: "/laporan/absensi",
        icon: CalendarCheck,
        title: "Rekap Absensi Bulanan Dinas",
      },
      {
        label: "Laporan Mutasi",
        href: "/laporan/mutasi",
        icon: ArrowLeftRight,
        title: "Buku Induk Mutasi Murid",
      },
      {
        label: "Laporan Keuangan",
        href: "/laporan/keuangan",
        icon: DollarSign,
        badge: "APBS",
        title: "Laporan Keuangan & Neraca Tahunan",
      },
    ],
  },
];

const ALL_SECONDARY_ITEMS: NavItem[] = [
  {
    label: "Manajemen Pengguna",
    href: "/pengguna",
    icon: ShieldCheck,
    badge: "RBAC",
    title: "Manajemen Pengguna & Hak Akses",
  },
  { label: "Pengaturan Sekolah", href: "/pengaturan", icon: Settings },
  {
    label: "Keamanan & Cache",
    href: "/pengaturan/keamanan",
    icon: ShieldCheck,
    badge: "Redis",
    title: "Audit Keamanan & Performa Cache",
  },
];

export interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

function isItemActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { role, roleLabel, roleBadgeColor } = useAuth();
  const [comingSoonModal, setComingSoonModal] = useState<NavItem | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setComingSoonModal(null);
      }
    };
    if (comingSoonModal) {
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  }, [comingSoonModal]);

  const [counts, setCounts] = useState<{
    murid: number | null;
    guru: number | null;
    orangtua: number | null;
    rawatUks: number | null;
  }>({
    murid: null,
    guru: null,
    orangtua: null,
    rawatUks: null,
  });

  useEffect(() => {
    // Fetch live real counts from API endpoints
    const fetchRealCounts = async () => {
      try {
        const muridRes = await fetch('/api/murid?limit=1');
        const muridJson = await muridRes.json();
        if (muridJson.success && muridJson.meta) {
          setCounts((prev) => ({ ...prev, murid: muridJson.meta.total }));
        }
      } catch {}

      try {
        const guruRes = await fetch('/api/guru?limit=1');
        const guruJson = await guruRes.json();
        if (guruJson.success && guruJson.meta) {
          setCounts((prev) => ({ ...prev, guru: guruJson.meta.total }));
        }
      } catch {}

      try {
        const ortuRes = await fetch('/api/orangtua?limit=1');
        const ortuJson = await ortuRes.json();
        if (ortuJson.success && ortuJson.meta) {
          setCounts((prev) => ({ ...prev, orangtua: ortuJson.meta.total }));
        }
      } catch {}

      try {
        const uksRes = await fetch('/api/kesehatan');
        const uksJson = await uksRes.json();
        if (uksJson.success && uksJson.stats) {
          setCounts((prev) => ({ ...prev, rawatUks: uksJson.stats.rawatUks || 0 }));
        }
      } catch {}
    };

    fetchRealCounts();
  }, [pathname]);

  // Filter navigation groups based on role permissions (RBAC)
  const navGroups = useMemo(() => {
    return ALL_NAV_GROUPS.map((group) => ({
      ...group,
      items: group.items.filter((item) => canAccessRoute(role, item.href)),
    })).filter((group) => group.items.length > 0);
  }, [role]);

  // Filter secondary items based on role permissions
  const secondaryItems = useMemo(() => {
    return ALL_SECONDARY_ITEMS.filter((item) => canAccessRoute(role, item.href));
  }, [role]);

  return (
    <>
      <div
        aria-hidden="true"
        onClick={onClose}
        className={cn(
          "fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm transition-opacity duration-300 lg:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      />

      <aside
        aria-label="Navigasi utama"
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-[272px] flex-col border-r border-slate-200 bg-white",
          "transition-transform duration-300 ease-out-expo will-change-transform",
          open ? "translate-x-0" : "-translate-x-full",
          "lg:translate-x-0",
        )}
      >
        {/* Header Logo */}
        <div className="flex h-16 shrink-0 items-center justify-between gap-3 border-b border-slate-200 px-5">
          <Link
            href="/"
            onClick={onClose}
            className="flex min-w-0 items-center gap-3"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-900 via-brand-700 to-brand-600 text-sm font-bold text-white shadow-sm shadow-brand-900/30">
              DZ
            </span>
            <span className="min-w-0">
              <span className="block truncate text-sm font-bold tracking-tight text-slate-900">
                DZITOE
              </span>
              <span className="block truncate text-[11px] font-medium text-slate-500">
                Admin · SMAN 20 Kab. Tangerang
              </span>
            </span>
          </Link>

          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup menu"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation list */}
        <nav className="scrollbar-thin flex-1 space-y-6 overflow-y-auto px-3 py-4">
          {navGroups.map((group) => (
            <div key={group.title}>
              <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                {group.title}
              </p>
              <ul className="space-y-1">
                {group.items.map((item) => {
                  const active = isItemActive(pathname, item.href);
                  const Icon = item.icon;

                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        title={item.title ?? item.label}
                        onClick={(e) => {
                          if (item.comingSoon) {
                            e.preventDefault();
                            e.stopPropagation();
                            setComingSoonModal(item);
                            return;
                          }
                          onClose();
                        }}
                        aria-current={active ? "page" : undefined}
                        className={cn(
                          "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ease-out-expo active:scale-[0.98]",
                          active
                            ? "bg-brand-50 text-brand-900 font-bold"
                            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
                        )}
                      >
                        {active ? (
                          <span
                            aria-hidden="true"
                            className="absolute inset-y-2 left-0 w-1 rounded-full bg-brand-900"
                          />
                        ) : null}

                        <Icon
                          className={cn(
                            "h-[18px] w-[18px] shrink-0 transition-colors",
                            active
                              ? "text-brand-900"
                              : "text-slate-400 group-hover:text-slate-600",
                            item.href === "/kesehatan" && counts.rawatUks && counts.rawatUks > 0 ? "text-rose-600" : ""
                          )}
                          strokeWidth={2.1}
                        />

                        <span className="min-w-0 flex-1 truncate">
                          {item.label}
                        </span>

                        {/* Dynamic Counts or Badges */}
                        {(() => {
                          if (item.comingSoon) {
                            return (
                              <span className="shrink-0 rounded-full bg-amber-50 border border-amber-200/90 px-2 py-0.5 text-[10px] font-bold text-amber-700 tracking-wide">
                                Segera
                              </span>
                            );
                          }

                          let displayBadge = item.badge;
                          let isUrgent = false;

                          if (item.href === "/murid") {
                            displayBadge = counts.murid !== null ? counts.murid.toLocaleString('id-ID') : "150";
                          } else if (item.href === "/guru") {
                            displayBadge = counts.guru !== null ? counts.guru.toLocaleString('id-ID') : "35";
                          } else if (item.href === "/orangtua") {
                            displayBadge = counts.orangtua !== null ? counts.orangtua.toLocaleString('id-ID') : "10";
                          } else if (item.href === "/kesehatan" && counts.rawatUks !== null && counts.rawatUks > 0) {
                            displayBadge = `${counts.rawatUks} UKS`;
                            isUrgent = true;
                          }

                          if (!displayBadge) return null;

                          return (
                            <span
                              className={cn(
                                "shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold tabular-nums transition-colors",
                                isUrgent
                                  ? "bg-rose-100 text-rose-700 animate-pulse font-bold"
                                  : active
                                  ? "bg-brand-900 text-white"
                                  : "bg-slate-100 text-slate-600 group-hover:bg-slate-200",
                              )}
                            >
                              {displayBadge}
                            </span>
                          );
                        })()}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* Secondary Navigation & Role Info Badge */}
        <div className="shrink-0 space-y-3 border-t border-slate-200 p-3 bg-slate-50/50">
          {secondaryItems.length > 0 && (
            <ul className="space-y-1">
              {secondaryItems.map((item) => {
                const active = isItemActive(pathname, item.href);
                const Icon = item.icon;

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={onClose}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors active:scale-[0.98]",
                        active
                          ? "bg-brand-50 text-brand-900 font-bold"
                          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
                      )}
                    >
                      <Icon
                        className={cn(
                          "h-[18px] w-[18px] shrink-0",
                          active ? "text-brand-900" : "text-slate-400",
                        )}
                        strokeWidth={2.1}
                      />
                      <span className="truncate">{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}

          {/* User Active Role Pill */}
          <div className="flex items-center justify-between gap-2 px-2.5 py-2 bg-white rounded-xl border border-slate-200/90 shadow-2xs">
            <div className="min-w-0">
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Peran Aktif</p>
              <p className="text-xs font-bold text-slate-800 truncate">{roleLabel}</p>
            </div>
            <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-bold border", roleBadgeColor)}>
              {role}
            </span>
          </div>
        </div>
      </aside>

      {/* Modal Popup Coming Soon */}
      {comingSoonModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="coming-soon-title"
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setComingSoonModal(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl shadow-slate-900/40 border border-slate-100 animate-in zoom-in-95 duration-200"
          >
            {/* Top Banner Gradient with Modern Geometric Accents */}
            <div className="relative overflow-hidden bg-gradient-to-br from-brand-950 via-brand-900 to-indigo-950 px-6 pt-8 pb-7 text-white text-center">
              {/* Glow Effects */}
              <div className="absolute -top-12 -left-12 h-36 w-36 rounded-full bg-brand-500/20 blur-2xl pointer-events-none" />
              <div className="absolute -bottom-8 -right-8 h-32 w-32 rounded-full bg-amber-400/20 blur-2xl pointer-events-none" />

              {/* Close Button */}
              <button
                type="button"
                onClick={() => setComingSoonModal(null)}
                aria-label="Tutup jendela pop-up"
                className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white/80 transition-colors hover:bg-white/20 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>

              {/* Feature Icon Container */}
              <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-inner text-amber-300">
                {React.createElement(comingSoonModal.icon || Sparkles, {
                  className: "h-8 w-8 text-amber-300",
                  strokeWidth: 2,
                })}
              </div>

              {/* Phase Pill */}
              <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-400/20 border border-amber-300/30 px-3 py-1 text-[11px] font-bold text-amber-200 tracking-wide">
                <Sparkles className="h-3 w-3 text-amber-300" />
                <span>COMING SOON · SEGERA HADIR</span>
              </div>

              {/* Phase Subtitle */}
              <p className="mt-2 text-xs font-semibold tracking-wide text-brand-200/90">
                {comingSoonModal.comingSoonInfo?.phase || "Roadmap Pengembangan DZITOE"}
              </p>
            </div>

            {/* Body Content */}
            <div className="p-6 space-y-4">
              <div className="text-center">
                <h3 id="coming-soon-title" className="text-xl font-extrabold text-slate-900 tracking-tight">
                  {comingSoonModal.comingSoonInfo?.title || comingSoonModal.label}
                </h3>
                <p className="mt-1 text-xs text-slate-500">
                  SMAN 20 Kabupaten Tangerang · Sistem Tata Kelola Terpadu
                </p>
              </div>

              {/* Information Box */}
              <div className="rounded-2xl border border-slate-200/90 bg-slate-50/70 p-4 text-xs leading-relaxed text-slate-600">
                <p className="font-semibold text-slate-800 mb-1 flex items-center gap-1.5">
                  <Info className="h-3.5 w-3.5 text-brand-600 shrink-0" />
                  Tentang Modul Ini:
                </p>
                <p>
                  {comingSoonModal.comingSoonInfo?.description ||
                    "Fitur ini sedang dalam tahapan pengujian dan penyempurnaan sebelum dibuka secara publik bagi warga sekolah."}
                </p>
              </div>

              {/* Roadmap Status Notice */}
              <div className="flex items-start gap-3 rounded-2xl border border-amber-200/80 bg-amber-50/70 p-3.5">
                <span className="relative flex h-2.5 w-2.5 mt-0.5 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
                </span>
                <div className="text-xs text-amber-900 leading-snug">
                  <p className="font-bold">Status: Tahap Rilis Bertahap</p>
                  <p className="mt-0.5 text-amber-800/90 text-[11px]">
                    Modul disembunyikan sementara sesuai urutan prioritas rilis sistem operasional sekolah.
                  </p>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setComingSoonModal(null)}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-brand-900 px-4 py-3 text-sm font-bold text-white shadow-md shadow-brand-900/20 transition-all hover:bg-brand-800 active:scale-[0.98]"
                >
                  <span>Mengerti & Kembali</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Sidebar;
