'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Loader2, Printer } from 'lucide-react';

export default function CetakPaketSoalPage() {
  const params = useParams();
  const paketId = params.id as string;
  const [paket, setPaket] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/bank-soal/paket/${paketId}`)
      .then(res => res.json())
      .then(json => {
        if (json.success) setPaket(json.data);
        setLoading(false);
      });
  }, [paketId]);

  if (loading) return <div className="p-8 flex justify-center"><Loader2 className="animate-spin w-8 h-8 text-brand-600" /></div>;
  if (!paket) return <div className="p-8 text-center text-red-500">Paket Soal tidak ditemukan</div>;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-gray-100 min-h-screen py-8 print:bg-white print:p-0 print:py-0">
      
      {/* Control Bar (Hidden when printing) */}
      <div className="max-w-4xl mx-auto mb-4 flex justify-between items-center bg-white p-4 shadow-sm rounded-lg print:hidden">
        <div>
          <h2 className="font-bold">Mode Cetak Naskah</h2>
          <p className="text-sm text-gray-500">Gunakan fitur Print browser (Ctrl+P) lalu pilih "Save as PDF" untuk mencetak ke PDF.</p>
        </div>
        <button onClick={handlePrint} className="dz-btn-primary gap-2">
          <Printer className="w-4 h-4" /> Cetak Naskah & Kunci
        </button>
      </div>

      {/* A4 / Folio Paper Simulation */}
      <div className={`mx-auto bg-white shadow-lg print:shadow-none ${paket.layoutKertas === 'FOLIO' ? 'w-[215mm] min-h-[330mm]' : 'w-[210mm] min-h-[297mm]'} p-[20mm] print:w-auto print:min-h-auto print:p-0`}>
        
        {/* KOP NASKAH */}
        {paket.kopNaskah ? (
          <div className="flex items-center border-b-4 border-double border-black pb-4 mb-6">
            {paket.kopNaskah.logoKiriUrl ? (
              <img src={paket.kopNaskah.logoKiriUrl} className="w-20 h-20 object-contain mr-4" alt="Logo Kiri" />
            ) : <div className="w-20 h-20 bg-gray-200 mr-4 flex items-center justify-center text-xs text-gray-400">Logo 1</div>}
            
            <div className="flex-1 text-center font-serif">
              <h1 className="text-lg font-bold uppercase">{paket.kopNaskah.namaLembaga}</h1>
              <h2 className="text-2xl font-bold uppercase">{paket.kopNaskah.namaSekolah}</h2>
              <p className="text-sm">{paket.kopNaskah.alamat}</p>
            </div>

            {paket.kopNaskah.logoKananUrl ? (
              <img src={paket.kopNaskah.logoKananUrl} className="w-20 h-20 object-contain ml-4" alt="Logo Kanan" />
            ) : <div className="w-20 h-20 bg-gray-200 ml-4 flex items-center justify-center text-xs text-gray-400">Logo 2</div>}
          </div>
        ) : (
          <div className="border-b-4 border-double border-black pb-4 mb-6 text-center font-serif">
            <h2 className="text-2xl font-bold uppercase">NASKAH UJIAN SEKOLAH</h2>
          </div>
        )}

        {/* INFO MAPEL */}
        <div className="grid grid-cols-2 gap-x-8 mb-6 font-semibold">
          <div>Mata Pelajaran: {paket.mapel?.nama}</div>
          <div>Kelas/Semester: {paket.kelas} / {paket.semester}</div>
          <div>Nama Paket: {paket.nama}</div>
          <div>Durasi Waktu: {paket.durasi} Menit</div>
        </div>

        {/* PETUNJUK */}
        {paket.petunjuk && (
          <div className="mb-6 p-4 border border-black italic">
            <span className="font-bold not-italic">Petunjuk Pengerjaan:</span><br/>
            <div className="mt-1 whitespace-pre-wrap">{paket.petunjuk}</div>
          </div>
        )}

        {/* BUTIR SOAL */}
        <div className={`text-justify ${paket.jumlahKolom === 2 ? 'columns-2 gap-8' : ''}`}>
          {paket.items?.map((item: any, idx: number) => (
            <div key={item.id} className="mb-6 break-inside-avoid">
              <div className="flex gap-2">
                <div className="font-bold shrink-0">{idx + 1}.</div>
                <div className="flex-1">
                  <div dangerouslySetInnerHTML={{ __html: item.bankSoal?.pertanyaan || 'Pertanyaan...' }} />
                  
                  {/* Contoh render Opsi Jawaban (Jika Pilihan Ganda) */}
                  {item.bankSoal?.opsiJawaban && (
                    <ol className="list-[lower-alpha] pl-5 mt-2 space-y-1">
                      {Array.isArray(item.bankSoal.opsiJawaban) ? item.bankSoal.opsiJawaban.map((opsi: any, i: number) => (
                        <li key={i}>{opsi.teks}</li>
                      )) : null}
                    </ol>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* PAGE BREAK (KUNCI JAWABAN) */}
      <div className="break-before-page mx-auto mt-8 bg-white shadow-lg print:shadow-none w-[210mm] p-[20mm] print:w-auto print:min-h-auto print:p-0">
        <h2 className="text-2xl font-bold text-center mb-6 uppercase underline">Lembar Kunci Jawaban</h2>
        <div className="grid grid-cols-2 gap-x-8 font-semibold mb-8">
          <div>Mata Pelajaran: {paket.mapel?.nama}</div>
          <div>Nama Paket: {paket.nama}</div>
        </div>

        <table className="w-full border-collapse border border-black text-center">
          <thead>
            <tr>
              <th className="border border-black py-2 w-16">No</th>
              <th className="border border-black py-2">Kunci Jawaban</th>
              <th className="border border-black py-2 w-32">Bobot / Skor</th>
            </tr>
          </thead>
          <tbody>
            {paket.items?.map((item: any, idx: number) => (
              <tr key={item.id}>
                <td className="border border-black py-2">{idx + 1}</td>
                <td className="border border-black py-2">
                  {/* Ekstrak Kunci (jika ada struktur kunci) */}
                  {item.bankSoal?.kunciJawaban ? item.bankSoal.kunciJawaban : 'A/B/C/D'}
                </td>
                <td className="border border-black py-2">{item.bobot}</td>
              </tr>
            ))}
          </tbody>
        </table>
        
        <div className="mt-8 text-sm italic">
          * Kunci jawaban ini bersifat rahasia dan dicetak terpisah untuk kebutuhan guru/korektor.
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          @page { size: auto; margin: 0mm; }
          * {
            color: #000 !important;
            box-shadow: none !important;
            text-shadow: none !important;
            background: transparent !important;
          }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; background-color: white !important; }
          .print\\:hidden { display: none !important; }
        }
      `}} />
    </div>
  );
}
