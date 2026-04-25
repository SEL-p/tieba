import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "votre@email.com" },
        password: { label: "Mot de passe", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email et mot de passe requis");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        });

        if (!user || !user.password) {
          throw new Error("Aucun utilisateur trouvé avec cet email");
        }

        if (!user.isActive) {
          throw new Error("Ce compte a été suspendu par l'administration.");
        }

        const isPasswordCorrect = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordCorrect) {
          throw new Error("Mot de passe incorrect");
        }

        let sellerId = null;
        let shopRole = null;
        
        if (user.role === 'COMMERCIAL') {
          const staffAcc = await prisma.staffAccount.findUnique({ where: { userId: user.id } });
          if (staffAcc) {
            sellerId = staffAcc.sellerId;
            shopRole = staffAcc.shopRole;
          }
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          sellerId,
          shopRole
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
        if (user.sellerId) {
          token.sellerId = user.sellerId;
          token.shopRole = user.shopRole;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.role = token.role;
        session.user.id = token.id;
        if (token.sellerId) {
          session.user.sellerId = token.sellerId;
          session.user.shopRole = token.shopRole;
        }
      }
      return session;
    }
  },
  pages: {
    signIn: "/connexion",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
