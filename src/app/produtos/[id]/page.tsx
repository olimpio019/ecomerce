"use client";
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Loader2, ArrowLeft } from 'lucide-react';
import { useCart } from '@/hooks/useCart';

interface Product {
  id: string;
  name: string;
  price: number;
  precoPix: number;
  image: string;
  description: string;
  seller: string;
  sizes: string[];
  categoria: {
    nome: string;
  };
}

export default function ProdutoDetalhePage() {
  const params = useParams();
  const router = useRouter();
  const [produto, setProduto] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const cart = useCart();

  useEffect(() => {
    const fetchProduto = async () => {
      try {
        const response = await fetch(`/api/produtos/${params.id}`);
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Produto não encontrado');
          }
          throw new Error('Erro ao carregar produto');
        }
        const data = await response.json();
        setProduto(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar produto');
      } finally {
        setLoading(false);
      }
    };

    fetchProduto();
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (error || !produto) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <p className="text-lg text-red-500">{error || 'Produto não encontrado'}</p>
        <div className="flex gap-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Voltar
          </button>
          <Link
            href="/produtos"
            className="text-blue-500 hover:underline"
          >
            Ver todos os produtos
          </Link>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert('Por favor, selecione um tamanho');
      return;
    }

    cart.addItem({
      id: produto.id,
      name: produto.name,
      price: produto.price,
      precoPix: produto.precoPix,
      image: produto.image,
      size: selectedSize,
    });
  };

  // Gerar numerações de tênis do 35 ao 45
  const numeracoesTenis = Array.from({ length: 11 }, (_, i) => (35 + i).toString());

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Voltar
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="relative w-full h-[500px] md:h-[600px]">
          <Image
            src={produto.image}
            alt={produto.name}
            fill
            className="object-contain rounded-lg"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
        </div>

        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{produto.name}</h1>
            <p className="text-gray-500 mt-2">{produto.seller}</p>
          </div>

          <div className="space-y-2">
            <p className="text-2xl font-bold text-gray-900">
              R$ {produto.price.toFixed(2)}
            </p>
            <p className="text-green-600">
              R$ {produto.precoPix.toFixed(2)} no PIX
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-2">Descrição</h2>
            <p className="text-gray-600">{produto.description}</p>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-2">Tamanho</h2>
            <div className="grid grid-cols-5 gap-2">
              {produto.categoria.nome.toLowerCase() === 'tênis' ? (
                numeracoesTenis.map((tamanho) => (
                  <button
                    key={tamanho}
                    onClick={() => setSelectedSize(tamanho)}
                    className={`p-2 border rounded-md text-center ${
                      selectedSize === tamanho
                        ? 'border-blue-500 bg-blue-50 text-blue-600'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {tamanho}
                  </button>
                ))
              ) : (
                produto.sizes.map((tamanho) => (
                  <button
                    key={tamanho}
                    onClick={() => setSelectedSize(tamanho)}
                    className={`p-2 border rounded-md text-center ${
                      selectedSize === tamanho
                        ? 'border-blue-500 bg-blue-50 text-blue-600'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {tamanho}
                  </button>
                ))
              )}
            </div>
          </div>

          <div className="space-y-4">
            <button
              onClick={handleAddToCart}
              className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              <ShoppingCart className="w-5 h-5" />
              Adicionar ao Carrinho
            </button>

            <Link
              href="/carrinho"
              className="w-full bg-gray-100 text-gray-800 py-3 rounded-md hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
            >
              <ShoppingCart className="w-5 h-5" />
              Ver Carrinho
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 