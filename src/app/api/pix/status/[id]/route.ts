import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest, context: any) {
  try {
    const pagamento = await prisma.pagamento.findUnique({
      where: {
        id: parseInt(context.params.id)
      },
      select: {
        id: true,
        status: true,
        externalId: true,
        valor: true,
        criadaEm: true,
        atualizadaEm: true,
        pedido: {
          select: {
            id: true,
            status: true
          }
        }
      }
    });

    if (!pagamento) {
      return new NextResponse('Pagamento não encontrado', { status: 404 });
    }

    return NextResponse.json(pagamento);
  } catch (error) {
    console.error('Erro ao buscar status do pagamento:', error);
    return new NextResponse('Erro interno do servidor', { status: 500 });
  }
} 