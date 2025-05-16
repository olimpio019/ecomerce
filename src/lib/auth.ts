import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        senha: { label: 'Senha', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.senha) {
          throw new Error('Credenciais inválidas');
        }

        const usuario = await prisma.usuario.findUnique({
          where: {
            email: credentials.email
          }
        });

        if (!usuario) {
          throw new Error('Usuário não encontrado');
        }

        const senhaCorreta = await bcrypt.compare(credentials.senha, usuario.senha);

        if (!senhaCorreta) {
          throw new Error('Senha incorreta');
        }

        return {
          id: usuario.id.toString(),
          email: usuario.email,
          name: usuario.nome,
          admin: usuario.admin
        };
      }
    })
  ],
  session: {
    strategy: 'jwt'
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.admin = user.admin;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.admin = token.admin as boolean;
      }
      return session;
    }
  },
  pages: {
    signIn: '/login',
    error: '/login'
  }
}; 