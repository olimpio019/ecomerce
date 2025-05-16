import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return new NextResponse('Não autorizado', { status: 401 });
  }

  try {
    const pedidos = await prisma.pedido.findMany({
      include: {
        itens: {
          include: {
            produto: true
          }
        },
        usuario: true
      },
      orderBy: {
        criadoEm: 'desc'
      }
    });

    return NextResponse.json(pedidos);
  } catch (error) {
    console.error('Erro ao buscar pedidos:', error);
    return new NextResponse('Erro interno do servidor', { status: 500 });
  }
} 