import React from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Features = () => {
//   useGSAP(() => {
//     gsap.to(".heading1-page2", {
//       y: "-30%",
//       scale: 1.2,
//       scrollTrigger: {
//         trigger: ".Section2",
//         start: "top top",
//         end: "bottom top",
//         scrub: true,
//         pin: true,
//       }
//     });
//   }, []);

  return (
    <section
      id="features"
      className="Section2 page2 relative w-full min-h-screen flex items-center justify-center px-4 sm:px-8 bg-[#F5F5F5]"
    >
      <div className="heading1-page2 font-orbitron text-center text-black 
                      text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl 
                      w-full flex items-center justify-center">
        Features
      </div>
    </section>
  );
};

export default Features;
