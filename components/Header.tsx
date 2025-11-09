import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="bg-base-200/50 backdrop-blur-sm border-b border-base-300 sticky top-0 z-10 text-center">
      <div className="container mx-auto px-4 py-4">
        <h1 className="text-3xl font-bold text-white tracking-tight">
          Removedor de Marcas D'água
        </h1>
        <p className="text-gray-400 mt-1">Inteligência Artificial para limpar suas imagens.</p>
      </div>
    </header>
  );
};
