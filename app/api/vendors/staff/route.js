import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import bcrypt from 'bcryptjs';

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'VENDEUR') {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 403 });
    }

    const seller = await prisma.seller.findUnique({
      where: { userId: session.user.id }
    });

    if (!seller) {
      return NextResponse.json({ error: 'Vendeur introuvable' }, { status: 404 });
    }

    const staffAccounts = await prisma.staffAccount.findMany({
      where: { sellerId: seller.id },
      include: {
        user: {
          select: { id: true, name: true, email: true, phone: true, isActive: true, createdAt: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(staffAccounts);
  } catch (error) {
    console.error('Error fetching staff:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'VENDEUR') {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 403 });
    }

    const seller = await prisma.seller.findUnique({
      where: { userId: session.user.id }
    });

    if (!seller) {
      return NextResponse.json({ error: 'Vendeur introuvable' }, { status: 404 });
    }

    const body = await request.json();
    const { name, email, phone, password, shopRole } = body;

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Nom, email et mot de passe sont requis' }, { status: 400 });
    }

    // Check if user exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { phone: phone || undefined }]
      }
    });

    if (existingUser) {
      return NextResponse.json({ error: 'Un utilisateur avec cet email ou téléphone existe déjà' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newStaff = await prisma.$transaction(async (tx) => {
      // Create the user
      const user = await tx.user.create({
        data: {
          name,
          email,
          phone,
          password: hashedPassword,
          role: 'COMMERCIAL', // System role
        }
      });

      // Create the staff account link
      const staffAccount = await tx.staffAccount.create({
        data: {
          userId: user.id,
          sellerId: seller.id,
          shopRole: shopRole || 'COMMERCIAL', // Store specific role
        },
        include: {
          user: {
            select: { id: true, name: true, email: true, phone: true, isActive: true, createdAt: true }
          }
        }
      });

      return staffAccount;
    });

    return NextResponse.json(newStaff, { status: 201 });
  } catch (error) {
    console.error('Error creating staff:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
