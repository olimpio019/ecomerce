import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

// GET /api/admin/produtos - Listar todos os produtos
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    console.log('Sessão no endpoint de produtos:', session);
    
    if (!session) {
      console.log('Nenhuma sessão encontrada');
      return NextResponse.json(
        { error: 'Não autorizado - Sessão não encontrada' },
        { status: 401 }
      );
    }

    if (session.user.role !== 'ADMIN') {
      console.log('Usuário não é admin. Role:', session.user.role);
      return NextResponse.json(
        { error: 'Não autorizado - Acesso restrito a administradores' },
        { status: 401 }
      );
    }

    const produtos = await prisma.produto.findMany({
      include: {
        categoria: {
          select: {
            nome: true,
          },
        },
      },
      orderBy: {
        id: 'desc',
      },
    });

    // Converter preços para número
    const produtosComPrecoNumerico = produtos.map(produto => ({
      ...produto,
      preco: Number(produto.preco),
      precoPix: Number(produto.precoPix)
    }));

    return NextResponse.json(produtosComPrecoNumerico);
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// POST /api/admin/produtos - Criar novo produto
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }

    const data = await request.json();
    
    const produto = await prisma.produto.create({
      data: {
        nome: data.nome,
        descricao: data.descricao,
        preco: data.preco,
        precoPix: data.precoPix || data.preco,
        imagemUrl: data.imagemUrl,
        estoque: data.estoque,
        categoriaId: data.categoriaId,
        marca: data.marca || "",
        tamanhos: data.tamanhos || [],
      },
      include: {
        categoria: {
          select: {
            nome: true,
          },
        },
      },
    });

    return NextResponse.json(produto, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar produto:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
} 