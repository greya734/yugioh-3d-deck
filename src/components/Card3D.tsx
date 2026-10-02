// src/components/Card3D.tsx
import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';
import type { YugiohCard } from '../types/card';

interface Card3DProps {
  card: YugiohCard;
  position: [number, number, number];
  isSelected: boolean;
  onClick: (card: YugiohCard) => void;
}

export default function Card3D({ card, position, isSelected, onClick }: Card3DProps) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const [hovered, setHovered] = useState(false);

  // Redirection vers notre proxy pour contourner le blocage CORS
  const proxiedImageUrl = card.card_images[0].image_url_small.replace(
    'https://images.ygoprodeck.com',
    '/ygo-images'
  );

  const texture = useTexture(proxiedImageUrl);

  // Animation douce de flottement
  useFrame((state) => {
    if (meshRef.current) {
      const t = state.clock.getElapsedTime();
      meshRef.current.position.y = position[1] + (hovered ? 0.3 : Math.sin(t * 2 + position[0]) * 0.05);
      if (hovered) {
        meshRef.current.rotation.y += 0.01;
      } else {
        meshRef.current.rotation.y = 0;
      }
    }
  });

  return (
    <mesh
      ref={meshRef}
      position={position}
      scale={isSelected ? 1.15 : hovered ? 1.05 : 1}
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
      <boxGeometry args={[2.4, 3.5, 0.02]} />
      <meshStandardMaterial map={texture} roughness={0.3} metalness={0.1} />
    </mesh>
  );
}