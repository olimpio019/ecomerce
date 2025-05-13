'use client';

import { useEffect, useState, use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, ArrowLeft } from 'lucide-react';
import { useCart } from '../../../hooks/useCart';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

interface Product {
  id: string;
  nome: string;
  preco: number;
  imagem: string;
  precoPix: number;
  descricao: string;
  categoria: string;
}

const categoryNames: { [key: string]: string } = {
  masculino: 'Masculino',
  feminino: 'Feminino',
  infantil: 'Infantil',
  esportes: 'Esportes'
};

export default function CategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();
  const categoryName = categoryNames[resolvedParams.id] || resolvedParams.id;
  const router = useRouter();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`/api/produtos?categoria=${resolvedParams.id}`);
        if (!response.ok) throw new Error('Erro ao buscar produtos');
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Erro ao carregar produtos:', error);
        toast.error('Erro ao carregar produtos');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [resolvedParams.id]);

  const handleAddToCart = (product: Product) => {
    addItem({
      id: product.id,
      name: product.nome,
      price: product.preco,
      precoPix: product.precoPix,
      image: product.imagem,
    });
    toast.success('Produto adicionado ao carrinho!');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-sm p-4">
                  <div className="h-48 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <Link 
          href="/"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-red-600 mb-6 transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Voltar para a página inicial</span>
        </Link>

        <div className="flex items-center gap-4 mb-8">
          <div className="relative w-24 h-24">
            <Image
              src={`/categories/${resolvedParams.id}.jpg`}
              alt={categoryName}
              fill
              className="object-cover rounded-lg"
            />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{categoryName}</h1>
            <p className="text-gray-600 mt-1">
              {products.length} produtos encontrados
            </p>
          </div>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Nenhum produto encontrado nesta categoria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <Link href={`/produtos/${product.id}`}>
                  <div className="relative h-48">
                    <Image
                      src={product.imagem}
                      alt={product.nome}
                      fill
                      className="object-cover rounded-t-lg"
                    />
                  </div>
                </Link>
                <div className="p-4">
                  <Link href={`/produtos/${product.id}`}>
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                      {product.nome}
                    </h3>
                  </Link>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="text-lg font-bold text-red-600">
                        R$ {product.preco.toFixed(2)}
                      </span>
                      <span className="ml-2 text-sm text-gray-500 line-through">
                        R$ {(product.preco / 0.9).toFixed(2)}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => router.push(`/produtos/${product.id}`)}
                    className="w-full bg-red-600 text-white py-2 rounded-lg flex items-center justify-center space-x-2 hover:bg-red-700 transition-colors"
                  >
                    <ShoppingCart size={20} />
                    <span>Ver Detalhes</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 