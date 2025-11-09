import React, { useState } from 'react';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { ImageDisplay } from './components/ImageDisplay';
import { ActionButton } from './components/ActionButton';
import { removeWatermark } from './services/geminiService';
import { DownloadIcon, RefreshIcon, SpinnerIcon, SparklesIcon } from './components/Icons';

type ImageJobStatus = 'queued' | 'processing' | 'success' | 'error';

interface ImageJob {
  id: string;
  file: File;
  originalSrc: string;
  processedSrc: string | null;
  status: ImageJobStatus;
  error?: string;
}

const App: React.FC = () => {
  const [imageJobs, setImageJobs] = useState<ImageJob[]>([]);

  const processImage = async (jobId: string) => {
    const jobToProcess = imageJobs.find(job => job.id === jobId);
    if (!jobToProcess) return;

    // Use the last processed image for refinement, or the original for the first pass.
    const sourceImage = jobToProcess.processedSrc || jobToProcess.originalSrc;
    
    setImageJobs(prev => prev.map(j => j.id === jobId ? { ...j, status: 'processing', error: undefined } : j));

    try {
      const base64Data = sourceImage.split(',')[1];
      const resultBase64 = await removeWatermark(base64Data, jobToProcess.file.type);
      const newProcessedSrc = `data:${jobToProcess.file.type};base64,${resultBase64}`;
      setImageJobs(prev => prev.map(j => j.id === jobId ? { ...j, status: 'success', processedSrc: newProcessedSrc } : j));
    } catch (err) {
      console.error(err);
      setImageJobs(prev => prev.map(j => j.id === jobId ? { ...j, status: 'error', error: 'Falha ao processar imagem.' } : j));
    }
  };


  const handleImageUpload = (files: File[]) => {
    const fileReadPromises = files.map(file => {
      return new Promise<{ file: File; originalSrc: string }>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = e => {
          const result = e.target?.result as string;
          resolve({ file, originalSrc: result });
        };
        reader.onerror = err => {
          console.error("Falha ao ler o arquivo:", file.name);
          reject(err);
        };
        reader.readAsDataURL(file);
      });
    });
  
    Promise.all(fileReadPromises)
      .then(loadedFiles => {
        setImageJobs(prevJobs => {
          const existingSrcs = new Set(prevJobs.map(j => j.originalSrc));
          const newJobs: ImageJob[] = [];
  
          loadedFiles.forEach((loadedFile, index) => {
            if (!existingSrcs.has(loadedFile.originalSrc)) {
              existingSrcs.add(loadedFile.originalSrc);
              newJobs.push({
                id: `${loadedFile.file.name}-${Date.now()}-${index}`,
                file: loadedFile.file,
                originalSrc: loadedFile.originalSrc,
                processedSrc: null,
                status: 'queued',
              });
            }
          });
  
          return [...prevJobs, ...newJobs];
        });
      })
      .catch(error => {
        console.error("Ocorreu um erro ao carregar as imagens:", error);
      });
  };
  
  const handleDownload = (job: ImageJob) => {
    if (!job.processedSrc) return;
    const link = document.createElement('a');
    link.href = job.processedSrc;
    link.download = `sem_marca_${job.file.name}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const resetState = () => {
    setImageJobs([]);
  };

  return (
    <div className="min-h-screen bg-base-100 text-gray-200 font-sans">
      <Header />
      <main className="container mx-auto px-4 py-8 md:py-12">
        {imageJobs.length === 0 ? (
          <ImageUploader onImageUpload={handleImageUpload} />
        ) : (
          <div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {imageJobs.map(job => (
                <div key={job.id} className="bg-base-200 p-4 rounded-2xl shadow-lg border border-base-300 flex flex-col">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                    <ImageDisplay title="Original" imageSrc={job.originalSrc} />
                    <ImageDisplay title="Resultado" imageSrc={job.processedSrc} isLoading={job.status === 'processing'} />
                  </div>
                  {job.status === 'error' && (
                     <div className="bg-red-500/20 text-red-300 px-3 py-2 rounded-lg mt-4 text-center text-sm" role="alert">
                       {job.error}
                     </div>
                  )}
                  <div className="mt-4 flex-grow flex flex-wrap justify-center items-center gap-3">
                    {job.status === 'queued' && (
                       <ActionButton onClick={() => processImage(job.id)}>
                         Remover Marca D'água
                       </ActionButton>
                    )}
                    {job.status === 'success' && (
                      <>
                        <ActionButton onClick={() => handleDownload(job)}>
                          <DownloadIcon />
                          Baixar
                        </ActionButton>
                        <button onClick={() => processImage(job.id)} className="inline-flex items-center justify-center gap-2 px-6 py-3 font-semibold text-gray-300 bg-base-300 rounded-full hover:bg-gray-600 transition-colors">
                          <SparklesIcon />
                          Aprimorar Resultado
                        </button>
                      </>
                    )}
                     {job.status === 'error' && (
                      <button onClick={() => processImage(job.id)} className="inline-flex items-center justify-center gap-2 px-6 py-3 font-semibold text-gray-300 bg-base-300 rounded-full hover:bg-gray-600 transition-colors">
                        <RefreshIcon />
                        Tentar Novamente
                      </button>
                    )}
                    {job.status === 'processing' && (
                       <div className="inline-flex items-center justify-center gap-3 px-8 py-4 font-semibold text-white">
                         <SpinnerIcon />
                         Processando...
                       </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
             <div className="mt-12 text-center">
                <button onClick={resetState} className="text-gray-400 hover:text-white transition-colors duration-200 px-6 py-3 bg-base-200 rounded-full">
                  Carregar Novas Imagens
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
