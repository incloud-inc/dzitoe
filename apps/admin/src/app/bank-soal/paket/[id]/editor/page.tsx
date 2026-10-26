'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Loader2, Save, GripVertical, FileText, Printer, Search } from 'lucide-react';

export default function PaketSoalEditorPage() {
  const params = useParams();
  const router = useRouter();
  const paketId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [paket, setPaket] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);
  const [kopList, setKopList] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);

  useEffect(() => {
    Promise.all([
      fetch(`/api/bank-soal/paket/${paketId}`).then(res => res.json()),
      fetch(`/api/bank-soal/kop-naskah`).then(res => res.json())
    ]).then(([paketRes, kopRes]) => {
      if (paketRes.success) {
        setPaket(paketRes.data);
        setItems(paketRes.data.items || []);
      }
      if (kopRes.success) {
        setKopList(kopRes.data);
      }
      setLoading(false);
    });
  }, [paketId]);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIdx(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIdx === null || draggedIdx === index) return;

    const newItems = [...items];
    const draggedItem = newItems[draggedIdx];
    
    newItems.splice(draggedIdx, 1);
    newItems.splice(index, 0, draggedItem);
    
    setDraggedIdx(index);
    setItems(newItems);
  };

  const handleDragEnd = () => {
    setDraggedIdx(null);
  };

  const saveLayout = async () => {
    setSaving(true);
    try {
      await fetch(`/api/bank-soal/paket/${paketId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paket)
      });

      await fetch(`/api/bank-soal/paket/${paketId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'UPDATE_ITEMS', items: items })
      });

      alert('Berhasil menyimpan tata letak naskah soal');
    } catch (error) {
      alert('Terjadi kesalahan saat menyimpan');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 flex justify-center"><Loader2 className="animate-spin w-8 h-8 text-brand-600" /></div>;
  if (!paket) return <div className="p-8 text-center text-red-500">Paket Soal tidak ditemukan</div>;

  return (
    <div className="flex flex-col gap-6 p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Editor Tata Letak Naskah</h1>
          <p className="text-slate-500 mt-1">Paket: {paket.nama} | Mapel: {paket.mapel?.nama}</p>
        </div>
        <div className="flex gap-2">
          <button className="dz-btn-ghost gap-2" onClick={() => window.open(`/bank-soal/paket/${paketId}/cetak`)}>
            <Printer className="w-4 h-4" /> Preview Cetak
          </button>
          <button className="dz-btn-primary gap-2" onClick={saveLayout} disabled={saving}>
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Simpan Perubahan
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="flex flex-col gap-4">
          <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-card">
            <h2 className="text-lg font-bold flex items-center gap-2 mb-4"><FileText className="w-5 h-5"/> Pengaturan Naskah</h2>
            
            <div className="flex flex-col gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Kop Naskah Resmi</label>
                <select 
                  value={paket.kopNaskahId || ''} 
                  onChange={(e) => setPaket({...paket, kopNaskahId: e.target.value})}
                  className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
                >
                  <option value="">-- Pilih Kop --</option>
                  {kopList.map(k => (
                    <option key={k.id} value={k.id}>{k.namaSekolah}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Layout Kertas</label>
                <select 
                  value={paket.layoutKertas} 
                  onChange={(e) => setPaket({...paket, layoutKertas: e.target.value})}
                  className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
                >
                  <option value="A4">A4 (21 x 29.7 cm)</option>
                  <option value="FOLIO">F4 / Folio (21.5 x 33 cm)</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Kolom Cetak</label>
                <select 
                  value={paket.jumlahKolom.toString()} 
                  onChange={(e) => setPaket({...paket, jumlahKolom: parseInt(e.target.value)})}
                  className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
                >
                  <option value="1">1 Kolom (Penuh)</option>
                  <option value="2">2 Kolom (Koran)</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Petunjuk Pengerjaan</label>
                <textarea 
                  className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm min-h-[120px]"
                  placeholder="Isi petunjuk pengerjaan..."
                  value={paket.petunjuk || ''}
                  onChange={(e) => setPaket({...paket, petunjuk: e.target.value})}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="md:col-span-2">
          <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-card">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold">Urutan Butir Soal (Drag & Drop)</h2>
              <button className="dz-btn-ghost text-xs gap-1">
                <Search className="w-3.5 h-3.5" /> Tambah Soal
              </button>
            </div>
            
            {items.length === 0 ? (
              <div className="p-12 text-center text-slate-500 border-2 border-dashed rounded-lg">
                Paket ini belum memiliki butir soal.<br/>Silakan tambahkan dari Bank Soal.
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {items.map((it, idx) => (
                  <div 
                    key={it.id || it.bankSoalId}
                    draggable
                    onDragStart={(e) => handleDragStart(e, idx)}
                    onDragOver={(e) => handleDragOver(e, idx)}
                    onDragEnd={handleDragEnd}
                    className={`flex items-start gap-3 p-3 border rounded-md bg-white transition-all cursor-move active:cursor-grabbing ${draggedIdx === idx ? 'opacity-60 border-brand-500 shadow-inner' : 'hover:border-brand-300 shadow-sm'}`}
                  >
                    <div className="mt-1 text-slate-400">
                      <GripVertical className="w-5 h-5" />
                    </div>
                    <div className="font-bold text-lg w-6 shrink-0">{idx + 1}.</div>
                    <div className="flex-1">
                      <div className="text-sm line-clamp-2" dangerouslySetInnerHTML={{ __html: it.bankSoal?.pertanyaan || 'Pertanyaan tidak tersedia' }} />
                      <div className="mt-2 text-xs text-slate-500 flex gap-3">
                        <span className="bg-slate-100 px-2 py-0.5 rounded">ID: {it.bankSoalId.slice(-6)}</span>
                        <span className="bg-slate-100 px-2 py-0.5 rounded">Bobot: {it.bobot}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
