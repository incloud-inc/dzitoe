import { describe, it, expect } from 'vitest';
import {
  getAllParents,
  createParent,
  updateParent,
  deleteParent,
  getParentById,
  getParentByPhoneOrNisn,
  getAllMutations,
  recordMutation,
  deleteMutation,
  getMutationById,
} from '../../packages/db/src';
import { authenticateCredentials } from '../../packages/auth/src';

describe('Data Orang Tua / Wali Suite (A5.4 & A5.8)', () => {
  it('retrieves seeded parents list correctly', () => {
    const parents = getAllParents();
    expect(parents.length).toBeGreaterThanOrEqual(8);

    const bambang = parents.find((p) => p.id === 'prt-001');
    expect(bambang).toBeDefined();
    expect(bambang?.nama).toContain('Bambang Sudirman');
    expect(bambang?.hubungan).toBe('AYAH');
    expect(bambang?.noHp).toBe('081288991122');
  });

  it('creates and retrieves a new parent', () => {
    const newParent = createParent({
      nama: 'Ibu Rahmawati S.Pd',
      nik: '3603125501800099',
      hubungan: 'IBU',
      noHp: '081299008877',
      pekerjaan: 'Guru SMP',
      penghasilan: 'Rp 5.000.000 - Rp 10.000.000',
      alamat: 'Jl. Surya Bahari No. 10, Pakuhaji',
      muridIds: ['mrd-test-01'],
      isPrimaryContact: true,
      email: 'rahmawati@gmail.com',
    });

    expect(newParent.id).toBeDefined();
    expect(newParent.nama).toBe('Ibu Rahmawati S.Pd');

    const fetched = getParentById(newParent.id);
    expect(fetched).not.toBeNull();
    expect(fetched?.noHp).toBe('081299008877');
  });

  it('finds parent by WhatsApp or Student NISN/ID', () => {
    const byPhone = getParentByPhoneOrNisn('0812-8899-1122');
    expect(byPhone).not.toBeNull();
    expect(byPhone?.nama).toContain('Bambang Sudirman');

    const byChildId = getParentByPhoneOrNisn('mrd-001');
    expect(byChildId).not.toBeNull();
  });

  it('updates and deletes a parent correctly', () => {
    const tempParent = createParent({
      nama: 'Testing Parent Delete',
      nik: '3603120000000001',
      hubungan: 'WALI',
      noHp: '089900001111',
      pekerjaan: 'Swasta',
      penghasilan: '< Rp 3.000.000',
      alamat: 'Pakuhaji',
      muridIds: [],
      isPrimaryContact: false,
    });

    const updated = updateParent(tempParent.id, {
      pekerjaan: 'PNS Pemprov',
    });
    expect(updated?.pekerjaan).toBe('PNS Pemprov');

    const deleteResult = deleteParent(tempParent.id);
    expect(deleteResult).toBe(true);

    const checkGone = getParentById(tempParent.id);
    expect(checkGone).toBeNull();
  });
});

describe('Mutasi Murid Suite (A5.9)', () => {
  it('loads seeded student mutations accurately', () => {
    const list = getAllMutations();
    expect(list.length).toBeGreaterThanOrEqual(4);

    const mutKeluar = list.find((m) => m.jenisMutasi === 'PINDAH_KELUAR');
    expect(mutKeluar).toBeDefined();
    expect(mutKeluar?.sekolahTujuan).toBeDefined();
    expect(mutKeluar?.nomorSurat).toContain('421.3');

    const mutMasuk = list.find((m) => m.jenisMutasi === 'PINDAH_MASUK');
    expect(mutMasuk).toBeDefined();
    expect(mutMasuk?.sekolahAsal).toBeDefined();
  });

  it('records new student mutation with SK number and status', () => {
    const newMut = recordMutation({
      muridId: 'mrd-unit-test',
      muridNama: 'Budi Santoso Junior',
      nis: '26999',
      nisn: '0089999999',
      kelasAsal: 'X.1',
      jenisMutasi: 'PINDAH_KELUAR',
      tanggalMutasi: '2026-03-28',
      nomorSurat: '421.3/999/SMAN20/III/2026',
      sekolahTujuan: 'SMAN 3 Tangerang Selatan',
      alasan: 'Kepindahan domisili orang tua ke Bintaro',
      statusApproval: 'DISETUJUI',
    });

    expect(newMut.id).toBeDefined();
    const fetched = getMutationById(newMut.id);
    expect(fetched).not.toBeNull();
    expect(fetched?.sekolahTujuan).toBe('SMAN 3 Tangerang Selatan');

    deleteMutation(newMut.id);
  });
});

describe('Mobile Parent Authentication Suite (B1.3)', () => {
  it('authenticates demo parent successfully', async () => {
    const res = await authenticateCredentials({
      identifier: 'ortu',
      password: 'ortu123',
      role: 'ORANG_TUA',
    });

    expect(res.success).toBe(true);
    expect(res.user?.role).toBe('ORANG_TUA');
  });

  it('authenticates parent using registered WhatsApp number and default password Masuk123!', async () => {
    const res = await authenticateCredentials({
      identifier: '081288991122',
      password: 'Masuk123!',
      role: 'ORANG_TUA',
    });

    expect(res.success).toBe(true);
    expect(res.user?.role).toBe('ORANG_TUA');
    expect(res.user?.name).toContain('Bambang Sudirman');
  });

  it('authenticates parent using WhatsApp with international code +62 and spaces', async () => {
    const res = await authenticateCredentials({
      identifier: '+62 812-8899-1122',
      password: 'Masuk123!',
      role: 'ORANG_TUA',
    });

    expect(res.success).toBe(true);
    expect(res.user?.role).toBe('ORANG_TUA');
    expect(res.user?.name).toContain('Bambang Sudirman');
  });

  it('authenticates parent using student NISN and default password', async () => {
    const res = await authenticateCredentials({
      identifier: '26001',
      password: 'Masuk123!',
      role: 'ORANG_TUA',
    });

    expect(res.success).toBe(true);
    expect(res.user?.role).toBe('ORANG_TUA');
    expect(res.user?.name).toContain('Bambang Sudirman');
  });

  it('rejects parent with invalid password', async () => {
    const res = await authenticateCredentials({
      identifier: '081288991122',
      password: 'wrongpassword',
      role: 'ORANG_TUA',
    });

    expect(res.success).toBe(false);
  });
});
