import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Suspense, useRef, useState } from 'react';
import HumanAnatomyModel from './HumanAnatomyModel';

export default function App() {
  const [selectedPart, setSelectedPart] = useState(null);
  const selectedPartRef = useRef();

  return (
    <>
      <Canvas camera={{ position: [0, 2, 5], fov: 45 }}>
        <ambientLight intensity={1} />
        <directionalLight position={[5, 5, 5]} />
        <Suspense fallback={null}>
          <HumanAnatomyModel
            onSelect={setSelectedPart}
            selectedPartRef={selectedPartRef}
          />
          <OrbitControls />
        </Suspense>
      </Canvas>
      {selectedPart && (
        <div style={{
          position: 'absolute',
          top: 20,
          left: 20,
          padding: '10px 20px',
          background: '#fff',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        }}>
          Selected: <strong>{selectedPart}</strong>
        </div>
      )}
    </>
  );
}
