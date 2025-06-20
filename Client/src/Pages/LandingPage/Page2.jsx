import React, { useState } from "react";

const steps = [
  { title: "Upload File Securely", role: "user" },
  { title: "File Gets Encrypted", role: "user" },
  { title: "File Sent to Network", role: "user" },
  { title: "Access Anytime Globally", role: "user" },
  { title: "Store File Encrypted", role: "provider" },
  { title: "Auto Sync & Manage", role: "provider" },
  { title: "Earn Passive Income", role: "provider" },
  { title: "Always Stay Private", role: "provider" },
];

const FlowCircleStatic = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const angle = 360 / steps.length;
  const radius = 200;

  const handleClickOutside = () => {
    setActiveIndex(null);
  };

  return (
    <section
      id="how-it-works"
      onClick={handleClickOutside}
      className="relative w-full min-h-screen flex items-center justify-center bg-[#F5F5F5] py-32 overflow-hidden"
    >
      <div className="relative w-[500px] h-[500px] sm:w-[600px] sm:h-[600px]">
        {/* {steps.map((step, i) => {
          const rotation = angle * i;
          const x = radius * Math.cos((rotation * Math.PI) / 180);
          const y = radius * Math.sin((rotation * Math.PI) / 180);

          const isActive = activeIndex === i;

          return (
            <div
              key={i}
              onClick={(e) => {
                e.stopPropagation(); // Prevent bubbling to parent
                setActiveIndex(i);
              }}
              className={`absolute w-40 h-40 bg-black text-white p-4 rounded-2xl flex items-center justify-center text-center shadow-xl border transition-all duration-500 ease-in-out cursor-pointer
  ${isActive ? "z-50" : "hover:scale-105 hover:z-30"}
  ${step.role === "user" ? "border-blue-500" : "border-green-500"}`}
              style={{
                top: isActive ? "50%" : `calc(50% + ${y}px - 80px)`,
                left: isActive ? "50%" : `calc(50% + ${x}px - 80px)`,
                transform: isActive
                  ? "translate(-50%, -50%) scale(4)"
                  : "translate(0, 0)",
              }}
            >
              <span className="text-sm font-medium leading-tight font-montserrat">
                {step.title}
              </span>
            </div>
          );
        })} */}

        {/* Center label */}
        <div className="absolute top-1/2 left-1/2 w-40 h-40 sm:w-44 sm:h-44 -translate-x-1/2 -translate-y-1/2 bg-black text-white rounded-full flex items-center justify-center font-bold text-lg sm:text-xl shadow-[0_0_80px_rgba(0,0,0,0.2)] font-orbitron z-10 pointer-events-none">
          CypherShare
        </div>
      </div>
    </section>
  );
};

export default FlowCircleStatic;
