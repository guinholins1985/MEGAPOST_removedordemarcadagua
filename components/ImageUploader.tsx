
import React, { useCallback, useState } from 'react';
import { UploadIcon } from './Icons';

interface ImageUploaderProps {
  onImageUpload: (file: File) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onImageUpload(e.target.files[0]);
    }
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragIn = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  }, []);
  
  const handleDragOut = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);
  
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onImageUpload(e.dataTransfer.files[0]);
      e.dataTransfer.clearData();
    }
  }, [onImageUpload]);

  return (
    <div className="max-w-3xl mx-auto">
      <label
        htmlFor="image-upload"
        className={`relative block w-full h-80 rounded-2xl border-2 border-dashed transition-all duration-300 ease-in-out cursor-pointer
                    ${isDragging ? 'border-brand-primary bg-brand-primary/10' : 'border-base-300 hover:border-brand-secondary'}`}
        onDragEnter={handleDragIn}
        onDragLeave={handleDragOut}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="flex flex-col justify-center items-center h-full text-center p-6">
          <UploadIcon />
          <p className="mt-4 text-xl font-semibold text-gray-300">
            Arraste e solte uma imagem aqui
          </p>
          <p className="mt-1 text-gray-400">ou</p>
          <p className="mt-1 font-medium text-brand-secondary">
            Clique para selecionar um arquivo
          </p>
          <p className="mt-4 text-xs text-gray-500">
            PNG, JPG, WEBP, etc.
          </p>
        </div>
        <input
          id="image-upload"
          type="file"
          className="hidden"
          accept="image/*"
          onChange={handleFileChange}
        />
      </label>
    </div>
  );
};
