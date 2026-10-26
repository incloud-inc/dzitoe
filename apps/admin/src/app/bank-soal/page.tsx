"use client";

import { useEffect, useState } from "react";
import { Plus, Search, Filter, BookOpen, FileText, Loader2, Database, AlignLeft, Upload, Printer } from "lucide-react";
import Link from "next/link";
import { ExcelImportModal } from "@/components/common/ExcelImportModal";

export default function BankSoalPage() {
  const [activeTab, setActiveTab] = useState<'soal' | 'paragraf' | 'paket'>('soal');
  
  // States Soal
  const [soalList, setSoalList] = useState<any[]>([]);
  const [loadingSoal, setLoadingSoal] = useState(true);
  
  // States Paragraf
  const [paragrafList, setParagrafList] = useState<any[]>([]);
  const [loadingParagraf, setLoadingParagraf] = useState(true);

  // States Paket
  const [paketList, setPaketList] = useState<any[]>([]);
  const [loadingPaket, setLoadingPaket] = useState(true);

  // Filters
  const [filterMapel, setFilterMapel] = useState("");
  const [filterTingkat, setFilterTingkat] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Modals
  const [isImportModalOpen, setImportModalOpen] = useState(false);

  const fetchSoal = async () => {
    setLoadingSoal(true);
    try {
      const res = await fetch('/api/bank-soal');
      const data = await res.json();
      setSoalList(data.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingSoal(false);
    }
  };

  const fetchParagraf = async () => {
    setLoadingParagraf(true);
    try {
      const res = await fetch('/api/paragraf');
      const data = await res.json();
      setParagrafList(data.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingParagraf(false);
    }
  };

  const fetchPaket = async () => {
    setLoadingPaket(true);
    try {
      const res = await fetch('/api/bank-soal/paket');
      const data = await res.json();
      setPaketList(data.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingPaket(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'soal') {
      fetchSoal();
    } else if (activeTab === 'paragraf') {
      fetchParagraf();
    } else if (activeTab === 'paket') {
      fetchPaket();
    }
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Database className="h-8 w-8 text-indigo-600" />
              Repositori Bank Soal
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Kelola butir soal, paragraf stimulus, dan filter soal berdasarkan mapel/topik.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/bank-soal/preview"
              className="inline-flex items-center justify-center rounded-md bg-white border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 transition-colors"
            >
              <Printer className="h-4 w-4 mr-2 text-slate-500" />
              Preview & Cetak
            </Link>
            <button
              onClick={() => setImportModalOpen(true)}
              className="inline-flex items-center justify-center rounded-md bg-white border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 transition-colors"
            >
              <Upload className="h-4 w-4 mr-2 text-slate-500" />
              Import Soal
            </button>
            <Link
              href="/bank-soal/paragraf/create"
              className="inline-flex items-center justify-center rounded-md bg-white border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 transition-colors"
            >
              <AlignLeft className="h-4 w-4 mr-2 text-slate-500" />
              Teks Stimulus
            </Link>
            <Link
              href="/bank-soal/create"
              className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Buat Soal Baru
            </Link>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-slate-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('soal')}
              className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                activeTab === 'soal'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              <FileText className="w-4 h-4" /> Daftar Soal
            </button>
            <button
              onClick={() => setActiveTab('paragraf')}
              className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                activeTab === 'paragraf'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              <BookOpen className="w-4 h-4" /> Paragraf Stimulus
            </button>
            <button
              onClick={() => setActiveTab('paket')}
              className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                activeTab === 'paket'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              <Printer className="w-4 h-4" /> Naskah Cetak (Paket)
            </button>
          </nav>
        </div>

        {activeTab === 'soal' && (
          <div className="space-y-4">
            {/* Filter Bar */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="w-5 h-5 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Cari pertanyaan soal..."
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-3">
                <select
                  value={filterMapel}
                  onChange={(e) => setFilterMapel(e.target.value)}
                  className="border border-slate-300 rounded-lg py-2 px-3 text-sm focus:ring-indigo-500 focus:border-indigo-500 bg-white min-w-[150px]"
                >
                  <option value="">Semua Mapel</option>
                  <option value="MTK-W">Matematika Wajib</option>
                  <option value="BINDO">Bahasa Indonesia</option>
                </select>
                <select
                  value={filterTingkat}
                  onChange={(e) => setFilterTingkat(e.target.value)}
                  className="border border-slate-300 rounded-lg py-2 px-3 text-sm focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                >
                  <option value="">Semua Kesulitan</option>
                  <option value="MUDAH">Mudah</option>
                  <option value="SEDANG">Sedang</option>
                  <option value="SULIT">Sulit</option>
                </select>
              </div>
            </div>

            {/* List Soal */}
            {loadingSoal ? (
              <div className="py-12 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-indigo-500" /></div>
            ) : soalList.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-xl border border-slate-200 border-dashed">
                <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="text-slate-900 font-medium">Belum ada soal</h3>
                <p className="text-slate-500 text-sm mt-1">Buat soal pertama Anda untuk mulai mengisi bank soal.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {soalList.map((soal) => (
                  <div key={soal.id} className="bg-white p-5 rounded-xl border border-slate-200 hover:border-indigo-300 transition">
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 text-xs font-semibold rounded-md border border-indigo-100 uppercase tracking-wide">
                            {(soal.jenisSoal || 'PILIHAN_GANDA').replace(/_/g, ' ')}
                          </span>
                          <span className={`px-2.5 py-1 text-xs font-semibold rounded-md border uppercase tracking-wide ${
                            soal.tingkatKesulitan === 'MUDAH' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                            soal.tingkatKesulitan === 'SEDANG' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                            'bg-red-50 text-red-700 border-red-100'
                          }`}>
                            {soal.tingkatKesulitan || 'SEDANG'}
                          </span>
                          <span className="text-xs text-slate-400 font-medium ml-1">
                            {soal.mapel?.kode || 'UMUM'} / {soal.bab?.nama || 'Tanpa Bab'}
                          </span>
                        </div>
                        <div 
                          className="prose prose-sm max-w-none text-slate-800 line-clamp-3 mb-3"
                          dangerouslySetInnerHTML={{ __html: soal.pertanyaan }}
                        />
                        {soal.paragrafId && (
                          <div className="bg-slate-50 border-l-4 border-slate-300 p-3 rounded-r-md text-sm text-slate-600 mb-3">
                            <span className="font-semibold text-slate-700 block mb-1">Terhubung ke Stimulus:</span>
                            {soal.paragrafObj?.judul || 'Teks Paragraf tanpa judul'}
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col gap-2 shrink-0">
                        <button className="px-3 py-1.5 bg-white border border-slate-300 rounded text-sm text-slate-600 hover:text-indigo-600 hover:border-indigo-300 transition">
                          Edit
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'paragraf' && (
          <div className="space-y-4">
             {loadingParagraf ? (
              <div className="py-12 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-indigo-500" /></div>
            ) : paragrafList.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-xl border border-slate-200 border-dashed">
                <AlignLeft className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="text-slate-900 font-medium">Belum ada Paragraf Stimulus</h3>
                <p className="text-slate-500 text-sm mt-1">Buat teks wacana yang dapat dipakai oleh lebih dari 1 butir soal.</p>
                <Link href="/bank-soal/paragraf/create" className="mt-4 inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700">
                  <Plus className="w-4 h-4 mr-2" /> Buat Stimulus
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {paragrafList.map(p => (
                  <div key={p.id} className="bg-white p-5 rounded-xl border border-slate-200 hover:border-indigo-300 transition flex flex-col">
                    <h3 className="font-bold text-slate-900 mb-2">{p.judul || 'Tanpa Judul'}</h3>
                    <div 
                      className="text-sm text-slate-600 line-clamp-4 flex-1 mb-4" 
                      dangerouslySetInnerHTML={{ __html: p.konten }} 
                    />
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100">
                      <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full">
                        Digunakan di {p._count?.bankSoal || 0} soal
                      </span>
                      <button className="text-sm text-slate-500 hover:text-indigo-600 font-medium">Edit Teks</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'paket' && (
          <div className="space-y-4">
             {loadingPaket ? (
              <div className="py-12 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-indigo-500" /></div>
            ) : paketList.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-xl border border-slate-200 border-dashed">
                <Printer className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="text-slate-900 font-medium">Belum ada Paket Naskah Cetak</h3>
                <p className="text-slate-500 text-sm mt-1">Buat paket soal untuk mengatur layout ujian fisik.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {paketList.map(p => (
                  <div key={p.id} className="bg-white p-5 rounded-xl border border-slate-200 hover:border-indigo-300 transition flex flex-col">
                    <h3 className="font-bold text-slate-900 text-lg mb-1">{p.nama}</h3>
                    <p className="text-sm text-slate-500 mb-4">{p.mapel?.nama} • {p.kelas}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="text-xs font-semibold bg-slate-100 text-slate-600 px-2 py-1 rounded">
                        {p.jumlahSoal} Soal Target
                      </span>
                      <span className="text-xs font-semibold bg-indigo-50 text-indigo-600 px-2 py-1 rounded">
                        {p._count?.items || 0} Soal Terisi
                      </span>
                      <span className="text-xs font-semibold bg-slate-100 text-slate-600 px-2 py-1 rounded">
                        {p.layoutKertas}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-auto pt-4 border-t border-slate-100">
                      <Link href={`/bank-soal/paket/${p.id}/editor`} className="flex-1 text-center bg-white border border-slate-300 hover:border-indigo-500 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-semibold transition">
                        Edit & Tata Letak
                      </Link>
                      <Link href={`/bank-soal/paket/${p.id}/cetak`} className="flex-1 text-center bg-indigo-600 text-white hover:bg-indigo-700 px-3 py-2 rounded-md text-sm font-semibold transition">
                        Preview Cetak
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <ExcelImportModal
        isOpen={isImportModalOpen}
        onClose={() => setImportModalOpen(false)}
        title="Import Bank Soal"
        subtitle="Unggah file Excel untuk memasukkan soal Pilihan Ganda & Benar-Salah secara massal"
        templateUrl="/api/bank-soal/template"
        templateFilename="Template_BankSoal_Dzitoe.xlsx"
        uploadEndpoint="/api/bank-soal/import"
        sampleColumns={["KodeMapel", "JenisSoal", "TingkatKesulitan", "Pertanyaan", "Opsi A", "Opsi B", "JawabanBenar"]}
        onImportSuccess={() => {
          setImportModalOpen(false);
          fetchSoal();
        }}
      />
    </div>
  );
}
