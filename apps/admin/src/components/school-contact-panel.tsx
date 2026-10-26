'use client';

import React, { useState } from 'react';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  ExternalLink,
  Copy,
  Check,
  MessageCircle,
  Globe,
  Youtube,
  Instagram,
} from 'lucide-react';
import { SectionCard } from './section-card';

export function SchoolContactPanel() {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <SectionCard
      title="Pusat Informasi & Narahubung Sekolah"
      description="Layanan Komunikasi Resmi SMAN 20 Kabupaten Tangerang"
      action={
        <div className="flex items-center gap-1.5">
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Layanan Aktif
          </span>
        </div>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Kolom 1: Alamat & Lokasi */}
        <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2 text-brand-900 font-bold text-xs uppercase tracking-wider">
              <MapPin className="w-4 h-4 text-brand-700" />
              <span>Lokasi & Kampus</span>
            </div>
            <p className="text-xs font-semibold text-slate-800 leading-snug">
              Kampus SMAN 20 Kabupaten Tangerang
            </p>
            <p className="mt-1 text-xs text-slate-500 leading-relaxed">
              Jl. Raya Pakuhaji No. 20, Desa Pakuhaji, Kec. Pakuhaji, Kab. Tangerang, Banten 15570
            </p>
            <div className="mt-2 text-[11px] text-slate-400 font-mono">
              Koordinat: -6.071285, 106.598214
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-200/70 flex items-center justify-between">
            <button
              onClick={() =>
                copyToClipboard(
                  'Jl. Raya Pakuhaji No. 20, Kec. Pakuhaji, Kab. Tangerang, Banten 15570',
                  'alamat'
                )
              }
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-600 hover:text-brand-900 transition-colors cursor-pointer"
            >
              {copiedKey === 'alamat' ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">Tersalin</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Salin Alamat</span>
                </>
              )}
            </button>
            <a
              href="https://maps.google.com/?q=-6.071285,106.598214"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[11px] font-bold text-brand-700 hover:text-brand-900 hover:underline"
            >
              <span>Buka Peta</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Kolom 2: Kontak Suara & WhatsApp */}
        <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2 text-brand-900 font-bold text-xs uppercase tracking-wider">
              <Phone className="w-4 h-4 text-brand-700" />
              <span>Telepon & WhatsApp</span>
            </div>
            
            <div className="space-y-2 mt-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Call Center TU:</span>
                <span className="font-bold text-slate-800 tabular-nums">(021) 5937-2020</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Hotline Darurat:</span>
                <span className="font-bold text-slate-800 tabular-nums">+62 812-8899-1120</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Email Resmi:</span>
                <span className="font-bold text-slate-800 truncate max-w-[150px]">
                  info@sman20.sch.id
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-200/70 flex items-center justify-between">
            <a
              href="https://wa.me/6281288991122?text=Halo%20Admin%20SMAN%2020%20Kabupaten%20Tangerang"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp TU</span>
            </a>
            <button
              onClick={() => copyToClipboard('info@sman20kabtangerang.sch.id', 'email')}
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-600 hover:text-brand-900 transition-colors cursor-pointer"
            >
              {copiedKey === 'email' ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">Tersalin</span>
                </>
              ) : (
                <>
                  <Mail className="w-3.5 h-3.5" />
                  <span>Salin Email</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Kolom 3: Jam Pelayanan & Tim Piket */}
        <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2 text-brand-900 font-bold text-xs uppercase tracking-wider">
              <Clock className="w-4 h-4 text-brand-700" />
              <span>Jam Operasional & Media</span>
            </div>

            <div className="space-y-1.5 mt-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Senin – Kamis:</span>
                <span className="font-semibold text-slate-800">07.00 – 16.00 WIB</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Jumat:</span>
                <span className="font-semibold text-slate-800">07.00 – 16.30 WIB</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Sabtu – Minggu:</span>
                <span className="font-semibold text-amber-700">Libur KBM</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-200/70 flex items-center justify-between text-xs text-slate-600">
            <span className="text-[11px] text-slate-400">Media Resmi:</span>
            <div className="flex items-center gap-3">
              <a
                href="https://sman20kabtangerang.sch.id"
                target="_blank"
                rel="noopener noreferrer"
                title="Situs Resmi"
                className="hover:text-brand-900 transition-colors"
              >
                <Globe className="w-4 h-4" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                title="Instagram Resmi"
                className="hover:text-rose-600 transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                title="YouTube Sekolah"
                className="hover:text-red-600 transition-colors"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </SectionCard>
  );
}
