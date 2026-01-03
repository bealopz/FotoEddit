
import React from 'react';

interface PreviewScreenProps {
  image: string;
  onBack: () => void;
  onContinue: () => void;
  onCancel: () => void;
}

const PreviewScreen: React.FC<PreviewScreenProps> = ({ image, onBack, onContinue, onCancel }) => {
  return (
    <div className="flex-1 flex flex-col animate-fadeIn">
      <header className="flex items-center px-4 py-4 z-20">
        <button 
          onClick={onBack}
          className="size-10 flex items-center justify-center rounded-full hover:bg-black/5 transition-colors text-slate-700"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 className="flex-1 text-center font-bold text-lg pr-10 text-slate-800">Vista Previa</h1>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-6 relative">
        <div className="w-full max-w-[320px] aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl ring-4 ring-white relative bg-black">
          <img src={image} alt="Preview" className="w-full h-full object-cover" />
        </div>
        
        <p className="mt-8 text-slate-600 text-sm font-medium text-center max-w-[240px]">
          ¿Te gusta cómo se ve? Confirma para comenzar a editar.
        </p>
      </main>

      <footer className="p-6 space-y-3">
        <button 
          onClick={onContinue}
          className="w-full h-14 bg-primary text-white rounded-2xl flex items-center justify-center gap-2 font-bold text-lg shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all active:scale-[0.98]"
        >
          Continuar
          <span className="material-symbols-outlined">check</span>
        </button>
        
        <button 
          onClick={onCancel}
          className="w-full h-14 bg-white/60 text-slate-800 rounded-2xl flex items-center justify-center gap-2 font-semibold text-lg hover:bg-white/80 transition-all active:scale-[0.98] border border-white/20"
        >
          <span className="material-symbols-outlined text-xl">image_search</span>
          Elegir otra
        </button>
      </footer>
    </div>
  );
};

export default PreviewScreen;
