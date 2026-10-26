'use client';

import React, { useState, useRef } from 'react';
import {
  FileSpreadsheet,
  Upload,
  Download,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  X,
  FileCheck,
  RefreshCw,
  Info,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ImportSummaryReport } from '@dzitoe/utils';

interface ExcelImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle: string;
  templateUrl: string;
  templateFilename: string;
  uploadEndpoint: string;
  acceptedFileTypes?: string;
  sampleColumns: string[];
  onImportSuccess?: () => void;
}

export function ExcelImportModal({
  isOpen,
  onClose,
  title,
  subtitle,
  templateUrl,
  templateFilename,
  uploadEndpoint,
  acceptedFileTypes = '.xlsx, .xls, .csv',
  sampleColumns,
  onImportSuccess,
}: ExcelImportModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [report, setReport] = useState<ImportSummaryReport | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setReport(null);
      setErrorMessage(null);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setSelectedFile(file);
      setReport(null);
      setErrorMessage(null);
    }
  };

  const handleExecuteImport = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setErrorMessage(null);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const res = await fetch(uploadEndpoint, {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (data.success && data.summary) {
        setReport(data.summary);
        if (onImportSuccess) {
          onImportSuccess();
        }
      } else {
        setErrorMessage(data.message || 'Gagal memproses file import.');
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Terjadi kesalahan jaringan saat mengunggah file.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setReport(null);
    setErrorMessage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 p-6 sm:p-8 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-700 flex items-center justify-center border border-brand-100 shrink-0">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">{title}</h3>
              <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step 1: Download Template */}
        <div className="p-4 rounded-2xl bg-brand-50/60 border border-brand-100/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <span className="text-xs font-bold text-brand-900 flex items-center gap-1.5">
              <Info className="w-4 h-4 text-brand-600" />
              Gunakan Template Standar
            </span>
            <p className="text-[11px] text-brand-800/80 leading-relaxed">
              Format kolom yang didukung: <span className="font-mono text-brand-950 font-bold">{sampleColumns.join(', ')}</span>
            </p>
          </div>
          <a
            href={templateUrl}
            download={templateFilename}
            className="inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl bg-white text-brand-800 hover:bg-brand-50 border border-brand-200 text-xs font-bold shrink-0 transition shadow-xs cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-brand-600" />
            <span>Unduh Template (.xlsx)</span>
          </a>
        </div>

        {/* Step 2: Upload Area / Dropzone */}
        {!report && (
          <div className="space-y-4">
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={cn(
                'border-2 border-dashed rounded-3xl p-8 text-center cursor-pointer transition flex flex-col items-center justify-center gap-3',
                selectedFile
                  ? 'border-brand-500 bg-brand-50/20'
                  : 'border-slate-300 hover:border-brand-500 hover:bg-slate-50/80'
              )}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept={acceptedFileTypes}
                onChange={handleFileChange}
                className="hidden"
              />
              <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-600">
                <Upload className="w-6 h-6 text-brand-600" />
              </div>
              {selectedFile ? (
                <div>
                  <p className="text-sm font-bold text-brand-950 flex items-center justify-center gap-1.5">
                    <FileCheck className="w-4 h-4 text-emerald-600" />
                    {selectedFile.name}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Ukuran: {(selectedFile.size / 1024).toFixed(1)} KB — Siap diproses
                  </p>
                </div>
              ) : (
                <div>
                  <p className="text-xs font-bold text-slate-800">
                    Klik untuk memilih file atau seret file ke sini
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Mendukung file Microsoft Excel (.xlsx, .xls) dan CSV
                  </p>
                </div>
              )}
            </div>

            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs font-medium flex items-center gap-2">
                <XCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                disabled={isUploading}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold transition cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleExecuteImport}
                disabled={!selectedFile || isUploading}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-md shadow-brand-600/20 disabled:opacity-50 transition cursor-pointer"
              >
                {isUploading ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Memproses Import...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-3.5 h-3.5" />
                    <span>Mulai Import Data</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Diagnostic Report Result */}
        {report && (
          <div className="space-y-5 animate-in fade-in duration-200">
            {/* Stat Cards */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                <span className="text-[10px] uppercase font-bold text-slate-400">Total Baris</span>
                <p className="text-xl font-black text-slate-800 mt-0.5">{report.totalRows}</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-center">
                <span className="text-[10px] uppercase font-bold text-emerald-700">Berhasil Masuk</span>
                <p className="text-xl font-black text-emerald-800 mt-0.5">{report.successCount}</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-center">
                <span className="text-[10px] uppercase font-bold text-amber-700">Dilewati / Duplikat</span>
                <p className="text-xl font-black text-amber-800 mt-0.5">{report.skippedCount}</p>
              </div>
            </div>

            {/* Error / Warning Details if any */}
            {report.errors.length > 0 && (
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                  Rincian Baris yang Dilewati ({report.errors.length})
                </span>
                <div className="max-h-48 overflow-y-auto rounded-2xl border border-slate-200 divide-y divide-slate-100 text-xs">
                  {report.errors.map((err, idx) => (
                    <div key={idx} className="p-2.5 flex items-start justify-between gap-3 bg-white hover:bg-slate-50">
                      <div>
                        <span className="font-bold text-slate-900">Baris #{err.row}</span>
                        {err.identifier && <span className="ml-2 font-mono text-slate-500">[{err.identifier}]</span>}
                        <p className="text-slate-600 mt-0.5">{err.message}</p>
                      </div>
                      {err.field && (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-100 text-amber-800 shrink-0">
                          {err.field}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Success message banner */}
            <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 text-emerald-900 text-xs flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                Data telah tersinkronisasi ke sistem. Anda dapat menutup jendela ini untuk melihat tabel yang diperbarui.
              </span>
            </div>

            {/* Action buttons */}
            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-semibold transition cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Upload File Lain</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-md shadow-brand-600/20 transition cursor-pointer"
              >
                Selesai & Tutup
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
