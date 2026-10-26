'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  CheckCircle2,
  XCircle,
  Clock,
  FileText,
  Search,
  RefreshCw,
  ExternalLink,
  Eye,
  AlertCircle,
} from 'lucide-react';
import {
  type PermohonanIzin,
  PERMIT_TYPE_LABELS,
} from '@dzitoe/db';

export function AttendanceVerificationTab() {
  const [permits, setPermits] = useState<PermohonanIzin[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('MENUNGGU');
  const [jenisFilter, setJenisFilter] = useState<string>('');
  const [userTypeFilter, setUserTypeFilter] = useState<string>('');
  const [search, setSearch] = useState('');

  const [summary, setSummary] = useState({
    total: 0,
    menunggu: 0,
    disetujui: 0,
    ditolak: 0,
    sakit: 0,
    izin: 0,
    dispensasi: 0,
  });

  // Modal states
  const [selectedPermit, setSelectedPermit] = useState<PermohonanIzin | null>(null);
  const [actionType, setActionType] = useState<'APPROVE' | 'REJECT' | 'PREVIEW' | null>(null);
  const [verifikatorNama, setVerifikatorNama] = useState('Petugas Piket & Wali Kelas');
  const [catatan, setCatatan] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchPermits = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (statusFilter) params.set('status', statusFilter);
      if (jenisFilter) params.set('jenis', jenisFilter);
      if (userTypeFilter) params.set('userType', userTypeFilter);
      if (search) params.set('search', search);

      const res = await fetch(`/api/presensi/verifikasi?${params.toString()}`);
      const json = await res.json();
      if (json.success) {
        setPermits(json.data);
        setSummary(json.summary);
      }
    } catch (err) {
      console.error('Error fetching permits:', err);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, jenisFilter, userTypeFilter, search]);

  useEffect(() => {
    fetchPermits();
  }, [fetchPermits]);

  const handleAction = async () => {
    if (!selectedPermit || !actionType || actionType === 'PREVIEW') return;
    try {
      setSubmitting(true);
      const res = await fetch('/api/presensi/verifikasi', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedPermit.id,
          action: actionType,
          verifikatorNama,
          catatan,
        }),
      });
      const json = await res.json();
      if (json.success) {
        alert(json.message);
        setActionType(null);
        setSelectedPermit(null);
        setCatatan('');
        fetchPermits();
      } else {
        alert(json.message);
      }
    } catch (err: any) {
      alert('Gagal memproses verifikasi: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* 4 Summary Cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-800">Menunggu Verifikasi</span>
            <div className="rounded-lg bg-amber-100 p-2 text-amber-700">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-amber-900">{summary.menunggu}</div>
          <p className="mt-1 text-[11px] text-amber-700">Perlu tindak lanjut wali kelas/piket</p>
        </div>

        <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-800">Telah Disetujui</span>
            <div className="rounded-lg bg-emerald-100 p-2 text-emerald-700">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-emerald-900">{summary.disetujui}</div>
          <p className="mt-1 text-[11px] text-emerald-700">Tersinkronisasi ke log presensi</p>
        </div>

        <div className="rounded-xl border border-rose-200 bg-rose-50/50 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-rose-800">Permohonan Ditolak</span>
            <div className="rounded-lg bg-rose-100 p-2 text-rose-700">
              <XCircle className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-rose-900">{summary.ditolak}</div>
          <p className="mt-1 text-[11px] text-rose-700">Berkas tidak sah / ditolak</p>
        </div>

        <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-blue-800">Total Pengajuan</span>
            <div className="rounded-lg bg-blue-100 p-2 text-blue-700">
              <FileText className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-blue-900">{summary.total}</div>
          <p className="mt-1 text-[11px] text-blue-700">
            {summary.sakit} Sakit • {summary.izin} Izin • {summary.dispensasi} Dispensasi
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari permohonan (nama pemohon, NISN/NIP, no. surat, alasan)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-slate-50/50 pl-9 pr-4 py-2 text-xs focus:border-indigo-500 focus:bg-white focus:outline-none"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 focus:outline-none"
          >
            <option value="">Semua Status Approval</option>
            <option value="MENUNGGU">Menunggu Persetujuan</option>
            <option value="DISETUJUI">Disetujui</option>
            <option value="DITOLAK">Ditolak</option>
          </select>

          <select
            value={jenisFilter}
            onChange={(e) => setJenisFilter(e.target.value)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 focus:outline-none"
          >
            <option value="">Semua Kategori</option>
            <option value="SAKIT">Surat Sakit Dokter</option>
            <option value="IZIN">Izin Keperluan</option>
            <option value="DISPENSASI">Dispensasi Lomba</option>
          </select>

          <select
            value={userTypeFilter}
            onChange={(e) => setUserTypeFilter(e.target.value)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 focus:outline-none"
          >
            <option value="">Semua Pemohon</option>
            <option value="MURID">Murid / Siswa</option>
            <option value="GURU">Guru / GTK</option>
          </select>

          <button
            onClick={() => fetchPermits()}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
            Muat Ulang
          </button>
        </div>
      </div>

      {/* Permits Table */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 bg-slate-50 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-4 py-3">Pemohon</th>
                <th className="px-4 py-3">Kategori & Surat</th>
                <th className="px-4 py-3">Rentang Tanggal</th>
                <th className="px-4 py-3">Alasan / Keterangan</th>
                <th className="px-4 py-3">Bukti Dokumen</th>
                <th className="px-4 py-3">Status Verifikasi</th>
                <th className="px-4 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-slate-500">
                    <RefreshCw className="mx-auto h-6 w-6 animate-spin text-indigo-600" />
                    <p className="mt-2 text-xs">Memuat permohonan izin...</p>
                  </td>
                </tr>
              ) : permits.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-slate-500">
                    Tidak ada permohonan izin/sakit pada kriteria ini.
                  </td>
                </tr>
              ) : (
                permits.map((p) => {
                  const meta = PERMIT_TYPE_LABELS[p.jenis] || {
                    label: p.jenis,
                    badge: 'bg-slate-100 text-slate-800',
                  };

                  return (
                    <tr key={p.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-4 py-3">
                        <div className="font-semibold text-slate-900">{p.nama}</div>
                        <div className="text-[11px] text-slate-500">
                          {p.userType === 'MURID' ? `Kelas ${p.kelasOrJabatan}` : p.kelasOrJabatan} •{' '}
                          {p.identifier}
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-semibold ${meta.badge}`}
                        >
                          {p.jenis}
                        </span>
                        <div className="mt-1 font-mono text-[11px] text-slate-500">
                          {p.nomorSurat}
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        <div className="font-medium text-slate-800">
                          {p.tanggalMulai} {p.tanggalMulai !== p.tanggalSelesai ? `s/d ${p.tanggalSelesai}` : ''}
                        </div>
                        <div className="text-[11px] text-slate-500">{p.durasiHari} hari</div>
                      </td>

                      <td className="px-4 py-3 max-w-xs">
                        <p className="line-clamp-2 text-slate-700">{p.alasan}</p>
                      </td>

                      <td className="px-4 py-3">
                        {p.lampiranUrl ? (
                          <button
                            onClick={() => {
                              setSelectedPermit(p);
                              setActionType('PREVIEW');
                            }}
                            className="inline-flex items-center gap-1 rounded border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] font-medium text-indigo-600 hover:bg-indigo-50"
                          >
                            <Eye className="h-3.5 w-3.5" />
                            Lihat Berkas
                          </button>
                        ) : (
                          <span className="text-[11px] text-slate-400 italic">Tanpa Lampiran</span>
                        )}
                      </td>

                      <td className="px-4 py-3">
                        {p.status === 'MENUNGGU' && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-[11px] font-semibold text-amber-700 border border-amber-200">
                            <Clock className="h-3 w-3" />
                            Menunggu Verifikasi
                          </span>
                        )}
                        {p.status === 'DISETUJUI' && (
                          <div>
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700 border border-emerald-200">
                              <CheckCircle2 className="h-3 w-3" />
                              Disetujui
                            </span>
                            <div className="mt-0.5 text-[10px] text-slate-500">
                              Oleh {p.diverifikasiOleh}
                            </div>
                          </div>
                        )}
                        {p.status === 'DITOLAK' && (
                          <div>
                            <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-0.5 text-[11px] font-semibold text-rose-700 border border-rose-200">
                              <XCircle className="h-3 w-3" />
                              Ditolak
                            </span>
                            <div className="mt-0.5 text-[10px] text-slate-500">
                              {p.catatanVerifikator}
                            </div>
                          </div>
                        )}
                      </td>

                      <td className="px-4 py-3 text-right">
                        {p.status === 'MENUNGGU' ? (
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => {
                                setSelectedPermit(p);
                                setActionType('APPROVE');
                                setCatatan('Disetujui sesuai dokumen lampiran sah.');
                              }}
                              className="rounded bg-emerald-600 px-2.5 py-1 text-[11px] font-semibold text-white hover:bg-emerald-700 transition-colors shadow-sm"
                            >
                              Setujui
                            </button>
                            <button
                              onClick={() => {
                                setSelectedPermit(p);
                                setActionType('REJECT');
                                setCatatan('');
                              }}
                              className="rounded bg-rose-600 px-2.5 py-1 text-[11px] font-semibold text-white hover:bg-rose-700 transition-colors shadow-sm"
                            >
                              Tolak
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => {
                              setSelectedPermit(p);
                              setActionType('PREVIEW');
                            }}
                            className="rounded border border-slate-200 px-2 py-1 text-[11px] text-slate-600 hover:bg-slate-50"
                          >
                            Detail
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Preview & Detail */}
      {actionType === 'PREVIEW' && selectedPermit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-xs font-semibold text-indigo-600">
                  {selectedPermit.nomorSurat}
                </span>
                <h3 className="text-base font-bold text-slate-900">
                  Detail Permohonan {selectedPermit.jenis}
                </h3>
              </div>
              <button
                onClick={() => setActionType(null)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 rounded-xl bg-slate-50 p-3">
                <div>
                  <span className="text-slate-500">Nama Pemohon:</span>
                  <div className="font-semibold text-slate-900">{selectedPermit.nama}</div>
                </div>
                <div>
                  <span className="text-slate-500">Kelas / Jabatan:</span>
                  <div className="font-semibold text-slate-900">{selectedPermit.kelasOrJabatan}</div>
                </div>
                <div>
                  <span className="text-slate-500">Tanggal:</span>
                  <div className="font-semibold text-slate-900">
                    {selectedPermit.tanggalMulai} ({selectedPermit.durasiHari} hari)
                  </div>
                </div>
                <div>
                  <span className="text-slate-500">Waktu Pengajuan:</span>
                  <div className="font-semibold text-slate-900">{selectedPermit.createdAt}</div>
                </div>
              </div>

              <div>
                <span className="font-semibold text-slate-700">Alasan Lengkap:</span>
                <p className="mt-1 rounded-lg border border-slate-200 bg-white p-3 text-slate-800 leading-relaxed">
                  {selectedPermit.alasan}
                </p>
              </div>

              {selectedPermit.lampiranUrl && (
                <div>
                  <span className="font-semibold text-slate-700">Lampiran Bukti Dokumen:</span>
                  <div className="mt-2 overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
                    <img
                      src={selectedPermit.lampiranUrl}
                      alt="Lampiran Surat"
                      className="max-h-72 w-full object-contain bg-slate-900/5 p-2"
                    />
                  </div>
                  <div className="mt-1 flex items-center justify-between text-[11px] text-slate-500">
                    <span>{selectedPermit.lampiranNama || 'Dokumen_Lampiran.jpg'}</span>
                    <a
                      href={selectedPermit.lampiranUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-indigo-600 hover:underline"
                    >
                      Buka ukuran penuh <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>
              )}

              {selectedPermit.status !== 'MENUNGGU' && (
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <span className="font-semibold text-slate-700">Catatan Hasil Verifikasi:</span>
                  <div className="mt-1 font-medium text-slate-900">
                    {selectedPermit.catatanVerifikator || '-'}
                  </div>
                  <div className="mt-1 text-[11px] text-slate-500">
                    Diverifikasi oleh: {selectedPermit.diverifikasiOleh} pada{' '}
                    {selectedPermit.diverifikasiPada}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-end border-t border-slate-100 pt-3">
                <button
                  onClick={() => setActionType(null)}
                  className="rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Konfirmasi Approval / Reject */}
      {(actionType === 'APPROVE' || actionType === 'REJECT') && selectedPermit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center gap-3">
              <div
                className={`rounded-full p-3 ${
                  actionType === 'APPROVE'
                    ? 'bg-emerald-50 text-emerald-600'
                    : 'bg-rose-50 text-rose-600'
                }`}
              >
                {actionType === 'APPROVE' ? (
                  <CheckCircle2 className="h-6 w-6" />
                ) : (
                  <AlertCircle className="h-6 w-6" />
                )}
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {actionType === 'APPROVE'
                    ? 'Setujui Permohonan Izin'
                    : 'Tolak Permohonan Izin'}
                </h3>
                <p className="text-xs text-slate-500">
                  {selectedPermit.nama} ({selectedPermit.kelasOrJabatan})
                </p>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700">Nama Petugas Verifikator</label>
                <input
                  type="text"
                  value={verifikatorNama}
                  onChange={(e) => setVerifikatorNama(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700">
                  {actionType === 'APPROVE' ? 'Catatan Persetujuan (Opsional)' : 'Alasan Penolakan *'}
                </label>
                <textarea
                  rows={3}
                  required={actionType === 'REJECT'}
                  placeholder={
                    actionType === 'APPROVE'
                      ? 'e.g. Surat dokter terverifikasi, istirahat sampai pulih.'
                      : 'e.g. Lampiran tidak jelas / alasan tidak memenuhi kriteria.'
                  }
                  value={catatan}
                  onChange={(e) => setCatatan(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-3">
                <button
                  type="button"
                  onClick={() => setActionType(null)}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="button"
                  disabled={submitting}
                  onClick={handleAction}
                  className={`rounded-lg px-4 py-2 text-xs font-semibold text-white shadow-sm ${
                    actionType === 'APPROVE'
                      ? 'bg-emerald-600 hover:bg-emerald-700'
                      : 'bg-rose-600 hover:bg-rose-700'
                  }`}
                >
                  {submitting
                    ? 'Memproses...'
                    : actionType === 'APPROVE'
                    ? 'Konfirmasi Setujui'
                    : 'Konfirmasi Tolak'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
