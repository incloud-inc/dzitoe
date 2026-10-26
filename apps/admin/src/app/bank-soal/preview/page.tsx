"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, Printer, Loader2 } from "lucide-react";
import Link from "next/link";

export default function BankSoalPreviewPage() {
  const [soalList, setSoalList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/bank-soal')
      .then(res => res.json())
      .then(data => {
        setSoalList(data.data || []);
        setLoading(false);
      });
  }, []);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-100 print:bg-white">
      {/* Top Navbar (Hidden when printing) */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10 print:hidden shadow-sm">
        <Link href="/bank-soal" className="inline-flex items-center text-sm font-medium text-slate-600 hover:text-indigo-600">
          <ArrowLeft className="w-4 h-4 mr-2" /> Kembali ke Repositori
        </Link>
        <div className="flex items-center gap-3">
          <button 
            onClick={handlePrint}
            className="inline-flex items-center bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 shadow-sm"
          >
            <Printer className="w-4 h-4 mr-2" /> Cetak / Ekspor PDF
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20 print:hidden">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
        </div>
      ) : (
        <div className="py-8 print:py-0">
          {/* Kertas A4 Wrapper */}
          <div className="mx-auto bg-white shadow-xl print:shadow-none max-w-[210mm] min-h-[297mm] p-[20mm] text-black">
            {/* Kop Soal */}
            <div className="text-center border-b-2 border-black pb-4 mb-6">
              <h1 className="text-xl font-bold uppercase tracking-wider">Pemerintah Provinsi Banten</h1>
              <h2 className="text-2xl font-bold uppercase tracking-widest mt-1">SMAN 20 KABUPATEN TANGERANG</h2>
              <p className="text-sm mt-1 font-medium">BANK SOAL & MATERI UJIAN</p>
            </div>
            
            {/* Header Informasi */}
            <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm font-semibold mb-8">
              <div className="flex"><span className="w-32">Mata Pelajaran</span>: Semua Mapel (Preview)</div>
              <div className="flex"><span className="w-32">Kurikulum</span>: Merdeka</div>
              <div className="flex"><span className="w-32">Tingkat / Kelas</span>: X, XI, XII</div>
              <div className="flex"><span className="w-32">Waktu</span>: 90 Menit</div>
            </div>

            {/* Instruksi Umum */}
            <div className="mb-8 border border-black p-3 text-sm">
              <span className="font-bold">PETUNJUK UMUM:</span>
              <ol className="list-decimal pl-5 mt-1">
                <li>Berdoalah sebelum mengerjakan soal.</li>
                <li>Periksa dan bacalah soal-soal dengan teliti sebelum menjawab.</li>
                <li>Laporkan kepada pengawas jika terdapat tulisan yang kurang jelas.</li>
              </ol>
            </div>

            {/* List Soal */}
            <div className="space-y-6 text-base font-sans leading-relaxed">
              {soalList.map((soal, idx) => (
                <div key={soal.id} className="break-inside-avoid">
                  {/* Soal Item */}
                  <div className="flex gap-3">
                    <div className="font-bold shrink-0">{idx + 1}.</div>
                    <div className="flex-1">
                      {/* Paragraf Stimulus (jika ada) */}
                      {soal.paragrafObj && (
                        <div className="mb-3 border border-slate-300 bg-slate-50 p-4 rounded text-sm italic shadow-sm">
                          {soal.paragrafObj.judul && <div className="font-bold mb-2 not-italic text-center">{soal.paragrafObj.judul}</div>}
                          <div dangerouslySetInnerHTML={{ __html: soal.paragrafObj.konten }} />
                        </div>
                      )}

                      {/* Pertanyaan */}
                      <div dangerouslySetInnerHTML={{ __html: soal.pertanyaan }} className="mb-2" />

                      {/* Render Opsi (Khusus PG) */}
                      {(soal.jenisSoal === 'PILIHAN_GANDA' || soal.jenisSoal === 'PILIHAN_GANDA_MULTI') && soal.jawaban?.opsi && (
                        <div className="pl-4 space-y-1">
                          {(soal.jawaban.opsi as string[]).map((opsi, oIdx) => (
                            <div key={oIdx} className="flex gap-2">
                              <span className="font-medium">{String.fromCharCode(65 + oIdx)}.</span>
                              <div dangerouslySetInnerHTML={{ __html: opsi }} />
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Render B/S */}
                      {soal.jenisSoal === 'BENAR_SALAH' && soal.jawaban?.pernyataan && (
                        <table className="w-full mt-3 mb-2 border-collapse border border-slate-300 text-sm">
                          <thead>
                            <tr className="bg-slate-100">
                              <th className="border border-slate-300 px-3 py-1 text-left">Pernyataan</th>
                              <th className="border border-slate-300 px-3 py-1 w-20 text-center">Benar</th>
                              <th className="border border-slate-300 px-3 py-1 w-20 text-center">Salah</th>
                            </tr>
                          </thead>
                          <tbody>
                            {(soal.jawaban.pernyataan as any[]).map((p, pIdx) => (
                              <tr key={pIdx}>
                                <td className="border border-slate-300 px-3 py-1">{p.teks}</td>
                                <td className="border border-slate-300 px-3 py-1 text-center"><div className="w-4 h-4 border border-black rounded-full mx-auto"></div></td>
                                <td className="border border-slate-300 px-3 py-1 text-center"><div className="w-4 h-4 border border-black rounded-full mx-auto"></div></td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}

                      {/* Kosong untuk Uraian / Isian */}
                      {(soal.jenisSoal === 'JAWABAN_PANJANG' || soal.jenisSoal === 'ISIAN_SINGKAT') && (
                        <div className="mt-3">
                          <div className="w-full border-b border-dotted border-black h-8"></div>
                          <div className="w-full border-b border-dotted border-black h-8"></div>
                          <div className="w-full border-b border-dotted border-black h-8"></div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Global Print CSS to ensure A4 rendering */}
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          @page { size: A4; margin: 0; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .print\\:hidden { display: none !important; }
          .print\\:bg-white { background-color: white !important; }
          .print\\:py-0 { padding-top: 0 !important; padding-bottom: 0 !important; }
          .print\\:shadow-none { box-shadow: none !important; }
          .break-inside-avoid { break-inside: avoid; }
        }
      `}} />
    </div>
  );
}
