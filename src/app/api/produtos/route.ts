import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const categoriaId = searchParams.get('categoriaId');
    const marca = searchParams.get('marca');

    const where: Prisma.ProdutoWhereInput = {};

    if (query) {
      where.OR = [
        {
          nome: {
            contains: query,
            mode: Prisma.QueryMode.insensitive
          }
        },
        {
          descricao: {
            contains: query,
            mode: Prisma.QueryMode.insensitive
          }
        }
      ];
    }

    if (marca) {
      where.marca = {
        contains: marca,
        mode: Prisma.QueryMode.insensitive
      };
    }

    if (categoriaId) {
      where.categoriaId = parseInt(categoriaId);
    }

    const produtos = await prisma.produto.findMany({
      where,
      include: {
        categoria: true
      }
    });

    return NextResponse.json(produtos);
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    return new NextResponse('Erro interno do servidor', { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { nome, descricao, preco, categoriaId, marca, estoque, tamanhos } = body;

    if (!nome || !descricao || !preco || !categoriaId) {
      return new NextResponse('Dados incompletos', { status: 400 });
    }

    const produto = await prisma.produto.create({
      data: {
        nome,
        descricao,
        preco,
        precoPix: preco,
        imagemUrl: 'https://via.placeholder.com/500',
        marca: marca || '',
        categoriaId,
        estoque: estoque || 10,
        tamanhos: tamanhos || []
      },
      include: {
        categoria: true
      }
    });

    return NextResponse.json(produto);
  } catch (error) {
    console.error('Erro ao criar produto:', error);
    return new NextResponse('Erro interno do servidor', { status: 500 });
  }
} 