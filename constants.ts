
import { Filter } from './types';

export const FILTERS: Filter[] = [
  {
    id: 'original',
    name: 'Original',
    css: 'none',
    thumbnail: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=200&h=200&fit=crop'
  },
  {
    id: 'pastel-pink',
    name: 'Rosé',
    css: 'sepia(0.2) saturate(1.2) hue-rotate(-30deg) brightness(1.1)',
    thumbnail: 'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=200&h=200&fit=crop'
  },
  {
    id: 'golden',
    name: 'Golden',
    css: 'sepia(0.4) saturate(1.5) brightness(1.1) contrast(1.1)',
    thumbnail: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=200&h=200&fit=crop'
  },
  {
    id: 'lilac',
    name: 'Lilac',
    css: 'hue-rotate(260deg) saturate(0.9) brightness(1.1)',
    thumbnail: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=200&h=200&fit=crop'
  },
  {
    id: 'vintage',
    name: 'Retro',
    css: 'sepia(0.6) contrast(0.8) brightness(0.9) saturate(0.8)',
    thumbnail: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=200&h=200&fit=crop'
  },
  {
    id: 'emerald',
    name: 'Emerald',
    css: 'hue-rotate(90deg) saturate(1.2) brightness(0.9)',
    thumbnail: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=200&h=200&fit=crop'
  },
  {
    id: 'cyber',
    name: 'Cyber',
    css: 'hue-rotate(160deg) saturate(2) brightness(1.1) contrast(1.3)',
    thumbnail: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=200&h=200&fit=crop'
  },
  {
    id: 'noir',
    name: 'Noir',
    css: 'grayscale(1) contrast(1.4) brightness(0.8)',
    thumbnail: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=200&h=200&fit=crop'
  },
  {
    id: 'faded',
    name: 'Faded',
    css: 'opacity(0.9) brightness(1.2) contrast(0.7) saturate(0.6)',
    thumbnail: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=200&h=200&fit=crop'
  },
  {
    id: 'arctic',
    name: 'Arctic',
    css: 'hue-rotate(190deg) saturate(0.5) brightness(1.2) contrast(1.1)',
    thumbnail: 'https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?w=200&h=200&fit=crop'
  },
  {
    id: 'sunset',
    name: 'Sunset',
    css: 'hue-rotate(-40deg) saturate(1.8) brightness(1.1)',
    thumbnail: 'https://images.unsplash.com/photo-1433086566088-e7473fb1702c?w=200&h=200&fit=crop'
  }
];
