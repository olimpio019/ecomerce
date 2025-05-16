'use client';

import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../hooks/useCart';
import { toast } from 'react-hot-toast';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ProxyImage } from './ProxyImage';

interface Product {
  id: string;
  nome: string;
  preco: number | string;
  imagemUrl: string;
  precoPix: number | string;
  descricao: string;
  vendedor: string;
  estoque: number;
  avaliacoes: number;
  nota: string;
  tamanhos: string[];
  categoria: string;
}

export function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addItem } = useCart();
  const router = useRouter();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch('/api/produtos');
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Erro ao buscar produtos');
        }
        
        const data = await response.json();
        if (!Array.isArray(data)) {
          throw new Error('Formato de dados inválido');
        }
        
        setProducts(data.slice(0, 4));
      } catch (error) {
        console.error('Erro ao carregar produtos:', error);
        setError(error instanceof Error ? error.message : 'Erro ao carregar produtos');
        toast.error('Erro ao carregar produtos');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = (product: Product) => {
    addItem({
      id: product.id,
      name: product.nome,
      price: Number(product.preco),
      precoPix: Number(product.precoPix),
      image: product.imagemUrl,
    });
    toast.success('Produto adicionado ao carrinho!');
  };

  if (loading) {
    return (
      <section className="py-8 md:py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 md:mb-8">
            <h2 className="text-2xl md:text-3xl font-bold">Produtos em Destaque</h2>
            <Link href="/produtos" className="text-red-600 hover:text-red-700 font-semibold mt-2 md:mt-0">
              Ver todos →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse">
                <div className="h-48 md:h-72 bg-gray-200" />
                <div className="p-4">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8 md:py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 md:mb-8">
          <h2 className="text-2xl md:text-3xl font-bold">Produtos em Destaque</h2>
          <Link href="/produtos" className="text-red-600 hover:text-red-700 font-semibold mt-2 md:mt-0">
            Ver todos →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-xl shadow-md overflow-hidden group hover:shadow-xl transition-all duration-300"
            >
              <Link href={`/produto/${product.id}`}>
                <div className="relative h-48 md:h-72">
                  <ProxyImage
                    src={product.imagemUrl}
                    alt={product.nome}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 md:top-4 right-2 md:right-4 bg-red-600 text-white px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-bold">
                    -10%
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-2 md:p-4 bg-gradient-to-t from-black/80 to-transparent">
                    <div className="flex space-x-1 md:space-x-2">
                      {product.tamanhos.map((tamanho) => (
                        <div
                          key={tamanho}
                          className="w-6 h-6 md:w-8 md:h-8 rounded-full border-2 border-white bg-white/20 flex items-center justify-center text-xs md:text-sm font-bold text-white"
                        >
                          {tamanho}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="p-3 md:p-4">
                  <div className="flex items-center justify-between mb-1 md:mb-2">
                    <span className="text-xs md:text-sm text-gray-500">{product.categoria}</span>
                    <div className="flex items-center">
                      <span className="text-base md:text-lg font-bold text-red-600">
                        R$ {Number(product.preco).toFixed(2)}
                      </span>
                      <span className="ml-1 md:ml-2 text-xs md:text-sm text-gray-500 line-through">
                        R$ {(Number(product.preco) / 0.9).toFixed(2)}
                      </span>
                    </div>
                  </div>
                  <h3 className="font-semibold text-sm md:text-lg mb-2 md:mb-4 line-clamp-2">{product.nome}</h3>
                </div>
              </Link>
              <div className="px-3 md:px-6 pb-3 md:pb-6">
                <button
                  onClick={() => router.push(`/produtos/${product.id}`)}
                  className="w-full bg-red-600 text-white py-2 md:py-3 rounded-lg flex items-center justify-center space-x-1 md:space-x-2 hover:bg-red-700 transition-colors text-sm md:text-base"
                >
                  <ShoppingCart size={16} className="md:w-5 md:h-5" />
                  <span>Ver Detalhes</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 