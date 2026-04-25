import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

    const formData = await request.formData();
    const file = formData.get('file');
    const type = formData.get('type'); // idCard, license, vehicleDoc, product, etc.

    if (!file) return NextResponse.json({ error: 'Aucun fichier' }, { status: 400 });

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const filename = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
    const uploadDir = join(process.cwd(), 'public', 'uploads');
    
    // Ensure directory exists
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (e) {}

    const path = join(uploadDir, filename);
    await writeFile(path, buffer);

    const fileUrl = `/uploads/${filename}`;

    // If it's a livreur document, update the profile automatically
    if (session.user.role === 'LIVREUR') {
      if (type === 'idCard') {
        await prisma.livreur.update({ where: { userId: session.user.id }, data: { idCardUrl: fileUrl } });
      } else if (type === 'license') {
        await prisma.livreur.update({ where: { userId: session.user.id }, data: { licenseUrl: fileUrl } });
      } else if (type === 'vehicleDoc') {
        await prisma.livreur.update({ where: { userId: session.user.id }, data: { vehicleDocUrl: fileUrl } });
      }
    }

    return NextResponse.json({ url: fileUrl });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Erreur lors du téléchargement' }, { status: 500 });
  }
}
