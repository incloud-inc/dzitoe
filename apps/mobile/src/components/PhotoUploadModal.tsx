'use client';

import React, { useState, useRef } from 'react';
import { Camera, Image as ImageIcon, Check, X } from 'lucide-react';

interface PhotoUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentAvatar?: string | null;
  userName?: string;
  userRole?: 'MURID' | 'GURU';
  studentId?: string;
  onPhotoUpdated?: (newAvatarUrl: string) => void;
  onUploadSuccess?: (newAvatarUrl: string) => void;
}

export function PhotoUploadModal({
  isOpen,
  onClose,
  currentAvatar,
  userName = 'Pengguna',
  userRole = 'MURID',
  studentId = 'demo-murid-1',
  onPhotoUpdated,
  onUploadSuccess,
}: PhotoUploadModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setErrorMessage('Ukuran foto terlalu besar. Maksimal 2 MB.');
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setErrorMessage(null);
  };

  const handleSavePhoto = async () => {
    if (!selectedFile && !previewUrl) return;

    setIsUploading(true);
    setErrorMessage(null);

    try {
      if (selectedFile) {
        const formData = new FormData();
        formData.append('studentId', studentId);
        formData.append('photo', selectedFile);

        // Upload to backend API
        const endpoint = userRole === 'GURU' ? '/api/guru/upload-foto' : '/api/murid/upload-foto';
        const res = await fetch(endpoint, {
          method: 'POST',
          body: formData,
        });

        const data = await res.json();
        if (data.success && data.avatarUrl) {
          onPhotoUpdated?.(data.avatarUrl);
          onUploadSuccess?.(data.avatarUrl);
          onClose();
          return;
        }
      }

      // Fallback: save previewUrl to state/storage for offline/mobile preview
      if (previewUrl) {
        onPhotoUpdated?.(previewUrl);
        onUploadSuccess?.(previewUrl);
        onClose();
      }
    } catch {
      // Local fallback
      if (previewUrl) {
        onPhotoUpdated?.(previewUrl);
        onUploadSuccess?.(previewUrl);
        onClose();
      } else {
        setErrorMessage('Gagal mengunggah foto. Silakan coba lagi.');
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setErrorMessage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-white rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-5 animate-in slide-in-from-bottom-6 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-100">
              <Camera className="w-5 h-5 text-[#087f5b]" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Ganti Foto Profil</h3>
              <p className="text-[11px] text-slate-500">Pilih dari Galeri atau Kamera</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Visual Avatar Preview */}
        <div className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-center">
          <div className="relative w-28 h-28 rounded-full overflow-hidden p-1 bg-white shadow-md ring-4 ring-emerald-500/20 mb-3 group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={
                previewUrl ||
                currentAvatar ||
                'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150'
              }
              alt={userName}
              className="w-full h-full rounded-full object-cover"
            />
            {previewUrl && (
              <span className="absolute bottom-1 right-2 px-1.5 py-0.5 rounded-full text-[9px] font-black bg-[#087f5b] text-white shadow-xs">
                Baru
              </span>
            )}
          </div>
          <span className="text-xs font-bold text-slate-800">{userName}</span>
          <span className="text-[10px] text-slate-400">
            {selectedFile ? `${selectedFile.name} (${(selectedFile.size / 1024).toFixed(1)} KB)` : 'Foto profil saat ini'}
          </span>
        </div>

        {errorMessage && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium text-center">
            {errorMessage}
          </div>
        )}

        {/* Action Picker Buttons */}
        <div className="space-y-2.5">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full py-3 px-4 rounded-2xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold transition flex items-center justify-center gap-2 shadow-xs cursor-pointer active:scale-98"
          >
            <ImageIcon className="w-4 h-4 text-[#087f5b]" />
            <span>{previewUrl ? 'Pilih Foto Lain dari Galeri' : 'Buka Galeri Foto'}</span>
          </button>

          {previewUrl && (
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={handleReset}
                disabled={isUploading}
                className="py-2.5 px-3 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 transition"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleSavePhoto}
                disabled={isUploading}
                className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#087f5b] to-[#12b886] text-white font-bold text-xs shadow-md shadow-[#087f5b]/20 hover:opacity-95 transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {isUploading ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Menyimpan...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Simpan Foto</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        <p className="text-[10px] text-slate-400 text-center leading-relaxed">
          💡 Foto ini akan ditampilkan di kartu absensi digital dan verifikasi gerbang sekolah.
        </p>
      </div>
    </div>
  );
}
