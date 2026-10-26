const fs = require('fs');
const path = require('path');

const tasksFile = path.join(__dirname, '..', 'TASKS.md');
let content = fs.readFileSync(tasksFile, 'utf8');

const targetPhase3 = `### A. Modul A14: Jenis Tagihan

| No | Task | Prioritas | Status | DeepSeek | Estimasi |
|---|---|---|---|---|---|
| A14.1 | Schema JenisTagihan | 🔴 | ✅ | Wajib | 0.5 hari |
| A14.2 | API CRUD jenis tagihan | 🔴 | ✅ | Wajib | 1.5 hari |
| A14.3 | Halaman jenis tagihan | 🔴 | ✅ | Wajib | 1.5 hari |
| A14.4 | Konfigurasi periode (sekali, bulanan, semester) | 🔴 | ✅ | Wajib | 1 hari |

**Subtotal:** 4 task, estimasi 4.5 hari (Status: 4/4 ✅ Selesai Penuh)

---

### B. Modul A15: Tagihan

| No | Task | Prioritas | Status | DeepSeek | Estimasi |
|---|---|---|---|---|---|
| A15.1 | Schema Tagihan | 🔴 | ✅ | Wajib | 1 hari |
| A15.2 | API CRUD tagihan | 🔴 | ✅ | Wajib | 2 hari |
| A15.3 | API generate tagihan massal | 🔴 | ✅ | Wajib | 2 hari |
| A15.4 | Halaman tagihan | 🔴 | ✅ | Wajib | 2 hari |
| A15.5 | Filter tagihan (kelas, status, periode) | 🔴 | ✅ | Wajib | 1 hari |
| A15.6 | Export tagihan | 🟡 | ✅ | Wajib | 0.5 hari |

**Subtotal:** 6 task, estimasi 8.5 hari (Status: 6/6 ✅ Selesai Penuh)

---

### C. Modul A16: Cicilan

| No | Task | Prioritas | Status | DeepSeek | Estimasi |
|---|---|---|---|---|---|
| A16.1 | Schema cicilan | 🔴 | ✅ | Wajib | 1 hari |
| A16.2 | API skema cicilan | 🔴 | ✅ | Wajib | 2 hari |
| A16.3 | Halaman cicilan | 🔴 | ✅ | Wajib | 2 hari |
| A16.4 | Progress cicilan | 🔴 | ✅ | Wajib | 1 hari |
| A16.5 | Notifikasi jatuh tempo cicilan | 🟡 | ✅ | Wajib | 1 hari |

**Subtotal:** 5 task, estimasi 7 hari (Status: 5/5 ✅ Selesai Penuh)

---

### D. Modul A17: Pembayaran

| No | Task | Prioritas | Status | DeepSeek | Estimasi |
|---|---|---|---|---|---|
| A17.1 | Schema Pembayaran | 🔴 | ✅ | Wajib | 1 hari |
| A17.2 | API catat pembayaran | 🔴 | ✅ | Wajib | 2 hari |
| A17.3 | API verifikasi pembayaran | 🔴 | ✅ | Wajib | 1.5 hari |
| A17.4 | Halaman pembayaran | 🔴 | ✅ | Wajib | 2 hari |
| A17.5 | Upload bukti pembayaran | 🔴 | ✅ | Wajib | 1 hari |
| A17.6 | Metode pembayaran (tunai, transfer, QRIS, VA) | 🔴 | ✅ | Wajib | 1 hari |
| A17.7 | Cetak kwitansi | 🟡 | ✅ | Wajib | 1 hari |

**Subtotal:** 7 task, estimasi 9.5 hari (Status: 7/7 ✅ Selesai Penuh)

---

### E. Modul A18: Tunggakan & Riwayat

| No | Task | Prioritas | Status | DeepSeek | Estimasi |
|---|---|---|---|---|---|
| A18.1 | API tunggakan | 🔴 | ✅ | Wajib | 1.5 hari |
| A18.2 | API riwayat pembayaran | 🔴 | ✅ | Wajib | 1 hari |
| A18.3 | Halaman tunggakan | 🔴 | ✅ | Wajib | 2 hari |
| A18.4 | Halaman riwayat pembayaran | 🔴 | ✅ | Wajib | 1.5 hari |
| A18.5 | Notifikasi tunggakan | 🟡 | ✅ | Wajib | 1 hari |

**Subtotal:** 5 task, estimasi 7 hari (Status: 5/5 ✅ Selesai Penuh)

---

**FASE 3 TOTAL:** 27 task, estimasi ±36.5 hari (Status: 27/27 ✅ Selesai Penuh)

---

`;

const startIdx = content.indexOf('### A. Modul A14: Jenis Tagihan');
const endIdx = content.indexOf('## 🖨️ FASE 4: Bank Soal Siap Cetak');

if (startIdx !== -1 && endIdx !== -1) {
  const updated = content.slice(0, startIdx) + targetPhase3 + content.slice(endIdx);
  fs.writeFileSync(tasksFile, updated, 'utf8');
  console.log('Successfully updated Phase 3 in TASKS.md');
} else {
  console.error('Could not find boundaries', { startIdx, endIdx });
}
