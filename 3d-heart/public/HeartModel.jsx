// src/components/HeartModel.jsx
import { useGLTF, useAnimations } from '@react-three/drei';
import { useRef, useEffect, useState } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { AudioListener, AudioLoader, Audio } from 'three';

export default function HeartModel({ onSelect }) {
  const ref = useRef();
  const { scene, animations } = useGLTF('/heart.glb');
  const { actions } = useAnimations(animations, ref);
  const { camera, scene: threeScene } = useThree();

  const [heartbeatSound] = useState(() => new Audio(new AudioListener()));
  const [beatTime] = useState(1000);
  const bisectedParts = useRef({});

  useEffect(() => {
    if (actions && Object.keys(actions).length > 0) {
      actions[Object.keys(actions)[0]]?.play();
    }

    camera.add(heartbeatSound.listener);
    threeScene.add(camera);

    const loader = new AudioLoader();
    loader.load('/heartbeat.mp3', (buffer) => {
      heartbeatSound.setBuffer(buffer);
      heartbeatSound.setLoop(false);
      heartbeatSound.setVolume(0.5);
    });

    scene.traverse((child) => {
      if (child.isMesh) {
        const name = child.name.toLowerCase();
        if (name.includes('text') || name.includes('label') || name.includes('annotation')) {
          child.visible = false;
        }
        bisectedParts.current[child.name.toLowerCase()] = child;
      }
    });
  }, [actions, scene, camera, heartbeatSound, threeScene]);

  useFrame(() => {
    // Heartbeat scale effect
    if (ref.current) {
      const t = Date.now() % beatTime;
      const s = 1 + Math.sin((t / beatTime) * Math.PI * 2) * 0.03;
      ref.current.scale.set(s, s, s);
    }
  });

  const handleClick = (e) => {
    e.stopPropagation();
    const clickedName = e.object.name.toLowerCase();
    onSelect(clickedName);

    // Define bisection logic based on part names
    const part = bisectedParts.current[clickedName];
    if (!part || part.userData.bisected) return;

    let direction = new THREE.Vector3();
    if (clickedName.includes('left atrium') || clickedName.includes('left_ventricle')) {
      direction.set(-0.5, 0, 0);
    } else if (clickedName.includes('right atrium') || clickedName.includes('right_ventricle')) {
      direction.set(0.5, 0, 0);
    } else {
      direction.set(0, 0.5, 0);
    }

    part.userData.bisected = true;
    part.position.add(direction);
  };

  return (
    <primitive
      ref={ref}
      object={scene}
      onClick={handleClick}
      dispose={null}
    />
  );
}
