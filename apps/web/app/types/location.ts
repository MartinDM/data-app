export interface MapLocation {
  id: string;
  type: 'home' | 'work' | 'recent' | 'frequent';
  coords: { lat: number; lng: number };
  title: string;
  description: string;
  timestamp?: Date;
}
