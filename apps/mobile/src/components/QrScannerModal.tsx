'use client';

import React, { useState } from 'react';
import { QrCode, X, Camera, CheckCircle2, AlertTriangle, KeyRound } from 'lucide-react';

interface QrScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScanSuccess: (qrCodeValue: string) => void;
}

export function QrScannerModal({ isOpen, onClose, onScanSuccess }: QrScannerModalProps) {
  const [tokenInput, setTokenInput] = useState('');
  const [isSimulatingScan, setIsSimulatingScan] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSimulateScan = () => {
    setIsSimulatingScan(true);
    setErrorMessage(null);
    setTimeout(() => {
      setIsSimulatingScan(false);
      onScanSuccess('QR-PIKET-SMAN20-' + Date.now());
      onClose();
    }, 1200);
  };

  const handleTokenSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tokenInput.trim()) {
      setErrorMessage('Masukkan kode token pos piket.');
      return;
    }
    onScanSuccess(`TOKEN-${tokenInput.trim().toUpperCase()}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-sm rounded-3xl bg-slate-900 border border-slate-800 text-white p-5 shadow-2xl space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-400 flex items-center justify-center">
              <QrCode className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Scan QR Pos Piket</h3>
              <span className="text-[10px] text-amber-400 font-semibold bg-amber-500/10 px-1.5 py-0.5 rounded">
                Metode Alternatif
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Info Banner */}
        <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/60 text-xs text-slate-300 space-y-1">
          <p className="font-semibold text-slate-200">Kapan metode ini digunakan?</p>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Metode ini adalah <strong>opsi cadangan/alternatif</strong> jika GPS atau kamera Anda bermasalah. Anda tidak wajib menggunakan QR Code jika sudah presensi via GPS atau Swafoto.
          </p>
        </div>

        {/* Viewfinder Mockup */}
        <div className="relative aspect-square rounded-2xl bg-black border-2 border-dashed border-amber-500/50 flex flex-col items-center justify-center p-4 overflow-hidden">
          {/* Scanning Animation Laser Line */}
          <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent shadow-[0_0_12px_#f59e0b] animate-bounce top-1/3" />

          <div className="w-36 h-36 rounded-xl border-2 border-amber-400/80 p-2 flex flex-col items-center justify-center text-center bg-slate-950/40">
            <Camera className="w-8 h-8 text-amber-400 mb-1" />
            <span className="text-[11px] font-bold text-slate-200">Arahkan Kamera</span>
            <span className="text-[9px] text-slate-400">ke QR Pos Piket Gerbang</span>
          </div>

          <button
            type="button"
            onClick={handleSimulateScan}
            disabled={isSimulatingScan}
            className="absolute bottom-3 inset-x-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition active:scale-95"
          >
            {isSimulatingScan ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                <span>Mendeteksi QR Code...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Simulasikan Scan QR Sukses</span>
              </>
            )}
          </button>
        </div>

        {/* Manual Emergency Token Input */}
        <form onSubmit={handleTokenSubmit} className="space-y-2 pt-1 border-t border-slate-800">
          <label className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
            <KeyRound className="w-3 h-3 text-amber-400" />
            <span>Atau Masukkan Kode Token Harian Piket:</span>
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Contoh: PKT20A"
              value={tokenInput}
              onChange={(e) => setTokenInput(e.target.value.toUpperCase())}
              className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono uppercase text-white focus:outline-none focus:border-amber-400 placeholder:text-slate-500"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-bold text-xs transition active:scale-95"
            >
              Kirim
            </button>
          </div>
          {errorMessage && (
            <p className="text-[10px] text-rose-400 flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" />
              <span>{errorMessage}</span>
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
