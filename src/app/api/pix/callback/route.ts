import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Callback PIX recebido:', body);

    // Busca o pagamento pelo externalId
    const pagamentoExistente = await prisma.pagamento.findFirst({
      where: {
        externalId: body.idTransaction
      }
    });

    if (!pagamentoExistente) {
      console.error('Pagamento não encontrado:', body.idTransaction);
      return new NextResponse('Pagamento não encontrado', { status: 404 });
    }

    // Atualiza o status do pagamento
    const pagamento = await prisma.pagamento.update({
      where: {
        id: pagamentoExistente.id
      },
      data: {
        status: body.status === 'PAID' ? 'PAGO' : 'FALHOU'
      }
    });

    // Se o pagamento foi confirmado, atualiza o status do pedido
    if (body.status === 'PAID') {
      await prisma.pedido.update({
        where: {
          id: pagamento.pedidoId
        },
        data: {
          status: 'PAGO'
        }
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro ao processar callback PIX:', error);
    return new NextResponse('Erro interno do servidor', { status: 500 });
  }
} 