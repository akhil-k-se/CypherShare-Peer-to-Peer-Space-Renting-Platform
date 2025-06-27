import React, { useRef, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Stars, OrbitControls, Html } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { OrbitingLogo } from "./LogoOrbit";

// Earth component
function Earth({ scale }) {
  const earthRef = useRef();

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const earth = earthRef.current;

    gsap.fromTo(
      earth.position,
      { y: -10 },
      {
        y: 0,
        duration: 2,
        ease: "power4.out",
      }
    );
    gsap.set(earth.position, { y: 0 });

    gsap.to(earth.position, {
      y: -10,
      ease: "power4.out",
      scrollTrigger: {
        trigger: "#globe-section", 
        start: "top top",
        end: "bottom bottom", 
        scrub: true,
        // pin: true,
        // markers:true,
      },
    });
  }, []);

  return (
    <mesh ref={earthRef} scale={scale}>
      <sphereGeometry args={[2, 100, 100]} />
      <meshStandardMaterial emissive="white" emissiveIntensity={1} />
    </mesh>
  );
}

// Globe wrapper
export default function Globe({className}) {
  const starsGroupRef = useRef();
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1280
  );

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const scale = windowWidth < 768 ? 3.5 : windowWidth < 1024 ? 4.5 : 5;
  const cameraPos = [0, 0, 10];

  // if(scale==3.5)
  // {
  //   renderer.dispose();
  // scene = null;

  // }

  return (
    <div
      className={`${className}`}
    >
      <Canvas camera={{ position: cameraPos }}>
        {/* <OrbitingLogo
          textureURL="/assets/images/logo.png"
          radius={6}
          speed={0.5}
          y={-3}
        /> */}

        {/* <OrbitingLogo textureURL="/logos/ethereum.png" radius={6.5} speed={0.3} y={1.5} />
<OrbitingLogo textureURL="/logos/mongodb.png" radius={5.5} speed={0.4} y={-1} />
<OrbitingLogo textureURL="/logos/express.png" radius={6.2} speed={0.35} y={2} /> */}

        <ambientLight intensity={1.5} />

        {/* Stars */}
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
