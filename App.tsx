import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { ImageDisplay } from './components/ImageDisplay';
import { ActionButton } from './components/ActionButton';
import { removeWatermark } from './services/geminiService';
import { DownloadIcon, RefreshIcon, SpinnerIcon } from './components/Icons';

const App: React.FC = () => {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('imagem_sem_marca_dagua.png');
  const [mimeType, setMimeType] = useState<string>('image/png');

  const processImage = useCallback(async (image: string, type: string) => {
    if (!image) return;

    setIsLoading(true);
    setError(null);
    setProcessedImage(null); // Limpa o resultado anterior ao tentar novamente

    try {
      const base64Data = image.split(',')[1];
      const resultBase64 = await removeWatermark(base64Data, type);
      setProcessedImage(`data:${type};base64,${resultBase64}`);
    } catch (err) {
      console.error(err);
      setError('Ocorreu um erro ao remover a marca d\'água. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleImageUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setOriginalImage(result);
      setFileName(`sem_marca_${file.name}`);
      setMimeType(file.type);
      processImage(result, file.type); // Processamento automático
    };
    reader.onerror = () => {
        setError("Falha ao ler o arquivo de imagem.");
        setOriginalImage(null);
    }
    reader.readAsDataURL(file);
  };

  const handleRetry = useCallback(() => {
    if (originalImage && mimeType) {
      processImage(originalImage, mimeType);
    }
  }, [originalImage, mimeType, processImage]);

  const handleDownload = () => {
    if (!processedImage) return;
    const link = document.createElement('a');
    link.href = processedImage;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const resetState = () => {
    setOriginalImage(null);
    setProcessedImage(null);
    setError(null);
    setIsLoading(false);
  }

  return (
    <div className="min-h-screen bg-base-100 text-gray-200 font-sans">
      <Header />
      <main className="container mx-auto px-4 py-8 md:py-12">
        {!originalImage ? (
          <ImageUploader onImageUpload={handleImageUpload} />
        ) : (
          <div>
            {error && (
              <div className="bg-red-500/20 border border-red-500 text-red-300 px-4 py-3 rounded-lg relative mb-6 text-center" role="alert">
                <strong className="font-bold">Erro: </strong>
                <span className="block sm:inline">{error}</span>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
              <ImageDisplay title="Original" imageSrc={originalImage} />
              <ImageDisplay title="Sem Marca D'água" imageSrc={processedImage} isLoading={isLoading} />
            </div>

            <div className="mt-8 flex flex-wrap justify-center items-center gap-4">
              {isLoading ? (
                <ActionButton onClick={() => {}} disabled={true}>
                  <SpinnerIcon />
                  Processando...
                </ActionButton>
              ) : processedImage ? (
                <>
                  <ActionButton onClick={handleDownload}>
                    <DownloadIcon />
                    Baixar Imagem
                  </ActionButton>
                  <ActionButton onClick={handleRetry}>
                    <RefreshIcon />
                    Tentar Novamente
                  </ActionButton>
                </>
              ) : error ? (
                 <ActionButton onClick={handleRetry}>
                    <RefreshIcon />
                    Tentar Novamente
                </ActionButton>
              ) : null }

              <button onClick={resetState} className="text-gray-400 hover:text-white transition-colors duration-200 px-4 py-2">
                Carregar Outra Imagem
              </button>
            </div>
          </div>
        )}
      </main>
      <footer className="text-center py-6 text-gray-500 text-sm">
        <p>Desenvolvido com React, Tailwind CSS e Gemini API.</p>
      </footer>
    </div>
  );
};

export default App;
