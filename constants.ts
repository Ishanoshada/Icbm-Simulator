
export interface LaunchSite {
  id: string;
  name: string;
  coordinates: { lat: number; lng: number };
  gravity: number; // m/s^2
  anomaly: string;
  description: string;
}

export const LAUNCH_SITES: LaunchSite[] = [
  {
    id: 'vavuniya',
    name: 'Vavuniya Control',
    coordinates: { lat: 8.7515, lng: 80.4975 },
    gravity: 9.79,
    anomaly: 'Baseline G',
    description: 'Northern Command. Standard reference for kinematic baseline.'
  },
  {
    id: 'hambantota',
    name: 'Hambantota Strategic',
    coordinates: { lat: 6.1245, lng: 81.1185 },
    gravity: 9.78,
    anomaly: '-100 mGal (Low G)',
    description: 'Southern Low-G Zone. Optimized for low-drag kinematic ascent.'
  }
];

export const GLOBAL_TARGETS = [
  // South Asia
  { name: 'New Delhi, India', lat: 28.6139, lng: 77.2090 },
  { name: 'Dhaka, Bangladesh', lat: 23.8103, lng: 90.4125 },
  { name: 'Islamabad, Pakistan', lat: 33.6844, lng: 73.0479 },
  { name: 'Kathmandu, Nepal', lat: 27.7172, lng: 85.3240 },
  { name: 'Kabul, Afghanistan', lat: 34.5553, lng: 69.1770 },
  
  // East & Southeast Asia
  { name: 'Beijing, China', lat: 39.9042, lng: 116.4074 },
  { name: 'Tokyo, Japan', lat: 35.6762, lng: 139.6503 },
  { name: 'Seoul, South Korea', lat: 37.5665, lng: 126.9780 },
  { name: 'Taipei, Taiwan', lat: 25.0330, lng: 121.5654 },
  { name: 'Jakarta, Indonesia', lat: -6.2088, lng: 106.8456 },
  { name: 'Singapore', lat: 1.3521, lng: 103.8198 },
  { name: 'Bangkok, Thailand', lat: 13.7563, lng: 100.5018 },
  { name: 'Hanoi, Vietnam', lat: 21.0285, lng: 105.8542 },
  { name: 'Manila, Philippines', lat: 14.5995, lng: 120.9842 },
  
  // Middle East & West Asia
  { name: 'Tehran, Iran', lat: 35.6892, lng: 51.3890 },
  { name: 'Riyadh, Saudi Arabia', lat: 24.7136, lng: 46.6753 },
  { name: 'Ankara, Turkey', lat: 39.9334, lng: 32.8597 },
  { name: 'Jerusalem, Israel', lat: 31.7683, lng: 35.2137 },
  { name: 'Baghdad, Iraq', lat: 33.3152, lng: 44.3661 },
  { name: 'Abu Dhabi, UAE', lat: 24.4539, lng: 54.3773 },

  // Europe & Russia
  { name: 'Moscow, Russia', lat: 55.7558, lng: 37.6173 },
  { name: 'London, UK', lat: 51.5074, lng: -0.1278 },
  { name: 'Paris, France', lat: 48.8566, lng: 2.3522 },
  { name: 'Berlin, Germany', lat: 52.5200, lng: 13.4050 },
  { name: 'Rome, Italy', lat: 41.9028, lng: 12.4964 },
  { name: 'Kiev, Ukraine', lat: 50.4501, lng: 30.5234 },
  { name: 'Madrid, Spain', lat: 40.4168, lng: -3.7038 },
  
  // Africa
  { name: 'Cairo, Egypt', lat: 30.0444, lng: 31.2357 },
  { name: 'Pretoria, South Africa', lat: -25.7479, lng: 28.2293 },
  { name: 'Nairobi, Kenya', lat: -1.2921, lng: 36.8219 },
  { name: 'Lagos, Nigeria', lat: 6.5244, lng: 3.3792 },
  { name: 'Addis Ababa, Ethiopia', lat: 9.0306, lng: 38.7469 },

  // Americas
  { name: 'Washington DC, USA', lat: 38.8951, lng: -77.0364 },
  { name: 'Ottawa, Canada', lat: 45.4215, lng: -75.6972 },
  { name: 'Mexico City, Mexico', lat: 19.4326, lng: -99.1332 },
  { name: 'Brasilia, Brazil', lat: -15.7975, lng: -47.8919 },
  { name: 'Buenos Aires, Argentina', lat: -34.6037, lng: -58.3816 },

  // Oceania
  { name: 'Canberra, Australia', lat: -35.2809, lng: 149.1300 },
  { name: 'Wellington, NZ', lat: -41.2865, lng: 174.7762 }
];

export const GLOBE_RADIUS = 5;

export const MISSILE_SPECS = {
  mass: 20000, // kg
  thrust: 350000, // Newtons
  burnTime: 180, // seconds
  standardPayload: 1000, // kg
};

export type ThemeType = 'white' | 'warm';

export const THEMES = {
  white: {
    bg: '#f8fafc',
    panelBg: 'bg-white/95',
    panelBorder: 'border-slate-200',
    text: 'text-slate-900',
    subtext: 'text-slate-500',
    textColor: '#0f172a', // Hex for inline styles
    subtextColor: '#64748b', // Hex for inline styles
    accent: '#ef4444', 
    globeIntensity: 0.9,
    globeTexture: 'https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg'
  },
  warm: {
    bg: '#fdf6e3',
    panelBg: 'bg-[#eee8d5]/95',
    panelBorder: 'border-[#93a1a1]/20',
    text: 'text-[#586e75]',
    subtext: 'text-[#93a1a1]',
    textColor: '#586e75', // Hex for inline styles
    subtextColor: '#93a1a1', // Hex for inline styles
    accent: '#cb4b16',
    globeIntensity: 0.8,
    globeTexture: 'https://unpkg.com/three-globe/example/img/earth-day.jpg'
  }
};

export const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371; // km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};
