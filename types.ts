
export interface Landmark {
  id: string;
  name: string;
  position: [number, number, number]; // [x, y, z] for 3D space
  coordinates: { lat: number; lng: number };
  description: string;
  category: 'History' | 'Nature' | 'City' | 'Religious';
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}
