import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

type RouteContext = {
  params: {
    id: string;
  };
};

export async function GET(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const produto = await prisma.produto.findUnique({
      where: { id: params.id },
      include: {
        categoria: true,
        imagens: true
      }
    });

    if (!produto) {
      return new NextResponse('Produto não encontrado', { status: 404 });
    }

    return NextResponse.json(produto);
  } catch (error) {
    console.error('Erro ao buscar produto:', error);
    return new NextResponse('Erro interno do servidor', { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const body = await request.json();
    const { nome, descricao, preco, categoriaId, destaque, ativo } = body;

    if (!nome || !descricao || !preco || !categoriaId) {
      return new NextResponse('Dados incompletos', { status: 400 });
    }

    const produto = await prisma.produto.update({
      where: { id: params.id },
      data: {
        nome,
        descricao,
        preco,
        categoriaId,
        destaque: destaque ?? false,
        ativo: ativo ?? true
      },
      include: {
        categoria: true,
        imagens: true
      }
    });

    return NextResponse.json(produto);
  } catch (error) {
    console.error('Erro ao atualizar produto:', error);
    return new NextResponse('Erro interno do servidor', { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    await prisma.produto.delete({
      where: { id: params.id }
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Erro ao excluir produto:', error);
    return new NextResponse('Erro interno do servidor', { status: 500 });
  }
} 