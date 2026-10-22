import { ContactShadows, Environment, Lightformer } from '@react-three/drei';

interface SceneLightingProps {
  /** Hauteur (axe Y) du plan sur lequel s'affiche l'ombre portée. */
  groundY?: number;
}

/**
 * Éclairage « studio » : environnement procédural (aucun HDR à télécharger),
 * lumière principale avec ombres, contre-jour coloré et ombre de contact.
 */
export default function SceneLighting({ groundY = -1.9 }: SceneLightingProps) {
  return (
    <>
      {/* Reflets : boîtes à lumière autour de la scène (utile pour les métaux et les cartes brillantes) */}
      <Environment resolution={256} environmentIntensity={0.9}>
        <color attach="background" args={['#05060a']} />
        <Lightformer form="rect" intensity={3.2} color="#fff1dc" position={[0, 9, 6]} scale={[16, 4, 1]} />
        <Lightformer form="rect" intensity={1.6} color="#9db8ff" position={[-11, 4, 2]} scale={[10, 5, 1]} />
        <Lightformer form="rect" intensity={1.6} color="#ffd2a1" position={[11, 4, -2]} scale={[10, 5, 1]} />
        <Lightformer form="ring" intensity={2.4} color="#ffffff" position={[0, 8, -12]} scale={8} />
        <Lightformer form="rect" intensity={0.6} color="#6f86c9" position={[0, -3, 10]} scale={[18, 2, 1]} />
      </Environment>

      {/* Lumière d'ambiance douce, ciel froid / sol chaud */}
      <hemisphereLight args={['#c3d3ff', '#1b1511', 0.35]} />

      {/* Lumière principale : seule à projeter des ombres nettes (cartes -> plateau) */}
      <directionalLight
        castShadow
        position={[7, 14, 9]}
        intensity={2.4}
        color="#fff3e2"
        shadow-mapSize={[2048, 2048]}
        shadow-camera-near={1}
        shadow-camera-far={45}
        shadow-camera-left={-16}
        shadow-camera-right={16}
        shadow-camera-top={14}
        shadow-camera-bottom={-14}
        shadow-bias={-0.0004}
        shadow-normalBias={0.04}
      />

      {/* Contre-jour bleuté : détache les bords du plateau et de l'anneau du fond */}
      <spotLight position={[-10, 9, -12]} angle={0.55} penumbra={1} intensity={900} decay={2} color="#7fa2ff" />
      {/* Contre-jour chaud de l'autre côté */}
      <spotLight position={[12, 7, -10]} angle={0.5} penumbra={1} intensity={500} decay={2} color="#ffb072" />

      {/* Ombre douce sous le Duel Disk */}
      <ContactShadows
        position={[0, groundY, -2.5]}
        opacity={0.6}
        scale={34}
        blur={3}
        far={8}
        resolution={1024}
        color="#000000"
      />
    </>
  );
}
