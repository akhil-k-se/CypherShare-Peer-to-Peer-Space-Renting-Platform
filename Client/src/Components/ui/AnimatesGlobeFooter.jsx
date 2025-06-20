import React, { useRef, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Stars, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Earth object with scroll-triggered animation
const Earth = ({ scale }) => {
  const earthRef = useRef();

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const earth = earthRef.current;

    gsap.fromTo(
      earth.position,
      { y: 11 }, // starts above
      {
        y: 0,
        duration:1, // moves to center
        ease: "power4.inout",
        scrollTrigger: {
          trigger: "#animated-globe-container",
          start: "top 80%",
          end: "top 30%",
          scrub: true,
        //   markers: true,
        },
      }
    );
  }, []);

  return (
    <mesh ref={earthRef} scale={scale}>
      <sphereGeometry args={[2, 100, 100]} />
      <meshStandardMaterial emissive="white" emissiveIntensity={1} />
    </mesh>
  );
};

const AnimatedGlobeFooter = ({ className = "" }) => {
  const starsRef = useRef();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const scale = windowWidth < 768 ? 3.5 : windowWidth < 1024 ? 4.5 : 5;
  const cameraPos = [0, 0, 10];

  return (
    <div id="animated-globe-container" className={`w-full h-full ${className}`}>
      <Canvas camera={{ position: cameraPos }}>
        <ambientLight intensity={1.5} />
        <group ref={starsRef}>
          <Stars radius={100} depth={40} count={9000} factor={4} fade />
        </group>
        <group position={[0, 10, 0]}>
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
};

export default AnimatedGlobeFooter;
