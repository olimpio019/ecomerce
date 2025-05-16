import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

// GET /api/admin/produtos - Listar todos os produtos
export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return new NextResponse('Não autorizado', { status: 401 });
  }

  try {
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
export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return new NextResponse('Não autorizado', { status: 401 });
  }

  try {
    const body = await request.json();
    const { nome, descricao, preco, imagemUrl, estoque, categoriaId } = body;

    if (!nome || !descricao || !preco || !imagemUrl || !estoque || !categoriaId) {
      return new NextResponse('Todos os campos são obrigatórios', { status: 400 });
    }

    const produto = await prisma.produto.create({
      data: {
        nome,
        descricao,
        preco: parseFloat(preco),
        imagemUrl,
        estoque: parseInt(estoque),
        categoriaId: parseInt(categoriaId)
      }
    });

    return NextResponse.json(produto);
  } catch (error) {
    console.error('Erro ao criar produto:', error);
    return new NextResponse('Erro interno do servidor', { status: 500 });
  }
} 