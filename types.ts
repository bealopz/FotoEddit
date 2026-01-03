
export enum AppScreen {
  UPLOAD = 'UPLOAD',
  PREVIEW = 'PREVIEW',
  EDIT = 'EDIT',
  SAVE = 'SAVE'
}

export interface Filter {
  id: string;
  name: string;
  css: string;
  thumbnail: string;
}

export interface TextState {
  content: string;
  x: number; // percentage 0-100
  y: number; // percentage 0-100
}

export interface AppState {
  screen: AppScreen;
  image: string | null;
  selectedFilter: string;
  intensity: number;
  text: TextState;
  brightness: number;
  contrast: number;
  saturation: number;
}
