import { describe, it, expect } from 'vitest';
import {
  parseExcelFile,
  generateExcelTemplate,
  USER_TEMPLATE_SAMPLE,
  MURID_DAPODIK_TEMPLATE_SAMPLE,
  GURU_TEMPLATE_SAMPLE,
  type UserImportRow,
  type MuridDapodikRow,
  type GuruImportRow,
} from '../../packages/utils/src/excel';
import {
  getAllUsers,
  createUser,
  getAllStudents,
  createStudent,
  getAllTeachers,
  createTeacher,
} from '../../packages/db/src';

describe('Excel Parser & Template Generator Suite', () => {
  it('generates valid XLSX template buffer and parses it back accurately', () => {
    const buffer = generateExcelTemplate(USER_TEMPLATE_SAMPLE as any, 'Template');
    expect(buffer).toBeInstanceOf(Uint8Array);
    expect(buffer.length).toBeGreaterThan(100);

    const parsed = parseExcelFile<UserImportRow>(buffer);
    expect(parsed.length).toBe(USER_TEMPLATE_SAMPLE.length);
    expect(parsed[0].Username).toBe(USER_TEMPLATE_SAMPLE[0].Username);
    expect(parsed[0].Email).toBe(USER_TEMPLATE_SAMPLE[0].Email);
  });

  it('generates and parses Dapodik Kemendikbudristek 2026 murid template', () => {
    const buffer = generateExcelTemplate(MURID_DAPODIK_TEMPLATE_SAMPLE as any, 'Murid');
    const parsed = parseExcelFile<MuridDapodikRow>(buffer);

    expect(parsed.length).toBe(MURID_DAPODIK_TEMPLATE_SAMPLE.length);
    expect(parsed[0].NISN).toBe(MURID_DAPODIK_TEMPLATE_SAMPLE[0].NISN);
    expect(parsed[0]['Nama Siswa']).toBe(MURID_DAPODIK_TEMPLATE_SAMPLE[0]['Nama Siswa']);
    expect(parsed[0]['Rombel/Kelas']).toBe(MURID_DAPODIK_TEMPLATE_SAMPLE[0]['Rombel/Kelas']);
  });

  it('generates and parses Guru & PTK template', () => {
    const buffer = generateExcelTemplate(GURU_TEMPLATE_SAMPLE as any, 'Guru');
    const parsed = parseExcelFile<GuruImportRow>(buffer);

    expect(parsed.length).toBe(GURU_TEMPLATE_SAMPLE.length);
    expect(parsed[0].NIP).toBe(GURU_TEMPLATE_SAMPLE[0].NIP);
    expect(parsed[0]['Mata Pelajaran']).toBe(GURU_TEMPLATE_SAMPLE[0]['Mata Pelajaran']);
  });
});

describe('Store Insertion & Validation for Bulk Import', () => {
  it('successfully creates new user from parsed row', () => {
    const uniqueUser = `test.import.${Date.now()}`;
    const result = createUser({
      username: uniqueUser,
      nama: 'Testing Bulk User',
      email: `${uniqueUser}@sman20tng.sch.id`,
      role: 'GURU',
    });

    expect(result.success).toBe(true);
    expect(result.user?.username).toBe(uniqueUser);
  });

  it('successfully creates new student with Dapodik fields and class binding', () => {
    const uniqueNisn = `99${Date.now().toString().slice(-8)}`;
    const student = createStudent({
      nama: 'Siswa Uji Coba Dapodik',
      nis: '24259999',
      nisn: uniqueNisn,
      kelasId: 'kls-x-1',
      jenisKelamin: 'LAKI_LAKI',
    });

    expect(student.id).toBeDefined();
    expect(student.nisn).toBe(uniqueNisn);
    expect(student.kelasId).toBe('kls-x-1');
  });

  it('successfully creates new teacher and verifies record', () => {
    const uniqueNip = `19900101${Date.now().toString().slice(-10)}`;
    const teacher = createTeacher({
      nama: 'Guru Uji Coba Excel',
      nip: uniqueNip,
      mataPelajaran: 'Fisika Terapan',
      statusKepegawaian: 'PNS',
      jenisKelamin: 'LAKI_LAKI',
    });

    expect(teacher.id).toBeDefined();
    expect(teacher.nip).toBe(uniqueNip);
    expect(teacher.mataPelajaran).toBe('Fisika Terapan');
  });
});
