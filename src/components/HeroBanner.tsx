'use client';

import { ProxyImage } from './ProxyImage';

export function HeroBanner() {
  return (
    <div className="relative h-[300px] md:h-[500px] w-full">
      <div className="absolute inset-0">
        <ProxyImage
          src="/banner.jpg"
          alt="Banner principal"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black bg-opacity-30" />
      </div>
      <div className="relative container mx-auto px-4 h-full flex items-center">
        <div className="max-w-xl text-center md:text-left">
          <h1 className="text-2xl md:text-4xl font-bold text-white mb-2 md:mb-4">
            As Melhores Ofertas em Esportes
          </h1>
          <p className="text-base md:text-xl text-white mb-4 md:mb-6">
            Encontre os melhores preços em calçados, roupas e acessórios esportivos
          </p>
          <button className="bg-red-600 text-white px-6 md:px-8 py-2 md:py-3 rounded-full font-bold hover:bg-red-700 transition-colors text-sm md:text-base">
            Ver Ofertas
          </button>
        </div>
      </div>
    </div>
  );
} 