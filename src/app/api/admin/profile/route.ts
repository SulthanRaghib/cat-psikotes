import { NextResponse } from 'next/server';
import DB from '@/lib/db';
import { getSession } from '@/lib/auth';
import bcrypt from 'bcryptjs';

export async function PUT(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { currentPassword, newPassword } = await request.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: 'Password lama dan baru harus diisi' }, { status: 400 });
    }

    // Verify current admin
    const username = session.username;
    const admin = await DB.admins.findByUsername(username);

    if (!admin) {
      return NextResponse.json({ error: 'Admin tidak ditemukan' }, { status: 404 });
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, admin.password_hash);
    if (!isMatch) {
      return NextResponse.json({ error: 'Password saat ini salah' }, { status: 401 });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const newHash = await bcrypt.hash(newPassword, salt);

    // Update password
    await DB.admins.updatePassword(username, newHash);

    return NextResponse.json({ success: true, message: 'Password berhasil diubah' });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message || 'Terjadi kesalahan sistem' }, { status: 500 });
  }
}
