import { useState, useEffect, lazy, Suspense } from 'react';
import type { CSSProperties } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import * as THREE from 'three';
import { fetchRandomCards } from './services/yugiohApi';
import type { YugiohCard } from './types/card';
import CardDetails from './components/CardDetails';
import DualDisk from './components/DualDisk';
import SceneLighting from './scene/SceneLighting';

const Card3D = lazy(() => import('./components/Card3D'))

// --- Disposition de la scène -------------------------------------------------
// Le modèle exporté depuis Blender mesure ~9,6 u de large (bras en V, moyeu à l'arrière).
const DISK_SCALE = 1.55;
const DISK_POSITION: [number, number, number] = [0.2, 0, -0.25];
// Pente des bras du plateau (22°) : les cartes suivent le V du Duel Disk.
const ARM_SLOPE = Math.tan((22 * Math.PI) / 180);
const CARD_SPACING = 3.0;
const CARD_HEIGHT = 5.4;
// Le point le plus bas du modèle (bracelet)
const GROUND_Y = -1.11 * DISK_SCALE - 0.1;

export default function App() {
  const [cards, setCards] = useState<YugiohCard[]>([]);
  const [selectedCard, setSelectedCard] = useState<YugiohCard | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const drawNewHand = async () => {
    setLoading(true);
    setSelectedCard(null);
    const newCards = await fetchRandomCards(5);
    setCards(newCards);
    setLoading(false);
  };

  useEffect(() => {
    drawNewHand();
  }, []);

  return (
    <main style={{ width: '100vw', height: '100vh', background: 'radial-gradient(ellipse at 50% 38%, #1f2638 0%, #0e1017 58%, #06070b 100%)', position: 'relative', overflow: 'hidden' }}>
      
      {/* Interface de contrôle */}
      <header style={styles.topBar}>
        <h1 style={{ margin: 0, fontSize: '1.5rem', color: '#f5c518' }}>Yu-Gi-Oh! 3D Deck Explorer</h1>
        <button 
          onClick={drawNewHand} 
          disabled={loading}
          style={styles.drawButton}
        >
          {loading ? 'Pioche en cours...' : '🃏 Piocher une nouvelle main'}
        </button>
      </header>

      {/* Scène 3D */}
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ position: [0, 6.8, 15.5], fov: 42 }}
        gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.05 }}
      >
        <SceneLighting groundY={GROUND_Y} />

        <Suspense fallback={<Html center>Chargement…</Html>}>
          <DualDisk position={DISK_POSITION} scale={DISK_SCALE} />

          {cards.map((card, index) => {
            const posX = (index - (cards.length - 1) / 2) * CARD_SPACING;
            // La main de cartes épouse le V du plateau et s'incline légèrement vers le centre.
            const posZ = DISK_POSITION[2] - ARM_SLOPE * Math.abs(posX);
            const rotY = -posX * 0.035;

            return (
              <Card3D
                key={card.id}
                card={card}
                position={[posX, CARD_HEIGHT, posZ]}
                rotation={[0, rotY, 0]}
                isSelected={selectedCard?.id === card.id}
                onClick={(c) => setSelectedCard(c)}
              />
            );
          })}
        </Suspense>

        <OrbitControls
          enablePan={false}
          target={[0, 2.4, -2]}
          maxPolarAngle={Math.PI / 2 - 0.05}
          minDistance={6}
          maxDistance={30}
        />
      </Canvas>

      {/* Détails UI */}
      <CardDetails card={selectedCard} onClose={() => setSelectedCard(null)} />
    </main>
  );
}

const styles: { [key: string]: CSSProperties } = {
  topBar: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 10,
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
  },
  drawButton: {
    padding: '10px 18px',
    backgroundColor: '#f5c518',
    color: '#000',
    border: 'none',
    borderRadius: '8px',
    fontWeight: 'bold',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(245, 197, 24, 0.4)',
    transition: 'transform 0.1s ease',
  }
};
