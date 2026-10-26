'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Trophy,
  Users,
  Search,
  Calendar,
  MapPin,
  GraduationCap,
  Sparkles,
  CheckCircle2,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface EkskulItem {
  id: string;
  kode: string;
  nama: string;
  kategori: string;
  kategoriLabel: string;
  deskripsi: string;
  pembinaGuruId: string;
  pembinaNama: string;
  pembinaNip: string;
  hariKegiatan: string;
  jamMulai: string;
  jamSelesai: string;
  lokasi: string;
  kuota: number;
  jumlahAnggota: number;
  prestasiTerakhir: string;
  fotoUrl: string;
  status: 'AKTIF' | 'NONAKTIF';
}

const KATEGORI_OPTIONS = [
  { id: 'ALL', label: 'Semua' },
  { id: 'OLAHRAGA', label: 'Olahraga' },
  { id: 'BELA_NEGARA', label: 'Bela Negara' },
  { id: 'KEPANDUAN', label: 'Kepanduan' },
  { id: 'KESENIAN', label: 'Kesenian' },
  { id: 'AKADEMIK', label: 'Akademik & Sains' },
  { id: 'KEAGAMAAN', label: 'Keagamaan' },
  { id: 'LINGKUNGAN', label: 'Lingkungan' },
];

const KATEGORI_BADGE_STYLE: Record<string, string> = {
  BELA_NEGARA: 'bg-rose-50 text-rose-700 border-rose-200/80',
  KEPANDUAN: 'bg-amber-50 text-amber-700 border-amber-200/80',
  OLAHRAGA: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
  KESENIAN: 'bg-purple-50 text-purple-700 border-purple-200/80',
  AKADEMIK: 'bg-blue-50 text-blue-700 border-blue-200/80',
  KEAGAMAAN: 'bg-teal-50 text-teal-700 border-teal-200/80',
  LINGKUNGAN: 'bg-lime-50 text-lime-800 border-lime-200/80',
};

export default function MobileEkstraPage() {
  const [ekskulList, setEkskulList] = useState<EkskulItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedKategori, setSelectedKategori] = useState('ALL');
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [registeredEkskul, setRegisteredEkskul] = useState<string[]>([]);
  const [userMemberships, setUserMemberships] = useState<Record<string, { jabatan: string }>>({});
  const [submittingId, setSubmittingId] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const loadEkskulData = async () => {
    try {
      const [eksRes, myRes] = await Promise.all([
        fetch('/api/ekskul').then((r) => r.json()),
        fetch('/api/ekskul/anggota?my=true').then((r) => r.json()),
      ]);

      if (eksRes.success && eksRes.data) {
        setEkskulList(eksRes.data);
      }

      if (myRes.success && myRes.data) {
        const ids: string[] = [];
        const map: Record<string, { jabatan: string }> = {};
        for (const item of myRes.data) {
          ids.push(item.ekskulId);
          map[item.ekskulId] = { jabatan: item.jabatan || 'ANGGOTA' };
        }
        setRegisteredEkskul(ids);
        setUserMemberships(map);
      }
    } catch (err) {
      console.error('Fetch ekskul mobile error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEkskulData();
  }, []);

  const filteredEkskul = useMemo(() => {
    return ekskulList.filter((item) => {
      const matchKategori = selectedKategori === 'ALL' || item.kategori === selectedKategori;
      const q = searchQuery.toLowerCase().trim();
      const matchQuery =
        q === '' ||
        item.nama.toLowerCase().includes(q) ||
        item.kode.toLowerCase().includes(q) ||
        item.pembinaNama.toLowerCase().includes(q) ||
        item.deskripsi.toLowerCase().includes(q) ||
        item.lokasi.toLowerCase().includes(q);
      return matchKategori && matchQuery;
    });
  }, [ekskulList, selectedKategori, searchQuery]);

  const handleToggleJoin = async (ekskul: EkskulItem) => {
    const isJoined = registeredEkskul.includes(ekskul.id);
    setSubmittingId(ekskul.id);

    try {
      if (isJoined) {
        const res = await fetch(`/api/ekskul/anggota?ekskulId=${encodeURIComponent(ekskul.id)}`, {
          method: 'DELETE',
        });
        const json = await res.json();
        if (json.success) {
          setRegisteredEkskul((prev) => prev.filter((id) => id !== ekskul.id));
          setUserMemberships((prev) => {
            const next = { ...prev };
            delete next[ekskul.id];
            return next;
          });
          showToast(`Batal bergabung dari ${ekskul.nama}`);
          loadEkskulData();
        } else {
          showToast(json.message || 'Gagal membatalkan keanggotaan.');
        }
      } else {
        const res = await fetch('/api/ekskul/anggota', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ekskulId: ekskul.id }),
        });
        const json = await res.json();
        if (json.success) {
          setRegisteredEkskul((prev) => [...prev, ekskul.id]);
          setUserMemberships((prev) => ({
            ...prev,
            [ekskul.id]: { jabatan: 'ANGGOTA' },
          }));
          showToast(`Berhasil mendaftar ke ekstrakurikuler ${ekskul.nama}!`);
          loadEkskulData();
        } else {
          showToast(json.message || 'Gagal mendaftar ekskul.');
        }
      }
    } catch (err) {
      console.error(err);
      showToast('Terjadi kesalahan jaringan.');
    } finally {
      setSubmittingId(null);
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 pt-4 pb-28">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 rounded-2xl bg-slate-900/95 px-4 py-2.5 text-xs text-white shadow-xl backdrop-blur-sm animate-in fade-in slide-in-from-top-3">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>{toastMsg}</span>
          <button onClick={() => setToastMsg(null)} className="ml-2 text-slate-400 hover:text-white">
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Header Halaman */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800 border border-emerald-200">
            <Sparkles className="h-3 w-3 text-emerald-600" />
            BAKAT & MINAT SISWA
          </span>
          <span className="text-[10px] text-slate-400 font-medium">SMAN 20 Tangerang</span>
        </div>
        <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">Katalog Ekstrakurikuler</h1>
        <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
          Pilih wadah kegiatan mandiri, kepemimpinan, dan raih prestasi membanggakan.
        </p>
      </div>

      {/* Rangkuman Ringkas 3 Kartu Mini */}
      <div className="mb-4 grid grid-cols-3 gap-2">
        <div className="rounded-2xl border border-slate-200/90 bg-white p-2.5 shadow-xs text-center">
          <span className="text-[10px] text-slate-400 font-semibold block">Total Ekskul</span>
          <span className="text-base font-extrabold text-slate-900">{ekskulList.length || 10}</span>
          <span className="text-[9px] text-emerald-600 font-bold block mt-0.5">Aktif Semua</span>
        </div>
        <div className="rounded-2xl border border-slate-200/90 bg-white p-2.5 shadow-xs text-center">
          <span className="text-[10px] text-slate-400 font-semibold block">Anggota</span>
          <span className="text-base font-extrabold text-slate-900">
            {ekskulList.reduce((acc, curr) => acc + (curr.jumlahAnggota || 0), 0) || 314}
          </span>
          <span className="text-[9px] text-blue-600 font-bold block mt-0.5">Terdaftar</span>
        </div>
        <div className="rounded-2xl border border-slate-200/90 bg-white p-2.5 shadow-xs text-center">
          <span className="text-[10px] text-slate-400 font-semibold block">Ekskul Anda</span>
          <span className="text-base font-extrabold text-emerald-600">{registeredEkskul.length}</span>
          <span className="text-[9px] text-amber-600 font-bold block mt-0.5">Diikuti</span>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative mb-3">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <input
          type="text"
          placeholder="Cari ekskul, pembina, lokasi..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-2xl border border-slate-200 bg-white pl-9 pr-9 py-2.5 text-xs text-slate-800 placeholder-slate-400 shadow-xs focus:border-emerald-500 focus:outline-none"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Horizontal Scroll Kategori Chips */}
      <div className="mb-4 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {KATEGORI_OPTIONS.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setSelectedKategori(cat.id)}
            className={cn(
              'shrink-0 rounded-xl px-3 py-1.5 text-xs font-semibold transition-all',
              selectedKategori === cat.id
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-50'
            )}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Horizontal Snap Scroll Card List (Touch-First) */}
      <div className="relative">
        {loading ? (
          <div className="py-16 text-center text-xs text-slate-400">
            <div className="inline-flex items-center gap-2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent" />
              <span>Memuat katalog ekstrakurikuler...</span>
            </div>
          </div>
        ) : filteredEkskul.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-400">
            <Trophy className="mx-auto h-8 w-8 text-slate-300 mb-2" />
            <p className="text-xs font-medium">Tidak ada ekstrakurikuler yang sesuai kriteria pencarian.</p>
          </div>
        ) : (
          <div className="flex gap-3.5 overflow-x-auto snap-x snap-mandatory pb-4 pt-1 -mx-4 px-4 no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {filteredEkskul.map((item) => {
              const isJoined = registeredEkskul.includes(item.id);
              const badgeClass = KATEGORI_BADGE_STYLE[item.kategori] || 'bg-slate-100 text-slate-700 border-slate-200';
              const percentage = Math.min(100, Math.round(((item.jumlahAnggota || 0) / (item.kuota || 30)) * 100));

              return (
                <div
                  key={item.id}
                  className="snap-center shrink-0 w-[85%] max-w-[320px] overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                >
                {/* Image Banner with Badges */}
                <div className="relative h-44 w-full overflow-hidden bg-slate-100">
                  <img
                    src={item.fotoUrl}
                    alt={item.nama}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-900/30 to-transparent" />

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <span
                      className={cn(
                        'inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold border backdrop-blur-xs shadow-xs',
                        badgeClass
                      )}
                    >
                      {item.kategoriLabel}
                    </span>

                    <span className="font-mono text-[10px] font-extrabold text-white/90 bg-black/40 px-2 py-0.5 rounded-lg backdrop-blur-xs">
                      {item.kode}
                    </span>
                  </div>

                  {/* Title on Image Bottom */}
                  <div className="absolute bottom-3 left-3 right-3">
                    <h3 className="text-base font-extrabold text-white leading-tight drop-shadow-sm">
                      {item.nama}
                    </h3>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-4 space-y-3">
                  {/* Prestasi Terakhir Badge (Jika Ada) */}
                  {item.prestasiTerakhir && item.prestasiTerakhir !== '-' && (
                    <div className="flex items-start gap-2 rounded-2xl bg-amber-50/80 border border-amber-200/70 p-2.5 text-xs text-amber-900">
                      <Trophy className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-[10px] font-bold text-amber-800 uppercase block tracking-wider">
                          Prestasi Terkini
                        </span>
                        <span className="text-[11px] font-medium leading-tight block">
                          {item.prestasiTerakhir}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Deskripsi */}
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {item.deskripsi}
                  </p>

                  {/* Info Jadwal & Lokasi */}
                  <div className="rounded-2xl bg-slate-50 p-3 space-y-2 text-xs border border-slate-100">
                    <div className="flex items-center gap-2 text-slate-700">
                      <Calendar className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                      <span className="font-semibold text-slate-900">{item.hariKegiatan}</span>
                      <span className="text-slate-400">•</span>
                      <span className="font-mono text-slate-600">{item.jamMulai} - {item.jamSelesai} WIB</span>
                    </div>

                    <div className="flex items-center gap-2 text-slate-600">
                      <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{item.lokasi}</span>
                    </div>

                    <div className="flex items-center gap-2 text-slate-600">
                      <GraduationCap className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">Pembina: <strong className="text-slate-800">{item.pembinaNama}</strong></span>
                    </div>
                  </div>

                  {/* Kuota & Anggota Progress Bar */}
                  <div>
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className="text-slate-500 font-medium">Kapasitas Anggota</span>
                      <span className="font-bold text-slate-800">
                        {item.jumlahAnggota || 0} / {item.kuota || 30} Siswa ({percentage}%)
                      </span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                      <div
                        className={cn(
                          'h-full rounded-full transition-all duration-500',
                          percentage > 90 ? 'bg-amber-500' : 'bg-emerald-500'
                        )}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>

                  {/* Tombol Aksi Gabung / Terdaftar */}
                  <div className="pt-1 flex items-center gap-2">
                    {isJoined ? (
                      <div className="flex-1 flex items-center justify-between gap-2 rounded-2xl bg-emerald-50 border border-emerald-200/90 px-3.5 py-2 text-xs">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                          <div>
                            <span className="font-bold text-emerald-900 block leading-tight">Tergabung</span>
                            <span className="text-[10px] text-emerald-700 font-medium block">
                              Jabatan: <strong>{userMemberships[item.id]?.jabatan || 'ANGGOTA'}</strong>
                            </span>
                          </div>
                        </div>
                        <button
                          type="button"
                          disabled={submittingId === item.id}
                          onClick={() => handleToggleJoin(item)}
                          className="rounded-xl bg-white border border-rose-200 px-2.5 py-1 text-[11px] font-semibold text-rose-600 hover:bg-rose-50 transition-colors disabled:opacity-50"
                        >
                          {submittingId === item.id ? '...' : 'Batal Ikut'}
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        disabled={submittingId === item.id}
                        onClick={() => handleToggleJoin(item)}
                        className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 py-2.5 text-xs font-bold text-white hover:bg-emerald-700 transition-all active:scale-98 shadow-xs disabled:opacity-50"
                      >
                        <Users className="h-4 w-4" />
                        <span>{submittingId === item.id ? 'Mendaftarkan...' : 'Daftar Ekstrakurikuler'}</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
          </div>
        )}
      </div>
    </div>
  );
}
