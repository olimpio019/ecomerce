import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { gerarToken } from '../utils/jwt';
import { Request, Response } from 'express';

const prisma = new PrismaClient();

export async function registrarUsuario(req: Request, res: Response) {
  const { nome, email, senha, admin } = req.body;
  if (!nome || !email || !senha) {
    return res.status(400).json({ error: 'Nome, email e senha são obrigatórios.' });
  }
  const existe = await prisma.usuario.findUnique({ where: { email } });
  if (existe) {
    return res.status(409).json({ error: 'Usuário já cadastrado.' });
  }
  const senhaHash = await bcrypt.hash(senha, 10);
  const usuario = await prisma.usuario.create({
    data: { nome, email, senhaHash, admin: !!admin }
  });
  return res.status(201).json({ id: usuario.id, nome: usuario.nome, email: usuario.email, admin: usuario.admin });
}

export async function loginUsuario(req: Request, res: Response) {
  const { email, senha } = req.body;
  if (!email || !senha) {
    return res.status(400).json({ error: 'Email e senha obrigatórios.' });
  }
  const usuario = await prisma.usuario.findUnique({ where: { email } });
  if (!usuario) {
    return res.status(401).json({ error: 'Usuário não encontrado.' });
  }
  const ok = await bcrypt.compare(senha, usuario.senhaHash);
  if (!ok) {
    return res.status(401).json({ error: 'Senha inválida.' });
  }
  const token = gerarToken({ id: usuario.id, email: usuario.email, admin: usuario.admin });
  return res.json({ token, usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email, admin: usuario.admin } });
}
