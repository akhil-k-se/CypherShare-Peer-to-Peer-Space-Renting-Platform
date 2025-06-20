"use client";
import React, { useRef, useLayoutEffect } from "react";
import {
  motion,
  useAnimationFrame,
  useMotionTemplate,
  useMotionValue,
  useTransform,
} from "motion/react";
import { cn } from "../lib/utils";

export function Button({
  borderRadius = "1.75rem",
  children,
  as: Component = "button",
  containerClassName,
  borderClassName,
  duration,
  className,
  ...otherProps
}) {
  return (
    <Component
      className={cn(
        "relative h-16 w-40 overflow-hidden p-[1px] text-xl z-40 font-orbitron hidden lg:block",
        containerClassName
      )}
      style={{ borderRadius }}
      {...otherProps}
    >
      <div
        className="absolute inset-0"
        style={{ borderRadius: `calc(${borderRadius} * 0.96)` }}
      >
        <MovingBorder duration={duration} rx="30%" ry="30%">
          <div
            className={cn(
              "h-20 w-20 bg-[radial-gradient(#0ea5e9_40%,transparent_60%)] opacity-[0.8]",
              borderClassName
            )}
          />
        </MovingBorder>
      </div>
      <div
        className={cn(
          "relative flex h-full w-full items-center justify-center border border-gray-700 bg-black/[0.8] text-sm text-white antialiased backdrop-blur-xl",
          className
        )}
        style={{ borderRadius: `calc(${borderRadius} * 0.96)` }}
      >
        {children}
      </div>
    </Component>
  );
}

export const MovingBorder = ({
  children,
  duration = 3000,
  rx,
  ry,
  ...otherProps
}) => {
  const pathRef = useRef(null);
  const progress = useMotionValue(0);

  useAnimationFrame((time) => {
    const path = pathRef.current;

    if (
      !path ||
      typeof path.getTotalLength !== "function" ||
      path.getBBox().width === 0 || // not rendered yet
      !path.getAttribute("width") || // SVG rect invalid
      !path.getAttribute("height")
    ) {
      return;
    }

    try {
      const length = path.getTotalLength();
      const pxPerMillisecond = length / duration;
      progress.set((time * pxPerMillisecond) % length);
    } catch (err) {
      console.warn("⚠️ Failed to get path total length:", err);
    }
  });

  const x = useTransform(progress, (val) => {
    const path = pathRef.current;
    if (!path || typeof path.getPointAtLength !== "function") return 0;

    try {
      return path.getPointAtLength(val).x;
    } catch (err) {
      return 0;
    }
  });

  const y = useTransform(progress, (val) => {
    const path = pathRef.current;
    if (!path || typeof path.getPointAtLength !== "function") return 0;

    try {
      return path.getPointAtLength(val).y;
    } catch (err) {
      return 0;
    }
  });

  const transform = useMotionTemplate`translateX(${x}px) translateY(${y}px) translateX(-50%) translateY(-50%)`;

  return (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        className="absolute h-full w-full pointer-events-none"
        width="100%"
        height="100%"
        {...otherProps}
      >
        <rect
          ref={pathRef}
          fill="none"
          width="100%"
          height="100%"
          rx={rx}
          ry={ry}
        />
      </svg>

      <motion.div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          display: "inline-block",
          transform,
        }}
      >
        {children}
      </motion.div>
    </>
  );
};
