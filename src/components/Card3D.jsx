import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';

export default function Card3D({ card, position, onClick, isSelected }) {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);

  // Chargement de l'image de la carte Yu-Gi-Oh
  const texture = useTexture(card.card_images[0].image_url_small);

  // Animation douce de flottement
  useFrame((state) => {
    if (meshRef.current) {
      const t = state.clock.getElapsedTime();
      // Léger balancement vertical et rotation si survolé
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
      onPointerOver={() => {
        document.body.style.cursor = 'pointer';
        setHovered(true);
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'auto';
        setHovered(false);
      }}
    >
      {/* Dimensions d'une carte : largeur ~2.4, hauteur ~3.5, épaisseur ~0.02 */}
      <boxGeometry args={[2.4, 3.5, 0.02]} />
      
      {/* Matériau avec texture de la carte */}
      <meshStandardMaterial map={texture} roughness={0.3} metalness={0.1} />
    </mesh>
  );
}