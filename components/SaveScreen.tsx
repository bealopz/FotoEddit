
import React, { useMemo, useState } from 'react';
import { FILTERS } from '../constants';
import { AppState } from '../types';

interface SaveScreenProps {
  state: AppState;
  onNew: () => void;
  onBack: () => void;
}

const SaveScreen: React.FC<SaveScreenProps> = ({ state, onNew, onBack }) => {
  const [isSaving, setIsSaving] = useState(false);

  const activeFilter = useMemo(() => 
    FILTERS.find(f => f.id === state.selectedFilter) || FILTERS[0]
  , [state.selectedFilter]);

  const appliedFilterStyle = useMemo(() => {
    let filterStr = '';
    if (activeFilter.id !== 'original') {
      const parts = activeFilter.css.split(' ');
      const adjustedParts = parts.map(part => {
        const match = part.match(/([a-z-]+)\(([^)]+)\)/);
        if (!match) return part;
        const [_, func, val] = match;
        if (val.includes('%')) return `${func}(${(parseFloat(val) * state.intensity) / 100}%)`;
        if (val.includes('deg')) return `${func}(${(parseFloat(val) * state.intensity) / 100}deg)`;
        const num = parseFloat(val);
        return isNaN(num) ? part : `${func}(${num * (state.intensity / 100)})`;
      });
      filterStr = adjustedParts.join(' ');
    }
    filterStr += ` brightness(${state.brightness}%) contrast(${state.contrast}%) saturate(${state.saturation}%)`;
    return filterStr;
  }, [activeFilter, state.intensity, state.brightness, state.contrast, state.saturation]);

  const handleDownload = async () => {
    if (!state.image) return;
    setIsSaving(true);

    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      // Essential for downloading images from external URLs without security errors
      img.crossOrigin = "anonymous";
      img.src = state.image;

      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });

      // Set canvas size to original image size
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;

      if (ctx) {
        // 1. Apply Filters
        ctx.filter = appliedFilterStyle;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        // Reset filter for text
        ctx.filter = 'none';

        // 2. Draw Text
        if (state.text.content) {
          const fontSize = Math.max(40, canvas.width / 15); // Dynamic font size
          ctx.font = `bold ${fontSize}px Inter, sans-serif`;
          ctx.fillStyle = 'white';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          
          // Shadow/Glow effect matching CSS
          ctx.shadowColor = 'rgba(0,0,0,0.8)';
          ctx.shadowBlur = fontSize / 2;
          ctx.shadowOffsetY = fontSize / 5;

          const x = (canvas.width * state.text.x) / 100;
          const y = (canvas.height * state.text.y) / 100;
          
          ctx.fillText(state.text.content.toUpperCase(), x, y);
        }

        // 3. Trigger Download
        const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
        const link = document.createElement('a');
        link.download = `foto-edit-${Date.now()}.jpg`;
        link.href = dataUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      console.error("Error saving image:", error);
      alert("Hubo un error al procesar la imagen. Intenta con otra foto.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col animate-fadeIn">
      <header className="flex items-center justify-between px-4 py-4 z-20">
        <button onClick={onBack} className="size-10 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-700">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 className="font-bold text-lg text-slate-800">Resultado</h1>
        <div className="size-10"></div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-6 relative">
        <div className="relative w-full max-w-[320px] aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl ring-4 ring-slate-100 bg-black">
          <img 
            src={state.image!} 
            alt="Final result" 
            className="w-full h-full object-cover" 
            style={{ filter: appliedFilterStyle }}
          />
          {state.text.content && (
            <div 
              className="absolute pointer-events-none"
              style={{ 
                left: `${state.text.x}%`, 
                top: `${state.text.y}%`,
                transform: 'translate(-50%, -50%)'
              }}
            >
              <span className="text-white text-xl font-bold uppercase tracking-widest drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)] whitespace-nowrap">
                {state.text.content}
              </span>
            </div>
          )}
          
          <div className="absolute bottom-4 left-4 flex items-center gap-2 px-3 py-1.5 bg-black/40 backdrop-blur-md rounded-full">
            <span className="material-symbols-outlined text-sm text-primary">auto_fix_high</span>
            <span className="text-[10px] font-bold text-white uppercase tracking-wider">{activeFilter.name}</span>
          </div>
        </div>
      </main>

      <footer className="p-6 space-y-3">
        <button 
          onClick={handleDownload}
          disabled={isSaving}
          className="w-full h-14 bg-primary text-white rounded-2xl flex items-center justify-center gap-2 font-bold text-lg shadow-lg shadow-primary/20 transition-transform active:scale-95 disabled:opacity-50 disabled:scale-100"
        >
          {isSaving ? (
            <span className="material-symbols-outlined animate-spin">progress_activity</span>
          ) : (
            <span className="material-symbols-outlined">download</span>
          )}
          {isSaving ? 'Procesando...' : 'Descargar Foto'}
        </button>
        <button onClick={onBack} className="w-full h-14 bg-slate-100 text-slate-800 rounded-2xl flex items-center justify-center gap-2 font-semibold text-lg hover:bg-slate-200 transition-transform active:scale-95 border border-transparent">
          <span className="material-symbols-outlined">palette</span>
          Editar más
        </button>
        <button onClick={onNew} className="w-full py-4 text-slate-500 hover:text-slate-700 font-medium">
          Empezar Nueva
        </button>
      </footer>
    </div>
  );
};

export default SaveScreen;
