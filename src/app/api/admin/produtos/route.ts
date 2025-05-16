import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/admin/produtos - Listar todos os produtos
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return new NextResponse('Não autorizado', { status: 401 });
    }

    const produtos = await prisma.produto.findMany({
      include: {
        categoria: true
      },
      orderBy: {
        nome: 'asc'
      }
    });

    return NextResponse.json(produtos);
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    return new NextResponse('Erro interno do servidor', { status: 500 });
  }
}

// POST /api/admin/produtos - Criar novo produto
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return new NextResponse('Não autorizado', { status: 401 });
    }

    const body = await request.json();
    const { nome, descricao, preco, precoPix, imagemUrl, categoriaId, estoque, marca, tamanhos } = body;

    if (!nome || !descricao || !preco || !precoPix || !imagemUrl || !categoriaId) {
      return new NextResponse('Dados incompletos', { status: 400 });
    }

    const produto = await prisma.produto.create({
      data: {
        nome,
        descricao,
        preco: parseFloat(preco),
        precoPix: parseFloat(precoPix),
        imagemUrl,
        categoriaId: parseInt(categoriaId),
        estoque: parseInt(estoque) || 10,
        marca: marca || '',
        tamanhos: tamanhos || []
      }
    });

    return NextResponse.json(produto);
  } catch (error) {
    console.error('Erro ao criar produto:', error);
    return new NextResponse('Erro interno do servidor', { status: 500 });
  }
} 