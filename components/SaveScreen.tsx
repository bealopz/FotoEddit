
import React, { useMemo } from 'react';
import { FILTERS } from '../constants';
import { AppState } from '../types';

interface SaveScreenProps {
  state: AppState;
  onNew: () => void;
  onBack: () => void;
}

const SaveScreen: React.FC<SaveScreenProps> = ({ state, onNew, onBack }) => {
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

  return (
    <div className="flex-1 flex flex-col bg-background-dark animate-fadeIn">
      <header className="flex items-center justify-between px-4 py-4 z-20">
        <button onClick={onBack} className="size-10 flex items-center justify-center rounded-full hover:bg-white/10">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 className="font-bold text-lg">Resultado</h1>
        <div className="size-10"></div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-6 relative">
        <div className="absolute w-full h-full bg-gradient-to-tr from-green-500/10 via-blue-500/10 to-purple-500/10 blur-[80px] rounded-full"></div>
        
        <div className="relative w-full max-w-[320px] aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl ring-1 ring-white/10 bg-black">
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
        <button className="w-full h-14 bg-primary rounded-2xl flex items-center justify-center gap-2 font-bold text-lg shadow-lg shadow-primary/20 transition-transform active:scale-95">
          <span className="material-symbols-outlined">download</span>
          Descargar Foto
        </button>
        <button onClick={onBack} className="w-full h-14 bg-white/5 rounded-2xl flex items-center justify-center gap-2 font-semibold text-lg hover:bg-white/10 transition-transform active:scale-95">
          <span className="material-symbols-outlined">palette</span>
          Editar más
        </button>
        <button onClick={onNew} className="w-full py-4 text-white/40 hover:text-white/60 font-medium">
          Empezar Nueva
        </button>
      </footer>
    </div>
  );
};

export default SaveScreen;
