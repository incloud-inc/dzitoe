'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  GraduationCap,
  UserCheck,
  AlertCircle,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Sparkles,
  Users,
  Calendar,
  Search,
  Check,
  X,
  AlertTriangle,
  ChevronRight,
  Clock,
  CheckSquare,
  UserX,
  Filter,
  CheckCheck,
} from 'lucide-react';
import { DashboardShell } from '@/components/dashboard-shell';
import { cn } from '@/lib/utils';
import type {
  PromotionDirectMapping,
  PromotionException,
  PromotionConfig,
  PromotionPreviewResult,
  TindakanKelas12TidakLulus,
  StudentPromotionMapping,
} from '@dzitoe/db';

export default function PromotionWizardPage() {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [executing, setExecuting] = useState<boolean>(false);
  const [rollingBack, setRollingBack] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  // Status data from API
  const [statusData, setStatusData] = useState<any>(null);

  // Step 1: Kelas 12 Graduation configuration
  const [luluskanKelas12, setLuluskanKelas12] = useState<boolean>(true);
  const [tindakanKelas12, setTindakanKelas12] = useState<TindakanKelas12TidakLulus>('TUNDA_SEMUA');
  const [siswaKelas12LulusIds, setSiswaKelas12LulusIds] = useState<string[]>([]);
  const [searchMurid12, setSearchMurid12] = useState<string>('');
  const [selectedRombel12Filter, setSelectedRombel12Filter] = useState<string>('ALL');

  // Step 2: Per-Student Promotion Mapping (Pemetaan Kelas Siswa / Peminatan)
  const [pemetaanSiswa, setPemetaanSiswa] = useState<StudentPromotionMapping[]>([]);
  const [selectedMappingTingkat, setSelectedMappingTingkat] = useState<'X' | 'XI'>('X');
  const [selectedSourceClassId, setSelectedSourceClassId] = useState<string>('ALL');
  const [searchStudentMapping, setSearchStudentMapping] = useState<string>('');
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
  const [bulkTargetClassId, setBulkTargetClassId] = useState<string>('');

  // Fallback legacy direct mapping & exceptions (Step 3)
  const [pemetaanJalurCepat, setPemetaanJalurCepat] = useState<PromotionDirectMapping[]>([]);
  const [pengecualian, setPengecualian] = useState<PromotionException[]>([]);

  // Exception search & selection (Step 3)
  const [searchStudent, setSearchStudent] = useState<string>('');
  const [allStudentsList, setAllStudentsList] = useState<any[]>([]);

  // Preview result (Dry Run - Step 4)
  const [previewResult, setPreviewResult] = useState<PromotionPreviewResult | null>(null);
  const [previewLoading, setPreviewLoading] = useState<boolean>(false);

  // Security confirmation input (Step 4)
  const [confirmInput, setConfirmInput] = useState<string>('');
  const [successExecution, setSuccessExecution] = useState<{ success: boolean; message: string; snapshotId: string } | null>(null);

  // Toast Helper
  const showToast = (text: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 5000);
  };

  // Fetch initial status and student list
  const loadInitialData = async () => {
    try {
      setLoading(true);
      const [resStatus, resMurid] = await Promise.all([
        fetch('/api/kenaikan-kelas/status'),
        fetch('/api/murid?limit=1500'),
      ]);

      const jsonStatus = await resStatus.json();
      const jsonMurid = await resMurid.json();

      if (jsonStatus.success && jsonStatus.data) {
        setStatusData(jsonStatus.data);
        setPemetaanJalurCepat(jsonStatus.data.defaultMappings || []);
        if (
          jsonStatus.data.defaultStudentMappings &&
          Array.isArray(jsonStatus.data.defaultStudentMappings) &&
          jsonStatus.data.defaultStudentMappings.length > 0
        ) {
          setPemetaanSiswa(jsonStatus.data.defaultStudentMappings);
        }
      }

      if (jsonMurid.success && Array.isArray(jsonMurid.data)) {
        setAllStudentsList(jsonMurid.data);
        // Default: populate all kelas 12 students into selective pool
        const kls12 = jsonMurid.data.filter((s: any) => s.kelasNama?.toUpperCase().startsWith('XII'));
        setSiswaKelas12LulusIds(kls12.map((s: any) => s.id));

        // If defaultStudentMappings was not provided by API status, construct fallback from jsonMurid
        if (
          (!jsonStatus.data?.defaultStudentMappings || jsonStatus.data.defaultStudentMappings.length === 0) &&
          jsonStatus.data?.allClasses
        ) {
          const defaultStudents: StudentPromotionMapping[] = [];
          const klsXI = jsonStatus.data.allClasses.filter((c: any) => c.tingkat === 'XI');
          const klsXII = jsonStatus.data.allClasses.filter((c: any) => c.tingkat === 'XII');

          jsonMurid.data.forEach((s: any) => {
            const isX = s.kelasNama?.toUpperCase().startsWith('X.') || s.kelasNama?.toUpperCase().startsWith('X ');
            const isXI = s.kelasNama?.toUpperCase().startsWith('XI.') || s.kelasNama?.toUpperCase().startsWith('XI ');
            if (isX) {
              const suffix = s.kelasNama.replace(/^X[.\s]*/i, '');
              const matchedXI = klsXI.find((xi: any) => xi.nama.replace(/^XI[.\s]*/i, '') === suffix) || klsXI[0];
              if (matchedXI) {
                defaultStudents.push({
                  muridId: s.id,
                  muridNama: s.nama,
                  nis: s.nis || '-',
                  kelasAsalId: s.kelasId,
                  kelasAsalNama: s.kelasNama,
                  tingkatAsal: 'X',
                  keKelasId: matchedXI.id,
                  keKelasNama: matchedXI.nama,
                  tingkatTujuan: 'XI',
                });
              }
            } else if (isXI) {
              const suffix = s.kelasNama.replace(/^XI[.\s]*/i, '');
              const matchedXII = klsXII.find((xii: any) => xii.nama.replace(/^XII[.\s]*/i, '') === suffix) || klsXII[0];
              if (matchedXII) {
                defaultStudents.push({
                  muridId: s.id,
                  muridNama: s.nama,
                  nis: s.nis || '-',
                  kelasAsalId: s.kelasId,
                  kelasAsalNama: s.kelasNama,
                  tingkatAsal: 'XI',
                  keKelasId: matchedXII.id,
                  keKelasNama: matchedXII.nama,
                  tingkatTujuan: 'XII',
                });
              }
            }
          });
          setPemetaanSiswa(defaultStudents);
        }
      }
    } catch (err: any) {
      showToast('Gagal memuat status kenaikan kelas: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  // Filtered Grade 12 students list
  const studentsKelas12 = useMemo(() => {
    return allStudentsList.filter((s) => s.kelasNama?.toUpperCase().startsWith('XII'));
  }, [allStudentsList]);

  const filteredKelas12Students = useMemo(() => {
    let list = studentsKelas12;
    if (selectedRombel12Filter !== 'ALL') {
      list = list.filter((s) => s.kelasId === selectedRombel12Filter || s.kelasNama === selectedRombel12Filter);
    }
    if (searchMurid12.trim()) {
      const q = searchMurid12.toLowerCase().trim();
      list = list.filter(
        (s) =>
          s.nama.toLowerCase().includes(q) ||
          s.nis?.toLowerCase().includes(q) ||
          s.kelasNama?.toLowerCase().includes(q)
      );
    }
    return list;
  }, [studentsKelas12, selectedRombel12Filter, searchMurid12]);

  // Toggle individual student graduation in selective mode
  const handleToggleStudentGraduation = (id: string) => {
    setSiswaKelas12LulusIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Bulk toggle for current filtered grade 12 list
  const handleSelectAllCurrentFilter12 = () => {
    const currentIds = filteredKelas12Students.map((s) => s.id);
    setSiswaKelas12LulusIds((prev) => Array.from(new Set([...prev, ...currentIds])));
    showToast(`Menandai ${currentIds.length} murid kelas XII sebagai Lulus.`, 'info');
  };

  const handleDeselectAllCurrentFilter12 = () => {
    const currentIdSet = new Set(filteredKelas12Students.map((s) => s.id));
    setSiswaKelas12LulusIds((prev) => prev.filter((id) => !currentIdSet.has(id)));
    showToast('Membatalkan tanda lulus untuk rombel/filter terpilih.', 'info');
  };

  // Step 2: Classes in currently active level (Source: X or XI)
  const sourceClassesInActiveLevel = useMemo(() => {
    if (!statusData?.allClasses) return [];
    return statusData.allClasses.filter((c: any) => c.tingkat === selectedMappingTingkat);
  }, [statusData, selectedMappingTingkat]);

  // Step 2: Target destination classes (Target: XI or XII)
  const targetClassesInActiveLevel = useMemo(() => {
    if (!statusData?.allClasses) return [];
    const targetLevel = selectedMappingTingkat === 'X' ? 'XI' : 'XII';
    return statusData.allClasses.filter((c: any) => c.tingkat === targetLevel);
  }, [statusData, selectedMappingTingkat]);

  // Set default bulkTargetClassId when target classes change
  useEffect(() => {
    if (targetClassesInActiveLevel.length > 0 && !bulkTargetClassId) {
      setBulkTargetClassId(targetClassesInActiveLevel[0].id);
    }
  }, [targetClassesInActiveLevel, bulkTargetClassId]);

  // Step 2: Real-time Live Capacity Tracker for Target Classes
  const targetClassCapacityTracker = useMemo(() => {
    const tracker: Record<string, { assigned: number; capacity: number; classInfo: any }> = {};
    if (!statusData?.allClasses) return tracker;

    targetClassesInActiveLevel.forEach((tc: any) => {
      tracker[tc.id] = {
        assigned: 0,
        capacity: tc.kapasitas || 36,
        classInfo: tc,
      };
    });

    pemetaanSiswa.forEach((m) => {
      const target = tracker[m.keKelasId];
      if (m.tingkatAsal === selectedMappingTingkat && target) {
        target.assigned += 1;
      }
    });

    return tracker;
  }, [statusData, targetClassesInActiveLevel, pemetaanSiswa, selectedMappingTingkat]);

  // Count of students per source class
  const sourceClassStudentCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    pemetaanSiswa.forEach((m) => {
      if (m.tingkatAsal === selectedMappingTingkat) {
        counts[m.kelasAsalId] = (counts[m.kelasAsalId] || 0) + 1;
        counts[m.kelasAsalNama] = (counts[m.kelasAsalNama] || 0) + 1;
      }
    });
    return counts;
  }, [pemetaanSiswa, selectedMappingTingkat]);

  // Students in active level
  const studentsInActiveLevel = useMemo(() => {
    return pemetaanSiswa.filter((m) => m.tingkatAsal === selectedMappingTingkat);
  }, [pemetaanSiswa, selectedMappingTingkat]);

  // Displayed student mappings filtered by source class and search query
  const displayedStudentMappings = useMemo(() => {
    let list = studentsInActiveLevel;

    if (selectedSourceClassId !== 'ALL') {
      list = list.filter(
        (m) => m.kelasAsalId === selectedSourceClassId || m.kelasAsalNama === selectedSourceClassId
      );
    }

    if (searchStudentMapping.trim()) {
      const q = searchStudentMapping.toLowerCase().trim();
      list = list.filter(
        (m) =>
          m.muridNama.toLowerCase().includes(q) ||
          m.nis.toLowerCase().includes(q) ||
          m.kelasAsalNama.toLowerCase().includes(q) ||
          m.keKelasNama.toLowerCase().includes(q)
      );
    }

    return [...list].sort((a, b) => {
      if (a.kelasAsalNama !== b.kelasAsalNama) {
        const numA = parseInt(a.kelasAsalNama.replace(/\D/g, '') || '0', 10);
        const numB = parseInt(b.kelasAsalNama.replace(/\D/g, '') || '0', 10);
        return numA - numB;
      }
      return a.muridNama.localeCompare(b.muridNama);
    });
  }, [studentsInActiveLevel, selectedSourceClassId, searchStudentMapping]);

  // Update target class mapping per student (1 by 1)
  const handleUpdateStudentTarget = (muridId: string, keKelasId: string) => {
    if (!statusData?.allClasses) return;
    const targetClass = statusData.allClasses.find((c: any) => c.id === keKelasId || c.nama === keKelasId);
    if (!targetClass) return;

    setPemetaanSiswa((prev) =>
      prev.map((item) =>
        item.muridId === muridId
          ? {
              ...item,
              keKelasId: targetClass.id,
              keKelasNama: targetClass.nama,
              tingkatTujuan: targetClass.tingkat,
            }
          : item
      )
    );
  };

  // Toggle selection of student for bulk placement
  const handleToggleSelectStudent = (muridId: string) => {
    setSelectedStudentIds((prev) =>
      prev.includes(muridId) ? prev.filter((id) => id !== muridId) : [...prev, muridId]
    );
  };

  // Select all currently displayed students in table
  const handleSelectAllDisplayed = () => {
    const currentIds = displayedStudentMappings.map((s) => s.muridId);
    setSelectedStudentIds((prev) => Array.from(new Set([...prev, ...currentIds])));
    showToast(`Memilih ${currentIds.length} murid di tampilan saat ini.`, 'info');
  };

  // Deselect all
  const handleDeselectAllDisplayed = () => {
    setSelectedStudentIds([]);
  };

  // Apply bulk placement for selected students
  const handleApplyBulkPlacement = () => {
    if (selectedStudentIds.length === 0) {
      showToast('Pilih setidaknya satu murid terlebih dahulu.', 'info');
      return;
    }
    if (!bulkTargetClassId) {
      showToast('Pilih rombel tujuan terlebih dahulu.', 'info');
      return;
    }
    const targetClass = statusData?.allClasses?.find((c: any) => c.id === bulkTargetClassId);
    if (!targetClass) return;

    const targetIdSet = new Set(selectedStudentIds);
    setPemetaanSiswa((prev) =>
      prev.map((item) =>
        targetIdSet.has(item.muridId)
          ? {
              ...item,
              keKelasId: targetClass.id,
              keKelasNama: targetClass.nama,
              tingkatTujuan: targetClass.tingkat,
            }
          : item
      )
    );

    showToast(
      `Berhasil memetakan ${selectedStudentIds.length} murid terpilih ke kelas ${targetClass.nama}.`,
      'success'
    );
    setSelectedStudentIds([]);
  };

  // Reset to default parallel mapping
  const handleResetToParallel = () => {
    if (!statusData?.allClasses) return;
    const targetLevel = selectedMappingTingkat === 'X' ? 'XI' : 'XII';
    const targetClasses = statusData.allClasses.filter((c: any) => c.tingkat === targetLevel);

    setPemetaanSiswa((prev) =>
      prev.map((m) => {
        if (m.tingkatAsal !== selectedMappingTingkat) return m;
        const suffix = m.kelasAsalNama.replace(/^(X|XI)[.\s]*/i, '');
        const matched =
          targetClasses.find((tc: any) => tc.nama.replace(/^(XI|XII)[.\s]*/i, '') === suffix) ||
          targetClasses[0];
        if (matched) {
          return {
            ...m,
            keKelasId: matched.id,
            keKelasNama: matched.nama,
            tingkatTujuan: matched.tingkat,
          };
        }
        return m;
      })
    );
    showToast(`Pemetaan Tingkat ${selectedMappingTingkat} direset ke paralel standar.`, 'info');
  };

  // Distribute all students in active level evenly round-robin
  const handleDistributeEvenly = () => {
    if (!statusData?.allClasses) return;
    const targetLevel = selectedMappingTingkat === 'X' ? 'XI' : 'XII';
    const targetClasses = statusData.allClasses.filter((c: any) => c.tingkat === targetLevel);
    if (targetClasses.length === 0) return;

    let targetIdx = 0;
    setPemetaanSiswa((prev) =>
      prev.map((m) => {
        if (m.tingkatAsal !== selectedMappingTingkat) return m;
        const assignedTarget = targetClasses[targetIdx % targetClasses.length];
        targetIdx++;
        return {
          ...m,
          keKelasId: assignedTarget.id,
          keKelasNama: assignedTarget.nama,
          tingkatTujuan: assignedTarget.tingkat,
        };
      })
    );
    showToast(
      `Seluruh murid Tingkat ${selectedMappingTingkat} telah didistribusikan merata ke ${targetClasses.length} rombel target.`,
      'success'
    );
  };

  // Add / remove exception in Step 3
  const handleAddException = (student: any, tipe: 'TINGGAL_KELAS' | 'MUTASI') => {
    if (pengecualian.some((e) => e.muridId === student.id)) {
      showToast('Murid sudah ada dalam daftar pengecualian.', 'info');
      return;
    }

    const newException: PromotionException = {
      muridId: student.id,
      muridNama: student.nama,
      nis: student.nis || '-',
      kelasLamaId: student.kelasId,
      kelasLamaNama: student.kelasNama,
      tipe,
      catatan: tipe === 'TINGGAL_KELAS' ? 'Tinggal di rombel asal' : 'Mutasi / pindah sekolah',
    };

    setPengecualian((prev) => [...prev, newException]);
    showToast(`${student.nama} ditandai sebagai ${tipe === 'TINGGAL_KELAS' ? 'Tinggal Kelas' : 'Mutasi'}.`, 'success');
  };

  const handleRemoveException = (muridId: string) => {
    setPengecualian((prev) => prev.filter((e) => e.muridId !== muridId));
  };

  // Trigger Dry Run Preview on entering Step 4
  const runPreviewSimulation = async () => {
    if (!statusData) return;
    try {
      setPreviewLoading(true);
      const config: PromotionConfig = {
        tahunAjaranLama: statusData.tahunAjaranLama,
        tahunAjaranBaru: statusData.tahunAjaranBaru,
        luluskanKelas12,
        tindakanKelas12,
        siswaKelas12LulusIds,
        pemetaanJalurCepat,
        pemetaanSiswa,
        pengecualian,
      };

      const res = await fetch('/api/kenaikan-kelas/preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ config }),
      });

      const json = await res.json();
      if (json.success && json.data) {
        setPreviewResult(json.data);
      } else {
        showToast(json.message || 'Gagal menjalankan simulasi.', 'error');
      }
    } catch (err: any) {
      showToast('Error simulasi: ' + err.message, 'error');
    } finally {
      setPreviewLoading(false);
    }
  };

  // Step navigation helper
  const goToStep = (step: 1 | 2 | 3 | 4) => {
    setCurrentStep(step);
    if (step === 4) {
      runPreviewSimulation();
    }
  };

  // Execute Promotion Handler
  const handleExecutePromotion = async () => {
    if (confirmInput.trim().toUpperCase() !== 'KONFIRMASI') {
      showToast('Harap ketik "KONFIRMASI" untuk melanjutkan eksekusi.', 'error');
      return;
    }

    try {
      setExecuting(true);
      const config: PromotionConfig = {
        tahunAjaranLama: statusData.tahunAjaranLama,
        tahunAjaranBaru: statusData.tahunAjaranBaru,
        luluskanKelas12,
        tindakanKelas12,
        siswaKelas12LulusIds,
        pemetaanJalurCepat,
        pemetaanSiswa,
        pengecualian,
      };

      const res = await fetch('/api/kenaikan-kelas/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ config, executedBy: 'Admin Sekolah (SMAN 20)' }),
      });

      const json = await res.json();
      if (json.success && json.data) {
        setSuccessExecution(json.data);
        showToast('Kenaikan kelas berhasil dieksekusi secara penuh!', 'success');
        loadInitialData();
      } else {
        showToast(json.message || 'Gagal mengeksekusi kenaikan kelas.', 'error');
      }
    } catch (err: any) {
      showToast('Error saat eksekusi: ' + err.message, 'error');
    } finally {
      setExecuting(false);
    }
  };

  // 1-Click Rollback Handler
  const handleRollback = async () => {
    if (!statusData?.lastActiveSnapshot) return;
    const confirmRollback = window.confirm(
      `APAKAH ANDA YAKIN?\n\nSemua perubahan kenaikan kelas ke Tahun Ajaran ${statusData.lastActiveSnapshot.tahunAjaranBaru} akan dibatalkan, dan data murid akan dipulihkan ke Snapshot ${statusData.lastActiveSnapshot.tahunAjaranLama}.`
    );
    if (!confirmRollback) return;

    try {
      setRollingBack(true);
      const res = await fetch('/api/kenaikan-kelas/rollback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          snapshotId: statusData.lastActiveSnapshot.id,
          revertedBy: 'Admin Sekolah (Rollback Darurat)',
        }),
      });

      const json = await res.json();
      if (json.success) {
        showToast(json.data?.message || 'Rollback kenaikan kelas berhasil.', 'success');
        setSuccessExecution(null);
        setConfirmInput('');
        loadInitialData();
      } else {
        showToast(json.message || 'Gagal melakukan rollback.', 'error');
      }
    } catch (err: any) {
      showToast('Error rollback: ' + err.message, 'error');
    } finally {
      setRollingBack(false);
    }
  };

  // Filter students for Step 3 exception search
  const filteredStudents = useMemo(() => {
    if (!searchStudent.trim()) return [];
    const q = searchStudent.toLowerCase().trim();
    return allStudentsList
      .filter(
        (s) =>
          s.nama.toLowerCase().includes(q) ||
          s.nis?.toLowerCase().includes(q) ||
          s.kelasNama?.toLowerCase().includes(q)
      )
      .slice(0, 8);
  }, [allStudentsList, searchStudent]);

  return (
    <DashboardShell>
      <div className="space-y-6 pb-20">
        {/* Toast Notification */}
        {toastMessage && (
          <div
            className={cn(
              'fixed top-5 right-5 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl text-sm font-medium border backdrop-blur-md transition-all animate-in slide-in-from-top-4',
              toastMessage.type === 'success' && 'bg-emerald-50/90 text-emerald-800 border-emerald-200 dark:bg-emerald-950/80 dark:text-emerald-200 dark:border-emerald-800',
              toastMessage.type === 'error' && 'bg-rose-50/90 text-rose-800 border-rose-200 dark:bg-rose-950/80 dark:text-rose-200 dark:border-rose-800',
              toastMessage.type === 'info' && 'bg-sky-50/90 text-sky-800 border-sky-200 dark:bg-sky-950/80 dark:text-sky-200 dark:border-sky-800'
            )}
          >
            {toastMessage.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />}
            {toastMessage.type === 'error' && <AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-400" />}
            {toastMessage.type === 'info' && <Sparkles className="w-5 h-5 text-sky-600 dark:text-sky-400" />}
            <span>{toastMessage.text}</span>
          </div>
        )}

        {/* Top Header & Breadcrumb */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/60 pb-5">
          <div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
              <Link href="/murid" className="hover:text-primary transition-colors">
                Manajemen Murid
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/60" />
              <span className="font-semibold text-foreground">Wisaya Kenaikan Kelas</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-primary flex items-center justify-center text-white shadow-md shadow-primary/20">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
                  Wisaya Kenaikan Kelas (Smart Promotion Wizard)
                  <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-primary/10 text-primary border border-primary/20">
                    Mode Pro
                  </span>
                </h1>
                <p className="text-xs md:text-sm text-muted-foreground">
                  Proses otomatisasi perpindahan rombel dan kelulusan tahun ajaran SMAN 20 Kabupaten Tangerang.
                </p>
              </div>
            </div>
          </div>

          {/* Academic Year Badge & Rollback Action */}
          <div className="flex items-center gap-3">
            <div className="bg-card border rounded-xl px-3 py-2 shadow-sm flex items-center gap-3 text-xs">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Calendar className="w-4 h-4 text-primary" />
                <span>Tahun Ajaran:</span>
              </div>
              <div className="flex items-center gap-1.5 font-bold text-foreground">
                <span className="px-2 py-0.5 rounded bg-muted">
                  {statusData?.tahunAjaranLama || '2025/2026'}
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-primary" />
                <span className="px-2 py-0.5 rounded bg-primary/15 text-primary border border-primary/25">
                  {statusData?.tahunAjaranBaru || '2026/2027'}
                </span>
              </div>
            </div>

            {statusData?.lastActiveSnapshot && (
              <button
                type="button"
                onClick={handleRollback}
                disabled={rollingBack}
                title="Batalkan kenaikan kelas terakhir dan kembalikan data murid ke snapshot sebelumnya"
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/30 hover:bg-amber-500/20 active:scale-[0.98] transition-all shadow-sm"
              >
                <RotateCcw className={cn('w-3.5 h-3.5', rollingBack && 'animate-spin')} />
                <span>{rollingBack ? 'Memulihkan...' : 'Batalkan (Rollback)'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Loading Indicator */}
        {loading && (
          <div className="bg-card border rounded-2xl p-6 shadow-sm flex items-center justify-center gap-3 text-xs font-semibold text-muted-foreground animate-pulse">
            <div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
            <span>Memuat status kenaikan kelas dan data 30 rombel SMAN 20...</span>
          </div>
        )}

        {/* Stepper Progress Bar */}
        <div className="bg-card border rounded-2xl p-4 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            {/* Step 1 */}
            <button
              type="button"
              onClick={() => goToStep(1)}
              className={cn(
                'flex items-center gap-3 p-3 rounded-xl border text-left transition-all active:scale-[0.98]',
                currentStep === 1
                  ? 'bg-primary/10 border-primary shadow-sm text-primary ring-1 ring-primary/20'
                  : currentStep > 1
                  ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-700 dark:text-emerald-400 hover:bg-muted/60'
                  : 'bg-muted/30 border-transparent text-muted-foreground hover:bg-muted/60'
              )}
            >
              <div
                className={cn(
                  'w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0',
                  currentStep === 1
                    ? 'bg-primary text-primary-foreground'
                    : currentStep > 1
                    ? 'bg-emerald-500 text-white'
                    : 'bg-muted text-muted-foreground'
                )}
              >
                {currentStep > 1 ? <Check className="w-4 h-4" /> : '1'}
              </div>
              <div className="min-w-0">
                <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Langkah 1</div>
                <div className="text-xs md:text-sm font-bold truncate">Kelulusan Kelas XII</div>
              </div>
            </button>

            {/* Step 2 */}
            <button
              type="button"
              onClick={() => goToStep(2)}
              className={cn(
                'flex items-center gap-3 p-3 rounded-xl border text-left transition-all active:scale-[0.98]',
                currentStep === 2
                  ? 'bg-primary/10 border-primary shadow-sm text-primary ring-1 ring-primary/20'
                  : currentStep > 2
                  ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-700 dark:text-emerald-400 hover:bg-muted/60'
                  : 'bg-muted/30 border-transparent text-muted-foreground hover:bg-muted/60'
              )}
            >
              <div
                className={cn(
                  'w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0',
                  currentStep === 2
                    ? 'bg-primary text-primary-foreground'
                    : currentStep > 2
                    ? 'bg-emerald-500 text-white'
                    : 'bg-muted text-muted-foreground'
                )}
              >
                {currentStep > 2 ? <Check className="w-4 h-4" /> : '2'}
              </div>
              <div className="min-w-0">
                <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Langkah 2</div>
                <div className="text-xs md:text-sm font-bold truncate">Pemetaan Per Murid</div>
              </div>
            </button>

            {/* Step 3 */}
            <button
              type="button"
              onClick={() => goToStep(3)}
              className={cn(
                'flex items-center gap-3 p-3 rounded-xl border text-left transition-all active:scale-[0.98]',
                currentStep === 3
                  ? 'bg-primary/10 border-primary shadow-sm text-primary ring-1 ring-primary/20'
                  : currentStep > 3
                  ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-700 dark:text-emerald-400 hover:bg-muted/60'
                  : 'bg-muted/30 border-transparent text-muted-foreground hover:bg-muted/60'
              )}
            >
              <div
                className={cn(
                  'w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0',
                  currentStep === 3
                    ? 'bg-primary text-primary-foreground'
                    : currentStep > 3
                    ? 'bg-emerald-500 text-white'
                    : 'bg-muted text-muted-foreground'
                )}
              >
                {currentStep > 3 ? <Check className="w-4 h-4" /> : '3'}
              </div>
              <div className="min-w-0">
                <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Langkah 3</div>
                <div className="text-xs md:text-sm font-bold truncate">Pengecualian Murid</div>
              </div>
            </button>

            {/* Step 4 */}
            <button
              type="button"
              onClick={() => goToStep(4)}
              className={cn(
                'flex items-center gap-3 p-3 rounded-xl border text-left transition-all active:scale-[0.98]',
                currentStep === 4
                  ? 'bg-primary/10 border-primary shadow-sm text-primary ring-1 ring-primary/20'
                  : 'bg-muted/30 border-transparent text-muted-foreground hover:bg-muted/60'
              )}
            >
              <div
                className={cn(
                  'w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0',
                  currentStep === 4 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                )}
              >
                4
              </div>
              <div className="min-w-0">
                <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Langkah 4</div>
                <div className="text-xs md:text-sm font-bold truncate">Simulasi & Eksekusi</div>
              </div>
            </button>
          </div>
        </div>

        {/* STEP 1: KELULUSAN KELAS XII & TINDAKAN OPSIONAL */}
        {currentStep === 1 && (
          <div className="space-y-6 animate-in fade-in-50 duration-200">
            <div className="bg-card border rounded-2xl p-6 shadow-sm space-y-6">
              {/* Header with Switch */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-5">
                <div>
                  <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-indigo-500" />
                    Kelulusan Tingkat Akhir (Kelas XII)
                  </h2>
                  <p className="text-xs md:text-sm text-muted-foreground mt-0.5">
                    Pengelolaan status kelulusan murid angkatan akhir dan penentuan tindakan jika kelulusan tidak otomatis.
                  </p>
                </div>

                {/* Primary Master Switch */}
                <div
                  onClick={() => setLuluskanKelas12(!luluskanKelas12)}
                  className={cn(
                    'flex items-center gap-3 p-3 rounded-xl border cursor-pointer select-none transition-all shadow-sm active:scale-[0.98]',
                    luluskanKelas12
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-800 dark:text-emerald-300'
                      : 'bg-muted/60 border-border text-foreground hover:bg-muted'
                  )}
                >
                  <div
                    className={cn(
                      'w-10 h-6 rounded-full p-1 transition-colors relative',
                      luluskanKelas12 ? 'bg-emerald-600' : 'bg-muted-foreground/30'
                    )}
                  >
                    <div
                      className={cn(
                        'w-4 h-4 rounded-full bg-white transition-transform',
                        luluskanKelas12 ? 'translate-x-4' : 'translate-x-0'
                      )}
                    />
                  </div>
                  <div className="text-xs">
                    <div className="font-bold">Luluskan Semua Siswa Kelas XII Secara Otomatis</div>
                    <div className="text-[11px] opacity-75">
                      {luluskanKelas12 ? 'Aktif (Seluruh kelas XII jadi Alumni)' : 'Non-aktif (Pilih Tindakan Opsional)'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats Cards Tingkat XII */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl border bg-gradient-to-br from-indigo-500/10 via-background to-background">
                  <div className="text-xs font-medium text-muted-foreground">Total Rombel Kelas XII</div>
                  <div className="text-2xl font-bold text-foreground mt-1">
                    {statusData?.tingkatStats?.XII?.jumlahKelas || 10} Rombel
                  </div>
                  <div className="text-[11px] text-muted-foreground mt-1">XII.1 s/d XII.10</div>
                </div>

                <div className="p-4 rounded-xl border bg-gradient-to-br from-emerald-500/10 via-background to-background">
                  <div className="text-xs font-medium text-muted-foreground">Total Murid Kelas XII</div>
                  <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                    {studentsKelas12.length} Murid
                  </div>
                  <div className="text-[11px] text-muted-foreground mt-1">
                    {luluskanKelas12
                      ? 'Semua akan lulus'
                      : tindakanKelas12 === 'PILIH_SELEKTIF'
                      ? `${siswaKelas12LulusIds.length} murid dipilih lulus`
                      : tindakanKelas12 === 'TUNDA_SEMUA'
                      ? 'Semua ditunda di kelas XII'
                      : 'Dialihkan ke Mutasi'}
                  </div>
                </div>

                <div className="p-4 rounded-xl border bg-gradient-to-br from-primary/10 via-background to-background">
                  <div className="text-xs font-medium text-muted-foreground">Integritas Data Riwayat</div>
                  <div className="text-sm font-semibold text-foreground mt-1 flex items-center gap-1.5 text-primary">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Dicatat ke RiwayatKelas</span>
                  </div>
                  <div className="text-[11px] text-muted-foreground mt-1">
                    Histori kelas dan absensi masa lalu tetap aman.
                  </div>
                </div>
              </div>

              {/* JIKA UNCHECK: PILIHAN TINDAKAN OPSIONAL */}
              {!luluskanKelas12 && (
                <div className="space-y-4 pt-2 border-t animate-in fade-in-50 duration-300">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-500" />
                    <h3 className="text-sm font-bold text-foreground">
                      Pilihan Tindakan Opsional untuk Tingkat XII:
                    </h3>
                    <span className="text-xs text-muted-foreground">
                      (Tentukan kebijakan bagi murid kelas XII yang tidak diluluskan otomatis)
                    </span>
                  </div>

                  {/* 3 Radio Action Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Opsi 1: Tunda Semua */}
                    <div
                      onClick={() => setTindakanKelas12('TUNDA_SEMUA')}
                      className={cn(
                        'p-4 rounded-xl border cursor-pointer transition-all select-none relative active:scale-[0.98]',
                        tindakanKelas12 === 'TUNDA_SEMUA'
                          ? 'bg-amber-500/10 border-amber-500 ring-2 ring-amber-500/20 shadow-sm'
                          : 'bg-card hover:bg-muted/40 border-border'
                      )}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-amber-500/15 text-amber-600 flex items-center justify-center">
                            <Clock className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-foreground">Tunda Kelulusan Semua</div>
                            <div className="text-[10px] text-muted-foreground">Tetap di Rombel XII</div>
                          </div>
                        </div>
                        <input
                          type="radio"
                          name="tindakanKelas12"
                          checked={tindakanKelas12 === 'TUNDA_SEMUA'}
                          onChange={() => setTindakanKelas12('TUNDA_SEMUA')}
                          className="w-4 h-4 text-amber-600 focus:ring-amber-500 mt-1"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mt-3 leading-relaxed">
                        Seluruh murid kelas XII tetap berstatus AKTIF dan bertahan di rombel XII lamanya (misal menunggu pengumuman resmi dinas).
                      </p>
                    </div>

                    {/* Opsi 2: Kelulusan Selektif */}
                    <div
                      onClick={() => setTindakanKelas12('PILIH_SELEKTIF')}
                      className={cn(
                        'p-4 rounded-xl border cursor-pointer transition-all select-none relative active:scale-[0.98]',
                        tindakanKelas12 === 'PILIH_SELEKTIF'
                          ? 'bg-indigo-500/10 border-indigo-500 ring-2 ring-indigo-500/20 shadow-sm'
                          : 'bg-card hover:bg-muted/40 border-border'
                      )}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-indigo-500/15 text-indigo-600 flex items-center justify-center">
                            <CheckSquare className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-foreground">Kelulusan Selektif</div>
                            <div className="text-[10px] text-muted-foreground">Pilih Rombel / Murid</div>
                          </div>
                        </div>
                        <input
                          type="radio"
                          name="tindakanKelas12"
                          checked={tindakanKelas12 === 'PILIH_SELEKTIF'}
                          onChange={() => setTindakanKelas12('PILIH_SELEKTIF')}
                          className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 mt-1"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mt-3 leading-relaxed">
                        Centang murid atau rombel XII tertentu yang memenuhi kriteria kelulusan. Siswa yang tidak dicentang otomatis ditunda di kelas XII.
                      </p>
                    </div>

                    {/* Opsi 3: Mutasi Massal */}
                    <div
                      onClick={() => setTindakanKelas12('MUTASI_MASSAL')}
                      className={cn(
                        'p-4 rounded-xl border cursor-pointer transition-all select-none relative active:scale-[0.98]',
                        tindakanKelas12 === 'MUTASI_MASSAL'
                          ? 'bg-rose-500/10 border-rose-500 ring-2 ring-rose-500/20 shadow-sm'
                          : 'bg-card hover:bg-muted/40 border-border'
                      )}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-rose-500/15 text-rose-600 flex items-center justify-center">
                            <UserX className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-foreground">Alihkan ke Mutasi Keluar</div>
                            <div className="text-[10px] text-muted-foreground">Tidak Melanjutkan</div>
                          </div>
                        </div>
                        <input
                          type="radio"
                          name="tindakanKelas12"
                          checked={tindakanKelas12 === 'MUTASI_MASSAL'}
                          onChange={() => setTindakanKelas12('MUTASI_MASSAL')}
                          className="w-4 h-4 text-rose-600 focus:ring-rose-500 mt-1"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mt-3 leading-relaxed">
                        Seluruh murid kelas XII dialihkan ke status MUTASI (keluar/drop-out) jika angkatan ini tidak menyelesaikan jenjang di SMAN 20.
                      </p>
                    </div>
                  </div>

                  {/* SUB-SECTION JIKA MEMILIH "PILIH_SELEKTIF" */}
                  {tindakanKelas12 === 'PILIH_SELEKTIF' && (
                    <div className="border rounded-2xl p-5 bg-card/90 shadow-sm space-y-4 animate-in fade-in-50 duration-200 mt-4">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b pb-4">
                        <div>
                          <div className="text-sm font-bold text-foreground flex items-center gap-2">
                            <Filter className="w-4 h-4 text-primary" />
                            <span>Daftar Seleksi Kelulusan Murid Kelas XII</span>
                            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                              {siswaKelas12LulusIds.length} / {studentsKelas12.length} Murid Lulus
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            Centang nama siswa yang dinyatakan lulus. Siswa yang tidak dicentang akan berstatus mengulang / tunda di kelas XII.
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={handleSelectAllCurrentFilter12}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                          >
                            <CheckCheck className="w-3.5 h-3.5" />
                            <span>Luluskan Semua di Filter Ini</span>
                          </button>
                          <button
                            type="button"
                            onClick={handleDeselectAllCurrentFilter12}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-muted hover:bg-muted/80 text-foreground transition-colors"
                          >
                            <X className="w-3.5 h-3.5" />
                            <span>Batal Semua</span>
                          </button>
                        </div>
                      </div>

                      {/* Filters: Rombel Pills & Search */}
                      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                        {/* Rombel Tabs */}
                        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1">
                          <button
                            type="button"
                            onClick={() => setSelectedRombel12Filter('ALL')}
                            className={cn(
                              'px-3 py-1 rounded-lg text-xs font-semibold shrink-0 transition-colors',
                              selectedRombel12Filter === 'ALL'
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted text-muted-foreground hover:bg-muted/80'
                            )}
                          >
                            Semua ({studentsKelas12.length})
                          </button>
                          {statusData?.allClasses
                            ?.filter((c: any) => c.tingkat === 'XII')
                            .map((c: any) => {
                              const countInRombel = studentsKelas12.filter((s) => s.kelasId === c.id || s.kelasNama === c.nama).length;
                              return (
                                <button
                                  key={c.id}
                                  type="button"
                                  onClick={() => setSelectedRombel12Filter(c.id)}
                                  className={cn(
                                    'px-2.5 py-1 rounded-lg text-xs font-semibold shrink-0 transition-colors',
                                    selectedRombel12Filter === c.id
                                      ? 'bg-primary text-primary-foreground'
                                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                                  )}
                                >
                                  {c.nama} ({countInRombel})
                                </button>
                              );
                            })}
                        </div>

                        {/* Search Input */}
                        <div className="relative w-full sm:w-64 shrink-0">
                          <Search className="w-3.5 h-3.5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            value={searchMurid12}
                            onChange={(e) => setSearchMurid12(e.target.value)}
                            placeholder="Cari nama / NIS murid XII..."
                            className="w-full pl-8 pr-3 py-1.5 text-xs bg-background border rounded-lg focus:ring-1 focus:ring-primary focus:outline-none"
                          />
                        </div>
                      </div>

                      {/* Checklist Table */}
                      <div className="border rounded-xl overflow-hidden max-h-64 overflow-y-auto bg-card shadow-xs">
                        <table className="w-full text-xs text-left">
                          <thead className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-bold border-b border-slate-200 dark:border-slate-700 sticky top-0 z-10 shadow-xs">
                            <tr>
                              <th className="py-2.5 px-3 w-10 text-center">Status</th>
                              <th className="py-2.5 px-3">Nama Murid</th>
                              <th className="py-2.5 px-3">NIS</th>
                              <th className="py-2.5 px-3">Kelas Asal</th>
                              <th className="py-2.5 px-3 text-right">Keputusan</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y">
                            {filteredKelas12Students.map((s) => {
                              const isGraduating = siswaKelas12LulusIds.includes(s.id);
                              return (
                                <tr
                                  key={s.id}
                                  onClick={() => handleToggleStudentGraduation(s.id)}
                                  className={cn(
                                    'hover:bg-muted/30 cursor-pointer select-none transition-colors',
                                    isGraduating ? 'bg-emerald-500/5' : ''
                                  )}
                                >
                                  <td className="py-2 px-3 text-center">
                                    <input
                                      type="checkbox"
                                      checked={isGraduating}
                                      onChange={() => handleToggleStudentGraduation(s.id)}
                                      className="w-4 h-4 rounded text-primary focus:ring-primary border-gray-300"
                                    />
                                  </td>
                                  <td className="py-2 px-3 font-semibold text-foreground">{s.nama}</td>
                                  <td className="py-2 px-3 text-muted-foreground font-mono">{s.nis || '-'}</td>
                                  <td className="py-2 px-3 text-muted-foreground">{s.kelasNama}</td>
                                  <td className="py-2 px-3 text-right">
                                    <span
                                      className={cn(
                                        'px-2 py-0.5 rounded text-[10px] font-bold border',
                                        isGraduating
                                          ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30'
                                          : 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30'
                                      )}
                                    >
                                      {isGraduating ? 'Dinyatakan Lulus' : 'Ditunda / Mengulang'}
                                    </span>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Navigation Action */}
              <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => goToStep(2)}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs md:text-sm font-bold bg-gradient-to-r from-brand-900 via-brand-800 to-emerald-700 text-white hover:brightness-110 active:scale-95 transition-all shadow-md shadow-brand-900/20 border border-emerald-600/30 cursor-pointer"
                >
                  <span>Lanjut ke Pemetaan Kelas</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: PEMETAAN PER SISWA / MURID (PENJURUSAN & PEMINATAN) */}
        {currentStep === 2 && (
          <div className="space-y-6 animate-in fade-in-50 duration-200">
            <div className="bg-card border rounded-2xl p-6 shadow-sm space-y-6">
              {/* Header Step 2 */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b pb-5">
                <div>
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-brand-50 text-brand-900 border border-brand-200 dark:bg-brand-950/60 dark:text-emerald-300 dark:border-brand-800">
                      <Users className="w-3.5 h-3.5 text-brand-700 dark:text-emerald-400" />
                      Kurikulum Merdeka: Fase E ➔ Fase F (Peminatan)
                    </span>
                    <span className="text-xs text-muted-foreground">•</span>
                    <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                      Tahun Ajaran {statusData?.tahunAjaranBaru || '2026/2027'}
                    </span>
                    <span className="text-xs text-muted-foreground">•</span>
                    <span className="text-xs font-medium text-muted-foreground">
                      Total {studentsInActiveLevel.length} Murid Tingkat {selectedMappingTingkat}
                    </span>
                  </div>
                  <h2 className="text-xl font-black text-foreground tracking-tight flex items-center gap-2">
                    Pemetaan Rombel Kenaikan Kelas (Per Siswa / Murid)
                  </h2>
                  <p className="text-xs md:text-sm text-muted-foreground mt-0.5 max-w-4xl">
                    Setiap murid di kelas X akan berpencar ke berbagai rombel kelas XI sesuai mata pelajaran pilihan / peminatan. Anda dapat memetakan rombel tujuan setiap siswa satu per satu, atau memilih murid sekaligus untuk pemetaan rombongan.
                  </p>
                </div>

                {/* Quick Presets Utility Buttons */}
                <div className="flex items-center gap-2 shrink-0 flex-wrap">
                  <button
                    type="button"
                    onClick={handleResetToParallel}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 shadow-2xs active:scale-[0.98] transition-all cursor-pointer"
                    title="Kembalikan formasi ke paralel standar (X.1 ➔ XI.1, dll)"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Reset Paralel Standar</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleDistributeEvenly}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 text-emerald-800 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-700 shadow-2xs active:scale-[0.98] transition-all cursor-pointer"
                    title="Distribusikan murid secara merata ke seluruh rombel tujuan"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Distribusi Bagi Rata</span>
                  </button>
                </div>
              </div>

              {/* Tingkat Selection Tabs (Fase E vs Fase F Lanjutan) */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-muted/20 p-2 rounded-2xl border">
                <div className="flex items-center gap-2 overflow-x-auto">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedMappingTingkat('X');
                      setSelectedSourceClassId('ALL');
                      setSelectedStudentIds([]);
                    }}
                    className={cn(
                      'px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-2',
                      selectedMappingTingkat === 'X'
                        ? 'bg-brand-900 text-white shadow-sm ring-1 ring-emerald-500/50'
                        : 'bg-white dark:bg-slate-800 text-muted-foreground hover:text-foreground border'
                    )}
                  >
                    <span
                      className={cn(
                        'w-2 h-2 rounded-full',
                        selectedMappingTingkat === 'X' ? 'bg-emerald-400' : 'bg-slate-400'
                      )}
                    />
                    <span>Tingkat X ➔ XI (Fase E ke Fase F - Penjurusan Peminatan)</span>
                    <span
                      className={cn(
                        'px-2 py-0.5 rounded-full text-[10px] font-mono',
                        selectedMappingTingkat === 'X'
                          ? 'bg-emerald-500/30 text-emerald-200'
                          : 'bg-muted text-muted-foreground'
                      )}
                    >
                      {pemetaanSiswa.filter((m) => m.tingkatAsal === 'X').length} Murid
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedMappingTingkat('XI');
                      setSelectedSourceClassId('ALL');
                      setSelectedStudentIds([]);
                    }}
                    className={cn(
                      'px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-2',
                      selectedMappingTingkat === 'XI'
                        ? 'bg-indigo-900 text-white shadow-sm ring-1 ring-indigo-500/50'
                        : 'bg-white dark:bg-slate-800 text-muted-foreground hover:text-foreground border'
                    )}
                  >
                    <span
                      className={cn(
                        'w-2 h-2 rounded-full',
                        selectedMappingTingkat === 'XI' ? 'bg-indigo-400' : 'bg-slate-400'
                      )}
                    />
                    <span>Tingkat XI ➔ XII (Fase F Lanjutan)</span>
                    <span
                      className={cn(
                        'px-2 py-0.5 rounded-full text-[10px] font-mono',
                        selectedMappingTingkat === 'XI'
                          ? 'bg-indigo-500/30 text-indigo-200'
                          : 'bg-muted text-muted-foreground'
                      )}
                    >
                      {pemetaanSiswa.filter((m) => m.tingkatAsal === 'XI').length} Murid
                    </span>
                  </button>
                </div>

                <div className="text-[11px] text-muted-foreground text-right px-2 hidden lg:block">
                  Kapasitas Ideal:{' '}
                  <strong className="text-foreground">36 murid / rombel</strong>
                </div>
              </div>

              {/* Target Class Live Capacity Tracker Grid */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold text-foreground flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>
                      Monitor Kapasitas Rombel Tujuan (Tingkat{' '}
                      {selectedMappingTingkat === 'X' ? 'XI' : 'XII'} TA {statusData?.tahunAjaranBaru || '2026/2027'}):
                    </span>
                  </div>
                  <span className="text-[11px] text-muted-foreground">
                    Terhitung otomatis dari pemetaan murid saat ini
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
                  {targetClassesInActiveLevel.map((tc: any) => {
                    const stats = targetClassCapacityTracker[tc.id] || {
                      assigned: 0,
                      capacity: tc.kapasitas || 36,
                      classInfo: tc,
                    };
                    const percent = Math.min(100, Math.round((stats.assigned / stats.capacity) * 100));
                    const isFull = stats.assigned === stats.capacity;
                    const isOver = stats.assigned > stats.capacity;

                    return (
                      <div
                        key={tc.id}
                        className={cn(
                          'p-3 rounded-xl border transition-all text-xs flex flex-col justify-between shadow-2xs',
                          isOver
                            ? 'bg-rose-50/70 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800'
                            : isFull
                            ? 'bg-blue-50/70 dark:bg-blue-950/40 border-blue-300 dark:border-blue-800'
                            : 'bg-card border-slate-200 dark:border-slate-800 hover:border-emerald-300'
                        )}
                      >
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <span className="font-black text-sm text-foreground font-mono">
                            {tc.nama}
                          </span>
                          <span
                            className={cn(
                              'px-2 py-0.5 rounded-full text-[10px] font-bold',
                              isOver
                                ? 'bg-rose-200 text-rose-900 dark:bg-rose-900/80 dark:text-rose-200'
                                : isFull
                                ? 'bg-blue-200 text-blue-900 dark:bg-blue-900/80 dark:text-blue-200'
                                : 'bg-emerald-100 text-emerald-900 dark:bg-emerald-900/80 dark:text-emerald-200'
                            )}
                          >
                            {isOver
                              ? `+${stats.assigned - stats.capacity} Overload`
                              : isFull
                              ? 'Penuh (36/36)'
                              : `Sisa ${stats.capacity - stats.assigned}`}
                          </span>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden my-1.5">
                          <div
                            className={cn(
                              'h-full transition-all duration-300',
                              isOver ? 'bg-rose-500' : isFull ? 'bg-blue-500' : 'bg-emerald-500'
                            )}
                            style={{ width: `${percent}%` }}
                          />
                        </div>

                        <div className="flex items-center justify-between text-[11px] text-muted-foreground mt-0.5">
                          <span>
                            <strong className="text-foreground">{stats.assigned}</strong> / {stats.capacity} Murid
                          </span>
                          <span className="truncate max-w-[80px] text-[10px]" title={tc.waliKelasNama}>
                            {tc.waliKelasNama ? tc.waliKelasNama.split(' ')[0] : 'Wali -'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Source Class Selector Pills (Rombel Asal) */}
              <div className="space-y-2 pt-2 border-t">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    <Filter className="w-3.5 h-3.5 text-muted-foreground" />
                    <span>Pilih Rombel Asal Siswa:</span>
                  </div>
                  <div className="text-[11px] text-muted-foreground">
                    Klik rombel asal di bawah untuk fokus memetakan siswa kelas tersebut
                  </div>
                </div>

                <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                  <button
                    type="button"
                    onClick={() => setSelectedSourceClassId('ALL')}
                    className={cn(
                      'px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 border',
                      selectedSourceClassId === 'ALL'
                        ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-slate-900 dark:border-white shadow-xs'
                        : 'bg-card text-muted-foreground hover:text-foreground border-slate-200 dark:border-slate-800'
                    )}
                  >
                    Semua Rombel Asal ({studentsInActiveLevel.length})
                  </button>

                  {sourceClassesInActiveLevel.map((sc: any) => {
                    const count = sourceClassStudentCounts[sc.id] || sourceClassStudentCounts[sc.nama] || 0;
                    const isSelected = selectedSourceClassId === sc.id || selectedSourceClassId === sc.nama;
                    return (
                      <button
                        key={sc.id}
                        type="button"
                        onClick={() => setSelectedSourceClassId(sc.id)}
                        className={cn(
                          'px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 border flex items-center gap-1.5',
                          isSelected
                            ? 'bg-brand-50 text-brand-900 dark:bg-emerald-950/80 dark:text-emerald-200 border-brand-800 dark:border-emerald-600 shadow-2xs ring-1 ring-brand-800'
                            : 'bg-card text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-800'
                        )}
                      >
                        <span className="font-mono">{sc.nama}</span>
                        <span
                          className={cn(
                            'px-1.5 py-0.2 rounded-md text-[10px]',
                            isSelected ? 'bg-brand-200/60 dark:bg-emerald-900 text-brand-950 dark:text-emerald-100' : 'bg-muted text-muted-foreground'
                          )}
                        >
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Toolbar: Search, Bulk Placement Bar & Selection */}
              <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 pt-1">
                {/* Search Input */}
                <div className="relative w-full md:w-80">
                  <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchStudentMapping}
                    onChange={(e) => setSearchStudentMapping(e.target.value)}
                    placeholder="Cari nama murid, NIS, atau rombel..."
                    className="w-full pl-9 pr-3 py-2 text-xs bg-background border rounded-xl focus:ring-1 focus:ring-emerald-600 focus:outline-none"
                  />
                  {searchStudentMapping && (
                    <button
                      type="button"
                      onClick={() => setSearchStudentMapping('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Bulk Action Controls */}
                {selectedStudentIds.length > 0 ? (
                  <div className="flex items-center gap-2 p-1.5 px-3 bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-300 dark:border-emerald-700 rounded-xl shadow-xs flex-wrap">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900 dark:text-emerald-200 shrink-0">
                      <CheckCheck className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                      <span>{selectedStudentIds.length} murid dipilih</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground font-medium hidden sm:inline">➔</span>
                      <select
                        value={bulkTargetClassId}
                        onChange={(e) => setBulkTargetClassId(e.target.value)}
                        className="bg-white dark:bg-slate-900 border border-emerald-500 rounded-lg px-2.5 py-1 text-xs font-bold text-foreground focus:outline-none cursor-pointer"
                      >
                        {targetClassesInActiveLevel.map((tc: any) => {
                          const stats = targetClassCapacityTracker[tc.id];
                          return (
                            <option key={tc.id} value={tc.id}>
                              Petakan ke {tc.nama} ({stats?.assigned || 0}/{stats?.capacity || 36})
                            </option>
                          );
                        })}
                      </select>

                      <button
                        type="button"
                        onClick={handleApplyBulkPlacement}
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold bg-gradient-to-r from-brand-900 via-brand-800 to-emerald-700 text-white hover:brightness-110 active:scale-95 transition-all shadow-xs cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Terapkan</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleDeselectAllDisplayed}
                        className="p-1 text-muted-foreground hover:text-foreground rounded-lg"
                        title="Batalkan pilihan"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleSelectAllDisplayed}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 shadow-2xs active:scale-95 transition cursor-pointer"
                    >
                      <CheckSquare className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Pilih Semua di Tampilan ({displayedStudentMappings.length})</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Per-Student Placement Matrix Table */}
              <div className="border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden bg-card shadow-xs">
                <div className="max-h-[560px] overflow-y-auto">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-bold border-b border-slate-200 dark:border-slate-700 sticky top-0 z-10 shadow-xs">
                      <tr>
                        <th className="py-3 px-3 w-10 text-center">
                          <input
                            type="checkbox"
                            checked={
                              displayedStudentMappings.length > 0 &&
                              displayedStudentMappings.every((s) => selectedStudentIds.includes(s.muridId))
                            }
                            onChange={(e) => {
                              if (e.target.checked) {
                                handleSelectAllDisplayed();
                              } else {
                                handleDeselectAllDisplayed();
                              }
                            }}
                            className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                          />
                        </th>
                        <th className="py-3 px-2 w-10 text-center">No</th>
                        <th className="py-3 px-4 min-w-[200px]">Nama Murid & NIS</th>
                        <th className="py-3 px-3 w-36">Kelas Asal</th>
                        <th className="py-3 px-2 w-10 text-center">Aksi</th>
                        <th className="py-3 px-4 w-60">Rombel Tujuan (Dipetakan Per Murid)</th>
                        <th className="py-3 px-4 min-w-[160px]">Target Ruang & Wali Kelas</th>
                        <th className="py-3 px-3 w-36 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                      {displayedStudentMappings.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="py-12 text-center text-muted-foreground">
                            <Users className="w-8 h-8 mx-auto mb-2 opacity-40" />
                            <p className="font-semibold">Tidak ada murid yang cocok dengan filter / pencarian.</p>
                            <p className="text-[11px] mt-0.5">Coba ubah kata kunci atau pilih rombel asal lainnya.</p>
                          </td>
                        </tr>
                      ) : (
                        displayedStudentMappings.map((studentItem, idx) => {
                          const isChecked = selectedStudentIds.includes(studentItem.muridId);
                          const targetClass = statusData?.allClasses?.find(
                            (c: any) => c.id === studentItem.keKelasId || c.nama === studentItem.keKelasNama
                          );
                          const originClass = statusData?.allClasses?.find(
                            (c: any) => c.id === studentItem.kelasAsalId || c.nama === studentItem.kelasAsalNama
                          );

                          // Detect if student is dispersed from the default parallel class
                          const originSuffix = studentItem.kelasAsalNama.replace(/^(X|XI)[.\s]*/i, '');
                          const targetSuffix = studentItem.keKelasNama.replace(/^(XI|XII)[.\s]*/i, '');
                          const isDispersedPeminatan = originSuffix !== targetSuffix;

                          return (
                            <tr
                              key={studentItem.muridId}
                              className={cn(
                                'hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors',
                                isChecked && 'bg-emerald-50/40 dark:bg-emerald-950/20'
                              )}
                            >
                              {/* Checkbox */}
                              <td className="py-3 px-3 text-center">
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={() => handleToggleSelectStudent(studentItem.muridId)}
                                  className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                                />
                              </td>

                              {/* No */}
                              <td className="py-3 px-2 text-center text-muted-foreground font-mono">
                                {idx + 1}
                              </td>

                              {/* Nama Murid & NIS */}
                              <td className="py-3 px-4">
                                <div className="font-bold text-foreground flex items-center gap-2">
                                  <span>{studentItem.muridNama}</span>
                                </div>
                                <div className="text-[11px] text-muted-foreground font-mono mt-0.5">
                                  NIS: {studentItem.nis}
                                </div>
                              </td>

                              {/* Kelas Asal */}
                              <td className="py-3 px-3">
                                <div className="flex items-center gap-1.5">
                                  <span
                                    className={cn(
                                      'px-2 py-0.5 rounded-md font-black text-xs font-mono border',
                                      studentItem.tingkatAsal === 'X'
                                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800'
                                        : 'bg-indigo-50 text-indigo-800 border-indigo-200 dark:bg-indigo-950/60 dark:text-indigo-300 dark:border-indigo-800'
                                    )}
                                  >
                                    {studentItem.kelasAsalNama}
                                  </span>
                                </div>
                                <div className="text-[10px] text-muted-foreground mt-0.5 truncate max-w-[120px]">
                                  {originClass?.waliKelasNama || 'Wali Kelas Asal'}
                                </div>
                              </td>

                              {/* Arah Panah */}
                              <td className="py-3 px-2 text-center">
                                <div className="w-6 h-6 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center mx-auto border border-emerald-200 dark:border-emerald-800">
                                  <ArrowRight className="w-3 h-3" />
                                </div>
                              </td>

                              {/* Dropdown Kelas Tujuan (Dipetakan Per Murid) */}
                              <td className="py-3 px-4">
                                <select
                                  value={studentItem.keKelasId}
                                  onChange={(e) =>
                                    handleUpdateStudentTarget(studentItem.muridId, e.target.value)
                                  }
                                  className={cn(
                                    'w-full bg-white dark:bg-slate-900 border-2 rounded-xl px-3 py-1.5 text-xs font-bold text-foreground focus:ring-2 focus:ring-emerald-500 focus:outline-none transition shadow-2xs cursor-pointer',
                                    isDispersedPeminatan
                                      ? 'border-indigo-500 text-indigo-900 dark:text-indigo-200'
                                      : 'border-emerald-600/40 hover:border-emerald-600'
                                  )}
                                >
                                  {targetClassesInActiveLevel.map((c: any) => {
                                    const stats = targetClassCapacityTracker[c.id];
                                    return (
                                      <option key={c.id} value={c.id}>
                                        {c.nama} ({stats?.assigned || 0}/{stats?.capacity || 36} Murid)
                                      </option>
                                    );
                                  })}
                                </select>
                              </td>

                              {/* Target Ruang & Wali Kelas */}
                              <td className="py-3 px-4">
                                <div className="font-semibold text-emerald-800 dark:text-emerald-300 truncate max-w-[170px]">
                                  {targetClass?.waliKelasNama || 'Wali Kelas Belum Diisi'}
                                </div>
                                <div className="text-[11px] text-muted-foreground mt-0.5">
                                  {targetClass?.ruang || 'Ruang Belajar'}
                                </div>
                              </td>

                              {/* Status */}
                              <td className="py-3 px-3 text-center">
                                {isDispersedPeminatan ? (
                                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-900 border border-indigo-300 dark:bg-indigo-950/70 dark:text-indigo-300 dark:border-indigo-700 shadow-2xs">
                                    <Sparkles className="w-2.5 h-2.5 text-indigo-600" />
                                    <span>Peminatan: {studentItem.keKelasNama}</span>
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-300 dark:bg-emerald-950/70 dark:text-emerald-300 dark:border-emerald-700 shadow-2xs">
                                    <Check className="w-2.5 h-2.5 text-emerald-700" />
                                    <span>{studentItem.keKelasNama}</span>
                                  </span>
                                )}
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Table Footer Summary */}
                <div className="p-3 bg-slate-50 dark:bg-slate-900/60 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-muted-foreground gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>
                      Menampilkan <strong>{displayedStudentMappings.length}</strong> dari{' '}
                      <strong>{studentsInActiveLevel.length}</strong> murid Tingkat {selectedMappingTingkat}.
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Setiap murid telah dipetakan ke rombel tujuan tahun ajaran baru.
                  </div>
                </div>
              </div>

              {/* Navigation Action Buttons (SMAN 20 Signature Brand Colors) */}
              <div className="flex justify-between gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => goToStep(1)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs md:text-sm font-semibold bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 active:scale-95 transition-all shadow-xs cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Kembali</span>
                </button>
                <button
                  type="button"
                  onClick={() => goToStep(3)}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs md:text-sm font-bold bg-gradient-to-r from-brand-900 via-brand-800 to-emerald-700 text-white hover:brightness-110 active:scale-95 transition-all shadow-md shadow-brand-900/20 border border-emerald-600/30 cursor-pointer"
                >
                  <span>Lanjut ke Pengecualian Murid</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: PENGECUALIAN MURID */}
        {currentStep === 3 && (
          <div className="space-y-6 animate-in fade-in-50 duration-200">
            <div className="bg-card border rounded-2xl p-6 shadow-sm">
              <div className="border-b pb-5">
                <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-amber-500" />
                  Pengecualian Murid (Tinggal Kelas / Mutasi Keluar)
                </h2>
                <p className="text-xs md:text-sm text-muted-foreground mt-0.5">
                  Tentukan murid yang tidak naik ke tingkat berikutnya atau mengalami mutasi keluar sebelum tahun ajaran baru.
                </p>
              </div>

              {/* Search bar for quick exception assignment */}
              <div className="my-5 space-y-3">
                <label className="text-xs font-semibold text-foreground">
                  Cari Nama Murid atau NIS untuk Ditambahkan ke Pengecualian:
                </label>
                <div className="relative max-w-xl">
                  <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchStudent}
                    onChange={(e) => setSearchStudent(e.target.value)}
                    placeholder="Ketik minimal 2 huruf nama murid atau NIS..."
                    className="w-full pl-9 pr-4 py-2 text-xs bg-background border rounded-xl focus:ring-1 focus:ring-primary focus:outline-none"
                  />
                </div>

                {/* Instant Search Results Dropdown */}
                {filteredStudents.length > 0 && (
                  <div className="border rounded-xl p-2 bg-card/90 shadow-md max-w-xl space-y-1">
                    {filteredStudents.map((st) => (
                      <div
                        key={st.id}
                        className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 text-xs transition-colors"
                      >
                        <div>
                          <div className="font-semibold text-foreground">{st.nama}</div>
                          <div className="text-[11px] text-muted-foreground">
                            NIS: {st.nis || '-'} • Kelas: {st.kelasNama}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleAddException(st, 'TINGGAL_KELAS')}
                            className="px-2.5 py-1 rounded-md bg-amber-500/10 text-amber-700 dark:text-amber-300 font-semibold hover:bg-amber-500/20 active:scale-[0.98] text-[11px] border border-amber-500/20"
                          >
                            Tinggal Kelas
                          </button>
                          <button
                            type="button"
                            onClick={() => handleAddException(st, 'MUTASI')}
                            className="px-2.5 py-1 rounded-md bg-rose-500/10 text-rose-700 dark:text-rose-300 font-semibold hover:bg-rose-500/20 active:scale-[0.98] text-[11px] border border-rose-500/20"
                          >
                            Mutasi Keluar
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Active Exceptions Table */}
              <div className="space-y-3 mt-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-foreground">
                    Daftar Murid yang Dikecualikan ({pengecualian.length})
                  </h3>
                  {pengecualian.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setPengecualian([])}
                      className="text-xs text-rose-500 hover:underline"
                    >
                      Hapus Semua Pengecualian
                    </button>
                  )}
                </div>

                {pengecualian.length === 0 ? (
                  <div className="border border-dashed rounded-xl p-8 text-center bg-muted/20">
                    <UserCheck className="w-8 h-8 text-muted-foreground mx-auto mb-2 opacity-50" />
                    <p className="text-xs text-muted-foreground font-medium">
                      Tidak ada murid yang dikecualikan. Seluruh murid akan naik kelas sesuai pemetaan Jalur Cepat.
                    </p>
                  </div>
                ) : (
                  <div className="border rounded-xl overflow-hidden bg-card shadow-xs">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-bold border-b border-slate-200 dark:border-slate-700 sticky top-0 z-10 shadow-xs">
                        <tr>
                          <th className="py-2.5 px-3">Nama Murid</th>
                          <th className="py-2.5 px-3">Kelas Asal</th>
                          <th className="py-2.5 px-3">Status Kenaikan</th>
                          <th className="py-2.5 px-3">Catatan</th>
                          <th className="py-2.5 px-3 text-right">Aksi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {pengecualian.map((exc) => (
                          <tr key={exc.muridId} className="hover:bg-muted/30">
                            <td className="py-2.5 px-3 font-semibold text-foreground">{exc.muridNama}</td>
                            <td className="py-2.5 px-3 text-muted-foreground">{exc.kelasLamaNama}</td>
                            <td className="py-2.5 px-3">
                              <span
                                className={cn(
                                  'px-2 py-0.5 rounded text-[11px] font-semibold border',
                                  exc.tipe === 'TINGGAL_KELAS'
                                    ? 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30'
                                    : 'bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/30'
                                )}
                              >
                                {exc.tipe === 'TINGGAL_KELAS' ? 'Tinggal Kelas' : 'Mutasi Keluar'}
                              </span>
                            </td>
                            <td className="py-2.5 px-3 text-muted-foreground">{exc.catatan}</td>
                            <td className="py-2.5 px-3 text-right">
                              <button
                                type="button"
                                onClick={() => handleRemoveException(exc.muridId)}
                                className="p-1 rounded hover:bg-rose-500/10 text-rose-500 transition-colors"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Navigation Action */}
              <div className="flex justify-between gap-3 mt-6 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => goToStep(2)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs md:text-sm font-semibold bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 active:scale-95 transition-all shadow-xs cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Kembali</span>
                </button>
                <button
                  type="button"
                  onClick={() => goToStep(4)}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs md:text-sm font-bold bg-gradient-to-r from-brand-900 via-brand-800 to-emerald-700 text-white hover:brightness-110 active:scale-95 transition-all shadow-md shadow-brand-900/20 border border-emerald-600/30 cursor-pointer"
                >
                  <span>Lanjut ke Simulasi (Dry Run)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: SIMULASI & EKSEKUSI */}
        {currentStep === 4 && (
          <div className="space-y-6 animate-in fade-in-50 duration-200">
            {/* Success state celebration */}
            {successExecution ? (
              <div className="bg-card border-2 border-emerald-500/40 rounded-2xl p-8 text-center shadow-lg space-y-4">
                <div className="w-16 h-16 bg-emerald-500/10 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h2 className="text-xl font-bold text-foreground">Kenaikan Kelas Berhasil Dieksekusi!</h2>
                <p className="text-sm text-muted-foreground max-w-lg mx-auto">
                  {successExecution.message} Seluruh histori kenaikan kelas murid telah dicatat secara permanen di database
                  dan Snapshot cadangan siap digunakan jika Anda perlu melakukan Rollback.
                </p>
                <div className="flex justify-center gap-3 pt-3">
                  <Link
                    href="/murid"
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs md:text-sm font-bold bg-gradient-to-r from-brand-900 via-brand-800 to-emerald-700 text-white hover:brightness-110 active:scale-95 transition-all shadow-md shadow-brand-900/20 border border-emerald-600/30 cursor-pointer"
                  >
                    <Users className="w-4 h-4" />
                    <span>Kembali ke Data Murid</span>
                  </Link>
                  <button
                    type="button"
                    onClick={handleRollback}
                    disabled={rollingBack}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/30 hover:bg-amber-500/20 active:scale-[0.98] cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Uji Batalkan (Rollback)</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-card border rounded-2xl p-6 shadow-sm space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-5">
                  <div>
                    <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5 text-emerald-500" />
                      Simulasi Kenaikan Kelas (Dry-Run Preview)
                    </h2>
                    <p className="text-xs md:text-sm text-muted-foreground mt-0.5">
                      Tinjau hasil perhitungan sebelum data riil database diperbarui.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={runPreviewSimulation}
                    disabled={previewLoading}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-muted hover:bg-muted/80 text-foreground border active:scale-[0.98] transition-all cursor-pointer"
                  >
                    <RotateCcw className={cn('w-3.5 h-3.5', previewLoading && 'animate-spin')} />
                    <span>{previewLoading ? 'Menghitung...' : 'Hitung Ulang Simulasi'}</span>
                  </button>
                </div>

                {/* Simulation Summary Cards */}
                {previewResult && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-4 rounded-xl border bg-muted/20">
                      <div className="text-xs text-muted-foreground font-medium">Total Murid Diproses</div>
                      <div className="text-2xl font-bold text-foreground mt-1">
                        {previewResult.totalMuridDiproses} Murid
                      </div>
                      <div className="text-[11px] text-muted-foreground mt-0.5">Tingkat X, XI, XII</div>
                    </div>

                    <div className="p-4 rounded-xl border bg-indigo-500/5 border-indigo-500/20">
                      <div className="text-xs text-indigo-700 dark:text-indigo-300 font-medium">Total Lulus (Alumni)</div>
                      <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mt-1">
                        {previewResult.totalLulus} Murid
                      </div>
                      <div className="text-[11px] text-muted-foreground mt-0.5">
                        {luluskanKelas12
                          ? 'Kelulusan Otomatis Semua'
                          : tindakanKelas12 === 'PILIH_SELEKTIF'
                          ? 'Kelulusan Selektif'
                          : 'Tidak ada yang lulus'}
                      </div>
                    </div>

                    <div className="p-4 rounded-xl border bg-emerald-500/5 border-emerald-500/20">
                      <div className="text-xs text-emerald-700 dark:text-emerald-300 font-medium">Total Naik Kelas</div>
                      <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                        {previewResult.totalNaik} Murid
                      </div>
                      <div className="text-[11px] text-muted-foreground mt-0.5">X ➔ XI dan XI ➔ XII</div>
                    </div>

                    <div className="p-4 rounded-xl border bg-amber-500/5 border-amber-500/20">
                      <div className="text-xs text-amber-700 dark:text-amber-300 font-medium">Pengecualian / Ditunda</div>
                      <div className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1">
                        {previewResult.totalTinggal + previewResult.totalMutasi} Murid
                      </div>
                      <div className="text-[11px] text-muted-foreground mt-0.5">
                        Tinggal/Ditunda: {previewResult.totalTinggal} • Mutasi: {previewResult.totalMutasi}
                      </div>
                    </div>
                  </div>
                )}

                {/* Warnings / Alerts if any */}
                {previewResult?.peringatan && previewResult.peringatan.length > 0 && (
                  <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl p-4 space-y-1">
                    <div className="text-xs font-bold text-amber-800 dark:text-amber-200 flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                      <span>Catatan Peringatan Kapasitas & Status:</span>
                    </div>
                    {previewResult.peringatan.map((w, idx) => (
                      <div key={idx} className="text-xs text-amber-700 dark:text-amber-300 pl-5">
                        • {w}
                      </div>
                    ))}
                  </div>
                )}

                {/* Capacity Summary Table */}
                <div className="space-y-3">
                  <h3 className="text-sm font-bold text-foreground">
                    Distribusi Kapasitas Rombel di Tahun Ajaran Baru ({statusData?.tahunAjaranBaru || '2026/2027'})
                  </h3>
                  <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden bg-card max-h-72 overflow-y-auto shadow-xs">
                    <table className="w-full text-xs text-left border-collapse">
                      <thead className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-bold border-b border-slate-200 dark:border-slate-700 sticky top-0 z-10 shadow-xs">
                        <tr>
                          <th className="py-2.5 px-3">Nama Rombel</th>
                          <th className="py-2.5 px-3">Tingkat</th>
                          <th className="py-2.5 px-3 text-center">Sebelum</th>
                          <th className="py-2.5 px-3 text-center">Sesudah</th>
                          <th className="py-2.5 px-3">Status Kapasitas</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {previewResult?.ringkasanKelasBaru?.map((c) => (
                          <tr key={c.kelasId} className="hover:bg-muted/30">
                            <td className="py-2 px-3 font-semibold text-foreground">{c.nama}</td>
                            <td className="py-2 px-3 text-muted-foreground">{c.tingkat}</td>
                            <td className="py-2 px-3 text-center text-muted-foreground">{c.jumlahSebelum}</td>
                            <td className="py-2 px-3 text-center font-bold text-foreground">
                              {c.jumlahSesudah} / {c.kapasitas}
                            </td>
                            <td className="py-2 px-3">
                              <span
                                className={cn(
                                  'px-2 py-0.5 rounded text-[11px] font-semibold border',
                                  c.statusKapasitas === 'AMAN' &&
                                    'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30',
                                  c.statusKapasitas === 'PENUH' &&
                                    'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30',
                                  c.statusKapasitas === 'OVERLOAD' &&
                                    'bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/30'
                                )}
                              >
                                {c.statusKapasitas}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Security Confirmation Card */}
                <div className="bg-muted/40 border-2 border-dashed rounded-2xl p-6 space-y-4">
                  <div className="flex items-start gap-3">
                    <ShieldCheck className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-bold text-foreground">Konfirmasi Pengaman Eksekusi (Safety Guard)</h4>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Sebelum eksekusi dijalankan, sistem secara otomatis menyimpan Snapshot cadangan. Jika terjadi
                        kesalahan formasi, Anda dapat melakukan Rollback 1-klik kapan saja.
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                    <div className="text-xs font-semibold text-foreground shrink-0">
                      Ketik <span className="font-mono bg-muted px-1.5 py-0.5 rounded border text-primary">KONFIRMASI</span>:
                    </div>
                    <input
                      type="text"
                      value={confirmInput}
                      onChange={(e) => setConfirmInput(e.target.value)}
                      placeholder="Ketik KONFIRMASI di sini..."
                      className="px-3 py-2 text-xs bg-background border rounded-xl font-mono focus:ring-1 focus:ring-primary focus:outline-none w-full sm:w-64"
                    />

                    <button
                      type="button"
                      onClick={handleExecutePromotion}
                      disabled={executing || confirmInput.trim().toUpperCase() !== 'KONFIRMASI'}
                      className={cn(
                        'inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs md:text-sm font-bold transition-all shadow-md active:scale-[0.98]',
                        confirmInput.trim().toUpperCase() === 'KONFIRMASI'
                          ? 'bg-gradient-to-r from-brand-900 via-brand-800 to-emerald-700 text-white hover:brightness-110 active:scale-95 shadow-lg shadow-brand-900/25 border border-emerald-600/30 cursor-pointer'
                          : 'bg-muted text-muted-foreground cursor-not-allowed opacity-60'
                      )}
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>{executing ? 'Mengeksekusi Kenaikan...' : 'Eksekusi Kenaikan Kelas Sekarang'}</span>
                    </button>
                  </div>
                </div>

                {/* Navigation Back */}
                <div className="flex justify-between gap-3 pt-4 border-t">
                  <button
                    type="button"
                    onClick={() => goToStep(3)}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs md:text-sm font-semibold bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 active:scale-95 transition-all shadow-xs cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Kembali ke Pengecualian</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
