import React, { useEffect } from "react";
import { useGLTF } from "@react-three/drei";

export default function HeartModel() {
  const { scene } = useGLTF("/heart.glb");

  useEffect(() => {
    // Traverse the scene and hide all text meshes
    scene.traverse((child) => {
      if (child.isMesh && child.name.toLowerCase().includes("text")) {
        child.visible = false;
      }
    });
  }, [scene]);

  return <primitive object={scene} scale={1.2} position={[0, -0.5, 0]} />;
}
