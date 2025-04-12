import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { Suspense, useRef, useState } from 'react';
import { HumanAnatomyModel } from './HumanAnatomyModel';
import * as THREE from 'three';

function CameraController({ targetRef }) {
  const { camera } = useThree();
  const vec = new THREE.Vector3();

  useFrame(() => {
    if (targetRef.current) {
      const targetPos = targetRef.current.getWorldPosition(vec);
      camera.position.lerp(targetPos.clone().add(new THREE.Vector3(0, 1, 3)), 0.05);
      camera.lookAt(targetPos);
    }
  });

  return null;
}

export default function App() {
  const [selectedPart, setSelectedPart] = useState(null);
  const selectedPartRef = useRef(null);

  return (
    <>
      <div style={{
        position: 'absolute', top: 20, left: 20, zIndex: 1,
        background: 'rgba(255,255,255,0.95)', padding: '10px', borderRadius: '10px',
        fontFamily: 'sans-serif', fontSize: '16px'
      }}>
        <strong>Selected:</strong> {selectedPart || 'None'}
      </div>

      <Canvas camera={{ position: [0, 2, 5], fov: 45 }}>
        <ambientLight intensity={0.8} /> {/* Increase ambient light intensity */}
        <directionalLight position={[5, 5, 5]} intensity={1.5} /> {/* Increase directional light intensity */}
        <Suspense fallback={<div style={{ color: 'white', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>Loading...</div>}>
          <HumanAnatomyModel onSelect={setSelectedPart} selectedPartRef={selectedPartRef} />
          <Environment preset="sunset" />
          <OrbitControls />
          <CameraController targetRef={selectedPartRef} />
        </Suspense>
      </Canvas>
    </>
  );
}