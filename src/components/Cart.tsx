'use client';

import { useState, useEffect } from 'react';
import { ShoppingCart, X, Plus, Minus, Trash2 } from 'lucide-react';
import { useCart } from '../hooks/useCart';
import { ProxyImage } from './ProxyImage';
import Link from 'next/link';
import { toast } from 'react-hot-toast';

export function Cart() {
  const [isOpen, setIsOpen] = useState(false);
  const { items, removeFromCart, updateQuantity, total, removeAll } = useCart();
  const [isAnimating, setIsAnimating] = useState(false);

  // Fechar o carrinho quando clicar fora dele
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const cartElement = document.getElementById('cart-dropdown');
      if (cartElement && !cartElement.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleRemoveItem = (itemId: string) => {
    removeFromCart(itemId);
    toast.success('Item removido do carrinho');
  };

  const handleUpdateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      handleRemoveItem(itemId);
      return;
    }
    updateQuantity(itemId, newQuantity);
  };

  const handleClearCart = () => {
    removeAll();
    toast.success('Carrinho esvaziado');
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-1 relative group"
      >
        <div className="relative">
          <ShoppingCart 
            size={24} 
            className="text-gray-700 group-hover:text-red-600 transition-colors" 
          />
          {items.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full animate-bounce">
              {items.length}
            </span>
          )}
        </div>
        <span className="hidden md:inline">Carrinho</span>
      </button>

      {isOpen && (
        <div 
          id="cart-dropdown"
          className="absolute right-0 top-full mt-2 w-[95vw] max-w-xs sm:max-w-md md:w-96 bg-white rounded-lg shadow-xl z-50 border border-gray-100 overflow-x-auto"
        >
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold flex items-center space-x-2">
                <ShoppingCart size={20} />
                <span>Seu Carrinho</span>
              </h3>
              <div className="flex items-center space-x-2">
                {items.length > 0 && (
                  <button
                    onClick={handleClearCart}
                    className="text-gray-500 hover:text-red-600 transition-colors"
                    title="Esvaziar carrinho"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
                <button 
                  onClick={() => setIsOpen(false)}
                  className="text-gray-500 hover:text-red-600 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {items.length === 0 ? (
              <div className="text-center py-8">
                <ShoppingCart size={48} className="mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500">Seu carrinho está vazio</p>
                <Link
                  href="/produtos"
                  className="mt-4 inline-block text-red-600 hover:text-red-700 font-medium"
                >
                  Ver produtos
                </Link>
              </div>
            ) : (
              <div className="space-y-4 max-h-[60vh] overflow-y-auto">
                {items.map((item) => (
                  <div 
                    key={item.id} 
                    className="flex items-center space-x-4 p-2 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <div className="relative w-20 h-20 flex-shrink-0">
                      <ProxyImage
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover rounded-lg"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold truncate">{item.name}</h4>
                      <p className="text-sm text-gray-500">
                        R$ {item.price.toFixed(2)}
                      </p>
                      <div className="flex items-center space-x-2 mt-2">
                        <button
                          onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                          className="p-1 hover:bg-gray-100 rounded transition-colors"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                          className="p-1 hover:bg-gray-100 rounded transition-colors"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <X size={20} />
                      </button>
                      <span className="text-sm font-medium mt-2">
                        R$ {(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}

                <div className="border-t pt-4 sticky bottom-0 bg-white">
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-bold">Total:</span>
                    <span className="text-lg font-bold text-red-600">
                      R$ {total.toFixed(2)}
                    </span>
                  </div>
                  <Link
                    href="/checkout"
                    className="block w-full bg-red-600 text-white py-3 rounded-lg text-center hover:bg-red-700 transition-colors font-medium"
                    onClick={() => setIsOpen(false)}
                  >
                    Finalizar Compra
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 