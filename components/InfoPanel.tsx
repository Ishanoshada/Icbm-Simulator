
import React from 'react';
import { Landmark } from '../types';
import { THEMES, ThemeType } from '../constants';

const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
);

interface InfoPanelProps {
  theme: ThemeType;
  landmark: Landmark | null;
  onClose: () => void;
}

const InfoPanel: React.FC<InfoPanelProps> = ({ theme, landmark, onClose }) => {
  if (!landmark) return null;
  const themeColors = THEMES[theme];

  return (
    <div className={`fixed top-6 left-6 w-80 ${themeColors.panelBg} backdrop-blur-xl border ${themeColors.panelBorder} rounded-2xl overflow-hidden shadow-2xl z-50 animate-in fade-in slide-in-from-left duration-300`}>
      <div className="relative h-40" style={{ background: `linear-gradient(to bottom right, ${themeColors.accent}, #f97316)` }}>
        <button 
          onClick={onClose}
          className="absolute top-3 right-3 p-1.5 bg-black/10 hover:bg-black/20 rounded-full transition-colors"
        >
          <CloseIcon />
        </button>
        <div className="absolute bottom-4 left-4">
          <span className="px-2 py-0.5 bg-black/20 text-[10px] uppercase tracking-widest font-bold rounded text-white">
            {landmark.category}
          </span>
          <h2 className="text-2xl font-bold mt-1 text-white">{landmark.name}</h2>
        </div>
      </div>
      
      <div className="p-6 space-y-4">
        <p className={`${themeColors.text} text-sm leading-relaxed opacity-80`}>
          {landmark.description}
        </p>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/5 p-3 rounded-xl border border-white/5">
            <span className={`${themeColors.subtext} text-[10px] uppercase block mb-1`}>Latitude</span>
            <span className="text-sm font-mono" style={{ color: themeColors.accent }}>{landmark.coordinates.lat.toFixed(4)}°N</span>
          </div>
          <div className="bg-white/5 p-3 rounded-xl border border-white/5">
            <span className={`${themeColors.subtext} text-[10px] uppercase block mb-1`}>Longitude</span>
            <span className="text-sm font-mono" style={{ color: themeColors.accent }}>{landmark.coordinates.lng.toFixed(4)}°E</span>
          </div>
        </div>

        <button 
          className="w-full py-3 font-semibold rounded-xl transition-all active:scale-95 text-sm"
          style={{ backgroundColor: themeColors.accent, color: theme === 'white' ? '#fff' : '#000' }}
        >
          Explore Locally
        </button>
      </div>
    </div>
  );
};

export default InfoPanel;
