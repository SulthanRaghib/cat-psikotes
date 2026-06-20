import { SignJWT, jwtVerify, JWTPayload } from 'jose';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

const secretKey = process.env.JWT_SECRET || 'fallback_secret_key_for_local_use_only_123';
const key = new TextEncoder().encode(secretKey);

export async function encrypt(payload: JWTPayload) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(key);
}

export async function decrypt(input: string): Promise<Record<string, unknown> | unknown> {
  const { payload } = await jwtVerify(input, key, {
    algorithms: ['HS256'],
  });
  return payload;
}

export async function getSession(req?: NextRequest): Promise<{ username: string } | null> {
  const session = req ? req.cookies.get('admin_session')?.value : cookies().get('admin_session')?.value;
  if (!session) return null;
  try {
    return await decrypt(session) as { username: string };
  } catch (err) {
    return null;
  }
}

export async function loginSession(username: string) {
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
  const session = await encrypt({ username, expires });

  cookies().set('admin_session', session, {
    expires,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  });
}

export async function logoutSession() {
  cookies().set('admin_session', '', {
    expires: new Date(0),
    httpOnly: true,
    path: '/',
  });
}
