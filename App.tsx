
import React, { useState, useCallback } from 'react';
import { AppScreen, AppState, TextState } from './types';
import UploadScreen from './components/UploadScreen';
import PreviewScreen from './components/PreviewScreen';
import EditScreen from './components/EditScreen';
import SaveScreen from './components/SaveScreen';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    screen: AppScreen.UPLOAD,
    image: null,
    selectedFilter: 'original',
    intensity: 75,
    brightness: 100,
    contrast: 100,
    saturation: 100,
    text: {
      content: '',
      x: 50,
      y: 50
    }
  });

  const handleUpload = useCallback((imageUrl: string) => {
    setState(prev => ({
      ...prev,
      image: imageUrl,
      screen: AppScreen.PREVIEW
    }));
  }, []);

  const handleContinue = useCallback(() => {
    setState(prev => ({ ...prev, screen: AppScreen.EDIT }));
  }, []);

  const handleBack = useCallback(() => {
    setState(prev => {
      if (prev.screen === AppScreen.PREVIEW) return { ...prev, screen: AppScreen.UPLOAD, image: null };
      if (prev.screen === AppScreen.EDIT) return { ...prev, screen: AppScreen.PREVIEW };
      if (prev.screen === AppScreen.SAVE) return { ...prev, screen: AppScreen.EDIT };
      return prev;
    });
  }, []);

  const handleSave = useCallback(() => {
    setState(prev => ({ ...prev, screen: AppScreen.SAVE }));
  }, []);

  const handleDiscard = useCallback(() => {
    setState({
      screen: AppScreen.UPLOAD,
      image: null,
      selectedFilter: 'original',
      intensity: 75,
      brightness: 100,
      contrast: 100,
      saturation: 100,
      text: { content: '', x: 50, y: 50 }
    });
  }, []);

  const updateState = useCallback((updates: Partial<AppState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  return (
    <div className="flex justify-center min-h-screen bg-background-dark overflow-hidden">
      <div className="w-full max-w-md bg-background-dark relative shadow-2xl overflow-hidden flex flex-col">
        {state.screen === AppScreen.UPLOAD && (
          <UploadScreen onUpload={handleUpload} />
        )}
        {state.screen === AppScreen.PREVIEW && (
          <PreviewScreen 
            image={state.image!} 
            onBack={handleBack} 
            onContinue={handleContinue} 
            onCancel={handleDiscard} 
          />
        )}
        {state.screen === AppScreen.EDIT && (
          <EditScreen 
            image={state.image!} 
            state={state}
            onUpdate={updateState}
            onSave={handleSave}
            onBack={handleBack}
          />
        )}
        {state.screen === AppScreen.SAVE && (
          <SaveScreen 
            state={state}
            onNew={handleDiscard}
            onBack={handleBack}
          />
        )}
      </div>
    </div>
  );
};

export default App;
