import { PrismaClient, PaymentStatus, PedidoStatus } from '@prisma/client';
import type { AuthRequest } from '../middlewares/auth';
import type { Request, Response } from 'express';

const prisma = new PrismaClient();

// Iniciar pagamento (simulação SyncPay)
export async function criarPagamento(req: AuthRequest, res: Response) {
  const { pedidoId, metodo } = req.body;
  const pedido = await prisma.pedido.findUnique({ 
    where: { id: Number(pedidoId) },
    include: { pagamento: true }
  });
  if (!pedido) return res.status(404).json({ error: 'Pedido não encontrado.' });
  if (pedido.pagamento) return res.status(400).json({ error: 'Pagamento já existe para este pedido.' });
  if (pedido.status !== 'PENDENTE') return res.status(400).json({ error: 'Pedido não pode ser pago novamente.' });

  const pagamento = await prisma.pagamento.create({
    data: {
      pedidoId: pedido.id,
      metodo: metodo || 'SYNC',
      valor: pedido.total,
      status: 'PENDENTE',
      externalId: 'SYNCMOCK-' + pedido.id
    }
  });
  res.status(201).json(pagamento);
}

// Webhook (fake): atualiza pagamento/pedido para PAGO
export async function webhookPagamento(req: Request, res: Response) {
  const { externalId } = req.body;
  const pagamento = await prisma.pagamento.findFirst({ where: { externalId } });
  if (!pagamento) return res.status(404).json({ error: 'Pagamento não encontrado pelo externalId.' });
  await prisma.pagamento.update({ where: { id: pagamento.id }, data: { status: 'PAGO' } });
  await prisma.pedido.update({ where: { id: pagamento.pedidoId }, data: { status: 'PAGO' } });
  res.json({ sucesso: true });
}
