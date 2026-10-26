'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ChevronLeft,
  Lock,
  Compass,
  MapPin,
  CheckCircle2,
  Save,
  CreditCard,
  Calendar,
  Home,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const AGAMA_OPTIONS = [
  { value: 'ISLAM', label: 'Islam' },
  { value: 'KRISTEN_PROTESTAN', label: 'Kristen Protestan' },
  { value: 'KATOLIK', label: 'Katolik' },
  { value: 'HINDU', label: 'Hindu' },
  { value: 'BUDDHA', label: 'Buddha' },
  { value: 'KHONGHUCU', label: 'Khonghucu' },
  { value: 'PENGHAYAT_KEPERCAYAAN', label: 'Penghayat Kepercayaan' },
];

export default function EditProfilPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = React.useState<'pokok' | 'kelahiran' | 'alamat'>('pokok');
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [toastMessage, setToastMessage] = React.useState<string | null>(null);

  const [studentId, setStudentId] = React.useState('');
  const [kelasNama, setKelasNama] = React.useState('X.1');
  const [formData, setFormData] = React.useState({
    nama: '',
    jenisKelamin: 'LAKI_LAKI' as 'LAKI_LAKI' | 'PEREMPUAN',
    nisn: '',
    nis: '',
    nik: '',
    noKk: '',
    tempatLahir: '',
    tanggalLahir: '',
    noAktaLahir: '',
    agama: 'ISLAM',
    jalan: '',
    rtRw: '',
    kelurahan: '',
    kecamatan: '',
    kabupaten: '',
    provinsi: '',
    kodePos: '',
    lintang: '',
    bujur: '',
  });

  React.useEffect(() => {
    async function loadProfile() {
      try {
        const res = await fetch('/api/murid/profile');
        const json = await res.json();
        if (json.success && json.data) {
          const s = json.data;
          setStudentId(s.id);
          setKelasNama(s.kelasNama || 'X.1');
          setFormData({
            nama: s.nama || '',
            jenisKelamin: s.jenisKelamin || 'LAKI_LAKI',
            nisn: s.nisn || '',
            nis: s.nis || '',
            nik: s.nik || '',
            noKk: s.noKk || '',
            tempatLahir: s.tempatLahir || '',
            tanggalLahir: s.tanggalLahir || '',
            noAktaLahir: s.noAktaLahir || '',
            agama: s.agama || 'ISLAM',
            jalan: s.jalan || '',
            rtRw: s.rtRw || '',
            kelurahan: s.kelurahan || '',
            kecamatan: s.kecamatan || '',
            kabupaten: s.kabupaten || '',
            provinsi: s.provinsi || '',
            kodePos: s.kodePos || '',
            lintang: s.lintang ? String(s.lintang) : '-6.124567',
            bujur: s.bujur ? String(s.bujur) : '106.125678',
          });
        }
      } catch (err) {
        console.error('Gagal memuat profil:', err);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, []);

  const handleGetLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setFormData((prev) => ({
            ...prev,
            lintang: pos.coords.latitude.toFixed(6),
            bujur: pos.coords.longitude.toFixed(6),
          }));
          setToastMessage(`Koordinat GPS tersimpan: ${pos.coords.latitude.toFixed(5)}, ${pos.coords.longitude.toFixed(5)}`);
          setTimeout(() => setToastMessage(null), 4000);
        },
        (err) => {
          alert(`Gagal mengambil koordinat: ${err.message}. Izin lokasi diperlukan.`);
        }
      );
    } else {
      alert('Browser tidak mendukung geolokasi GPS.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nama) {
      alert('Nama lengkap tidak boleh kosong.');
      return;
    }

    setSaving(true);
    try {
      const res = await fetch('/api/murid/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: studentId,
          ...formData,
          // ROMBEL TIDAK DISERTAKAN SAMA SEKALI
        }),
      });

      const json = await res.json();
      if (json.success) {
        setToastMessage('Data identitas berhasil disimpan ke Dapodik sekolah!');
        setTimeout(() => {
          router.push('/profil');
        }, 1200);
      } else {
        alert(json.message || 'Gagal menyimpan pembaruan.');
      }
    } catch {
      alert('Gagal menghubungi server.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-full bg-slate-50 text-slate-900 pb-24 font-sans">
      {/* Top Header Navigation */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 py-3.5 flex items-center justify-between">
        <Link
          href="/profil"
          className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Kembali</span>
        </Link>
        <h1 className="text-sm font-extrabold text-slate-900">Perbarui Identitas Diri</h1>
        <div className="w-12" />
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="mx-4 mt-3 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="p-4 space-y-4 max-w-xl mx-auto">
        {/* Banner Rombel Terkunci */}
        <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200 flex items-start gap-3 text-xs">
          <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center shrink-0 text-amber-800">
            <Lock className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-amber-950 block">
              Rombongan Belajar: Kelas {kelasNama} (Terkunci)
            </span>
            <p className="text-[11px] text-amber-800 mt-0.5 leading-relaxed">
              Sesuai aturan sekolah SMAN 20, murid tidak dapat mengubah rombel sendiri. Pemindahan rombel hanya dapat diproses oleh Admin Sekolah atau Guru Wali Kelas.
            </p>
          </div>
        </div>

        {/* Tab Pills */}
        <div className="flex items-center gap-1.5 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-xs">
          <button
            type="button"
            onClick={() => setActiveTab('pokok')}
            className={cn(
              'flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1',
              activeTab === 'pokok'
                ? 'bg-[#087f5b] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            )}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>Pokok</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('kelahiran')}
            className={cn(
              'flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1',
              activeTab === 'kelahiran'
                ? 'bg-[#087f5b] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            )}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Kelahiran</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('alamat')}
            className={cn(
              'flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1',
              activeTab === 'alamat'
                ? 'bg-[#087f5b] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            )}
          >
            <Home className="w-3.5 h-3.5" />
            <span>Alamat & GPS</span>
          </button>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs">
          {loading ? (
            <div className="py-12 text-center text-slate-400 text-xs font-semibold">
              Memuat data profil Dapodik...
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {/* TAB 1: POKOK (SINGLE COLUMN LAYOUT) */}
              {activeTab === 'pokok' && (
                <div className="space-y-4">
                  <div>
                    <label htmlFor="editNama" className="block font-bold text-slate-800 mb-1.5">
                      Nama Lengkap Murid <span className="text-rose-500">*</span>
                    </label>
                    <input
                      id="editNama"
                      type="text"
                      required
                      value={formData.nama}
                      onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                      className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border border-slate-300 font-bold text-slate-900 focus:ring-2 focus:ring-[#087f5b] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label htmlFor="editJenisKelamin" className="block font-bold text-slate-800 mb-1.5">
                      Jenis Kelamin
                    </label>
                    <select
                      id="editJenisKelamin"
                      value={formData.jenisKelamin}
                      onChange={(e) => setFormData({ ...formData, jenisKelamin: e.target.value as any })}
                      className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border border-slate-300 font-semibold text-slate-900 focus:ring-2 focus:ring-[#087f5b] focus:outline-none bg-white"
                    >
                      <option value="LAKI_LAKI">Laki-Laki (L)</option>
                      <option value="PEREMPUAN">Perempuan (P)</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="editRombel" className="block font-bold text-slate-500 mb-1.5 flex items-center justify-between">
                      <span>Rombongan Belajar (Rombel)</span>
                      <Lock className="w-3.5 h-3.5 text-amber-600" />
                    </label>
                    <input
                      id="editRombel"
                      type="text"
                      disabled
                      value={`Kelas ${kelasNama} (Terkunci oleh Sistem)`}
                      className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-100 font-bold text-slate-500 cursor-not-allowed select-none text-xs"
                    />
                  </div>

                  <div>
                    <label htmlFor="editNisn" className="block font-bold text-slate-800 mb-1.5">
                      Nomor Induk Siswa Nasional (NISN)
                    </label>
                    <input
                      id="editNisn"
                      type="text"
                      maxLength={10}
                      value={formData.nisn}
                      onChange={(e) => setFormData({ ...formData, nisn: e.target.value })}
                      className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono text-slate-900 focus:ring-2 focus:ring-[#087f5b] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label htmlFor="editNik" className="block font-bold text-slate-800 mb-1.5">
                      Nomor Induk Kependudukan (NIK)
                    </label>
                    <input
                      id="editNik"
                      type="text"
                      maxLength={16}
                      value={formData.nik}
                      onChange={(e) => setFormData({ ...formData, nik: e.target.value })}
                      className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono text-slate-900 focus:ring-2 focus:ring-[#087f5b] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label htmlFor="editNoKk" className="block font-bold text-slate-800 mb-1.5">
                      Nomor Kartu Keluarga (No. KK)
                    </label>
                    <input
                      id="editNoKk"
                      type="text"
                      maxLength={16}
                      value={formData.noKk}
                      onChange={(e) => setFormData({ ...formData, noKk: e.target.value })}
                      className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono text-slate-900 focus:ring-2 focus:ring-[#087f5b] focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {/* TAB 2: KELAHIRAN & AGAMA (SINGLE COLUMN LAYOUT) */}
              {activeTab === 'kelahiran' && (
                <div className="space-y-4">
                  <div>
                    <label htmlFor="editTempatLahir" className="block font-bold text-slate-800 mb-1.5">
                      Tempat Kelahiran
                    </label>
                    <input
                      id="editTempatLahir"
                      type="text"
                      value={formData.tempatLahir}
                      onChange={(e) => setFormData({ ...formData, tempatLahir: e.target.value })}
                      className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 focus:ring-2 focus:ring-[#087f5b] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label htmlFor="editTanggalLahir" className="block font-bold text-slate-800 mb-1.5">
                      Tanggal Lahir
                    </label>
                    <input
                      id="editTanggalLahir"
                      type="date"
                      value={formData.tanggalLahir}
                      onChange={(e) => setFormData({ ...formData, tanggalLahir: e.target.value })}
                      className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 focus:ring-2 focus:ring-[#087f5b] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label htmlFor="editNoAktaLahir" className="block font-bold text-slate-800 mb-1.5">
                      Nomor Akta Kelahiran
                    </label>
                    <input
                      id="editNoAktaLahir"
                      type="text"
                      value={formData.noAktaLahir}
                      onChange={(e) => setFormData({ ...formData, noAktaLahir: e.target.value })}
                      className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono text-slate-900 focus:ring-2 focus:ring-[#087f5b] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label htmlFor="editAgama" className="block font-bold text-slate-800 mb-1.5">
                      Agama / Kepercayaan
                    </label>
                    <select
                      id="editAgama"
                      value={formData.agama}
                      onChange={(e) => setFormData({ ...formData, agama: e.target.value })}
                      className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 focus:ring-2 focus:ring-[#087f5b] focus:outline-none bg-white font-semibold"
                    >
                      {AGAMA_OPTIONS.map((a) => (
                        <option key={a.value} value={a.value}>
                          {a.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {/* TAB 3: ALAMAT & TITIK GPS (SINGLE COLUMN LAYOUT) */}
              {activeTab === 'alamat' && (
                <div className="space-y-4">
                  <div>
                    <label htmlFor="editJalan" className="block font-bold text-slate-800 mb-1.5">
                      Alamat Jalan / Dusun
                    </label>
                    <input
                      id="editJalan"
                      type="text"
                      value={formData.jalan}
                      onChange={(e) => setFormData({ ...formData, jalan: e.target.value })}
                      className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 focus:ring-2 focus:ring-[#087f5b] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label htmlFor="editRtRw" className="block font-bold text-slate-800 mb-1.5">
                      RT / RW
                    </label>
                    <input
                      id="editRtRw"
                      type="text"
                      value={formData.rtRw}
                      onChange={(e) => setFormData({ ...formData, rtRw: e.target.value })}
                      className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 focus:ring-2 focus:ring-[#087f5b] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label htmlFor="editKelurahan" className="block font-bold text-slate-800 mb-1.5">
                      Desa / Kelurahan
                    </label>
                    <input
                      id="editKelurahan"
                      type="text"
                      value={formData.kelurahan}
                      onChange={(e) => setFormData({ ...formData, kelurahan: e.target.value })}
                      className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 focus:ring-2 focus:ring-[#087f5b] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label htmlFor="editKecamatan" className="block font-bold text-slate-800 mb-1.5">
                      Kecamatan
                    </label>
                    <input
                      id="editKecamatan"
                      type="text"
                      value={formData.kecamatan}
                      onChange={(e) => setFormData({ ...formData, kecamatan: e.target.value })}
                      className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 focus:ring-2 focus:ring-[#087f5b] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label htmlFor="editKabupaten" className="block font-bold text-slate-800 mb-1.5">
                      Kabupaten / Kota
                    </label>
                    <input
                      id="editKabupaten"
                      type="text"
                      value={formData.kabupaten}
                      onChange={(e) => setFormData({ ...formData, kabupaten: e.target.value })}
                      className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 focus:ring-2 focus:ring-[#087f5b] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label htmlFor="editProvinsi" className="block font-bold text-slate-800 mb-1.5">
                      Provinsi
                    </label>
                    <input
                      id="editProvinsi"
                      type="text"
                      value={formData.provinsi}
                      onChange={(e) => setFormData({ ...formData, provinsi: e.target.value })}
                      className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 focus:ring-2 focus:ring-[#087f5b] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label htmlFor="editKodePos" className="block font-bold text-slate-800 mb-1.5">
                      Kode Pos
                    </label>
                    <input
                      id="editKodePos"
                      type="text"
                      value={formData.kodePos}
                      onChange={(e) => setFormData({ ...formData, kodePos: e.target.value })}
                      className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono text-slate-900 focus:ring-2 focus:ring-[#087f5b] focus:outline-none"
                    />
                  </div>

                  {/* Geotagging GPS */}
                  <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-amber-900 flex items-center gap-1.5 text-xs">
                        <MapPin className="w-3.5 h-3.5 text-amber-700" />
                        Koordinat GPS Rumah
                      </span>
                      <button
                        type="button"
                        onClick={handleGetLocation}
                        className="min-h-[36px] px-3 py-1.5 rounded-lg bg-white border border-amber-300 text-amber-900 font-bold hover:bg-amber-100 transition shadow-xs text-xs flex items-center gap-1 active:scale-95 cursor-pointer"
                      >
                        <Compass className="w-3.5 h-3.5 text-amber-700" />
                        <span>Deteksi GPS</span>
                      </button>
                    </div>

                    <div className="space-y-2.5">
                      <div>
                        <label htmlFor="editLintang" className="block text-[11px] font-bold text-slate-700 mb-1">
                          Latitude (Lintang)
                        </label>
                        <input
                          id="editLintang"
                          type="text"
                          value={formData.lintang}
                          onChange={(e) => setFormData({ ...formData, lintang: e.target.value })}
                          className="w-full min-h-[44px] px-3 py-2 rounded-xl border border-slate-300 font-mono text-slate-900 focus:ring-2 focus:ring-[#087f5b] focus:outline-none bg-white text-xs"
                        />
                      </div>
                      <div>
                        <label htmlFor="editBujur" className="block text-[11px] font-bold text-slate-700 mb-1">
                          Longitude (Bujur)
                        </label>
                        <input
                          id="editBujur"
                          type="text"
                          value={formData.bujur}
                          onChange={(e) => setFormData({ ...formData, bujur: e.target.value })}
                          className="w-full min-h-[44px] px-3 py-2 rounded-xl border border-slate-300 font-mono text-slate-900 focus:ring-2 focus:ring-[#087f5b] focus:outline-none bg-white text-xs"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <Link
                  href="/profil"
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition text-xs"
                >
                  Batal
                </Link>

                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#087f5b] hover:bg-[#0ca678] text-white font-bold text-xs shadow-md shadow-[#087f5b]/20 transition cursor-pointer active:scale-95 disabled:opacity-50"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{saving ? 'Menyimpan...' : 'Simpan Perubahan'}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
