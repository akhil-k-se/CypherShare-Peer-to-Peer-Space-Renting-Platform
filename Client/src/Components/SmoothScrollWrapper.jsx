"use client";
import React, { useEffect } from "react";
import gsap from "gsap";
import ScrollSmoother from "gsap/ScrollSmoother";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollSmoother, ScrollTrigger);

export default function SmoothScrollWrapper({ children }) {
  useEffect(() => {
    ScrollSmoother.create({
      smooth: 1.2, // seconds it takes to "catch up"
      effects: true,
      normalizeScroll: true,
    });
  }, []);

  return (
    <div id="smooth-wrapper">
      <div id="smooth-content" className="relative">{children}</div>
    </div>
  );
}
