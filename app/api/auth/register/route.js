import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    const { name, email, password, role } = await req.json();

    if (!name || !email || !password || !role) {
      return NextResponse.json({ error: "Tous les champs sont requis" }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json({ error: "Cet email est déjà utilisé" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role.toUpperCase(), // ACHETEUR, VENDEUR, LIVREUR
      }
    });

    return NextResponse.json({ message: "Compte créé avec succès" }, { status: 201 });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: "Erreur lors de l'inscription" }, { status: 500 });
  }
}
