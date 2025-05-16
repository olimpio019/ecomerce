import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return new NextResponse('Não autorizado', { status: 401 });
    }

    return NextResponse.json(
      { error: 'Funcionalidade de cartão de crédito está desativada' },
      { status: 501 }
    );
  } catch (error) {
    console.error('Erro ao processar requisição:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
    
    return NextResponse.json(
      { error: 'Erro interno do servidor', details: errorMessage },
      { status: 500 }
    );
  }
} 