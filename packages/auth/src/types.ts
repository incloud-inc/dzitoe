// ==============================================================================
// DZITOE — Auth Types & Roles (@dzitoe/auth)
// Task: A0.7 & A1.1
// ==============================================================================

export type UserRole =
  | 'ADMIN'
  | 'KEPALA_SEKOLAH'
  | 'TU'
  | 'GURU'
  | 'MURID'
  | 'ORANG_TUA'
  | 'GURU_BK'
  | 'PETUGAS_PPID';

export interface AuthUser {
  id: string;
  name: string;
  username: string;
  email: string;
  role: UserRole;
  avatar?: string | null;
  muridId?: string | null;
  guruId?: string | null;
  nisn?: string | null;
  nip?: string | null;
  kelas?: string | null;
  requirePasswordChange?: boolean;
}

export interface SessionTokenPayload {
  sub: string; // user id
  username: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string | null;
  iat?: number;
  exp?: number;
}

export interface LoginCredentials {
  identifier: string; // username or email or NISN/NIP
  password: string;
  role?: UserRole;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  user?: AuthUser;
  token?: string;
  requirePasswordChange?: boolean;
}
