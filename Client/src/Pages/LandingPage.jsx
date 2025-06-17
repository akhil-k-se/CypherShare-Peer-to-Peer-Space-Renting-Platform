import React, { useEffect, useState } from "react";
import Globe from "../Components/Globe";
import { NavbarDemo } from "../Components/Navbar";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

const LandingPage = () => {
  const [isShortScreen, setIsShortScreen] = useState(false);

  useEffect(() => {
    // Check screen height for responsive adjustment
    const handleResize = () => {
      const height = window.innerHeight;
      setIsShortScreen(height < 600); // You can tweak this value
    };

    handleResize(); // Initial check
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".heading1", {
        y: -150,
        opacity: 0,
        duration: 2,
        ease: "power4.out",
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="w-full min-h-screen bg-black text-white overflow-x-hidden">
      <NavbarDemo />

      {/* Section 1 */}
      <section className="relative w-full h-screen font-orbitron">
        <div
          className={`w-full h-full flex flex-col items-center justify-center absolute z-30 text-center px-4 select-none pointer-events-none
            ${isShortScreen ? "gap-3 pb-4" : "gap-5 md:gap-7 pb-[8%]"}`}
        >
          {/* Headings */}
          <div>
            <h1
              className={`font-bold heading1 p-2 ${
                isShortScreen
                  ? "text-3xl sm:text-4xl"
                  : "text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl"
              }`}
            >
              Empowering
            </h1>
            <h1
              className={`font-bold heading1 p-2 ${
                isShortScreen
                  ? "text-3xl sm:text-4xl"
                  : "text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl"
              }`}
            >
              Secure File Sharing System
            </h1>
          </div>

          {/* Subtext */}
          <div>
            <p
              className={`heading1 leading-snug px-2 ${
                isShortScreen
                  ? "text-base sm:text-lg"
                  : "text-lg sm:text-xl md:text-2xl"
              }`}
            >
              Secure, encrypt and share files across devices
            </p>
            <p
              className={`heading1 leading-snug px-2 ${
                isShortScreen
                  ? "text-base sm:text-lg"
                  : "text-lg sm:text-xl md:text-2xl"
              }`}
            >
              ensuring complete data privacy
            </p>
          </div>
        </div>

        <Globe className="absolute z-10" />
      </section>

      {/* Section 2 */}
      <section className="w-full min-h-screen flex items-center justify-center bg-gray-900 px-4 text-center">
        <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold">Page 2</h2>
      </section>

      {/* Section 3 */}
      <section className="w-full min-h-screen flex items-center justify-center bg-gray-800 px-4 text-center">
        <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold">Page 3</h2>
      </section>
    </div>
  );
};

export default LandingPage;
