import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// Estender o tipo Session do NextAuth para incluir a propriedade admin
declare module 'next-auth' {
  interface Session {
    user: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      admin?: boolean;
    };
  }
}

export async function GET(request: NextRequest) {
  try {
    console.log('Verificando sessão...');
    const session = await getServerSession(authOptions);
    
    console.log('Sessão:', session);
    
    if (!session?.user) {
      console.log('Usuário não autenticado');
      return NextResponse.json(
        { error: 'Não autorizado', admin: false },
        { status: 401 }
      );
    }

    console.log('Usuário autenticado:', session.user.email);

    // Se o usuário já tem o campo admin na sessão, use-o
    if (typeof session.user.admin === 'boolean') {
      console.log('Admin status da sessão:', session.user.admin);
      return NextResponse.json({ admin: session.user.admin });
    }

    // Se não, busque no banco
    console.log('Buscando usuário no banco...');
    const user = await prisma.usuario.findUnique({ 
      where: { email: session.user.email! },
      select: { admin: true }
    });

    if (!user) {
      console.log('Usuário não encontrado no banco');
      return NextResponse.json(
        { error: 'Usuário não encontrado', admin: false },
        { status: 404 }
      );
    }

    console.log('Admin status do banco:', user.admin);

    // Atualize a sessão com o status de admin
    session.user.admin = user.admin;

    return NextResponse.json({ admin: user.admin });
  } catch (error) {
    console.error('Erro ao verificar status de admin:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor', admin: false },
      { status: 500 }
    );
  }
} 