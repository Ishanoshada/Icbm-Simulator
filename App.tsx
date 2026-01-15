
import React, { useState, useEffect, useMemo } from 'react';
import MapScene from './components/MapScene';
import { LAUNCH_SITES, GLOBAL_TARGETS, MISSILE_SPECS, THEMES, ThemeType, calculateDistance } from './constants';
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight, ExternalLink, Github } from 'lucide-react';

const App: React.FC = () => {
  const [activeSiteId, setActiveSiteId] = useState(LAUNCH_SITES[1].id);
  const [targetCoords, setTargetCoords] = useState({ lat: 28.6139, lng: 77.2090 });
  const [isLaunched, setIsLaunched] = useState(false);
  const [progress, setProgress] = useState(0);
  const [coords, setCoords] = useState({ lat: 0, lng: 0, alt: 0 });
  const [currentTheme, setCurrentTheme] = useState<ThemeType>('white');
  const [showComparison, setShowComparison] = useState(false);
  const [showGlobalReach, setShowGlobalReach] = useState(false);
  const [showControlsMobile, setShowControlsMobile] = useState(false);
  const [rotationInput, setRotationInput] = useState({ x: 0, y: 0 });

  const theme = THEMES[currentTheme];

  const calculateMetrics = (site: any, target: { lat: number, lng: number }) => {
    const dist = calculateDistance(site.coordinates.lat, site.coordinates.lng, target.lat, target.lng);
    const acc = (MISSILE_SPECS.thrust - (MISSILE_SPECS.mass * site.gravity)) / MISSILE_SPECS.mass;
    const strategicCoeff = site.id === 'hambantota' ? 0.995 : 1.0; 
    const estTime = Math.sqrt((2 * dist * 1000) / acc) * strategicCoeff;
    const endPhaseVelocity = Math.sqrt(2 * acc * dist * 1000);
    const impactEnergy = 0.5 * MISSILE_SPECS.mass * Math.pow(endPhaseVelocity, 2) / 1e9;
    const loadLoss = (site.gravity * MISSILE_SPECS.mass) / 1000;
    return { dist, acc, estTime, endPhaseVelocity, impactEnergy, loadLoss };
  };

  const comparisonData = useMemo(() => 
    LAUNCH_SITES.map(site => ({ ...site, ...calculateMetrics(site, targetCoords) })), 
    [targetCoords]
  );

  const globalReachData = useMemo(() => {
    return GLOBAL_TARGETS.map(target => {
      const vMetrics = calculateMetrics(LAUNCH_SITES[0], target);
      const hMetrics = calculateMetrics(LAUNCH_SITES[1], target);
      return {
        name: target.name,
        coords: target,
        vTime: vMetrics.estTime,
        hTime: hMetrics.estTime,
        vVel: vMetrics.endPhaseVelocity,
        hVel: vMetrics.endPhaseVelocity,
        dist: (vMetrics.dist + hMetrics.dist) / 2,
        timeDelta: vMetrics.estTime - hMetrics.estTime,
        efficiencyGain: ((vMetrics.estTime / hMetrics.estTime) - 1) * 100
      };
    });
  }, []);

  const globalAverages = useMemo(() => {
    const totalDelta = globalReachData.reduce((acc, curr) => acc + curr.timeDelta, 0);
    const avgEfficiency = globalReachData.reduce((acc, curr) => acc + curr.efficiencyGain, 0) / globalReachData.length;
    return {
      avgTimeAdvantage: totalDelta / globalReachData.length,
      avgEfficiency
    };
  }, [globalReachData]);

  const activeData = useMemo(() => comparisonData.find(d => d.id === activeSiteId)!, [comparisonData, activeSiteId]);
  const efficiencyIndex = ((comparisonData[0].estTime / comparisonData[1].estTime) - 1) * 100;
  const timeDelta = Math.abs(comparisonData[0].estTime - comparisonData[1].estTime);

  useEffect(() => {
    let interval: any;
    if (isLaunched && progress < 1) {
      const step = 0.005 / (activeData.dist / 2400); 
      interval = setInterval(() => {
        setProgress(prev => Math.min(prev + step, 1));
      }, 50);
    } else if (progress >= 1) {
      setIsLaunched(false);
    }
    return () => clearInterval(interval);
  }, [isLaunched, progress, activeData.dist]);

  const blockPointer = (e: any) => {
    e.stopPropagation();
    if (e.nativeEvent) e.nativeEvent.stopImmediatePropagation();
  };

  const isPresetTarget = GLOBAL_TARGETS.some(t => t.lat === targetCoords.lat && t.lng === targetCoords.lng);

  return (
    <div className={`relative w-screen h-screen ${theme.bg} ${theme.text} overflow-hidden font-sans transition-colors duration-700`}>
      {/* HEADER */}
      <header className="absolute top-0 left-0 w-full p-4 md:p-8 z-50 flex flex-col md:flex-row justify-between items-center md:items-start pointer-events-none gap-4">
        <div className="pointer-events-auto w-full md:w-auto flex flex-col items-center md:items-start" onPointerDown={blockPointer} onPointerUp={blockPointer} onClick={blockPointer}>
          <div className="flex items-center gap-2 md:gap-3">
            <div className="w-1 md:w-1.5 h-6 md:h-8" style={{ backgroundColor: theme.accent }} />
            <h1 className="text-2xl md:text-4xl font-black tracking-[-0.05em] leading-none">
              STRAT<span style={{ color: theme.accent }}>-X ICBM</span>
            </h1>
          </div>
          <div className={`${theme.subtext} text-[8px] md:text-[10px] font-mono uppercase tracking-[0.2em] md:tracking-[0.3em] mt-1 md:mt-2 ml-0 md:ml-4`}>
            Precision Ballistic Simulation v12.1
          </div>
        </div>

        <div className="pointer-events-auto flex flex-wrap justify-center md:justify-end gap-2" onPointerDown={blockPointer} onPointerUp={blockPointer} onClick={blockPointer}>
          <button 
            onClick={() => {
              setShowGlobalReach(!showGlobalReach);
              setShowComparison(false);
              setShowControlsMobile(false);
            }}
            className={`${theme.panelBg} border ${theme.panelBorder} px-3 md:px-6 py-2 rounded-full backdrop-blur-xl shadow-lg text-[9px] md:text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all outline-none`}
            style={{ 
              color: showGlobalReach ? '#fff' : theme.textColor, 
              backgroundColor: showGlobalReach ? theme.accent : undefined 
            }}
          >
            {showGlobalReach ? 'Hide Profile' : 'Reach Profile'}
          </button>
          
          <button 
            onClick={() => {
               setShowComparison(!showComparison);
               setShowGlobalReach(false);
               setShowControlsMobile(false);
               if (progress > 0) setProgress(0); 
            }}
            className={`${theme.panelBg} border ${theme.panelBorder} px-3 md:px-6 py-2 rounded-full backdrop-blur-xl shadow-lg text-[9px] md:text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all outline-none`}
            style={{ 
              color: showComparison ? '#fff' : theme.textColor, 
              backgroundColor: showComparison ? theme.accent : undefined 
            }}
          >
            {showComparison ? 'Hide Analytics' : 'Dual Analytics'}
          </button>

          <button 
            onClick={() => {
              setShowControlsMobile(!showControlsMobile);
              setShowGlobalReach(false);
              setShowComparison(false);
            }}
            className={`md:hidden ${theme.panelBg} border ${theme.panelBorder} px-3 py-2 rounded-full backdrop-blur-xl shadow-lg text-[9px] font-black uppercase tracking-widest hover:scale-105 transition-all outline-none`}
            style={{ 
              color: showControlsMobile ? '#fff' : theme.textColor, 
              backgroundColor: showControlsMobile ? theme.accent : undefined 
            }}
          >
            {showControlsMobile ? 'Hide Console' : 'Console'}
          </button>
          
          <div className={`${theme.panelBg} border ${theme.panelBorder} px-1.5 py-1.5 rounded-full backdrop-blur-xl flex gap-1 shadow-lg`}>
            {(['white', 'warm'] as ThemeType[]).map((t) => (
              <button key={t} onClick={() => setCurrentTheme(t)} className={`w-6 h-6 md:w-9 md:h-9 rounded-full border-2 transition-all flex items-center justify-center text-[10px] md:text-base ${currentTheme === t ? 'scale-110 border-current shadow-md' : 'border-transparent opacity-40 hover:opacity-100'} ${t === 'white' ? 'bg-white text-slate-900' : 'bg-[#fdf6e3] text-[#586e75]'}`}>
                {t === 'white' ? '○' : '◎'}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* MOBILE DIRECTIONAL CONTROLS */}
      <div className="md:hidden absolute bottom-40 right-4 z-50 flex flex-col items-center gap-1 pointer-events-none" onPointerDown={blockPointer}>
        <div className="flex flex-col gap-1">
          <button 
            onPointerDown={() => setRotationInput(prev => ({ ...prev, y: -0.05 }))}
            onPointerUp={() => setRotationInput(prev => ({ ...prev, y: 0 }))}
            onPointerLeave={() => setRotationInput(prev => ({ ...prev, y: 0 }))}
            className="pointer-events-auto w-12 h-12 flex items-center justify-center bg-black/60 backdrop-blur-md rounded-full border border-white/20 text-white active:bg-red-600 transition-colors"
          >
            <ChevronUp size={24} />
          </button>
          <div className="flex gap-1">
            <button 
              onPointerDown={() => setRotationInput(prev => ({ ...prev, x: -0.05 }))}
              onPointerUp={() => setRotationInput(prev => ({ ...prev, x: 0 }))}
              onPointerLeave={() => setRotationInput(prev => ({ ...prev, x: 0 }))}
              className="pointer-events-auto w-12 h-12 flex items-center justify-center bg-black/60 backdrop-blur-md rounded-full border border-white/20 text-white active:bg-red-600 transition-colors"
            >
              <ChevronLeft size={24} />
            </button>
            <button 
              onPointerDown={() => setRotationInput(prev => ({ ...prev, y: 0.05 }))}
              onPointerUp={() => setRotationInput(prev => ({ ...prev, y: 0 }))}
              onPointerLeave={() => setRotationInput(prev => ({ ...prev, y: 0 }))}
              className="pointer-events-auto w-12 h-12 flex items-center justify-center bg-black/60 backdrop-blur-md rounded-full border border-white/20 text-white active:bg-red-600 transition-colors"
            >
              <ChevronDown size={24} />
            </button>
            <button 
              onPointerDown={() => setRotationInput(prev => ({ ...prev, x: 0.05 }))}
              onPointerUp={() => setRotationInput(prev => ({ ...prev, x: 0 }))}
              onPointerLeave={() => setRotationInput(prev => ({ ...prev, x: 0 }))}
              className="pointer-events-auto w-12 h-12 flex items-center justify-center bg-black/60 backdrop-blur-md rounded-full border border-white/20 text-white active:bg-red-600 transition-colors"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* GLOBAL REACH DASHBOARD */}
      {showGlobalReach && (
        <div className="absolute top-36 md:top-28 left-4 right-4 md:left-8 md:right-auto bottom-48 md:bottom-28 z-50 md:w-[420px] pointer-events-none animate-in slide-in-from-left duration-500">
          <div className={`pointer-events-auto h-full ${theme.panelBg} border ${theme.panelBorder} p-5 md:p-8 rounded-[2rem] md:rounded-[3rem] shadow-2xl backdrop-blur-2xl flex flex-col`} onPointerDown={blockPointer} onPointerUp={blockPointer} onClick={blockPointer}>
            <div className="flex justify-between items-center mb-4 md:mb-6">
               <h2 className="text-lg md:text-xl font-black uppercase tracking-tighter italic">Global Reach</h2>
               <div className="text-[8px] md:text-[9px] font-bold text-white bg-red-600 px-2 md:px-3 py-1 md:py-1.5 rounded-full">LIVE SIM</div>
            </div>

            <div className="grid grid-cols-2 gap-3 md:gap-4 mb-4 md:mb-6 bg-black/5 p-4 md:p-5 rounded-2xl md:rounded-3xl border border-white/10">
               <div>
                  <div className="text-xl md:text-2xl font-black text-green-600">+{globalAverages.avgEfficiency.toFixed(2)}%</div>
                  <div className="text-[7px] md:text-[8px] font-black uppercase opacity-60 leading-none">Efficiency Gain</div>
               </div>
               <div className="text-right">
                  <div className="text-xl md:text-2xl font-black text-slate-800">-{globalAverages.avgTimeAdvantage.toFixed(1)}s</div>
                  <div className="text-[7px] md:text-[8px] font-black uppercase opacity-60 leading-none">Arrival Delta</div>
               </div>
            </div>

            <div className="flex-1 overflow-y-auto pr-1 space-y-3 md:space-y-4 scrollbar-hide">
              {!isPresetTarget && (
                 <div className="p-4 md:p-5 rounded-[1.5rem] md:roundedContainer bg-red-600/10 border-2 border-red-500/30">
                    <div className="flex justify-between items-center mb-2">
                       <span className="text-[9px] md:text-[10px] font-black uppercase text-red-600">MANUAL TARGET</span>
                       <span className="text-[8px] md:text-[9px] font-mono bg-red-600 text-white px-2 py-0.5 rounded">DYNAMIC</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 md:gap-4">
                       <div>
                          <span className="text-[6px] md:text-[7px] uppercase font-black opacity-50 block">Time Delta</span>
                          <span className="text-xs md:text-sm font-black">-{timeDelta.toFixed(1)}s</span>
                       </div>
                       <div className="text-right">
                          <span className="text-[6px] md:text-[7px] uppercase font-black opacity-50 block">Efficiency</span>
                          <span className="text-xs md:text-sm font-black text-green-600">+{efficiencyIndex.toFixed(2)}%</span>
                       </div>
                    </div>
                 </div>
              )}

              {globalReachData.map((target) => {
                const isActive = target.coords.lat === targetCoords.lat && target.coords.lng === targetCoords.lng;
                return (
                  <button 
                    key={target.name}
                    onClick={() => setTargetCoords(target.coords)}
                    className={`w-full text-left p-4 md:p-5 rounded-[1.5rem] md:rounded-[2rem] transition-all border outline-none ${isActive ? 'bg-red-600/5 border-red-500/50 shadow-inner' : 'bg-black/5 border-transparent hover:bg-black/10'}`}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className={`text-[10px] md:text-xs font-black uppercase ${isActive ? 'text-red-600' : ''}`}>{target.name}</span>
                      <span className="text-[8px] md:text-[9px] font-mono opacity-50">{target.dist.toFixed(0)} KM</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 md:gap-6">
                      <div className="space-y-1">
                        <div className="flex justify-between items-center text-[6px] md:text-[7px] font-black uppercase opacity-40">
                           <span>Base</span><span>{target.vTime.toFixed(1)}s</span>
                        </div>
                        <div className="flex justify-between items-center text-[6px] md:text-[7px] font-black uppercase text-red-600">
                           <span>Strat</span><span>{target.hTime.toFixed(1)}s</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-[7px] md:text-[8px] uppercase font-black opacity-40 block">Gain</span>
                        <span className="text-xs md:text-sm font-black text-green-600">+{target.efficiencyGain.toFixed(2)}%</span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* DUAL-SITE ANALYTICS */}
      {showComparison && !showGlobalReach && (
        <div className="absolute top-36 md:top-28 left-4 right-4 md:left-8 md:right-auto z-50 md:w-[350px] pointer-events-none animate-in slide-in-from-left duration-500">
          <div className={`pointer-events-auto ${theme.panelBg} border ${theme.panelBorder} p-5 md:p-7 rounded-[2rem] md:rounded-[2.5rem] shadow-2xl backdrop-blur-xl flex flex-col`} onPointerDown={blockPointer} onPointerUp={blockPointer} onClick={blockPointer}>
             <div className="flex justify-between items-center mb-4 md:mb-6">
                <h2 className="text-lg md:text-xl font-black uppercase italic tracking-tighter">Kinematic Feed</h2>
                <div className="text-[8px] font-bold text-red-600 bg-red-100 px-2 py-1 rounded">DUAL SYNC</div>
             </div>
             
             <div className="space-y-3 md:space-y-4">
               {comparisonData.map((data) => (
                 <div key={data.id} className={`p-4 md:p-5 rounded-[1.5rem] md:rounded-[2rem] border transition-colors ${activeSiteId === data.id ? 'border-red-500/40 bg-red-500/5' : 'border-slate-300/20 bg-black/5 shadow-inner'}`}>
                    <div className="flex justify-between items-center mb-2 md:mb-3">
                      <span className={`text-[9px] md:text-[10px] font-black uppercase ${activeSiteId === data.id ? 'text-red-600' : theme.text}`}>{data.name}</span>
                      <span className={`text-[8px] md:text-[9px] font-mono font-bold ${theme.subtext}`}>{data.gravity} ms⁻²</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div>
                        <span className="opacity-40 block text-[6px] md:text-[7px] font-black uppercase">Arrival</span>
                        <span className="text-xs md:text-sm font-bold">{data.estTime.toFixed(1)}s</span>
                      </div>
                      <div className="text-right">
                        <span className="opacity-40 block text-[6px] md:text-[7px] font-black uppercase">Peak Vel.</span>
                        <span className="text-xs md:text-sm font-black">{(data.endPhaseVelocity / 1000).toFixed(2)} km/s</span>
                      </div>
                    </div>
                 </div>
               ))}
             </div>
             <div className="pt-4 md:pt-6 border-t mt-4 md:mt-6 flex justify-between items-end bg-black/5 p-4 md:p-5 rounded-[1.5rem] md:rounded-[2rem]">
                <div>
                   <div className="text-2xl md:text-3xl font-black text-green-600">+{efficiencyIndex.toFixed(2)}%</div>
                   <div className="text-[8px] md:text-[9px] uppercase font-black opacity-50">Combined Gain</div>
                </div>
                <div className="text-right">
                   <div className="text-lg md:text-xl font-black text-slate-800">-{timeDelta.toFixed(1)}s</div>
                   <div className="text-[8px] md:text-[9px] uppercase font-black opacity-50">Delta Ref</div>
                </div>
             </div>
          </div>
        </div>
      )}

      {/* TELEMETRY & COMMAND CONSOLE */}
      <div className={`absolute top-36 md:top-28 right-4 md:right-8 left-4 md:left-auto z-50 md:w-80 flex flex-col gap-4 md:gap-5 pointer-events-none transition-all ${showControlsMobile ? 'opacity-100' : 'opacity-0 md:opacity-100 pointer-events-none md:pointer-events-auto'}`}>
        <div className={`pointer-events-auto p-5 md:p-7 ${theme.panelBg} border ${theme.panelBorder} rounded-[2rem] md:rounded-[2.5rem] shadow-xl backdrop-blur-md overflow-y-auto max-h-[40vh] md:max-h-none`} onPointerDown={blockPointer} onPointerUp={blockPointer} onClick={blockPointer}>
          <div className="flex justify-between items-center mb-4 md:mb-6 border-b pb-4">
            <h3 className="text-[9px] md:text-[10px] font-black uppercase tracking-widest opacity-60">Telemetry</h3>
            <div className="flex items-center gap-2">
               <span className="text-[8px] font-bold text-green-600">ACTIVE</span>
               <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            </div>
          </div>
          
          <div className="space-y-4 md:space-y-5">
            <div className="grid grid-cols-2 gap-3 md:gap-4">
              <div className="bg-black/5 p-3 md:p-4 rounded-2xl border border-white/10 shadow-inner">
                 <span className="text-[6px] md:text-[7px] uppercase font-black opacity-50 block mb-1">Impact Vel.</span>
                 <span className="text-xs md:text-sm font-black">{(activeData.endPhaseVelocity/1000).toFixed(2)} km/s</span>
              </div>
              <div className="bg-black/5 p-3 md:p-4 rounded-2xl border border-white/10 shadow-inner">
                 <span className="text-[6px] md:text-[7px] uppercase font-black opacity-50 block mb-1">Impact Yield</span>
                 <span className="text-xs md:text-sm font-black text-red-600">{activeData.impactEnergy.toFixed(1)} GJ</span>
              </div>
              <div className="bg-black/5 p-3 md:p-4 rounded-2xl border border-white/10 shadow-inner">
                 <span className="text-[6px] md:text-[7px] uppercase font-black opacity-50 block mb-1">Range</span>
                 <span className="text-xs md:text-sm font-black">{activeData.dist.toFixed(0)} km</span>
              </div>
              <div className="bg-black/5 p-3 md:p-4 rounded-2xl border border-white/10 shadow-inner">
                 <span className="text-[6px] md:text-[7px] uppercase font-black opacity-50 block mb-1">Local G</span>
                 <span className="text-xs md:text-sm font-black">{activeData.gravity}</span>
              </div>
            </div>

            {(isLaunched || progress > 0) && (
              <div className="pt-2">
                <div className="flex justify-between mb-2">
                   <span className="text-[8px] md:text-[10px] uppercase font-black opacity-60 tracking-widest">Flight Progress</span>
                   <span className="text-[8px] md:text-[10px] font-black">{(progress * 100).toFixed(1)}%</span>
                </div>
                <div className="w-full bg-slate-200 h-1.5 md:h-2 rounded-full overflow-hidden shadow-inner">
                   <div className="h-full transition-all duration-300" style={{ width: `${progress * 100}%`, backgroundColor: theme.accent }} />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className={`pointer-events-auto p-5 md:p-6 ${theme.panelBg} border ${theme.panelBorder} rounded-[2rem] md:rounded-[2.5rem] shadow-2xl backdrop-blur-xl`} onPointerDown={blockPointer} onPointerUp={blockPointer} onClick={blockPointer}>
          <div className="space-y-2 md:space-y-3">
            <div className="text-[7px] md:text-[8px] font-black uppercase tracking-[0.2em] opacity-50 ml-2">Active Launch Site</div>
            <div className="grid grid-cols-2 md:grid-cols-1 gap-2">
              {LAUNCH_SITES.map(site => (
                <button 
                  key={site.id} 
                  disabled={isLaunched || progress > 0} 
                  onClick={() => setActiveSiteId(site.id)} 
                  className={`w-full p-3 md:p-4 rounded-[1.2rem] md:rounded-[1.5rem] border-2 text-left transition-all outline-none ${activeSiteId === site.id ? 'border-red-500 bg-red-600/10 shadow-lg' : 'border-transparent hover:bg-black/5 opacity-60'}`}
                >
                  <div className={`text-[10px] md:text-[12px] font-black uppercase leading-tight ${activeSiteId === site.id ? 'text-red-600' : theme.text}`}>{site.name.split(' ')[0]}</div>
                  <div className="text-[6px] md:text-[8px] font-bold opacity-50 mt-0.5 uppercase">{site.anomaly}</div>
                </button>
              ))}
            </div>
          </div>
          <button 
            onClick={() => { 
              if (progress >= 1) setProgress(0); 
              else setIsLaunched(!isLaunched); 
            }} 
            className={`w-full mt-4 md:mt-6 py-4 md:py-5 rounded-[1.2rem] md:rounded-[1.5rem] font-black text-[10px] md:text-[12px] uppercase tracking-[0.3em] md:tracking-[0.5em] shadow-2xl transition-all active:scale-95 text-white outline-none ${isLaunched ? 'animate-pulse' : ''}`} 
            style={{ backgroundColor: isLaunched ? '#475569' : (progress >= 1 ? '#0f172a' : theme.accent) }}
          >
            {isLaunched ? 'ABORT' : (progress >= 1 ? 'RESET' : 'LAUNCH')}
          </button>
        </div>
      </div>

      {/* FOOTER - COMPACT ON MOBILE */}
      <div className="absolute bottom-6 md:bottom-8 left-4 right-4 md:left-1/2 md:right-auto md:-translate-x-1/2 z-50 pointer-events-none flex flex-col items-center gap-3">
        <div className={`pointer-events-auto bg-white backdrop-blur-none px-6 md:px-12 py-3 md:py-4 rounded-full border border-slate-300 shadow-2xl flex flex-col md:flex-row items-center justify-between md:gap-16 text-[10px] md:text-[12px] font-mono`} onPointerDown={blockPointer} onPointerUp={blockPointer} onClick={blockPointer}>
          <div className="flex gap-4 md:gap-16 text-slate-900">
            <div className="flex gap-2"> 
               <span className="opacity-40 font-black">LAT</span>
               <span className="font-black tabular-nums">{coords.lat.toFixed(4)}°N</span>
            </div>
            <div className="flex gap-2"> 
               <span className="opacity-40 font-black">LNG</span>
               <span className="font-black tabular-nums">{coords.lng.toFixed(4)}°E</span>
            </div>
          </div>
          <div className="hidden md:flex px-8 border-l border-slate-300 h-5 items-center">
            <span className={`font-black uppercase tracking-[0.3em] text-[10px] ${isLaunched ? 'text-red-600 animate-pulse' : 'text-slate-400'}`}>
               {isLaunched ? 'MISSION ACTIVE' : 'SYSTEM READY'}
            </span>
          </div>
        </div>
        
        {/* BRAND FOOTER */}
        <div className={`pointer-events-auto flex items-center gap-5 text-[10px] md:text-[12px] font-mono px-6 py-2.5 rounded-full border-2 shadow-2xl transition-all ${theme.panelBg.replace('/95', '')} ${theme.panelBorder} border-opacity-50`} onPointerDown={blockPointer}>
           <a href="https://ishanoshada.com" target="_blank" rel="noopener noreferrer" className={`flex items-center gap-2 hover:text-red-600 transition-colors font-bold ${theme.text}`}>
              <ExternalLink size={12} /> ishanoshada.com
           </a>
           <span className="opacity-20 font-light">|</span>
           <a href="https://github.com/ishanoshada/Icbm-Simulator" target="_blank" rel="noopener noreferrer" className={`flex items-center gap-2 hover:text-red-600 transition-colors font-bold ${theme.text}`}>
              <Github size={12} /> Source Code
           </a>
        </div>
      </div>

      <MapScene 
        theme={currentTheme} 
        launchProgress={progress} 
        activeSiteId={activeSiteId} 
        targetCoords={targetCoords}
        isLaunched={isLaunched}
        showComparison={showComparison}
        manualRotation={rotationInput}
        onSelectTarget={(c) => { 
           if (!isLaunched && progress === 0) {
              setTargetCoords(c);
           }
        }}
        onViewChange={setCoords}
      />
    </div>
  );
};

export default App;
