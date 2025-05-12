"use client";
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { FcGoogle } from 'react-icons/fc';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        toast.error('Email ou senha inválidos');
        return;
      }

      toast.success('Login realizado com sucesso!');
      router.push('/admin/produtos');
    } catch (error) {
      toast.error('Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md flex flex-col gap-6">
        <h1 className="text-2xl font-bold text-center text-red-700 mb-2">Acesse sua conta</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="E-mail"
            required
            className="border rounded-lg px-4 py-3 text-black focus:ring-2 focus:ring-red-500 outline-none"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          <input
            type="password"
            placeholder="Senha"
            required
            className="border rounded-lg px-4 py-3 text-black focus:ring-2 focus:ring-red-500 outline-none"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-red-600 text-white py-3 rounded-lg font-bold shadow hover:bg-red-700 transition disabled:opacity-60"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <div className="flex items-center gap-2 my-2">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-xs text-gray-400">ou</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        <button
          onClick={() => signIn('google')}
          className="flex items-center justify-center gap-2 border border-gray-300 rounded-lg py-3 font-bold hover:bg-gray-100 transition"
        >
          <FcGoogle size={22} /> Entrar com Google
        </button>

        <p className="text-center text-sm text-gray-600 mt-2">
          Não tem conta? <Link href="/registro" className="text-red-600 hover:underline font-bold">Cadastrar</Link>
        </p>
      </div>
    </div>
  );
} 