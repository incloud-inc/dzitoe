'use client';

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="id">
      <body className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center font-sans">
        <div className="max-w-md p-8 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 mb-2">Aplikasi Mengalami Kendala</h2>
          <p className="text-sm text-slate-500 mb-6">
            Terjadi masalah fatal saat memuat antarmuka. Silakan coba kembali atau hubungi administrator.
          </p>
          <button
            onClick={() => reset()}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold transition"
          >
            Muat Ulang
          </button>
        </div>
      </body>
    </html>
  );
}
