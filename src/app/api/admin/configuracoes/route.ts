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
    const configuracoes = await prisma.configuracao.findFirst();
    return NextResponse.json(configuracoes);
  } catch (error) {
    console.error('Erro ao buscar configurações:', error);
    return new NextResponse('Erro interno do servidor', { status: 500 });
  }
}

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return new NextResponse('Não autorizado', { status: 401 });
  }

  try {
    const body = await request.json();
    const { nomeLoja, emailContato, telefoneContato, endereco, cnpj } = body;

    const configuracoes = await prisma.configuracao.upsert({
      where: { id: 1 },
      update: {
        nomeLoja,
        emailContato,
        telefoneContato,
        endereco,
        cnpj
      },
      create: {
        id: 1,
        nomeLoja,
        emailContato,
        telefoneContato,
        endereco,
        cnpj
      }
    });

    return NextResponse.json(configuracoes);
  } catch (error) {
    console.error('Erro ao atualizar configurações:', error);
    return new NextResponse('Erro interno do servidor', { status: 500 });
  }
} 