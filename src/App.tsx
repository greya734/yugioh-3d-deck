import { useState, useEffect, lazy, Suspense } from 'react';
import type { CSSProperties } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Center } from '@react-three/drei';
import { fetchRandomCards } from './services/yugiohApi';
import type { YugiohCard } from './types/card';
import CardDetails from './components/CardDetails';

const Card3D = lazy(() => import('./components/Card3D'))

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
    <main style={{ width: '100vw', height: '100vh', backgroundColor: '#0e1017', position: 'relative', overflow: 'hidden' }}>
      
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
      <Canvas camera={{ position: [0, 1, 7], fov: 45 }}>
        <ambientLight intensity={0.8} />
        <directionalLight position={[5, 10, 5]} intensity={1.5} />
        <pointLight position={[-5, -5, -5]} intensity={0.5} />

        <Suspense fallback={<div>Chargement…</div>}>
          <Center>
            <group>
              {cards.map((card, index) => {
                const spacing = 2.7;
                const offset = ((cards.length - 1) * spacing) / 2;
                const posX = index * spacing - offset;
                
                return (
                  <Card3D
                    key={card.id}
                    card={card}
                    position={[posX, 0, 0]}
                    isSelected={selectedCard?.id === card.id}
                    onClick={(c) => setSelectedCard(c)}
                  />
                );
              })}
            </group>
          </Center>
        </Suspense>

        <OrbitControls enablePan={false} maxPolarAngle={Math.PI / 2} minDistance={3} maxDistance={15} />
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