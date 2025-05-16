"use client";
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  Users, 
  ShoppingCart, 
  Settings,
  LogOut
} from 'lucide-react';

interface User {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  admin?: boolean;
  role?: string;
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated' && !(session?.user as User)?.admin) {
      router.push('/');
    }
  }, [status, session, router]);

  const menuItems = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/produtos', label: 'Produtos', icon: Package },
    { href: '/admin/usuarios', label: 'Usuários', icon: Users },
    { href: '/admin/pedidos', label: 'Pedidos', icon: ShoppingCart },
    { href: '/admin/configuracoes', label: 'Configurações', icon: Settings },
  ];

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (!(session?.user as User)?.admin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg">
        <div className="flex flex-col h-full">
          {/* Logo e Nome */}
          <div className="p-4 border-b">
            <h1 className="text-xl font-bold text-red-600">Admin Panel</h1>
            <p className="text-sm text-gray-500">Bem-vindo, {session?.user?.name}</p>
          </div>

          {/* Menu */}
          <nav className="flex-1 p-4 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-2 p-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-red-50 text-red-600'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t">
            <Link
              href="/api/auth/signout"
              className="flex items-center space-x-2 text-gray-600 hover:text-red-600"
            >
              <LogOut className="w-5 h-5" />
              <span>Sair</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className="ml-64 p-8">
        {children}
      </div>
    </div>
  );
} 