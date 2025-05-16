import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const categoria = searchParams.get('categoria');
    const marca = searchParams.get('marca');
    const busca = searchParams.get('busca');

    const where = {
      ...(categoria && { categoria: { nome: categoria } }),
      ...(marca && marca !== '' && { 
        marca: { 
          contains: marca,
          mode: 'insensitive' 
        } 
      }),
      ...(busca && {
        OR: [
          { nome: { contains: busca, mode: 'insensitive' } },
          { descricao: { contains: busca, mode: 'insensitive' } }
        ]
      }),
    };

    const produtos = await prisma.produto.findMany({
      where,
      include: {
        categoria: true
      },
      orderBy: {
        criadoEm: 'desc'
      }
    });

    if (!produtos || produtos.length === 0) {
      return NextResponse.json([], { status: 200 });
    }

    const produtosFormatados = produtos.map(produto => ({
      id: produto.id.toString(),
      nome: produto.nome,
      preco: Number(produto.preco),
      precoPix: Number(produto.precoPix),
      imagem: produto.imagemUrl,
      descricao: produto.descricao,
      marca: produto.marca,
      vendedor: 'Loja Oficial',
      estoque: produto.estoque,
      avaliacoes: Math.floor(Math.random() * 500),
      nota: (Math.random() * 1 + 4).toFixed(1),
      tamanhos: produto.tamanhos || [],
      categoria: produto.categoria.nome,
    }));

    return NextResponse.json(produtosFormatados);
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
} 