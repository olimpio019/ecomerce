import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import { compare } from "bcryptjs";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Senha", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email e senha são obrigatórios');
        }

        try {
          const user = await prisma.usuario.findUnique({
            where: {
              email: credentials.email
            }
          });

          if (!user) {
            throw new Error('Usuário não encontrado');
          }

          const isPasswordValid = await compare(credentials.password, user.senhaHash);

          if (!isPasswordValid) {
            throw new Error('Senha incorreta');
          }

          return {
            id: user.id.toString(),
            email: user.email,
            name: user.nome,
            role: user.role || (user.admin ? 'ADMIN' : 'USER'),
            admin: user.admin
          };
        } catch (error) {
          console.error('Erro na autenticação:', error);
          throw error;
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.admin = user.admin;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role;
        session.user.admin = token.admin;
      }
      return session;
    }
  },
  pages: {
    signIn: '/login',
    error: '/auth/error'
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 dias
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
  trustHost: true
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }; 