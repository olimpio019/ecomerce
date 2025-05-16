import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return new NextResponse('Não autorizado', { status: 401 });
  }

  try {
    const usuarios = await prisma.usuario.findMany({
      select: {
        id: true,
        nome: true,
        email: true,
        admin: true,
        criadoEm: true,
        _count: {
          select: {
            pedidos: true
          }
        }
      },
      orderBy: {
        criadoEm: 'desc'
      }
    });

    return NextResponse.json(usuarios);
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
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
    const { nome, email, senha, admin } = body;

    if (!nome || !email || !senha) {
      return new NextResponse('Dados incompletos', { status: 400 });
    }

    const usuarioExistente = await prisma.usuario.findUnique({
      where: { email }
    });

    if (usuarioExistente) {
      return new NextResponse('Email já cadastrado', { status: 400 });
    }

    const senhaCriptografada = await bcrypt.hash(senha, 10);

    const usuario = await prisma.usuario.create({
      data: {
        nome,
        email,
        senha: senhaCriptografada,
        admin: admin || false
      }
    });

    return NextResponse.json(usuario);
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    return new NextResponse('Erro interno do servidor', { status: 500 });
  }
} 