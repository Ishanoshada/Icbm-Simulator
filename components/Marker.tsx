
import React, { useState, useMemo } from 'react';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { Landmark } from '../types';
import { GLOBE_RADIUS } from '../constants';

const Group = 'group' as any;
const Mesh = 'mesh' as any;
const SphereGeometry = 'sphereGeometry' as any;
const MeshStandardMaterial = 'meshStandardMaterial' as any;
const RingGeometry = 'ringGeometry' as any;
const MeshBasicMaterial = 'meshBasicMaterial' as any;

interface MarkerProps {
  landmark: Landmark;
  isSelected: boolean;
  onClick: () => void;
}

// Global conversion for consistency
export const latLngToVector3 = (lat: number, lng: number, radius: number): THREE.Vector3 => {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  return new THREE.Vector3(x, y, z);
};

const Marker: React.FC<MarkerProps> = ({ landmark, isSelected, onClick }) => {
  const [hovered, setHovered] = useState(false);
  
  const position = useMemo(() => 
    latLngToVector3(landmark.coordinates.lat, landmark.coordinates.lng, GLOBE_RADIUS + 0.02),
    [landmark.coordinates]
  );

  return (
    <Group 
      position={position} 
      onClick={(e: any) => { e.stopPropagation(); onClick(); }}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <Mesh>
        <SphereGeometry args={[isSelected ? 0.025 : 0.015, 16, 16]} />
        <MeshStandardMaterial 
          color={isSelected ? '#fbbf24' : (hovered ? '#ffffff' : '#ef4444')} 
          emissive={isSelected ? '#fbbf24' : '#ef4444'}
          emissiveIntensity={isSelected ? 4 : 2}
        />
      </Mesh>
      
      <Mesh rotation={[Math.PI / 2, 0, 0]}>
        <RingGeometry args={[isSelected ? 0.035 : 0.02, isSelected ? 0.045 : 0.025, 32]} />
        <MeshBasicMaterial color={isSelected ? '#fbbf24' : '#ef4444'} transparent opacity={0.6} side={THREE.DoubleSide} />
      </Mesh>

      {(hovered || isSelected) && (
        <Html distanceFactor={10} position={[0, 0.1, 0]} center>
          <div className={`px-2 py-1 rounded-md text-[9px] font-bold tracking-wider uppercase whitespace-nowrap transition-all transform pointer-events-none shadow-xl ${
            isSelected ? 'bg-yellow-400 text-black scale-110' : 'bg-black/90 backdrop-blur-md text-white border border-white/20'
          }`}>
            {landmark.name}
          </div>
        </Html>
      )}
    </Group>
  );
};

export default Marker;
