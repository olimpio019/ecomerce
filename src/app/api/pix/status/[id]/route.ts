import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest, context: any) {
  try {
    const pedido = await prisma.pedido.findUnique({
      where: { id: context.params.id },
      select: {
        id: true,
        status: true,
        pagamento: {
          select: {
            id: true,
            status: true,
            pixCopiaECola: true,
            pixQrCode: true,
            pixExpiracao: true
          }
        }
      }
    });

    if (!pedido) {
      return new NextResponse('Pedido não encontrado', { status: 404 });
    }

    if (!pedido.pagamento) {
      return new NextResponse('Pagamento não encontrado', { status: 404 });
    }

    return NextResponse.json({
      status: pedido.status,
      pagamento: pedido.pagamento
    });
  } catch (error) {
    console.error('Erro ao buscar status do pagamento:', error);
    return new NextResponse('Erro interno do servidor', { status: 500 });
  }
} 