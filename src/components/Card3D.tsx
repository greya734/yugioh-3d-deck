import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';
import type { YugiohCard } from '../types/card';

const CARD_BACK_URL = '/textures/card_back.png';

interface Card3DProps {
  card: YugiohCard;
  position: [number, number, number];
  /** Orientation de base de la carte (la rotation au survol s'ajoute à rotation[1]). */
  rotation?: [number, number, number];
  isSelected: boolean;
  onClick: (card: YugiohCard) => void;
}

export default function Card3D({ card, position, rotation = [0, 0, 0], isSelected, onClick }: Card3DProps) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const spin = useRef(0);
  const [hovered, setHovered] = useState(false);

  // Redirection vers notre proxy pour contourner le blocage CORS
  const proxiedImageUrl = card.card_images[0].image_url_small.replace(
    'https://images.ygoprodeck.com',
    '/ygo-images'
  );

  const [frontTexture, backTexture] = useTexture([proxiedImageUrl, CARD_BACK_URL]);

  // Flottement + rotation au survol (retour fluide à l'orientation de base)
  useFrame((state, delta) => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const t = state.clock.getElapsedTime();
    const targetY = position[1] + (hovered ? 0.3 : Math.sin(t * 2 + position[0]) * 0.05);
    mesh.position.y = THREE.MathUtils.damp(mesh.position.y, targetY, 8, delta);

    if (hovered) {
      spin.current += delta * 1.0;
    } else {
      const rest = Math.round(spin.current / (Math.PI * 2)) * Math.PI * 2;
      spin.current = THREE.MathUtils.damp(spin.current, rest, 6, delta);
    }
    mesh.rotation.y = rotation[1] + spin.current;
  });

  return (
    <mesh
      ref={meshRef}
      position={position}
      rotation={rotation}
      scale={isSelected ? 1.15 : hovered ? 1.05 : 1}
      castShadow
      receiveShadow
      onClick={() => onClick(card)}
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor = 'pointer';
        setHovered(true);
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'auto';
        setHovered(false);
      }}
    >
      <boxGeometry args={[2.4, 3.5, 0.04]} />
      {/* Ordre des faces d'un BoxGeometry : +x, -x, +y, -y, +z (face), -z (dos) */}
      <meshStandardMaterial attach="material-0" color="#16161b" roughness={0.6} />
      <meshStandardMaterial attach="material-1" color="#16161b" roughness={0.6} />
      <meshStandardMaterial attach="material-2" color="#16161b" roughness={0.6} />
      <meshStandardMaterial attach="material-3" color="#16161b" roughness={0.6} />
      <meshStandardMaterial attach="material-4" map={frontTexture} roughness={0.28} metalness={0.05} envMapIntensity={1.2} />
      <meshStandardMaterial attach="material-5" map={backTexture} roughness={0.4} metalness={0.05} />
    </mesh>
  );
}
