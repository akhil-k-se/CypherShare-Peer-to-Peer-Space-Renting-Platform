import React from "react";
import AnimatedGlobeFooter from "../../Components/ui/AnimatesGlobeFooter";

const Footer = () => {
  return (
    <div className="w-full h-[70vh] min-h-[500px] sm:min-h-[600px] md:min-h-[700px] relative overflow-hidden font-orbitron">
      {/* Centered Heading Text */}
      <div className="absolute left-1/2 top-[15%] -translate-x-1/2 text-black z-10 text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-center font-semibold">
        CypherShare
      </div>

      {/* Animated Globe */}
      <section className="w-full h-full relative">
        <AnimatedGlobeFooter className="w-full h-full z-0" />
      </section>
    </div>
  );
};

export default Footer;
