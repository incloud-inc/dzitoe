'use client';

import { useState, useEffect } from "react";
import { ArrowLeft, Save, Plus, Trash2, CheckCircle2, BookOpen, PenTool } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { RichTextEditor } from "@/components/ui/RichTextEditor";

const JENIS_SOAL = [
  { value: "PILIHAN_GANDA", label: "Pilihan Ganda (PG)" },
  { value: "PILIHAN_GANDA_MULTI", label: "Pilihan Ganda Kompleks (PGK)" },
  { value: "BENAR_SALAH", label: "Benar / Salah" },
  { value: "MENCOCOKKAN", label: "Menjodohkan" },
  { value: "ISIAN_SINGKAT", label: "Isian Singkat" },
  { value: "JAWABAN_PANJANG", label: "Uraian / Jawaban Panjang" },
];

const getDefaultSoal = () => ({
  id: Date.now() + Math.random(),
  jenisSoal: "PILIHAN_GANDA",
  tingkatKesulitan: "SEDANG",
  pertanyaan: "",
  pembahasan: "",
  tags: [],
  opsiPG: [{ teks: "", isBenar: false }, { teks: "", isBenar: false }],
  pernyataanBS: [{ teks: "", isBenar: true }],
  pasanganJodoh: [{ kiri: "", kanan: "" }, { kiri: "", kanan: "" }],
  jawabanSingkat: [""],
  uraian: { rubrik: "", poinMaksimal: 100 }
});

export default function SoalCreatePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [mapelList, setMapelList] = useState<any[]>([]);
  const [kelasList, setKelasList] = useState<any[]>([]);

  // Global State (Mata Pelajaran & Kelas apply to all)
  const [globalData, setGlobalData] = useState({
    mapelId: "",
    kelasId: "",
  });

  // Blocks of Questions
  const [blocks, setBlocks] = useState<any[]>([
    {
      id: Date.now(),
      type: 'STIMULUS', // 'STIMULUS' or 'MANDIRI'
      paragrafJudul: "",
      paragrafKonten: "",
      soalList: [getDefaultSoal()]
    }
  ]);

  useEffect(() => {
    fetch('/api/kurikulum/mapel').then(r => r.json()).then(d => setMapelList(d.data || []));
    fetch('/api/kurikulum').then(r => r.json()).then(d => setKelasList(d.data || []));
  }, []);

  // Block Management
  const addBlock = (type: 'STIMULUS' | 'MANDIRI') => {
    setBlocks([...blocks, {
      id: Date.now(),
      type,
      paragrafJudul: "",
      paragrafKonten: "",
      soalList: type === 'STIMULUS' ? [getDefaultSoal()] : [],
      soal: type === 'MANDIRI' ? getDefaultSoal() : null
    }]);
  };

  const removeBlock = (blockId: number) => {
    if (blocks.length === 1) return alert("Minimal harus ada 1 blok soal!");
    setBlocks(blocks.filter(b => b.id !== blockId));
  };

  // Stimulus Block Functions
  const updateStimulus = (blockId: number, field: string, value: string) => {
    setBlocks(blocks.map(b => b.id === blockId ? { ...b, [field]: value } : b));
  };

  const addSoalToStimulus = (blockId: number) => {
    setBlocks(blocks.map(b => {
      if (b.id === blockId) {
        return { ...b, soalList: [...b.soalList, getDefaultSoal()] };
      }
      return b;
    }));
  };

  const removeSoalFromStimulus = (blockId: number, soalId: number) => {
    setBlocks(blocks.map(b => {
      if (b.id === blockId) {
        if (b.soalList.length === 1) {
          alert("Grup stimulus minimal memiliki 1 soal!");
          return b;
        }
        return { ...b, soalList: b.soalList.filter((s: any) => s.id !== soalId) };
      }
      return b;
    }));
  };

  const updateSoalInStimulus = (blockId: number, soalId: number, field: string, value: any) => {
    setBlocks(blocks.map(b => {
      if (b.id === blockId) {
        return {
          ...b,
          soalList: b.soalList.map((s: any) => s.id === soalId ? { ...s, [field]: value } : s)
        };
      }
      return b;
    }));
  };

  // Mandiri Block Functions
  const updateSoalMandiri = (blockId: number, field: string, value: any) => {
    setBlocks(blocks.map(b => {
      if (b.id === blockId) {
        return { ...b, soal: { ...b.soal, [field]: value } };
      }
      return b;
    }));
  };

  const validateSoal = (soal: any, soalLabel: string) => {
    if (!soal.pertanyaan || soal.pertanyaan.trim() === "") {
      throw new Error(`Pertanyaan pada ${soalLabel} tidak boleh kosong!`);
    }
    if (soal.jenisSoal === "PILIHAN_GANDA") {
      if (soal.opsiPG.findIndex((o: any) => o.isBenar) === -1) {
        throw new Error(`Pilih satu jawaban benar untuk PG pada ${soalLabel}!`);
      }
    }
  };

  const handleSave = async () => {
    if (!globalData.mapelId) return alert("Pilih Mata Pelajaran terlebih dahulu!");
    if (!globalData.kelasId) return alert("Pilih Kelas terlebih dahulu!");

    // Validation
    try {
      blocks.forEach((block, bIndex) => {
        if (block.type === 'STIMULUS') {
          if (!block.paragrafKonten || block.paragrafKonten.trim() === "") {
            throw new Error(`Teks Stimulus pada Blok #${bIndex + 1} tidak boleh kosong!`);
          }
          block.soalList.forEach((soal: any, sIndex: number) => {
            validateSoal(soal, `Soal ${sIndex + 1} di Blok #${bIndex + 1}`);
          });
        } else {
          validateSoal(block.soal, `Soal Mandiri di Blok #${bIndex + 1}`);
        }
      });
    } catch (e: any) {
      return alert(e.message);
    }

    setLoading(true);
    try {
      // Process Each Block
      for (const block of blocks) {
        let paragrafIdToUse = null;

        // 1. Create Paragraf if Stimulus
        if (block.type === 'STIMULUS') {
          const pRes = await fetch("/api/paragraf", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              judul: block.paragrafJudul || "Teks Stimulus",
              konten: block.paragrafKonten
            })
          });
          const pData = await pRes.json();
          if (pData.success) {
            paragrafIdToUse = pData.data.id;
          } else {
            throw new Error("Gagal menyimpan teks stimulus");
          }
        }

        // 2. Submit Questions
        const soalToSubmit = block.type === 'STIMULUS' ? block.soalList : [block.soal];

        for (const soal of soalToSubmit) {
          let jawabanPayload: any = {};
          if (soal.jenisSoal === "PILIHAN_GANDA") {
            jawabanPayload = {
              opsi: soal.opsiPG.map((o: any) => o.teks),
              jawabanBenarIndex: soal.opsiPG.findIndex((o: any) => o.isBenar)
            };
          } else if (soal.jenisSoal === "PILIHAN_GANDA_MULTI") {
            jawabanPayload = {
              opsi: soal.opsiPG.map((o: any) => o.teks),
              jawabanBenarIndices: soal.opsiPG.map((o: any, idx: number) => o.isBenar ? idx : -1).filter((idx: number) => idx !== -1)
            };
          } else if (soal.jenisSoal === "BENAR_SALAH") {
            jawabanPayload = { pernyataan: soal.pernyataanBS };
          } else if (soal.jenisSoal === "MENCOCOKKAN") {
            jawabanPayload = { pasangan: soal.pasanganJodoh };
          } else if (soal.jenisSoal === "ISIAN_SINGKAT") {
            jawabanPayload = { jawabanBenar: soal.jawabanSingkat, caseSensitive: false };
          } else if (soal.jenisSoal === "JAWABAN_PANJANG") {
            jawabanPayload = soal.uraian;
          }

          const res = await fetch("/api/bank-soal", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              mapelId: globalData.mapelId,
              kelasKurikulumId: globalData.kelasId,
              jenisSoal: soal.jenisSoal,
              tingkatKesulitan: soal.tingkatKesulitan,
              paragrafId: paragrafIdToUse,
              pertanyaan: soal.pertanyaan,
              jawaban: jawabanPayload,
              pembahasan: soal.pembahasan,
              tags: soal.tags
            })
          });

          const data = await res.json();
          if (!data.success) {
            throw new Error(data.error || "Gagal menyimpan soal");
          }
        }
      }

      alert("Berhasil menyimpan seluruh soal!");
      router.push("/bank-soal");
    } catch (e: any) {
      console.error(e);
      alert(e.message || "Terjadi kesalahan saat menyimpan");
    } finally {
      setLoading(false);
    }
  };

  const renderSoalEditor = (soal: any, updateFn: (field: string, value: any) => void) => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="col-span-1 space-y-4">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Jenis Soal</label>
          <select 
            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 bg-white font-medium"
            value={soal.jenisSoal} onChange={e => updateFn('jenisSoal', e.target.value)}
          >
            {JENIS_SOAL.map(j => <option key={j.value} value={j.value}>{j.label}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Tingkat Kesulitan</label>
          <select 
            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 bg-white"
            value={soal.tingkatKesulitan} onChange={e => updateFn('tingkatKesulitan', e.target.value)}
          >
            <option value="MUDAH">Mudah</option>
            <option value="SEDANG">Sedang</option>
            <option value="SULIT">Sulit</option>
          </select>
        </div>
      </div>

      <div className="col-span-1 lg:col-span-2 space-y-6">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Pertanyaan <span className="text-red-500">*</span></label>
          <RichTextEditor value={soal.pertanyaan} onChange={v => updateFn('pertanyaan', v)} minHeight="100px" />
        </div>

        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
          <label className="block text-sm font-bold text-slate-800 mb-3 border-b border-slate-200 pb-2">Opsi Jawaban</label>
          
          {(soal.jenisSoal === 'PILIHAN_GANDA' || soal.jenisSoal === 'PILIHAN_GANDA_MULTI') && (
            <div className="space-y-3">
              {soal.opsiPG.map((opsi: any, idx: number) => (
                <div key={idx} className="flex items-start gap-3 bg-white p-2 rounded-lg border border-slate-200">
                  <div className="pt-2 pl-2">
                    {soal.jenisSoal === 'PILIHAN_GANDA' ? (
                      <input type="radio" name={`pg-correct-${soal.id}`} checked={opsi.isBenar} onChange={() => {
                        const newOpsi = soal.opsiPG.map((o: any, i: number) => ({ ...o, isBenar: i === idx }));
                        updateFn('opsiPG', newOpsi);
                      }} className="w-4 h-4 text-indigo-600 focus:ring-indigo-500" />
                    ) : (
                      <input type="checkbox" checked={opsi.isBenar} onChange={(e) => {
                        const newOpsi = [...soal.opsiPG];
                        newOpsi[idx].isBenar = e.target.checked;
                        updateFn('opsiPG', newOpsi);
                      }} className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 rounded" />
                    )}
                  </div>
                  <div className="flex-1">
                    <RichTextEditor value={opsi.teks} onChange={v => {
                      const newOpsi = [...soal.opsiPG];
                      newOpsi[idx].teks = v;
                      updateFn('opsiPG', newOpsi);
                    }} minHeight="60px" placeholder={`Opsi ${String.fromCharCode(65 + idx)}`} />
                  </div>
                  <button onClick={() => updateFn('opsiPG', soal.opsiPG.filter((_: any, i: number) => i !== idx))} className="text-slate-400 hover:text-red-500 p-2"><Trash2 className="w-4 h-4" /></button>
                </div>
              ))}
              <button onClick={() => updateFn('opsiPG', [...soal.opsiPG, { teks: "", isBenar: false }])} className="text-sm font-semibold text-indigo-600 flex items-center gap-1 mt-2 hover:bg-indigo-50 px-3 py-1.5 rounded-md transition">
                <Plus className="w-4 h-4" /> Tambah Opsi
              </button>
            </div>
          )}

          {soal.jenisSoal === 'BENAR_SALAH' && (
            <div className="space-y-3">
              {soal.pernyataanBS.map((p: any, idx: number) => (
                <div key={idx} className="flex items-center gap-3 bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
                  <input type="text" value={p.teks} onChange={e => {
                    const newP = [...soal.pernyataanBS];
                    newP[idx].teks = e.target.value;
                    updateFn('pernyataanBS', newP);
                  }} placeholder="Pernyataan..." className="flex-1 border-none focus:ring-0 text-sm" />
                  <select value={p.isBenar ? "true" : "false"} onChange={e => {
                    const newP = [...soal.pernyataanBS];
                    newP[idx].isBenar = e.target.value === "true";
                    updateFn('pernyataanBS', newP);
                  }} className="border border-slate-200 rounded text-sm py-1.5 px-2 bg-slate-50 font-medium">
                    <option value="true">Benar</option>
                    <option value="false">Salah</option>
                  </select>
                  <button onClick={() => updateFn('pernyataanBS', soal.pernyataanBS.filter((_: any, i: number) => i !== idx))} className="text-slate-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                </div>
              ))}
              <button onClick={() => updateFn('pernyataanBS', [...soal.pernyataanBS, { teks: "", isBenar: true }])} className="text-sm font-semibold text-indigo-600 flex items-center gap-1 mt-2 hover:bg-indigo-50 px-3 py-1.5 rounded-md transition">
                <Plus className="w-4 h-4" /> Tambah Pernyataan
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-8">
      <div className="mx-auto max-w-5xl">
        <Link href="/bank-soal" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-indigo-600 mb-6 transition">
          <ArrowLeft className="w-4 h-4 mr-2" /> Kembali ke Bank Soal
        </Link>
        
        <div className="flex justify-between items-end mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Buat Soal Berantai (Batch)</h1>
            <p className="mt-1 text-sm text-slate-500 max-w-2xl">
              Buat beberapa soal sekaligus. Anda dapat membuat grup soal yang menggunakan 1 paragraf stimulus (wacana) bersama, atau membuat soal mandiri.
            </p>
          </div>
          <button 
            onClick={handleSave}
            disabled={loading}
            className="px-6 py-2.5 rounded-lg bg-indigo-600 text-white font-bold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-sm shrink-0"
          >
            {loading ? "Menyimpan..." : <><Save className="w-5 h-5" /> Simpan Semua Batch</>}
          </button>
        </div>

        {/* Global Config */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-8 flex gap-6 items-center">
          <div className="flex-1">
            <label className="block text-sm font-semibold text-slate-700 mb-1">Mata Pelajaran <span className="text-red-500">*</span></label>
            <select 
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 bg-white"
              value={globalData.mapelId} onChange={e => setGlobalData({...globalData, mapelId: e.target.value})}
            >
              <option value="">-- Pilih Mapel --</option>
              {mapelList.map(m => <option key={m.id} value={m.id}>{m.nama}</option>)}
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-semibold text-slate-700 mb-1">Kelas Target (Kurikulum) <span className="text-red-500">*</span></label>
            <select 
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 bg-white disabled:bg-slate-100 disabled:text-slate-400"
              value={globalData.kelasId} 
              onChange={e => setGlobalData({...globalData, kelasId: e.target.value})}
              disabled={!globalData.mapelId}
            >
              <option value="">-- Pilih Kelas Target --</option>
              {kelasList
                .filter(k => k.mapelId === globalData.mapelId)
                .map(k => (
                  <option key={k.id} value={k.id}>Kelas {k.kelas} - Semester {k.semester}</option>
              ))}
            </select>
            {!globalData.mapelId && <p className="text-xs text-orange-500 mt-1">Pilih Mata Pelajaran terlebih dahulu.</p>}
          </div>
        </div>

        {/* Blocks Render */}
        <div className="space-y-8">
          {blocks.map((block, bIdx) => (
            <div key={block.id} className="relative">
              {block.type === 'STIMULUS' ? (
                // ------------------ BLOK STIMULUS ------------------
                <div className="bg-white rounded-2xl border-2 border-indigo-200 shadow-sm overflow-hidden">
                  <div className="bg-indigo-50 border-b border-indigo-100 px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-indigo-700" />
                      <h2 className="font-bold text-indigo-900 text-lg">Grup Soal Stimulus (Wacana)</h2>
                    </div>
                    <button onClick={() => removeBlock(block.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-md"><Trash2 className="w-5 h-5" /></button>
                  </div>
                  
                  <div className="p-6 border-b border-dashed border-slate-200 bg-indigo-50/30">
                    <label className="block text-sm font-bold text-slate-800 mb-2">Teks Wacana / Bacaan Bersama</label>
                    <input 
                      type="text"
                      placeholder="Judul Paragraf (Opsional)"
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 bg-white mb-3 font-semibold"
                      value={block.paragrafJudul}
                      onChange={e => updateStimulus(block.id, 'paragrafJudul', e.target.value)}
                    />
                    <RichTextEditor 
                      value={block.paragrafKonten} 
                      onChange={v => updateStimulus(block.id, 'paragrafKonten', v)} 
                      minHeight="120px" 
                      placeholder="Ketik teks wacana bacaan di sini..." 
                    />
                  </div>

                  <div className="p-6 bg-slate-50/50 space-y-6">
                    {block.soalList.map((soal: any, sIdx: number) => (
                      <div key={soal.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                        <div className="bg-slate-100 px-4 py-2 border-b border-slate-200 flex justify-between items-center">
                          <span className="font-bold text-slate-700 text-sm">Soal Bagian #{sIdx + 1}</span>
                          <button onClick={() => removeSoalFromStimulus(block.id, soal.id)} className="text-red-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                        </div>
                        <div className="p-4">
                          {renderSoalEditor(soal, (field, value) => updateSoalInStimulus(block.id, soal.id, field, value))}
                        </div>
                      </div>
                    ))}
                    
                    <button 
                      onClick={() => addSoalToStimulus(block.id)}
                      className="w-full py-3 rounded-xl border-2 border-dashed border-indigo-300 text-indigo-600 font-bold hover:bg-indigo-50 flex items-center justify-center gap-2"
                    >
                      <Plus className="w-5 h-5" /> Tambah Soal Lain di Bawah Stimulus Ini
                    </button>
                  </div>
                </div>
              ) : (
                // ------------------ BLOK MANDIRI ------------------
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                  <div className="bg-slate-50 border-b border-slate-100 px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <PenTool className="w-5 h-5 text-slate-600" />
                      <h2 className="font-bold text-slate-800 text-lg">Soal Mandiri (Tanpa Bacaan)</h2>
                    </div>
                    <button onClick={() => removeBlock(block.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-md"><Trash2 className="w-5 h-5" /></button>
                  </div>
                  <div className="p-6">
                    {renderSoalEditor(block.soal, (field, value) => updateSoalMandiri(block.id, field, value))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button 
            onClick={() => addBlock('STIMULUS')}
            className="w-full py-4 rounded-xl border-2 border-dashed border-indigo-300 text-indigo-600 font-bold hover:border-indigo-400 hover:bg-indigo-50 transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            <BookOpen className="w-6 h-6" /> Tambah Blok Soal + Stimulus Wacana Baru
          </button>
          <button 
            onClick={() => addBlock('MANDIRI')}
            className="w-full py-4 rounded-xl border-2 border-dashed border-slate-300 text-slate-600 font-bold hover:border-slate-400 hover:bg-slate-50 transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            <PenTool className="w-6 h-6" /> Tambah Blok Soal Mandiri
          </button>
        </div>

      </div>
    </div>
  );
}
