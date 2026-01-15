
import React, { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useLoader, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, Html } from '@react-three/drei';
import * as THREE from 'three';
import { LAUNCH_SITES, THEMES, GLOBE_RADIUS, ThemeType } from '../constants';
import Trajectory from './Trajectory';
import { latLngToVector3 } from './Marker';

const Mesh = 'mesh' as any;
const SphereGeometry = 'sphereGeometry' as any;
const MeshStandardMaterial = 'meshStandardMaterial' as any;
const Color = 'color' as any;
const AmbientLight = 'ambientLight' as any;
const DirectionalLight = 'directionalLight' as any;
const Group = 'group' as any;
const RingGeometry = 'ringGeometry' as any;
const MeshBasicMaterial = 'meshBasicMaterial' as any;

interface MapSceneProps {
  theme: ThemeType;
  launchProgress: number;
  activeSiteId: string;
  targetCoords: { lat: number; lng: number };
  isLaunched: boolean;
  showComparison: boolean;
  manualRotation?: { x: number; y: number };
  onSelectTarget: (coords: { lat: number; lng: number }) => void;
  onViewChange?: (coords: { lat: number; lng: number; alt: number }) => void;
}

const Globe: React.FC<{ theme: ThemeType; onSelect: (p: THREE.Vector3) => void; isLocked: boolean }> = ({ theme, onSelect, isLocked }) => {
  const themeColors = THEMES[theme];
  const [colorMap] = useLoader(THREE.TextureLoader, [themeColors.globeTexture]);

  return (
    <Mesh 
      onPointerDown={(e: any) => {
        if (isLocked) return;
        e.stopPropagation();
        const localPoint = e.object.worldToLocal(e.point.clone());
        onSelect(localPoint);
      }}
    >
      <SphereGeometry args={[GLOBE_RADIUS, 128, 128]} />
      <MeshStandardMaterial 
        map={colorMap} 
        roughness={0.7}
        metalness={0.1}
      />
    </Mesh>
  );
};

const MapSceneContent: React.FC<MapSceneProps> = ({ theme, launchProgress, activeSiteId, targetCoords, isLaunched, showComparison, manualRotation, onSelectTarget, onViewChange }) => {
  const themeColors = THEMES[theme];
  const { camera } = useThree();
  const controlsRef = useRef<any>(null);
  const [initialized, setInitialized] = useState(false);
  
  const activeSite = useMemo(() => LAUNCH_SITES.find(s => s.id === activeSiteId)!, [activeSiteId]);
  const isTargetingLocked = isLaunched || launchProgress >= 1;

  // INITIAL FOCUS: Center on Sri Lanka immediately on mount
  useEffect(() => {
    if (controlsRef.current && !initialized) {
      // Sri Lanka coordinates: 7.8731° N, 80.7718° E
      const focusPos = latLngToVector3(7.87, 80.77, GLOBE_RADIUS + 2.5);
      camera.position.copy(focusPos);
      camera.lookAt(0, 0, 0);
      controlsRef.current.update();
      setInitialized(true);
    }
  }, [camera, initialized]);

  // Handle site changes or launch state transitions
  useEffect(() => {
    if (controlsRef.current && initialized && !isLaunched && launchProgress === 0) {
      const sitePos = latLngToVector3(activeSite.coordinates.lat, activeSite.coordinates.lng, GLOBE_RADIUS + 3.0);
      camera.position.lerp(sitePos, 0.1);
      controlsRef.current.target.set(0, 0, 0);
      controlsRef.current.update();
    }
  }, [activeSiteId, isLaunched, launchProgress, activeSite.coordinates, initialized]);

  const handleGlobeClick = (localPoint: THREE.Vector3) => {
    const normalized = localPoint.clone().normalize();
    const phi = Math.acos(normalized.y);
    const theta = Math.atan2(normalized.z, -normalized.x);
    const lat = 90 - (phi * 180 / Math.PI);
    let lng = (theta * 180 / Math.PI) - 180;
    while (lng < -180) lng += 360;
    while (lng > 180) lng -= 360;
    onSelectTarget({ lat, lng });
  };

  useFrame(() => {
    // Handle manual rotation inputs from UI buttons
    if (controlsRef.current && manualRotation && (manualRotation.x !== 0 || manualRotation.y !== 0)) {
      // Rotate horizontally
      if (manualRotation.x !== 0) {
        controlsRef.current.setAzimuthalAngle(controlsRef.current.getAzimuthalAngle() + manualRotation.x);
      }
      // Rotate vertically
      if (manualRotation.y !== 0) {
        controlsRef.current.setPolarAngle(controlsRef.current.getPolarAngle() + manualRotation.y);
      }
      controlsRef.current.update();
    }

    if (onViewChange) {
      const pos = camera.position.clone().normalize();
      const phi = Math.acos(pos.y); 
      const theta = Math.atan2(pos.z, -pos.x);
      const lat = 90 - (phi * 180 / Math.PI);
      let lng = (theta * 180 / Math.PI) - 180;
      onViewChange({ lat, lng: -lng, alt: camera.position.length() - GLOBE_RADIUS });
    }
  });

  const targetMarkerPos = useMemo(() => latLngToVector3(targetCoords.lat, targetCoords.lng, GLOBE_RADIUS + 0.1), [targetCoords]);

  return (
    <>
      <Color attach="background" args={[themeColors.bg]} />
      <OrbitControls 
        ref={controlsRef} 
        enablePan={false} 
        minDistance={5.1} 
        maxDistance={12} 
        enableDamping={true}
        dampingFactor={0.05}
        makeDefault
      />
      
      <AmbientLight intensity={themeColors.globeIntensity} />
      <DirectionalLight position={[10, 10, 10]} intensity={1.2} />
      
      <Environment preset="city" />

      <Group>
        <Globe theme={theme} onSelect={handleGlobeClick} isLocked={isTargetingLocked} />
        
        {LAUNCH_SITES.map(site => {
          const isSiteActive = site.id === activeSiteId;
          const isVisible = showComparison || isSiteActive;
          
          return isVisible ? (
            <Trajectory 
              key={`traj-${site.id}`}
              start={site.coordinates} 
              end={targetCoords} 
              progress={launchProgress} 
              color={isSiteActive ? themeColors.accent : '#94a3b8'} 
            />
          ) : null;
        })}

        <Mesh position={targetMarkerPos}>
          <RingGeometry args={[0.04, 0.06, 32]} />
          <MeshBasicMaterial color={themeColors.accent} side={THREE.DoubleSide} transparent opacity={0.8} />
          <Html position={[0, 0.1, 0]} center>
            <div className={`px-2 py-0.5 text-[8px] font-black rounded uppercase whitespace-nowrap shadow-xl transition-colors ${isTargetingLocked ? 'bg-slate-800 text-slate-400' : 'bg-red-600 text-white animate-pulse'}`}>
              {isTargetingLocked ? 'TARGET LOCKED' : 'TARGET ACQUIRED'}
            </div>
          </Html>
        </Mesh>

        {LAUNCH_SITES.map(site => {
          const isSiteActive = site.id === activeSiteId;
          const isVisible = showComparison || isSiteActive;
          return isVisible ? (
            <Mesh key={site.id} position={latLngToVector3(site.coordinates.lat, site.coordinates.lng, GLOBE_RADIUS + 0.05)}>
              <SphereGeometry args={[0.015, 16, 16]} />
              <MeshBasicMaterial color={isSiteActive ? themeColors.accent : '#555'} />
              <Html position={[0, 0.08, 0]} center>
                <div className="text-[7px] font-bold opacity-60 uppercase whitespace-nowrap bg-black/10 px-1 rounded">{site.name}</div>
              </Html>
            </Mesh>
          ) : null;
        })}
      </Group>
    </>
  );
};

const MapScene: React.FC<MapSceneProps> = (props) => (
  <div className="w-full h-full cursor-crosshair">
    <Canvas shadows gl={{ antialias: true, preserveDrawingBuffer: true }}>
      <MapSceneContent {...props} />
    </Canvas>
  </div>
);

export default MapScene;
