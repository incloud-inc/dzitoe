"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  BookOpenCheck,
  CalendarCheck,
  ClipboardList,
  GraduationCap,
  HeartHandshake,
  LayoutDashboard,
  Settings,
  ShieldCheck,
  Users,
  X,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
  title?: string;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    title: "Utama",
    items: [
      { label: "Dashboard", href: "/", icon: LayoutDashboard },
      {
        label: "Murid (Siswa)",
        href: "/murid",
        icon: Users,
        badge: "1.250",
        title: "Murid (Siswa)",
      },
      { label: "Guru", href: "/guru", icon: GraduationCap, badge: "85" },
    ],
  },
  {
    title: "Akademik",
    items: [
      {
        label: "Fasilitasi Belajar",
        href: "/fasilitasi-belajar",
        icon: BookOpenCheck,
        title: "Fasilitasi Belajar (Pembelajaran)",
      },
      { label: "Asesmen", href: "/asesmen", icon: ClipboardList },
      {
        label: "Perkembangan Murid",
        href: "/perkembangan-murid",
        icon: BarChart3,
      },
    ],
  },
  {
    title: "Karakter & Kehadiran",
    items: [
      {
        label: "Disiplin Positif",
        href: "/disiplin-positif",
        icon: HeartHandshake,
      },
      { label: "Kehadiran", href: "/kehadiran", icon: CalendarCheck },
    ],
  },
];

const SECONDARY_ITEMS: NavItem[] = [
  { label: "Pengaturan", href: "/pengaturan", icon: Settings },
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
        <div className="flex h-16 shrink-0 items-center justify-between gap-3 border-b border-slate-200 px-5">
          <Link
            href="/"
            onClick={onClose}
            className="flex min-w-0 items-center gap-3"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-600 to-violet-600 text-sm font-bold text-white shadow-sm shadow-brand-600/30">
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

        <nav className="scrollbar-thin flex-1 space-y-6 overflow-y-auto px-3 py-5">
          {NAV_GROUPS.map((group) => (
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
                        onClick={onClose}
                        aria-current={active ? "page" : undefined}
                        className={cn(
                          "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ease-out-expo",
                          active
                            ? "bg-brand-50 text-brand-700"
                            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
                        )}
                      >
                        {active ? (
                          <span
                            aria-hidden="true"
                            className="absolute inset-y-2 left-0 w-1 rounded-full bg-brand-600"
                          />
                        ) : null}

                        <Icon
                          className={cn(
                            "h-[18px] w-[18px] shrink-0 transition-colors",
                            active
                              ? "text-brand-600"
                              : "text-slate-400 group-hover:text-slate-600",
                          )}
                          strokeWidth={2.1}
                        />

                        <span className="min-w-0 flex-1 truncate">
                          {item.label}
                        </span>

                        {item.badge ? (
                          <span
                            className={cn(
                              "shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold tabular-nums",
                              active
                                ? "bg-brand-600 text-white"
                                : "bg-slate-100 text-slate-600 group-hover:bg-slate-200",
                            )}
                          >
                            {item.badge}
                          </span>
                        ) : null}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        <div className="shrink-0 space-y-3 border-t border-slate-200 p-3">
          <ul className="space-y-1">
            {SECONDARY_ITEMS.map((item) => {
              const active = isItemActive(pathname, item.href);
              const Icon = item.icon;

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onClose}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                      active
                        ? "bg-brand-50 text-brand-700"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
                    )}
                  >
                    <Icon
                      className={cn(
                        "h-[18px] w-[18px] shrink-0",
                        active ? "text-brand-600" : "text-slate-400",
                      )}
                      strokeWidth={2.1}
                    />
                    <span className="truncate">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="rounded-xl border border-brand-100 bg-gradient-to-br from-brand-50 to-violet-50 p-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 shrink-0 text-brand-600" />
              <p className="text-xs font-semibold text-brand-900">
                Selaras Permendikdasmen 2026
              </p>
            </div>
            <p className="mt-1 text-[11px] leading-relaxed text-brand-700/80">
              Tahun Ajaran 2025/2026 · SMAN 20 Kab. Tangerang
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
