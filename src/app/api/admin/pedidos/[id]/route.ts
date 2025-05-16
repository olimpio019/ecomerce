import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

type RouteParams = {
  params: {
    id: string;
  };
};

export async function PATCH(
  request: Request,
  { params }: RouteParams
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.admin) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }

    const data = await request.json();
    
    const pedido = await prisma.pedido.update({
      where: { id: parseInt(params.id) },
      data: {
        status: data.status,
      },
      include: {
        usuario: {
          select: {
            nome: true,
            email: true,
          },
        },
        itens: {
          include: {
            produto: {
              select: {
                nome: true,
                preco: true,
                imagemUrl: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(pedido);
  } catch (error) {
    console.error('Erro ao atualizar pedido:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
} 