
import React from 'react';

interface UploadScreenProps {
  onUpload: (imageUrl: string) => void;
}

const UploadScreen: React.FC<UploadScreenProps> = ({ onUpload }) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          onUpload(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex-1 flex flex-col p-6 animate-fadeIn items-center justify-center">
      <div className="absolute top-8 left-0 right-0 px-6 flex items-center justify-between w-full">
        <h1 className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">FotoEdit</h1>
        <button className="p-2 rounded-full hover:bg-white/10 transition-colors">
          <span className="material-symbols-outlined">settings</span>
        </button>
      </div>

      <div className="w-full flex flex-col items-center">
        <label className="relative w-full max-w-[320px] aspect-square flex flex-col items-center justify-center border-2 border-dashed border-primary/30 rounded-[40px] bg-primary/5 cursor-pointer group hover:bg-primary/10 transition-all overflow-hidden shadow-2xl">
          <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
          
          <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 via-purple-500/10 to-pink-500/10 blur-3xl rounded-full pointer-events-none -z-10"></div>
          
          <div className="flex flex-col items-center text-center p-6 space-y-4">
            <div className="size-24 rounded-full bg-primary flex items-center justify-center text-white shadow-xl shadow-primary/30 transform group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-5xl">add_a_photo</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-1">Cargar Foto</h2>
              <p className="text-white/40 text-sm max-w-[200px] leading-tight">
                Selecciona una fotografía de tu dispositivo para comenzar.
              </p>
            </div>
          </div>
        </label>
      </div>

      <div className="absolute bottom-12 w-full px-12 flex flex-col items-center space-y-4">
        <div className="text-[10px] uppercase tracking-[0.2em] text-white/20 font-bold">Estilo Pastel Minimalista</div>
      </div>
    </div>
  );
};

export default UploadScreen;
