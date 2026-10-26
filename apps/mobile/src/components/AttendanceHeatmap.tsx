'use client';

import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  type HeatmapDay,
  type AttendanceLevel,
  generateSemesterHeatmap,
} from '@/lib/profile-data';

export interface AttendanceHeatmapProps {
  days?: HeatmapDay[];
  title?: string;
  subtitle?: string;
  showSummaryStats?: boolean;
}

export function AttendanceHeatmap({
  days,
  title = 'Heatmap Kehadiran Semester',
  subtitle = 'Konsistensi kehadiran KBM 15 Pekan',
  showSummaryStats = true,
}: AttendanceHeatmapProps) {
  const heatmapDays = React.useMemo(() => days || generateSemesterHeatmap(), [days]);
  const [selectedDay, setSelectedDay] = useState<HeatmapDay | null>(null);

  // Hitung ringkasan statistik
  const stats = React.useMemo(() => {
    let exactCount = 0;
    let partialCount = 0;
    let excusedCount = 0;
    let absentCount = 0;
    let weekendCount = 0;

    heatmapDays.forEach((d) => {
      if (d.level === 'exact') exactCount++;
      else if (d.level === 'partial') partialCount++;
      else if (d.level === 'excused') excusedCount++;
      else if (d.level === 'absent') absentCount++;
      else weekendCount++;
    });

    const activeSchoolDays = heatmapDays.length - weekendCount;
    const attendedDays = exactCount + partialCount;
    const attendancePercentage =
      activeSchoolDays > 0 ? ((attendedDays / activeSchoolDays) * 100).toFixed(1) : '100';

    return {
      percentage: attendancePercentage,
      exact: exactCount,
      partial: partialCount,
      excused: excusedCount,
      absent: absentCount,
      totalActive: activeSchoolDays,
    };
  }, [heatmapDays]);


  const getCellColor = (level: AttendanceLevel) => {
    switch (level) {
      case 'exact':
        return 'bg-[#087f5b] hover:ring-2 hover:ring-[#087f5b]/50';
      case 'partial':
        return 'bg-amber-400 hover:ring-2 hover:ring-amber-400/50';
      case 'excused':
        return 'bg-sky-400 hover:ring-2 hover:ring-sky-400/50';
      case 'absent':
        return 'bg-rose-500 hover:ring-2 hover:ring-rose-500/50';
      case 'weekend':
      default:
        return 'bg-slate-200/80 dark:bg-slate-800';
    }
  };

  const getLevelBadge = (level: AttendanceLevel) => {
    switch (level) {
      case 'exact':
        return { label: 'Tepat Waktu', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
      case 'partial':
        return { label: 'Terlambat / Parsial', color: 'bg-amber-50 text-amber-700 border-amber-200' };
      case 'excused':
        return { label: 'Izin / Sakit', color: 'bg-sky-50 text-sky-700 border-sky-200' };
      case 'absent':
        return { label: 'Tanpa Keterangan', color: 'bg-rose-50 text-rose-700 border-rose-200' };
      case 'weekend':
        return { label: 'Libur Akhir Pekan', color: 'bg-slate-100 text-slate-600 border-slate-200' };
    }
  };

  return (
    <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-card dark:border-slate-800 dark:bg-slate-900 transition-all">
      {/* Header Heatmap */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-[#e6fcf5] text-[#087f5b]">
              <Calendar className="h-4 w-4" />
            </span>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">{title}</h3>
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5 ml-9">{subtitle}</p>
        </div>

        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/80 text-xs font-black tabular-nums">
          <Sparkles className="w-3 h-3 text-emerald-600" />
          <span>{stats.percentage}%</span>
        </div>
      </div>

      {/* Grid Matriks Heatmap (Scroll horizontal aman di mobile) */}
      <div className="overflow-x-auto pb-2 scrollbar-none">
        <div className="min-w-[340px]">
          {/* Label Bulan */}
          <div className="flex justify-between text-[10px] font-semibold text-slate-400 mb-1.5 px-6">
            <span>Januari</span>
            <span>Februari</span>
            <span>Maret</span>
            <span>April</span>
          </div>

          <div className="flex gap-2">
            {/* Label Hari */}
            <div className="flex flex-col justify-between text-[9px] font-medium text-slate-400 py-0.5 select-none w-5 shrink-0">
              <span>Min</span>
              <span>Sen</span>
              <span>Sel</span>
              <span>Rab</span>
              <span>Kam</span>
              <span>Jum</span>
              <span>Sab</span>
            </div>

            {/* Kolom Minggu */}
            <div className="grid grid-flow-col grid-rows-7 gap-1.5 flex-1">
              {heatmapDays.map((day) => {
                const isSelected = selectedDay?.id === day.id;
                return (
                  <button
                    key={day.id}
                    type="button"
                    onClick={() => setSelectedDay(day)}
                    title={`${day.dateStr}: ${day.statusLabel}`}
                    className={cn(
                      'h-3.5 w-3.5 rounded-[4px] transition-all cursor-pointer',
                      getCellColor(day.level),
                      isSelected && 'ring-2 ring-indigo-500 scale-125 z-10'
                    )}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Detail Popover / Sheet saat Kotak Tanggal Dipilih */}
      {selectedDay && (
        <div className="mt-3 p-3 rounded-2xl bg-slate-50 border border-slate-200/80 dark:bg-slate-800/80 dark:border-slate-700 animate-fadeIn">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                <span>{selectedDay.dateStr}</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-300 mt-0.5">
                {selectedDay.statusLabel}
              </p>
            </div>
            <span
              className={cn(
                'px-2 py-0.5 rounded-full text-[10px] font-bold border',
                getLevelBadge(selectedDay.level).color
              )}
            >
              {getLevelBadge(selectedDay.level).label}
            </span>
          </div>

          {selectedDay.checkIn && (
            <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 text-[11px]">
              <div>
                <span className="text-slate-400">Jam Masuk:</span>{' '}
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {selectedDay.checkIn} WIB
                </span>
              </div>
              <div>
                <span className="text-slate-400">Jam Pulang:</span>{' '}
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {selectedDay.checkOut || '15:30 WIB'}
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Legend Warna (Keterangan) */}
      <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 text-[10px] text-slate-500">
        <span className="font-medium text-slate-400">Status:</span>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <span className="h-2.5 w-2.5 rounded-[3px] bg-[#087f5b]" />
            <span>Tepat Waktu</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="h-2.5 w-2.5 rounded-[3px] bg-amber-400" />
            <span>Terlambat</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="h-2.5 w-2.5 rounded-[3px] bg-sky-400" />
            <span>Izin</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="h-2.5 w-2.5 rounded-[3px] bg-rose-500" />
            <span>Alpha</span>
          </div>
        </div>
      </div>

      {/* Ringkasan Statistik Semester (Task B2.6) */}
      {showSummaryStats && (
        <div className="grid grid-cols-4 gap-2 mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-center">
          <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800">
            <div className="text-[10px] text-slate-400">Tepat Waktu</div>
            <div className="text-xs font-black text-emerald-700 dark:text-emerald-400 tabular-nums">
              {stats.exact}
            </div>
          </div>
          <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800">
            <div className="text-[10px] text-slate-400">Terlambat</div>
            <div className="text-xs font-black text-amber-600 dark:text-amber-400 tabular-nums">
              {stats.partial}
            </div>
          </div>
          <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800">
            <div className="text-[10px] text-slate-400">Izin/Sakit</div>
            <div className="text-xs font-black text-sky-600 dark:text-sky-400 tabular-nums">
              {stats.excused}
            </div>
          </div>
          <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800">
            <div className="text-[10px] text-slate-400">Alpha</div>
            <div className="text-xs font-black text-rose-600 dark:text-rose-400 tabular-nums">
              {stats.absent}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AttendanceHeatmap;
