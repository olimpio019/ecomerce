"use client";
import { useState, useEffect } from 'react';
import { Shield, ShieldOff, Search } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface Usuario {
  id: number;
  nome: string;
  email: string;
  admin: boolean;
  criadoEm: string;
}

interface SessionUser {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  admin?: boolean;
  role?: string;
}

export default function AdminUsuarios() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    console.log('Status da sessão:', status);
    console.log('Dados da sessão:', session);

    if (status === 'unauthenticated') {
      console.log('Usuário não autenticado, redirecionando para login...');
      router.push('/login');
    } else if (status === 'authenticated' && !(session?.user as SessionUser)?.admin) {
      console.log('Usuário não é admin, redirecionando para home...');
      router.push('/');
    } else if (status === 'authenticated' && (session?.user as SessionUser)?.admin) {
      console.log('Usuário autenticado e é admin, buscando usuários...');
      fetchUsuarios();
    }
  }, [status, session, router]);

  const fetchUsuarios = async () => {
    console.log('Iniciando busca de usuários...');
    try {
      const response = await fetch('/api/admin/usuarios', {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      console.log('Resposta da API:', response.status);
      
      if (!response.ok) {
        throw new Error('Erro ao carregar usuários');
      }

      const data = await response.json();
      console.log('Dados recebidos:', data);
      
      setUsuarios(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
      setUsuarios([]);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleAdmin = async (id: number, currentAdmin: boolean) => {
    try {
      const response = await fetch(`/api/admin/usuarios/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ admin: !currentAdmin }),
      });

      if (response.ok) {
        setUsuarios(usuarios.map(usuario => 
          usuario.id === id ? { ...usuario, admin: !currentAdmin } : usuario
        ));
      }
    } catch (error) {
      console.error('Erro ao atualizar status de admin:', error);
    }
  };

  if (status === 'loading' || loading) {
    console.log('Renderizando loading...');
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (!(session?.user as SessionUser)?.admin) {
    console.log('Usuário não é admin, não renderizando conteúdo...');
    return null;
  }

  const filteredUsuarios = usuarios.filter(usuario =>
    usuario.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    usuario.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Gerenciar Usuários</h1>
      </div>

      {/* Barra de Pesquisa */}
      <div className="relative">
        <input
          type="text"
          placeholder="Pesquisar usuários..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg pl-10 focus:outline-none focus:ring-2 focus:ring-red-500 text-black"
        />
        <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
      </div>

      {/* Tabela de Usuários */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Usuário
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Data de Cadastro
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Admin
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredUsuarios.map((usuario) => (
              <tr key={usuario.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {usuario.nome}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{usuario.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {new Date(usuario.criadoEm).toLocaleDateString('pt-BR')}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => handleToggleAdmin(usuario.id, usuario.admin)}
                    className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                      usuario.admin
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {usuario.admin ? (
                      <>
                        <Shield className="w-4 h-4" />
                        Admin
                      </>
                    ) : (
                      <>
                        <ShieldOff className="w-4 h-4" />
                        Usuário
                      </>
                    )}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 