import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const SECRET = new TextEncoder().encode(
  process.env.SESSION_SECRET || 'amandes_super_secret_jwt_key_at_least_32_characters_long'
);

export interface JWTPayload {
  userId: string;
  fullName: string;
  phoneNumber: string;
  ktpNumber?: string;
  role: 'pengurus' | 'ketua' | 'anggota' | 'pendamping';
  koperasiRef?: string;
}

export async function encrypt(payload: any): Promise<string> {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('2h')
    .sign(SECRET);
}

export async function decrypt(token: string): Promise<any | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return payload;
  } catch (error) {
    return null;
  }
}

export async function createSession(payload: JWTPayload) {
  const jwt = await encrypt(payload);

  const cookieStore = await cookies();
  cookieStore.set('session', jwt, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 7200, // 2 hours
  });
}

export async function getSession(): Promise<JWTPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('session')?.value;
  if (!token) return null;

  return await decrypt(token);
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete('session');
}

export async function requireRole(allowedRoles: ('pengurus' | 'ketua' | 'anggota' | 'pendamping')[]): Promise<JWTPayload> {
  const session = await getSession();
  if (!session) {
    throw new Error('Unauthorized');
  }
  if (!allowedRoles.includes(session.role)) {
    throw new Error('Forbidden');
  }
  return session;
}
