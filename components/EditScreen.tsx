
import React, { useMemo, useState, useRef } from 'react';
import { FILTERS } from '../constants';
import { AppState } from '../types';

interface EditScreenProps {
  image: string;
  state: AppState;
  onUpdate: (updates: Partial<AppState>) => void;
  onSave: () => void;
  onBack: () => void;
}

type EditMode = 'filters' | 'crop' | 'adjust' | 'text';

const EditScreen: React.FC<EditScreenProps> = ({ 
  image, 
  state,
  onUpdate,
  onSave,
  onBack 
}) => {
  const [mode, setMode] = useState<EditMode>('filters');
  const [aspectRatio, setAspectRatio] = useState('free');
  const [isDragging, setIsDragging] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);

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

  const handlePointerDown = (e: React.PointerEvent) => {
    if (mode === 'text' && state.text.content) {
      setIsDragging(true);
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || !containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    onUpdate({ 
      text: { 
        ...state.text, 
        x: Math.min(Math.max(x, 5), 95), 
        y: Math.min(Math.max(y, 5), 95) 
      } 
    });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-background-dark animate-fadeIn">
      <header className="flex items-center justify-between px-4 py-4 z-20">
        <button onClick={onBack} className="size-10 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors">
          <span className="material-symbols-outlined">close</span>
        </button>
        <h1 className="font-bold text-lg">Editor</h1>
        <button onClick={onSave} className="px-5 py-1.5 bg-primary text-white rounded-full font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all active:scale-95">
          Listo
        </button>
      </header>

      <main className="flex-1 relative flex items-center justify-center p-4">
        <div 
          ref={containerRef}
          className={`relative transition-all duration-500 overflow-hidden flex items-center justify-center bg-black rounded-2xl shadow-2xl
            ${aspectRatio === '1:1' ? 'aspect-square w-full max-w-[340px]' : 
              aspectRatio === '4:5' ? 'aspect-[4/5] w-full max-w-[340px]' : 
              aspectRatio === '16:9' ? 'aspect-[16/9] w-full' : 'max-h-full w-auto'}`}
        >
          <img 
            src={image} 
            className="w-full h-full object-cover transition-all"
            style={{ filter: appliedFilterStyle }}
          />
          
          {state.text.content && (
            <div 
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              className={`absolute cursor-move select-none p-3 rounded-lg border-2 transition-colors
                ${mode === 'text' ? 'border-primary/50 bg-black/20 backdrop-blur-sm' : 'border-transparent'}
                ${isDragging ? 'scale-105 shadow-xl' : ''}`}
              style={{ 
                left: `${state.text.x}%`, 
                top: `${state.text.y}%`,
                transform: 'translate(-50%, -50%)'
              }}
            >
              <span className="text-white text-xl font-bold uppercase tracking-widest drop-shadow-lg whitespace-nowrap">
                {state.text.content}
              </span>
            </div>
          )}
        </div>
      </main>

      <section className="bg-[#1a1f2e] border-t border-white/5 rounded-t-[40px] p-6 pb-10 space-y-6 z-30 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
        <div className="min-h-[140px] flex flex-col justify-center">
          {mode === 'filters' && (
            <div className="space-y-6">
              <input 
                type="range" min="0" max="100" value={state.intensity} 
                onChange={(e) => onUpdate({ intensity: parseInt(e.target.value) })}
                className="w-full accent-primary h-1 bg-white/10 rounded-full appearance-none cursor-pointer"
              />
              <div className="flex gap-4 overflow-x-auto no-scrollbar snap-x">
                {FILTERS.map(filter => (
                  <button key={filter.id} onClick={() => onUpdate({ selectedFilter: filter.id })} className="flex flex-col items-center gap-2 flex-shrink-0">
                    <div className={`size-16 rounded-2xl overflow-hidden border-2 p-0.5 transition-all ${state.selectedFilter === filter.id ? 'border-primary ring-4 ring-primary/20' : 'border-transparent hover:border-white/10'}`}>
                      <div className="w-full h-full rounded-xl bg-cover bg-center" style={{ backgroundImage: `url(${filter.thumbnail})`, filter: filter.id === 'original' ? 'none' : filter.css }} />
                    </div>
                    <span className={`text-[9px] font-bold ${state.selectedFilter === filter.id ? 'text-primary' : 'text-white/40'}`}>{filter.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {mode === 'adjust' && (
            <div className="space-y-4">
              {[
                { key: 'brightness', label: 'Brillo', icon: 'light_mode' },
                { key: 'contrast', label: 'Contraste', icon: 'contrast' },
                { key: 'saturation', label: 'Saturación', icon: 'palette' },
              ].map((adj) => (
                <div key={adj.key} className="flex items-center gap-4">
                  <span className="material-symbols-outlined text-white/40 text-sm">{adj.icon}</span>
                  <input 
                    type="range" min="0" max="200" value={(state as any)[adj.key]} 
                    onChange={(e) => onUpdate({ [adj.key]: parseInt(e.target.value) })}
                    className="flex-1 accent-primary h-1 bg-white/10 rounded-full appearance-none cursor-pointer"
                  />
                  <span className="text-[10px] font-bold text-white/60 w-8">{(state as any)[adj.key]}%</span>
                </div>
              ))}
            </div>
          )}

          {mode === 'crop' && (
            <div className="flex justify-center gap-6">
              {[
                { label: 'Original', val: 'free', icon: 'aspect_ratio' },
                { label: '1:1', val: '1:1', icon: 'square' },
                { label: '4:5', val: '4:5', icon: 'portrait' },
                { label: '16:9', val: '16:9', icon: 'rectangle' },
              ].map((ratio) => (
                <button key={ratio.val} onClick={() => setAspectRatio(ratio.val)} className={`flex flex-col items-center gap-2 transition-all ${aspectRatio === ratio.val ? 'text-primary scale-110' : 'text-white/40 hover:text-white/60'}`}>
                  <span className="material-symbols-outlined text-2xl">{ratio.icon}</span>
                  <span className="text-[10px] font-bold">{ratio.label}</span>
                </button>
              ))}
            </div>
          )}

          {mode === 'text' && (
            <div className="space-y-4">
              <input 
                type="text" 
                value={state.text.content}
                onChange={(e) => onUpdate({ text: { ...state.text, content: e.target.value } })}
                placeholder="Escribe tu texto aquí..."
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:border-primary text-base transition-colors"
                autoFocus
              />
              <p className="text-[10px] text-white/30 text-center uppercase tracking-widest font-bold">
                Mueve el texto arrastrándolo sobre la foto
              </p>
            </div>
          )}
        </div>

        <div className="flex items-center justify-around pt-4 border-t border-white/5">
          {[
            { id: 'filters', icon: 'filter_vintage', label: 'Filtros' },
            { id: 'crop', icon: 'crop', label: 'Recortar' },
            { id: 'adjust', icon: 'tune', label: 'Ajustes' },
            { id: 'text', icon: 'title', label: 'Texto' }
          ].map(m => (
            <button key={m.id} onClick={() => setMode(m.id as any)} className={`flex flex-col items-center gap-1 transition-all ${mode === m.id ? 'text-primary scale-110 font-bold' : 'text-white/40 hover:text-white/60'}`}>
              <span className="material-symbols-outlined">{m.icon}</span>
              <span className="text-[9px] uppercase tracking-tighter">{m.label}</span>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
};

export default EditScreen;
