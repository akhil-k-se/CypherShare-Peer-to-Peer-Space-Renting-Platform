import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

const steps = [
  { title: "Upload File Securely", content: "Encrypted file securely uploaded.", role: "user" },
  { title: "File Gets Encrypted", content: "AES-256 protection applied.", role: "user" },
  { title: "File Sent to Network", content: "Sent to global network nodes.", role: "user" },
  { title: "Access Anytime Globally", content: "Access your file globally.", role: "user" },
  { title: "Store File Encrypted", content: "Provider stores encrypted data.", role: "provider" },
  { title: "Auto Sync & Manage", content: "Auto sync with network.", role: "provider" },
  { title: "Earn Passive Income", content: "Earn by sharing space.", role: "provider" },
  { title: "Always Stay Private", content: "Your privacy is absolute.", role: "provider" },
];

const FlowCircleStatic = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [isSmall, setIsSmall] = useState(false);
  const angle = 360 / steps.length;
  const radius = 200;
  const activeStep = steps[activeIndex];

  const handleClickOutside = () => setActiveIndex(null);

  useEffect(() => {
    const updateSize = () => setIsSmall(window.innerWidth < 640);
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  return (
    <section
      id="how-it-works"
      onClick={handleClickOutside}
      className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#F5F5F5] px-4 py-16"
    >
      {/* Circle View (Desktop) */}
      <AnimatePresence>
        {!isSmall && activeIndex === null && (
          <motion.div
            key="circle-view"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 70, damping: 14 }}
            className="relative w-[500px] h-[500px] sm:w-[600px] sm:h-[600px]"
          >
            {steps.map((step, i) => {
              const rotation = angle * i;
              const x = radius * Math.cos((rotation * Math.PI) / 180);
              const y = radius * Math.sin((rotation * Math.PI) / 180);

              return (
                <motion.div
                  key={i}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveIndex(i);
                  }}
                  className="absolute w-40 h-40 p-4 rounded-2xl flex items-center justify-center text-center shadow-xl border cursor-pointer text-black font-montserrat bg-white"
                  style={{
                    top: `calc(50% + ${y}px - 80px)`,
                    left: `calc(50% + ${x}px - 80px)`,
                    borderColor: "#000",
                  }}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                >
                  <span className="text-sm font-medium leading-tight">
                    {step.title}
                  </span>
                </motion.div>
              );
            })}

            {/* Center Label */}
            <div className="absolute top-1/2 left-1/2 w-40 h-40 sm:w-44 sm:h-44 -translate-x-1/2 -translate-y-1/2 bg-black text-white rounded-full flex items-center justify-center font-bold text-lg sm:text-xl shadow-lg font-orbitron pointer-events-none">
              CypherShare
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Vertical View (Mobile) */}
      <AnimatePresence>
        {isSmall && activeIndex === null && (
          <motion.div
            key="list-view"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col gap-4 w-full max-w-md"
          >
            {steps.map((step, i) => (
              <motion.div
                key={i}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveIndex(i);
                }}
                className="bg-white text-black p-4 rounded-2xl shadow-md border border-black cursor-pointer font-montserrat hover:shadow-lg transition duration-300"
              >
                <h3 className="text-base font-semibold">{step.title}</h3>
                <p className="text-xs text-gray-500 mt-1">{step.role === "user" ? "User" : "Provider"}</p>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Zoomed Card Modal */}
      <AnimatePresence>
        {activeStep && (
          <motion.div
            key={`card-${activeIndex}`}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 12 }}
            className="absolute top-1/2 left-1/2 w-[90vw] max-w-md h-auto min-h-[260px] -translate-x-1/2 -translate-y-1/2 bg-black text-white p-6 rounded-3xl shadow-2xl z-50 text-center font-montserrat"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg sm:text-2xl font-bold mb-3 font-orbitron">{activeStep.title}</h2>
            <p className="text-sm sm:text-base">{activeStep.content}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default FlowCircleStatic;
