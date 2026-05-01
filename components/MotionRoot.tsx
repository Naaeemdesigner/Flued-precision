"use client";

import { LayoutGroup, LazyMotion, MotionConfig, domAnimation } from "framer-motion";
import { useEffect, useState } from "react";
import { BookingProvider } from "./BookingContext";

/**
 * Single root for all Framer Motion features.
 * - LazyMotion + domAnimation: ~80% smaller than full `motion`.
 * - MotionConfig respects user's reduced-motion preference globally.
 * - LayoutGroup orchestrates shared `layoutId` transitions across sections.
 *
 * Per-component `<LazyMotion>` wrappers can be removed — nested LazyMotion is
 * a no-op but produces a dev warning. Keep this as the only one.
 */
export default function MotionRoot({ children }: { children: React.ReactNode }) {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return (
    <BookingProvider>
      <LazyMotion features={domAnimation}>
        <MotionConfig
          reducedMotion={reduced ? "always" : "never"}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <LayoutGroup>{children}</LayoutGroup>
        </MotionConfig>
      </LazyMotion>
    </BookingProvider>
  );
}
