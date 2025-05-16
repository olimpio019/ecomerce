"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useCart } from "@/hooks/useCart";
import { toast } from "react-hot-toast";
import Link from "next/link";
import { ArrowLeft, ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
import { ProxyImage } from './ProxyImage';

interface Produto {
  id: string;
  nome: string;
  preco: number;
  precoPix: number;
  imagem: string;
  descricao: string;
  vendedor: string;
  estoque: number;
  avaliacoes: number;
  nota: string;
  tamanhos: string[];
  categoria: string;
  marca: string;
}

export function ProdutosList() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addItem } = useCart();
  const [marcaSelecionada, setMarcaSelecionada] = useState<string>("");
  const searchParams = useSearchParams();
  const termoBusca = searchParams.get("busca") || "";
  const router = useRouter();

  useEffect(() => {
    const fetchProdutos = async () => {
      try {
        setLoading(true);
        setError(null);
        const url = new URL("/api/produtos", window.location.origin);
        if (marcaSelecionada) {
          url.searchParams.set("marca", marcaSelecionada);
        }
        if (termoBusca) {
          url.searchParams.set("busca", termoBusca);
        }
        
        const response = await fetch(url.toString(), {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`Erro ao buscar produtos: ${response.statusText}`);
        }

        const data = await response.json();
        setProdutos(data);
      } catch (error) {
        console.error("Erro ao carregar produtos:", error);
        setError(error instanceof Error ? error.message : "Erro ao carregar produtos");
        toast.error("Erro ao carregar produtos");
      } finally {
        setLoading(false);
      }
    };

    fetchProdutos();
  }, [marcaSelecionada, termoBusca]);

  const handleAddToCart = (produto: Produto) => {
    addItem({
      id: produto.id,
      name: produto.nome,
      price: produto.preco,
      precoPix: produto.precoPix,
      image: produto.imagem,
    });
    toast.success("Produto adicionado ao carrinho!");
  };

  const marcas = [
    { id: '', nome: 'Todas as marcas' },
    { id: 'nike', nome: 'Nike' },
    { id: 'adidas', nome: 'Adidas' },
    { id: 'puma', nome: 'Puma' },
    { id: 'mizuno', nome: 'Mizuno' },
    { id: 'asics', nome: 'Asics' },
    { id: 'new-balance', nome: 'New Balance' },
  ];

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

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Nossos Produtos</h1>
          <div className="flex items-center gap-4">
            <Link
              href="/carrinho"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ShoppingCart className="w-5 h-5" />
              Ver Carrinho
            </Link>
            <Link
              href="/"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Voltar para a página inicial
            </Link>
          </div>
        </div>

        <div className="mb-8">
          <label htmlFor="marca" className="block text-sm font-medium text-gray-700 mb-2">
            Filtrar por marca
          </label>
          <select
            id="marca"
            value={marcaSelecionada}
            onChange={(e) => setMarcaSelecionada(e.target.value)}
            className="w-full md:w-64 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            {marcas.map((marca) => (
              <option key={marca.id} value={marca.id}>
                {marca.nome}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {produtos.map((produto) => (
            <div
              key={produto.id}
              className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <Link href={`/produtos/${produto.id}`}>
                <div className="relative h-48">
                  <ProxyImage
                    src={produto.imagem}
                    alt={produto.nome}
                    fill
                    className="object-cover rounded-t-lg"
                  />
                </div>
              </Link>
              <div className="p-4">
                <Link href={`/produtos/${produto.id}`}>
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                    {produto.nome}
                  </h3>
                </Link>
                <p className="text-sm text-gray-500 mb-2">{produto.marca}</p>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-lg font-bold text-red-600">
                      R$ {produto.preco.toFixed(2)}
                    </span>
                    <span className="ml-2 text-sm text-gray-500 line-through">
                      R$ {(produto.preco / 0.9).toFixed(2)}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => router.push(`/produtos/${produto.id}`)}
                  className="w-full bg-red-600 text-white py-2 rounded-lg flex items-center justify-center space-x-2 hover:bg-red-700 transition-colors"
                >
                  <ShoppingCart size={20} />
                  <span>Ver Detalhes</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 