"use client";
import { useEffect, useState } from 'react';
import { CheckCircle2, QrCode } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { paymentService } from '../../../services/paymentService';

export default function ConfirmacaoPage() {
  const router = useRouter();
  const [status, setStatus] = useState<'aguardando' | 'confirmado' | 'erro'>('aguardando');
  const [pix, setPix] = useState<{ qrCode: string; qrCodeText: string; transactionId: string; amount: number } | null>(null);
  const [loading, setLoading] = useState(true);

  // Simulação de dados do pedido (substitua pelos dados reais do carrinho/usuário)
  const pedido = {
    nome: 'Cliente Teste',
    email: 'cliente@email.com',
    cpf: '000.000.000-00',
    amount: 299.99,
  };

  useEffect(() => {
    async function gerarPix() {
      setLoading(true);
      try {
        const response = await paymentService.createPixPayment({
          amount: pedido.amount,
          customer: {
            name: pedido.nome,
            email: pedido.email,
            cpf: pedido.cpf.replace(/\D/g, '')
          },
          postbackUrl: `${window.location.origin}/api/pix/webhook`
        });
        setPix(response);
        setLoading(false);
        // Iniciar polling
        pollStatus(response.transactionId);
      } catch (e) {
        setStatus('erro');
        setLoading(false);
      }
    }
    gerarPix();
    // eslint-disable-next-line
  }, []);

  // Polling do status do pagamento
  function pollStatus(transactionId: string) {
    const interval = setInterval(async () => {
      try {
        const res = await paymentService.getPixPaymentStatus(transactionId);
        if (res.status === 'CONFIRMED' || res.status === 'PAID') {
          setStatus('confirmado');
          clearInterval(interval);
        }
      } catch {
        // Ignorar erros de polling
      }
    }, 3000);
  }

  if (loading) {
    return (
      <div className="max-w-xl mx-auto text-center py-16">
        <div className="animate-spin mx-auto mb-6 w-16 h-16 border-4 border-red-200 border-t-red-600 rounded-full" />
        <h1 className="text-2xl font-bold text-red-700">Gerando QR Code Pix...</h1>
        <p className="text-gray-600 mt-4">Aguarde um instante.</p>
      </div>
    );
  }

  if (status === 'confirmado') {
    return (
      <div className="max-w-xl mx-auto text-center">
        <CheckCircle2 className="mx-auto text-green-500 w-20 h-20 mb-6 animate-bounce" />
        <h1 className="text-3xl font-extrabold mb-4 text-green-700">Pedido realizado com sucesso!</h1>
        <p className="text-lg text-gray-700 mb-8">Obrigado por comprar conosco. Em breve você receberá um e-mail com os detalhes do seu pedido.</p>
        <button onClick={() => router.push('/')} className="bg-red-600 text-white px-10 py-3 rounded-xl text-lg font-extrabold shadow-lg hover:bg-red-700 hover:scale-105 transition-all duration-150">Voltar para a loja</button>
      </div>
    );
  }

  if (status === 'erro' || !pix) {
    return (
      <div className="max-w-xl mx-auto text-center py-16">
        <h1 className="text-2xl font-bold text-red-700 mb-4">Erro ao gerar pagamento Pix</h1>
        <p className="text-gray-600 mb-8">Tente novamente ou escolha outro método de pagamento.</p>
        <button onClick={() => router.push('/checkout/pagamento')} className="bg-red-600 text-white px-8 py-3 rounded-xl text-lg font-bold shadow hover:bg-red-700 transition">Voltar</button>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto text-center">
      <QrCode className="mx-auto text-red-600 w-16 h-16 mb-4" />
      <h1 className="text-2xl font-bold mb-2 text-red-700">Pagamento via Pix</h1>
      <p className="text-gray-700 mb-6">Escaneie o QR Code abaixo ou copie o código para pagar seu pedido.</p>
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6 flex flex-col items-center">
        <Image src={pix.qrCode} alt="QR Code Pix" width={200} height={200} className="rounded" />
        <div className="mt-4">
          <span className="block text-sm text-gray-500 mb-1">Valor:</span>
          <span className="text-2xl font-bold text-red-700">R$ {pix.amount.toFixed(2)}</span>
        </div>
        <div className="mt-6 w-full">
          <span className="block text-sm text-gray-500 mb-1">Copia e Cola:</span>
          <div className="bg-gray-100 rounded px-3 py-2 text-xs break-all select-all mb-2">{pix.qrCodeText}</div>
        </div>
        <p className="text-xs text-gray-500 mt-2">Após o pagamento, a confirmação é automática.</p>
      </div>
      <div className="flex justify-center mt-8">
        <div className="animate-pulse text-green-600 font-bold text-lg">Aguardando confirmação do pagamento...</div>
      </div>
    </div>
  );
} 