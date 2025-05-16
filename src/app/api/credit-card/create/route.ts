import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return new NextResponse('Não autorizado', { status: 401 });
    }

    const body = await request.json();
    const { numero, nome, validade, cvv } = body;

    if (!numero || !nome || !validade || !cvv) {
      return new NextResponse('Dados incompletos', { status: 400 });
    }

    // Aqui você implementaria a integração com a API de pagamento
    // Por enquanto, vamos simular uma resposta de sucesso
    const response = {
      success: true,
      cardId: 'card_' + Math.random().toString(36).substr(2, 9),
      last4: numero.slice(-4),
      brand: 'visa'
    };

    // Salva o cartão no banco de dados
    const cartao = await prisma.cartao.create({
      data: {
        usuarioId: session.user.id,
        numero: numero.slice(-4),
        nome,
        validade,
        brand: response.brand,
        cardId: response.cardId
      }
    });

    return NextResponse.json(cartao);
  } catch (error) {
    console.error('Erro ao processar cartão:', error);
    
    // Trata o erro de forma segura
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
    
    return NextResponse.json(
      { error: 'Erro ao processar cartão', details: errorMessage },
      { status: 500 }
    );
  }
} 