import React, { useRef, useEffect, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { MeshReflectorMaterial, OrbitControls, Stars } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";







// Earth mesh
function Earth({ scale }) {
  const earthRef = useRef();

  gsap.registerPlugin(ScrollTrigger);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        earthRef.current.position,
        { y: -10 },
        {
          y: 0,
          duration: 2,
          ease: "power4.out",
        }
      );
    });

    return () => ctx.revert();
  }, []);

  // useFrame(() => {
  //   // earthRef.current.rotation.y += 0.002;
  // });

  return (
    <mesh ref={earthRef} scale={scale}>
      <sphereGeometry args={[2, 100, 100]} />
      <meshStandardMaterial emissive="white" emissiveIntensity={1} />
    </mesh>
  );
}

// Globe wrapper
export default function Globe() {
  const starsGroupRef = useRef();
  const [windowWidth, setWindowWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 1280);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Dynamic scale and camera position based on screen width
  const scale = windowWidth < 768 ? 3.5 : windowWidth < 1024 ? 4.5 : 5;
  const cameraPos = windowWidth < 768 ? [0, 0, 10] : [0, 0, 10];

  return (
    <div className="w-screen h-screen">
      <Canvas camera={{ position: cameraPos }}>
        {/* Starfield */}
        <group ref={starsGroupRef}>
          <Stars radius={100} depth={40} count={9000} factor={4} fade />
        </group>

        {/* Earth */}
        <group position={[0, -13, 0]}>
          <Earth scale={scale} />
        </group>

        <OrbitControls
          enableZoom={false}
          autoRotate
          autoRotateSpeed={0.5}
          minPolarAngle={Math.PI / 2}
          maxPolarAngle={Math.PI / 2}
        />
      </Canvas>
    </div>
  );
}
