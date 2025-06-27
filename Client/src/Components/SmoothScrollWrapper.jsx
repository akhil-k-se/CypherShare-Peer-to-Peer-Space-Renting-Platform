"use client";
import React, { useEffect } from "react";
import gsap from "gsap";
import ScrollSmoother from "gsap/ScrollSmoother";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollSmoother, ScrollTrigger);

export default function SmoothScrollWrapper({ children }) {
  useEffect(() => {
    if (!window.smoother) {
      window.smoother = ScrollSmoother.create({
        wrapper: "#smooth-wrapper",
        content: "#smooth-content",
        smooth: 1.3,
        normalizeScroll: true,
        effects: true,
      });
    }
  }, []);

  return (
    <div id="smooth-wrapper">
      <div id="smooth-content" className="relative">
        {children}
      </div>
    </div>
  );
}
