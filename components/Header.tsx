
import React from 'react';
import { WandIcon } from './Icons';

export const Header: React.FC = () => {
  return (
    <header className="bg-base-200/50 backdrop-blur-sm border-b border-base-300 sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-3">
          <WandIcon />
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Removedor de Marca D'água com IA
          </h1>
        </div>
         <p className="text-gray-400 mt-1">Remoção perfeita de marcas d'água com um clique.</p>
      </div>
    </header>
  );
};
