import React, { useRef, useEffect } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import * as THREE from "three";

export function OrbitingLogo({ textureURL, radius = 5, speed = 0.5, y = 0 }) {
  const ref = useRef();

  const texture = useLoader(THREE.TextureLoader, textureURL);

  useEffect(() => {
    console.log("OrbitingLogo mounted");
    console.log("Texture loaded:", texture);
  }, [texture]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * speed;
    if (ref.current) {
      ref.current.position.y = Math.cos(t) * radius;
      ref.current.position.z = Math.sin(t) * radius;
      ref.current.lookAt(0, y, 0);
    }
  });

  return (
    <mesh ref={ref} position={[radius, y, 0]}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial map={texture} transparent side={THREE.DoubleSide} />
    </mesh>
  );
}
