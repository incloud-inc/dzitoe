'use client';

import React, { useEffect, useRef } from 'react';
import 'leaflet/dist/leaflet.css';

export interface AttendanceMapProps {
  userLat: number | null;
  userLng: number | null;
  schoolLat?: number;
  schoolLng?: number;
  radius?: number;
  isWithinRadius: boolean;
  isDemoMode?: boolean;
}

export default function AttendanceMap({
  userLat,
  userLng,
  schoolLat = -6.123456,
  schoolLng = 106.123456,
  radius = 100,
  isWithinRadius,
  isDemoMode = false,
}: AttendanceMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapInstanceRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const userMarkerRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const circleRef = useRef<any>(null);

  useEffect(() => {
    let isMounted = true;

    // Load Leaflet dinamik di browser
    import('leaflet').then((L) => {
      if (!isMounted || !mapContainerRef.current) return;

      // Jika map sudah ada, cukup update posisi
      if (!mapInstanceRef.current) {
        const centerLat = userLat ?? schoolLat;
        const centerLng = userLng ?? schoolLng;

        const map = L.map(mapContainerRef.current, {
          center: [centerLat, centerLng],
          zoom: 17,
          zoomControl: false,
          attributionControl: false,
        });

        // OpenStreetMap Tile Layer resmi & gratis
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
        }).addTo(map);

        // Icon Pin Gedung SMAN 20
        const schoolIcon = L.divIcon({
          className: 'custom-school-pin',
          html: `
            <div style="
              background: #087f5b;
              color: white;
              width: 32px;
              height: 32px;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 14px;
              box-shadow: 0 4px 10px rgba(8,127,91,0.4);
              border: 3px solid white;
            ">
              🏫
            </div>
          `,
          iconSize: [32, 32],
          iconAnchor: [16, 16],
        });

        // Marker Sekolah SMAN 20
        L.marker([schoolLat, schoolLng], { icon: schoolIcon })
          .addTo(map)
          .bindPopup('<b>SMAN 20 Kab. Tangerang</b><br>Pusat Titik Presensi')
          .openPopup();

        // Lingkaran Radius Sekolah
        const circle = L.circle([schoolLat, schoolLng], {
          radius: radius,
          color: isWithinRadius ? '#087f5b' : '#fd7e14',
          fillColor: isWithinRadius ? '#38d9a9' : '#ffa94d',
          fillOpacity: 0.25,
          weight: 2,
        }).addTo(map);

        circleRef.current = circle;
        mapInstanceRef.current = map;
      }

      const map = mapInstanceRef.current;
      const circle = circleRef.current;

      // Update warna lingkaran radius
      if (circle) {
        circle.setStyle({
          color: isWithinRadius ? '#087f5b' : '#fd7e14',
          fillColor: isWithinRadius ? '#38d9a9' : '#ffa94d',
        });
      }

      // Update Marker Posisi Pengguna (Murid)
      if (userLat !== null && userLng !== null) {
        const userIcon = L.divIcon({
          className: 'custom-user-pin',
          html: `
            <div style="
              position: relative;
              width: 22px;
              height: 22px;
            ">
              <div style="
                position: absolute;
                inset: 0;
                background: ${isWithinRadius ? '#087f5b' : '#e03131'};
                border-radius: 50%;
                opacity: 0.35;
                animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
              "></div>
              <div style="
                position: absolute;
                inset: 3px;
                background: ${isWithinRadius ? '#087f5b' : '#e03131'};
                border: 2.5px solid white;
                border-radius: 50%;
                box-shadow: 0 2px 6px rgba(0,0,0,0.3);
              "></div>
            </div>
          `,
          iconSize: [22, 22],
          iconAnchor: [11, 11],
        });

        if (!userMarkerRef.current) {
          userMarkerRef.current = L.marker([userLat, userLng], { icon: userIcon }).addTo(map);
        } else {
          userMarkerRef.current.setLatLng([userLat, userLng]);
          userMarkerRef.current.setIcon(userIcon);
        }

        // Auto pan ke posisi murid
        map.panTo([userLat, userLng], { animate: true });
      }
    });

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        userMarkerRef.current = null;
        circleRef.current = null;
      }
    };
  }, [userLat, userLng, schoolLat, schoolLng, radius, isWithinRadius, isDemoMode]);

  return (
    <div className="relative w-full h-48 sm:h-52 rounded-2xl overflow-hidden border border-slate-200/80 shadow-inner bg-slate-100">
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Floating Status Badge di atas Peta */}
      <div className="absolute top-2.5 left-2.5 z-10 pointer-events-none">
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold shadow-md backdrop-blur-md border ${
            isWithinRadius
              ? 'bg-[#e6fcf5]/95 text-[#087f5b] border-[#96f2d7]'
              : 'bg-amber-50/95 text-amber-800 border-amber-200'
          }`}
        >
          <span
            className={`w-2 h-2 rounded-full ${
              isWithinRadius ? 'bg-[#087f5b] animate-pulse' : 'bg-amber-500'
            }`}
          />
          {isWithinRadius ? 'Di Dalam Radius SMAN 20' : 'Di Luar Radius Sekolah'}
        </span>
      </div>

      {isDemoMode && (
        <div className="absolute top-2.5 right-2.5 z-10 pointer-events-none">
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-violet-100/90 text-violet-800 border border-violet-200 shadow-xs">
            Mode Demo Aktif
          </span>
        </div>
      )}

      {/* Leaflet Attribution Badge Kecil */}
      <div className="absolute bottom-1 right-2 z-10 pointer-events-none text-[9px] text-slate-500 bg-white/70 px-1.5 py-0.5 rounded backdrop-blur-xs">
        © OpenStreetMap
      </div>
    </div>
  );
}
