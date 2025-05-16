import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return new NextResponse('Não autorizado', { status: 401 });
    }

    const usuarios = await prisma.usuario.findMany({
      select: {
        id: true,
        nome: true,
        email: true,
        role: true,
        admin: true,
        criadoEm: true,
        atualizadoEm: true
      }
    });

    return NextResponse.json(usuarios);
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    return new NextResponse('Erro interno do servidor', { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return new NextResponse('Não autorizado', { status: 401 });
    }

    const body = await request.json();
    const { nome, email, senha, admin } = body;

    if (!nome || !email || !senha) {
      return new NextResponse('Dados incompletos', { status: 400 });
    }

    // Verifica se o email já está em uso
    const usuarioExistente = await prisma.usuario.findUnique({
      where: { email }
    });

    if (usuarioExistente) {
      return new NextResponse('Email já está em uso', { status: 400 });
    }

    // Criptografa a senha
    const senhaCriptografada = await bcrypt.hash(senha, 10);

    const usuario = await prisma.usuario.create({
      data: {
        nome,
        email,
        senhaHash: senhaCriptografada,
        admin: admin || false
      }
    });

    // Remove a senha do objeto retornado
    const { senhaHash, ...usuarioSemSenha } = usuario;

    return NextResponse.json(usuarioSemSenha);
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    return new NextResponse('Erro interno do servidor', { status: 500 });
  }
} 