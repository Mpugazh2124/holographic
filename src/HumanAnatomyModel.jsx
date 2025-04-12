import { useGLTF } from '@react-three/drei';
import { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';

export default function HumanAnatomyModel({ onSelect, selectedPartRef }) {
  const { scene } = useGLTF('/models/human_anatomy.glb', true);
  const animationRefs = useRef({});

  useEffect(() => {
    if (!scene) return;

    scene.traverse((child) => {
      if (child.isMesh) {
        child.userData.originalColor = child.material.color.clone();
        child.userData.originalPosition = child.position.clone();

        child.onClick = (e) => {
          e.stopPropagation();
          onSelect(child.name);

          scene.traverse((c) => {
            if (c.isMesh) {
              c.material.color.copy(c.userData.originalColor);
              c.position.copy(c.userData.originalPosition);
            }
          });

          child.material.color.set('#ff5050');
          animationRefs.current[child.name] = true;
          selectedPartRef.current = child;
        };
      }
    });
  }, [scene]);

  useFrame(() => {
    Object.entries(animationRefs.current).forEach(([name, animating]) => {
      const mesh = scene.getObjectByName(name);
      if (mesh && animating) {
        mesh.position.z += 0.02;
        if (mesh.position.z >= mesh.userData.originalPosition.z + 1) {
          animationRefs.current[name] = false;
        }
      }
    });
  });

  return scene ? <primitive object={scene} scale={0.01} /> : null;
}
