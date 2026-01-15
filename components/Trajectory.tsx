
import React, { useMemo } from 'react';
import * as THREE from 'three';
// Import latLngToVector3 from Marker.tsx where it is actually defined and exported
import { latLngToVector3 } from './Marker';
import { GLOBE_RADIUS } from '../constants';

// Define R3F elements as Uppercase components to bypass JSX intrinsic element type checks
const Group = 'group' as any;
const Line = 'line' as any;
const BufferGeometry = 'bufferGeometry' as any;
const LineBasicMaterial = 'lineBasicMaterial' as any;
const Mesh = 'mesh' as any;
const SphereGeometry = 'sphereGeometry' as any;
const MeshBasicMaterial = 'meshBasicMaterial' as any;
const PointLight = 'pointLight' as any;

interface TrajectoryProps {
  start: { lat: number; lng: number };
  end: { lat: number; lng: number };
  progress: number;
  color: string;
}

const Trajectory: React.FC<TrajectoryProps> = ({ start, end, progress, color }) => {
  const points = useMemo(() => {
    const pStart = latLngToVector3(start.lat, start.lng, GLOBE_RADIUS);
    const pEnd = latLngToVector3(end.lat, end.lng, GLOBE_RADIUS);
    
    // Middle point for parabolic curve (Apogee)
    const midLat = (start.lat + end.lat) / 2;
    const midLng = (start.lng + end.lng) / 2;
    const apogeeHeight = 1.5; // Altitude boost
    const pMid = latLngToVector3(midLat, midLng, GLOBE_RADIUS + apogeeHeight);
    
    const curve = new THREE.QuadraticBezierCurve3(pStart, pMid, pEnd);
    return curve.getPoints(100);
  }, [start, end]);

  const activePoints = useMemo(() => {
    const count = Math.floor(points.length * progress);
    return points.slice(0, count);
  }, [points, progress]);

  return (
    <Group>
      {/* Ghost Path */}
      <Line>
        <BufferGeometry attach="geometry" {...new THREE.BufferGeometry().setFromPoints(points)} />
        <LineBasicMaterial attach="material" color={color} transparent opacity={0.1} />
      </Line>
      
      {/* Active Path */}
      {activePoints.length > 1 && (
        <Line>
          <BufferGeometry attach="geometry" {...new THREE.BufferGeometry().setFromPoints(activePoints)} />
          <LineBasicMaterial attach="material" color={color} />
        </Line>
      )}

      {/* Warhead Marker */}
      {activePoints.length > 0 && (
        <Mesh position={activePoints[activePoints.length - 1]}>
          <SphereGeometry args={[0.03, 16, 16]} />
          <MeshBasicMaterial color={color} />
          <PointLight color={color} intensity={2} distance={1} />
        </Mesh>
      )}
    </Group>
  );
};

export default Trajectory;
