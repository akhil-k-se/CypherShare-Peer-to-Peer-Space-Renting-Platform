import React from "react";
import AnimatedGlobeFooter from "../../Components/ui/AnimatesGlobeFooter";
import { playClickSound } from "../../Components/playClickSound";

const Footer = () => {
  return (
    <div className="w-full min-h-[600px] lg:min-h-screen relative overflow-hidden font-orbitron bg-black text-white flex flex-col justify-end">
      {/* Animated Globe in Background */}
      <section className="w-full h-full absolute top-0 left-0 z-0 pointer-events-none">
        <AnimatedGlobeFooter className="w-full h-full" />
      </section>

      {/* Centered Brand Heading */}
      <div className="absolute left-1/2 top-[15%] -translate-x-1/2 translate-y-1/3 z-10 text-black text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-center font-semibold drop-shadow-xl">
        CypherShare
      </div>

      {/* Footer Content */}
      <div className="relative z-10 w-full px-4 sm:px-10 md:px-16 pb-10 pt-32">
        <div className="w-full max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-y-12 gap-x-10 animate-fadeInUp transition-all ease-in-out">
          {/* Column 1: Left Leg of U */}
          <div className="space-y-6">
            <h3 className="text-2xl sm:text-3xl font-semibold mb-4">
              About CypherShare
            </h3>
            <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
              A secure peer-to-peer platform for encrypted file storage and
              passive income. Powered by AES-256, IPFS, and decentralization.
            </p>
          </div>

          {/* Column 2 */}
          <div className="space-y-6">
            <h4 className="text-lg font-semibold mb-3">Quick Links</h4>
            <ul className="space-y-2 text-gray-400 text-sm sm:text-base">
              <li>
                <a
                  onClick={() => {
                    playClickSound(); // optional

                    const target = document.getElementById("how-it-works");
                    if (target && window.smoother) {
                      console.log(target);
                      window.smoother.scrollTo(target, true, "top top");
                    }
                  }}
                  className="hover:text-white transition hover:cursor-pointer"
                >
                  How It Works
                </a>
              </li>
              <li>
                <a href="/login" className="hover:text-white transition">
                  Login
                </a>
              </li>
              <li>
                <a href="/register" className="hover:text-white transition">
                  Register
                </a>
              </li>
              <li>
                <a onClick={()=>{
                  playClickSound();
                }} className="hover:text-white hover:cursor-pointer transition">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3 */}
          <div className="space-y-6">
            <h4 className="text-lg font-semibold mb-3">Legal</h4>
            <ul className="space-y-2 text-gray-400 text-sm sm:text-base">
              <li>
                <a href="/privacy" className="hover:text-white transition">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="/terms" className="hover:text-white transition">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Right Leg of U */}
          <div className="space-y-6">
            <h4 className="text-lg font-semibold mb-3">Contact</h4>
            <p className="text-gray-300 mb-3 text-sm sm:text-base">
              support@cyphershare.in
            </p>
            <div className="flex space-x-5 text-gray-400 text-sm sm:text-base">
              <a href="#" className="hover:text-white transition">
                Twitter
              </a>
              <a href="#" className="hover:text-white transition">
                GitHub
              </a>
              <a href="#" className="hover:text-white transition">
                LinkedIn
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Note */}
        <div className="mt-12 text-center text-xs text-gray-400 tracking-wide">
          © {new Date().getFullYear()} CypherShare. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default Footer;
