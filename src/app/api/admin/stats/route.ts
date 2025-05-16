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
    const [
      totalPedidos,
      totalProdutos,
      totalUsuarios,
      pedidosHoje,
      pedidosPendentes
    ] = await Promise.all([
      prisma.pedido.count(),
      prisma.produto.count(),
      prisma.usuario.count(),
      prisma.pedido.count({
        where: {
          criadoEm: {
            gte: new Date(new Date().setHours(0, 0, 0, 0))
          }
        }
      }),
      prisma.pedido.count({
        where: {
          status: 'PENDENTE'
        }
      })
    ]);

    return NextResponse.json({
      totalPedidos,
      totalProdutos,
      totalUsuarios,
      pedidosHoje,
      pedidosPendentes
    });
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    return new NextResponse('Erro interno do servidor', { status: 500 });
  }
} 