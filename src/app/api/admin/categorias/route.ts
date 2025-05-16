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
    const categorias = await prisma.categoria.findMany({
      orderBy: {
        nome: 'asc'
      }
    });

    return NextResponse.json(categorias);
  } catch (error) {
    console.error('Erro ao buscar categorias:', error);
    return new NextResponse('Erro interno do servidor', { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return new NextResponse('Não autorizado', { status: 401 });
  }

  try {
    const body = await request.json();
    const { nome } = body;

    if (!nome) {
      return new NextResponse('Nome é obrigatório', { status: 400 });
    }

    const categoria = await prisma.categoria.create({
      data: {
        nome
      }
    });

    return NextResponse.json(categoria);
  } catch (error) {
    console.error('Erro ao criar categoria:', error);
    return new NextResponse('Erro interno do servidor', { status: 500 });
  }
} 