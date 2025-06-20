import React, { useEffect, useState, useRef } from "react";
import Globe from "../../Components/ui/Globe";
import { NavbarDemo } from "../../Components/ui/Navbar";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AnimatePresence, motion } from "framer-motion";
import SoundToggle from "../../Components/SoundToggle";
import BackToTopButton from "../../Components/ui/backToTopButton";
import Login from "../Login";
import Register from "../Register";
import Page2 from "./Page2";
import { playClickSound } from "../../Components/playClickSound";
import Page3 from "./Page3";
import Features from "./Features";
import Footer from "./Footer";
gsap.registerPlugin(ScrollTrigger);

const LandingPage = () => {
  const [isShortScreen, setIsShortScreen] = useState(false);
  const [showButton, setShowButton] = useState(false); // 👈 Add this
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  const heroRef = useRef(null);
  // const globeRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      const height = window.innerHeight;
      setIsShortScreen(height < 600);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".heading1-text", {
        y: -150,
        opacity: 0,
        duration: 2,
        ease: "power4.out",
      });

      gsap.fromTo(
        ".heading1",
        { y: 100 },
        {
          y: -150,
          duration: 1,
          scrollTrigger: {
            trigger: ".heading1",
            start: "top 70%",
            scrub: true,
          },
        }
      );

      gsap.to(".heading2", {
        y: -100,
        duration: 1,
        scrollTrigger: {
          trigger: ".heading2",
          start: "top 75%",
          scrub: true,
        },
      });

      // gsap.to(".Section2", {
      //   backgroundColor: "#F5F5F5",
      //   color: "black",
      //   ease: "power4.out",
      //   scrollTrigger: {
      //     // trigger: ".header1",
      //     scrub: true,
      //     start: "top top",
      //     end: "+=500",
      //   },
      // });
    });

    return () => ctx.revert();
  }, []);

  const handleOnLoginClick = () => {
    playClickSound();
    const timeline = gsap.timeline();

    timeline
      .to(".heading1", {
        y: 1000,
        opacity: 0,
        duration: 1,
        ease: "power4.inOut",
        stagger: 0.1,
      })
      .to(
        ".heading2",
        {
          y: 1000,
          opacity: 0,
          duration: 1,
          ease: "power4.inOut",
        },
        "<"
      ) // run in parallel with heading1
      // .to(
      //   ".globe-layer",
      //   {
      //     y: 1000,
      //     opacity: 0,
      //     duration: 1,
      //     ease: "power4.inOut",
      //   },
      //   "<"
      // ) // run in parallel
      .add(() => {
        setShowLogin(true);
      });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="w-full min-h-screen bg-black text-white overflow-x-hidden relative"
    >
      <BackToTopButton />

      <div className="w-full min-h-screen bg-black text-white overflow-x-hidden relative fullPage">
        <NavbarDemo onLoginClick={handleOnLoginClick}/>

        {/* Section 1 */}
        <section
          ref={heroRef}
          className="section1 relative w-full h-screen font-orbitron"
        >
          <div
            className={`w-full h-full flex flex-col items-center justify-center absolute z-30 text-center px-4 select-none pointer-events-none
            ${isShortScreen ? "gap-3 pb-4" : "gap-5 md:gap-7 pb-[8%]"}`}
          >
            {/* Headings */}
            <div className="flex items-center justify-center flex-col">
              <h1
                className={`font-bold p-5 overflow-hidden heading1 ${
                  isShortScreen
                    ? "text-3xl sm:text-4xl"
                    : "text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl"
                }`}
              >
                <div className="parallax-layer heading1-text">Empowering</div>
              </h1>
              <h1
                className={`font-bold p-5 overflow-hidden heading2 ${
                  isShortScreen
                    ? "text-3xl sm:text-4xl"
                    : "text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl"
                }`}
              >
                <div className="parallax-layer heading1-text">
                  Secure File Sharing System
                </div>
              </h1>
            </div>

            {/* Subtext */}
            <div>
              <div
                className={` leading-snug px-2 overflow-hidden heading1 ${
                  isShortScreen
                    ? "text-base sm:text-lg"
                    : "text-lg sm:text-xl md:text-2xl"
                }`}
              >
                <h1 className=" parallax-layer heading1-text">
                  Secure, encrypt and share files across devices
                </h1>
              </div>
              <div
                className={` leading-snug px-2 overflow-hidden heading1 ${
                  isShortScreen
                    ? "text-base sm:text-lg"
                    : "text-lg sm:text-xl md:text-2xl"
                }`}
              >
                <h1 className="parallax-layer heading1-text">
                  ensuring complete data privacy
                </h1>
              </div>
            </div>
          </div>

          {/* Get Started Button */}
          {showButton && (
            <button className="p-5 absolute text-black bg-white border border-black rounded-lg bottom-5 left-1/2 -translate-x-1/2 z-50">
              Get Started
            </button>
          )}

          {/* Pass event handlers to Globe */}
          <Globe
          id="globe-section"
            // ref={globeRef}
            className="absolute z-10 parallax-layer globe-layer w-full h-screen"
            // onMouseEnter={() => setShowButton(true)}
            // onMouseLeave={() => setShowButton(false)}
          />

          <AnimatePresence>
            {showLogin && (
              <motion.div
                key="login"
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 100 }}
                transition={{ duration: 0.5 }}
                className="fixed inset-0 bg-black z-50"
              >
                <Login
                  onClose={() => {
                    playClickSound();
                    const timeline = gsap.timeline();
                    setShowLogin(false);

                    timeline
                      .to(".heading1", {
                        y: 0,
                        opacity: 1,
                        duration: 1,
                        ease: "power4.out",
                        stagger: 0.1,
                      })
                      .to(
                        ".heading2",
                        {
                          y: 0,
                          opacity: 1,
                          duration: 1,
                          ease: "power4.out",
                        },
                        "<"
                      )
                      .to(
                        ".globe-layer",
                        {
                          y: 0,
                          opacity: 1,
                          duration: 1,
                          ease: "power4.out",
                        },
                        "<"
                      );
                  }}
                  onRegisterClick={() => {
                    playClickSound();
                    // Animate Login away
                    gsap
                      .timeline()
                      .to(".login-slide", {
                        y: 1000,
                        opacity: 0,
                        duration: 0.6,
                        ease: "power4.inOut",
                      })
                      .add(() => {
                        setShowLogin(false);
                        setShowRegister(true);
                      });
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>
          <AnimatePresence>
            {showRegister && (
              <motion.div
                key="register"
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 100 }}
                transition={{ duration: 0.5 }}
                className="fixed inset-0 bg-black z-50"
              >
                <Register
                  onClose={() => {
                    playClickSound();
                    gsap
                      .timeline()
                      .to(".register-slide", {
                        y: 1000,
                        opacity: 0,
                        duration: 0.6,
                        ease: "power4.inOut",
                      })
                      .add(() => {
                        setShowRegister(false);
                        // setShowLogin(false);

                        // Animate hero content back in
                        gsap
                          .timeline()
                          .to(".heading1", {
                            y: 0,
                            opacity: 1,
                            duration: 1,
                            ease: "power4.out",
                            stagger: 0.1,
                          })
                          .to(
                            ".heading2",
                            {
                              y: 0,
                              opacity: 1,
                              duration: 1,
                              ease: "power4.out",
                            },
                            "<"
                          )
                          .to(
                            ".globe-layer",
                            {
                              y: 0,
                              opacity: 1,
                              duration: 1,
                              ease: "power4.out",
                            },
                            "<"
                          );
                      });
                  }}
                  onSwitchToLogin={() => {
                    playClickSound();
                    gsap
                      .timeline()
                      .to(".register-slide", {
                        y: 1000,
                        opacity: 0,
                        duration: 0.6,
                        ease: "power4.inOut",
                      })
                      .add(() => {
                        setShowRegister(false);
                        setShowLogin(true);

                        // Animate login page in
                        gsap.fromTo(
                          ".login-slide",
                          { y: 1000, opacity: 0 },
                          {
                            y: 0,
                            opacity: 1,
                            duration: 0.8,
                            ease: "power4.out",
                          }
                        );
                      });
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* Other Sections */}
        {/* <section  id='how-it-works'   className="Section2 w-full min-h-screen flex items-center justify-center bg-transparent px-4 text-center text-white relative"> */}
          {/* <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold">Page 2</h2> */}
          <Page2/>
        {/* </section> */}

        {/* <section className="w-full min-h-screen flex items-center justify-center bg-gray-800 px-4 text-center"> */}
          {/* <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold">Page 3</h2> */}
          <Page3/>
        {/* </section> */}
        <Features/>

        <Footer/>
      </div>
    </motion.div>
  );
};

export default LandingPage;
