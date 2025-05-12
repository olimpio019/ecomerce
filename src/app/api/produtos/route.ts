import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const categoria = searchParams.get('categoria');
    const marca = searchParams.get('marca');
    const busca = searchParams.get('busca');

    console.log('Parâmetros recebidos:', { categoria, marca, busca });

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

    console.log('Query where:', JSON.stringify(where, null, 2));

    const produtos = await prisma.produto.findMany({
      where,
      include: {
        categoria: true
      },
      orderBy: {
        criadoEm: 'desc'
      }
    });

    console.log('Produtos encontrados:', produtos.length);

    // Converter preços para número e adicionar campos necessários para a exibição
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
      avaliacoes: Math.floor(Math.random() * 500), // Mock de avaliações
      nota: (Math.random() * 1 + 4).toFixed(1), // Mock de nota entre 4 e 5
      tamanhos: produto.tamanhos,
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