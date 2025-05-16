import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return new NextResponse('Não autorizado', { status: 401 });
    }

    const configuracoes = await prisma.configuracao.findFirst();
    return NextResponse.json(configuracoes);
  } catch (error) {
    console.error('Erro ao buscar configurações:', error);
    return new NextResponse('Erro interno do servidor', { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return new NextResponse('Não autorizado', { status: 401 });
    }

    const body = await request.json();
    const { nomeLoja, descricaoLoja, emailContato, telefoneContato, enderecoLoja, instagramLoja, facebookLoja, whatsappLoja } = body;

    if (!nomeLoja || !descricaoLoja || !emailContato || !telefoneContato || !enderecoLoja) {
      return new NextResponse('Dados incompletos', { status: 400 });
    }

    const configuracoes = await prisma.configuracao.upsert({
      where: { id: 'configuracao-padrao' },
      update: {
        nomeLoja,
        descricaoLoja,
        emailContato,
        telefoneContato,
        enderecoLoja,
        instagramLoja,
        facebookLoja,
        whatsappLoja
      },
      create: {
        id: 'configuracao-padrao',
        nomeLoja,
        descricaoLoja,
        emailContato,
        telefoneContato,
        enderecoLoja,
        instagramLoja,
        facebookLoja,
        whatsappLoja
      }
    });

    return NextResponse.json(configuracoes);
  } catch (error) {
    console.error('Erro ao atualizar configurações:', error);
    return new NextResponse('Erro interno do servidor', { status: 500 });
  }
} 