"use client";

import { useState } from "react";
import { ArrowLeft, Save, AlignLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { RichTextEditor } from "@/components/ui/RichTextEditor";

export default function ParagrafCreatePage() {
  const router = useRouter();
  const [judul, setJudul] = useState("");
  const [konten, setKonten] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!konten) return alert("Konten wajib diisi!");
    
    setLoading(true);
    try {
      const res = await fetch("/api/paragraf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ judul, konten })
      });
      
      const data = await res.json();
      if (data.success) {
        router.push("/bank-soal");
      } else {
        alert(data.error || "Gagal menyimpan");
      }
    } catch (e) {
      console.error(e);
      alert("Terjadi kesalahan sistem");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-8">
      <div className="mx-auto max-w-4xl">
        <Link href="/bank-soal" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-indigo-600 mb-6 transition">
          <ArrowLeft className="w-4 h-4 mr-2" /> Kembali ke Bank Soal
        </Link>
        
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50">
            <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <AlignLeft className="h-6 w-6 text-indigo-600" />
              Buat Teks Stimulus / Wacana
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Buat paragraf atau wacana yang dapat dibagikan dan digunakan oleh lebih dari satu butir soal (misal: soal cerita atau literasi).
            </p>
          </div>
          
          <div className="p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Judul Referensi (Opsional)</label>
              <input 
                type="text" 
                value={judul}
                onChange={e => setJudul(e.target.value)}
                placeholder="Contoh: Cerita Rakyat Bawang Merah Bawang Putih"
                className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
              />
              <p className="mt-1.5 text-xs text-slate-500">Hanya untuk memudahkan pencarian di Bank Soal.</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Isi Teks / Wacana <span className="text-red-500">*</span></label>
              <div className="font-serif [&_.ProseMirror]:font-serif">
                <RichTextEditor 
                  value={konten}
                  onChange={setKonten}
                  minHeight="300px"
                  placeholder="Ketik wacana atau cerita di sini. Gunakan LaTeX jika butuh rumus..."
                />
              </div>
            </div>
          </div>
          
          <div className="p-6 bg-slate-50 border-t border-slate-200 flex justify-end gap-3">
            <Link href="/bank-soal" className="px-5 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-700 font-medium hover:bg-slate-50 transition">
              Batal
            </Link>
            <button 
              onClick={handleSave}
              disabled={loading || !konten.trim()}
              className="px-5 py-2.5 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition shadow-sm"
            >
              {loading ? "Menyimpan..." : <><Save className="w-4 h-4" /> Simpan Stimulus</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
