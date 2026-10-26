"use client";

import React, { useMemo, useState, useRef, useEffect, useCallback } from "react";

export interface MultiSeriesDataPoint {
  bulan: string;
  asesmen: number;
  kehadiran: number;
}

export interface TrendChartProps {
  data: MultiSeriesDataPoint[];
  height?: number;
  className?: string;
}

function buildSmoothPath(points: { x: number; y: number }[], tension = 0.35): string {
  if (points.length === 0) return "";
  const first = points[0];
  if (!first) return "";
  if (points.length === 1) return `M ${first.x},${first.y}`;

  let d = `M ${first.x},${first.y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p1 = points[i];
    const p2 = points[i + 1];
    if (!p1 || !p2) continue;
    const p0 = points[i - 1] ?? p1;
    const p3 = points[i + 2] ?? p2;

    const cp1x = p1.x + ((p2.x - p0.x) / 6) * tension * 2;
    const cp1y = p1.y + ((p2.y - p0.y) / 6) * tension * 2;
    const cp2x = p2.x - ((p3.x - p1.x) / 6) * tension * 2;
    const cp2y = p2.y - ((p3.y - p1.y) / 6) * tension * 2;

    d += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p2.x},${p2.y}`;
  }
  return d;
}

export function TrendChart({
  data,
  height = 260,
  className = "",
}: TrendChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(700);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => setWidth(el.clientWidth || 700);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const padding = { top: 20, right: 24, bottom: 32, left: 36 };
  const innerW = Math.max(0, width - padding.left - padding.right);
  const innerH = Math.max(0, height - padding.top - padding.bottom);

  // Y Scale 50..100%
  const minVal = 50;
  const maxVal = 100;
  const ticks = [50, 60, 70, 80, 90, 100];

  const yScale = useCallback(
    (v: number) => padding.top + innerH - ((v - minVal) / (maxVal - minVal)) * innerH,
    [innerH, padding.top]
  );

  const stepX = data.length > 1 ? innerW / (data.length - 1) : 0;

  const pointsAsesmen = useMemo(
    () =>
      data.map((d, i) => ({
        x: padding.left + i * stepX,
        y: yScale(d.asesmen),
        val: d.asesmen,
        bulan: d.bulan,
      })),
    [data, innerW, yScale, padding.left, stepX]
  );

  const pointsKehadiran = useMemo(
    () =>
      data.map((d, i) => ({
        x: padding.left + i * stepX,
        y: yScale(d.kehadiran),
        val: d.kehadiran,
        bulan: d.bulan,
      })),
    [data, innerW, yScale, padding.left, stepX]
  );

  const pathAsesmenLine = useMemo(() => buildSmoothPath(pointsAsesmen), [pointsAsesmen]);
  const pathKehadiranLine = useMemo(() => buildSmoothPath(pointsKehadiran), [pointsKehadiran]);

  const baseY = padding.top + innerH;
  const pathAsesmenArea = useMemo(() => {
    if (!pointsAsesmen.length) return "";
    const last = pointsAsesmen[pointsAsesmen.length - 1];
    const first = pointsAsesmen[0];
    if (!last || !first) return "";
    return `${pathAsesmenLine} L ${last.x},${baseY} L ${first.x},${baseY} Z`;
  }, [pathAsesmenLine, pointsAsesmen, baseY]);

  const pathKehadiranArea = useMemo(() => {
    if (!pointsKehadiran.length) return "";
    const last = pointsKehadiran[pointsKehadiran.length - 1];
    const first = pointsKehadiran[0];
    if (!last || !first) return "";
    return `${pathKehadiranLine} L ${last.x},${baseY} L ${first.x},${baseY} Z`;
  }, [pathKehadiranLine, pointsKehadiran, baseY]);

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    let nearest = 0;
    let minDist = Infinity;
    pointsAsesmen.forEach((p, idx) => {
      const dist = Math.abs(p.x - x);
      if (dist < minDist) {
        minDist = dist;
        nearest = idx;
      }
    });
    setHoverIndex(nearest);
  };

  const hoveredData = hoverIndex !== null ? data[hoverIndex] : null;
  const hoveredX = hoverIndex !== null ? (pointsAsesmen[hoverIndex]?.x ?? null) : null;

  return (
    <div ref={containerRef} className={`relative w-full select-none ${className}`} style={{ height }}>
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setHoverIndex(null)}
        className="overflow-visible"
        role="img"
        aria-label="Grafik Tren Asesmen dan Kehadiran Murid"
      >
        <defs>
          <linearGradient id="dzGradAsesmen" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#12b886" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#12b886" stopOpacity="0.0" />
          </linearGradient>
          <linearGradient id="dzGradKehadiran" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffa94d" stopOpacity="0.20" />
            <stop offset="100%" stopColor="#ffa94d" stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Horizontal Grid lines */}
        {ticks.map((t) => {
          const y = yScale(t);
          return (
            <g key={t}>
              <line
                x1={padding.left}
                x2={width - padding.right}
                y1={y}
                y2={y}
                stroke="#dee2e6"
                strokeWidth={1}
                strokeDasharray="4 4"
              />
              <text
                x={padding.left - 8}
                y={y + 3.5}
                textAnchor="end"
                className="fill-neutral-500 font-mono text-[10px]"
              >
                {t}%
              </text>
            </g>
          );
        })}

        {/* X Axis Labels */}
        {pointsAsesmen.map((p) => (
          <text
            key={p.bulan}
            x={p.x}
            y={height - 10}
            textAnchor="middle"
            className="fill-neutral-700 text-[11px] font-semibold"
          >
            {p.bulan}
          </text>
        ))}

        {/* Area Fills */}
        <path d={pathKehadiranArea} fill="url(#dzGradKehadiran)" />
        <path d={pathAsesmenArea} fill="url(#dzGradAsesmen)" />

        {/* Stroke Lines */}
        <path
          d={pathKehadiranLine}
          fill="none"
          stroke="#fd7e14"
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d={pathAsesmenLine}
          fill="none"
          stroke="#087f5b"
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Data points */}
        {pointsKehadiran.map((p, i) => (
          <circle
            key={`k-${i}`}
            cx={p.x}
            cy={p.y}
            r={hoverIndex === i ? 5 : 3.5}
            fill="#fd7e14"
            stroke="#ffffff"
            strokeWidth={2}
          />
        ))}

        {pointsAsesmen.map((p, i) => (
          <circle
            key={`a-${i}`}
            cx={p.x}
            cy={p.y}
            r={hoverIndex === i ? 5 : 3.5}
            fill="#087f5b"
            stroke="#ffffff"
            strokeWidth={2}
          />
        ))}

        {/* Hover Guide Line */}
        {hoveredX !== null && (
          <line
            x1={hoveredX}
            x2={hoveredX}
            y1={padding.top}
            y2={baseY}
            stroke="#adb5bd"
            strokeWidth={1.5}
            strokeDasharray="3 3"
          />
        )}
      </svg>

      {/* Floating Tooltip */}
      {hoveredData && hoveredX !== null && (
        <div
          className="pointer-events-none absolute top-4 z-20 -translate-x-1/2 rounded-xl border border-neutral-700 bg-neutral-900/95 px-3.5 py-2 text-white shadow-xl backdrop-blur-xs transition-transform duration-75"
          style={{ left: hoveredX }}
        >
          <p className="text-center text-[10px] font-bold uppercase tracking-wider text-neutral-400">
            Bulan {hoveredData.bulan}
          </p>
          <div className="mt-1 flex items-center gap-3.5 text-xs">
            <span className="flex items-center gap-1.5 font-semibold text-[#96f2d7]">
              <span className="h-2 w-2 rounded-full bg-[#12b886]" />
              Asesmen: {hoveredData.asesmen}%
            </span>
            <span className="flex items-center gap-1.5 font-semibold text-[#ffd8a8]">
              <span className="h-2 w-2 rounded-full bg-[#fd7e14]" />
              Kehadiran: {hoveredData.kehadiran}%
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export default TrendChart;
