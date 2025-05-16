import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return new NextResponse('Não autorizado', { status: 401 });
  }

  try {
    const usuario = await prisma.usuario.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        nome: true,
        email: true,
        admin: true,
        criadoEm: true,
        pedidos: {
          select: {
            id: true,
            total: true,
            status: true,
            criadoEm: true
          },
          orderBy: {
            criadoEm: 'desc'
          }
        }
      }
    });

    if (!usuario) {
      return new NextResponse('Usuário não encontrado', { status: 404 });
    }

    return NextResponse.json(usuario);
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    return new NextResponse('Erro interno do servidor', { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return new NextResponse('Não autorizado', { status: 401 });
  }

  try {
    const body = await request.json();
    const { nome, email, senha, admin } = body;

    const usuario = await prisma.usuario.findUnique({
      where: { id: params.id }
    });

    if (!usuario) {
      return new NextResponse('Usuário não encontrado', { status: 404 });
    }

    const dadosAtualizacao: any = {
      nome,
      email,
      admin
    };

    if (senha) {
      dadosAtualizacao.senha = await bcrypt.hash(senha, 10);
    }

    const usuarioAtualizado = await prisma.usuario.update({
      where: { id: params.id },
      data: dadosAtualizacao
    });

    return NextResponse.json(usuarioAtualizado);
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    return new NextResponse('Erro interno do servidor', { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return new NextResponse('Não autorizado', { status: 401 });
  }

  try {
    const usuario = await prisma.usuario.findUnique({
      where: { id: params.id }
    });

    if (!usuario) {
      return new NextResponse('Usuário não encontrado', { status: 404 });
    }

    await prisma.usuario.delete({
      where: { id: params.id }
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Erro ao deletar usuário:', error);
    return new NextResponse('Erro interno do servidor', { status: 500 });
  }
} 