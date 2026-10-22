import { useLayoutEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

export const DUAL_DISK_URL = '/models/dual_disk.glb';

interface DualDiskProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  /** Amplitude du léger flottement vertical (0 pour le désactiver). */
  floatAmplitude?: number;
}

export default function DualDisk({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  floatAmplitude = 0.06,
}: DualDiskProps) {
  const { scene } = useGLTF(DUAL_DISK_URL);
  const groupRef = useRef<THREE.Group>(null);

  // Clone pour ne pas muter la scène mise en cache par useGLTF.
  const model = useMemo(() => scene.clone(true), [scene]);

  useLayoutEffect(() => {
    model.traverse((obj) => {
      if (obj instanceof THREE.Mesh) {
        obj.castShadow = true;
        obj.receiveShadow = true;
      }
    });
  }, [model]);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();
    groupRef.current.position.y = position[1] + Math.sin(t * 0.8) * floatAmplitude;
  });

  return (
    <group ref={groupRef} position={position} rotation={rotation} scale={scale}>
      <primitive object={model} />
    </group>
  );
}

useGLTF.preload(DUAL_DISK_URL);
