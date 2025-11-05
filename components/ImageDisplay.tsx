import React from 'react';

interface ImageDisplayProps {
  title: string;
  imageSrc: string | null;
  isLoading?: boolean;
}

export const ImageDisplay: React.FC<ImageDisplayProps> = ({ title, imageSrc, isLoading }) => {
  return (
    <div className="w-full">
      <h2 className="text-xl font-bold text-center mb-4 text-gray-300">{title}</h2>
      <div className="aspect-square w-full rounded-2xl bg-base-200 border border-base-300 shadow-lg overflow-hidden flex items-center justify-center">
        {isLoading ? (
          <div className="w-full h-full bg-base-300 animate-pulse"></div>
        ) : imageSrc ? (
          <img
            src={imageSrc}
            alt={title}
            className="w-full h-full object-contain"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">O resultado aparecerá aqui</p>
          </div>
        )}
      </div>
    </div>
  );
};