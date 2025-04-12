// src/components/HeartModel.jsx
import { useGLTF } from '@react-three/drei';
import { useRef, useEffect } from 'react';

export default function HeartModel({ onSelect }) {
  const ref = useRef();
  const { scene } = useGLTF('/heart.glb');
  const bisectedParts = useRef({});

  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh) {
        const name = child.name.toLowerCase();
        if (name.includes('text') || name.includes('label') || name.includes('annotation')) {
          child.visible = false;
        }
        bisectedParts.current[name] = child;
      }
    });
  }, [scene]);

  const handleClick = (e) => {
    e.stopPropagation();
    const clickedName = e.object.name.toLowerCase();
    onSelect(clickedName);

    const part = bisectedParts.current[clickedName];
    if (!part || part.userData.bisected) return;

    part.userData.bisected = true;

    // Simple bisection direction
    part.position.x += clickedName.includes('left') ? -0.5 : 0.5;
  };

  return (
    <primitive
      ref={ref}
      object={scene}
      onClick={handleClick}
      dispose={null}
      scale={1.5}
    />
  );
}
