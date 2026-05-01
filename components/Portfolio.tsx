"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence, LazyMotion, domAnimation, useReducedMotion } from "framer-motion";
import { GripVertical } from "lucide-react";

const SILVER = "#C0C0C0";
const RED = "#E63946";

type Project = {
  id: string;
  vehicle: string;
  service: string;
  before: string;
  after: string;
  alt: string;
};

const PROJECTS: Project[] = [
  {
    id: "porsche-911",
    vehicle: "Porsche 911 GT3",
    service: "Platinum Ceramic Package",
    before: "/media/portfolio/3.jpg",
    after: "/media/portfolio/1.jpg",
    alt: "Porsche 911 GT3 paint correction and ceramic coating",
  },
  {
    id: "range-rover",
    vehicle: "Range Rover Autobiography",
    service: "Gold Signature Detail",
    before: "/media/portfolio/4.jpg",
    after: "/media/portfolio/2.jpg",
    alt: "Range Rover deep interior steam clean and leather conditioning",
  },
  {
    id: "g-wagon",
    vehicle: "Mercedes-AMG G63",
    service: "Platinum Ceramic Package",
    before: "/media/portfolio/5.jpg",
    after: "/media/portfolio/6.jpg",
    alt: "Mercedes-AMG G63 paint enhancement and swirl removal",
  },
];

function ComparisonSlider({ project }: { project: Project }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number>(0);
  const pendingXRef = useRef<number | null>(null);
  const pointerIdRef = useRef<number | null>(null);
  const [pos, setPos] = useState(50);
  const [dragging, setDragging] = useState(false);
  const [hovered, setHovered] = useState(false);

  // rAF-throttled position update — coalesces high-frequency pointermove events
  // so we never re-render more than once per frame. Eliminates handle "lag"
  // during fast cursor moves on desktop.
  const scheduleUpdate = useCallback((clientX: number) => {
    pendingXRef.current = clientX;
    if (rafRef.current) return;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = 0;
      const x = pendingXRef.current;
      const el = containerRef.current;
      if (x == null || !el) return;
      const rect = el.getBoundingClientRect();
      const pct = ((x - rect.left) / rect.width) * 100;
      setPos(Math.max(0, Math.min(100, pct)));
    });
  }, []);

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // Pointer-capture model: once dragging starts, all pointer events route to
  // the slider element regardless of cursor position. Prevents losing the
  // handle during rapid drags off the artboard.
  const startDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = containerRef.current;
    if (!el) return;
    setDragging(true);
    pointerIdRef.current = e.pointerId;
    try {
      el.setPointerCapture(e.pointerId);
    } catch {
      /* unsupported — fall back to window listeners below */
    }
    scheduleUpdate(e.clientX);
  };

  const onContainerPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    // Allow knob's own onPointerDown to also start; both call startDrag safely.
    e.preventDefault();
    startDrag(e);
  };

  const onContainerPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging) return;
    e.preventDefault();
    scheduleUpdate(e.clientX);
  };

  const endDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging) return;
    const el = containerRef.current;
    if (el && pointerIdRef.current != null) {
      try {
        el.releasePointerCapture(pointerIdRef.current);
      } catch {
        /* ignore */
      }
    }
    pointerIdRef.current = null;
    setDragging(false);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") setPos((p) => Math.max(0, p - 5));
    if (e.key === "ArrowRight") setPos((p) => Math.min(100, p + 5));
    if (e.key === "Home") setPos(0);
    if (e.key === "End") setPos(100);
  };

  return (
    <div
      ref={containerRef}
      className={`ba-slider relative w-full select-none ${hovered ? "is-hover" : ""} ${dragging ? "is-dragging" : ""}`}
      style={{
        aspectRatio: "16 / 10",
        borderRadius: 32,
        border: `1px solid ${SILVER}33`,
        boxShadow: "0 24px 64px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.02) inset",
        overflow: "hidden",
        background: "#0A0A0A",
        cursor: dragging ? "grabbing" : "ew-resize",
        touchAction: "none",
      }}
      onPointerDown={onContainerPointerDown}
      onPointerMove={onContainerPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onLostPointerCapture={endDrag}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      role="group"
      aria-label={`${project.vehicle} — before and after comparison`}
    >
      {/* AFTER (full background) */}
      <Image
        src={project.after}
        alt={`${project.alt} — after`}
        fill
        sizes="(max-width: 768px) 100vw, 1200px"
        className="ba-img ba-after"
        priority={false}
      />

      {/* BEFORE (clipped overlay) */}
      <div
        className="absolute inset-0 ba-before-wrap"
        style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
        aria-hidden="true"
      >
        <Image
          src={project.before}
          alt=""
          fill
          sizes="(max-width: 768px) 100vw, 1200px"
          className="ba-img"
        />
      </div>

      {/* Floating labels */}
      <span className="ba-label ba-label-before" aria-hidden="true">Before</span>
      <span className="ba-label ba-label-after" aria-hidden="true">After</span>

      {/* Handle: full-height neon red line + centered elegant knob */}
      <div
        className="ba-handle pointer-events-none absolute top-0 bottom-0"
        style={{ left: `${pos}%` }}
      >
        {/* Solid red line — edge-to-edge full image height */}
        <span className="ba-line-core" aria-hidden="true" />

        {/* Drag knob — prominent, centered exactly */}
        <button
          type="button"
          className="ba-knob"
          role="slider"
          aria-label="Comparison slider position"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(pos)}
          onPointerDown={(e) => {
            e.stopPropagation();
            // Forward to container handler — capture happens on container so
            // pointermove keeps tracking even off the knob.
            const synth = e as unknown as React.PointerEvent<HTMLDivElement>;
            startDrag(synth);
          }}
          onKeyDown={onKeyDown}
        >
          <GripVertical size={16} strokeWidth={2.5} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

export default function Portfolio() {
  const reduced = useReducedMotion();
  const [active, setActive] = useState(0);
  const project = PROJECTS[active];

  return (
    <LazyMotion features={domAnimation}>
      <section
        id="portfolio"
        aria-labelledby="portfolio-heading"
        className="relative overflow-hidden py-24 md:py-32"
        style={{ background: "#0A0A0A" }}
      >
        {/* Atmospheric mesh */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(50% 40% at 80% 20%, rgba(230,57,70,0.08) 0%, rgba(230,57,70,0) 70%), radial-gradient(40% 35% at 15% 80%, rgba(230,57,70,0.05) 0%, rgba(230,57,70,0) 70%)",
          }}
        />
        {/* Grain */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            opacity: 0.025,
            mixBlendMode: "overlay",
            backgroundImage:
              "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.9 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
            backgroundSize: "240px 240px",
          }}
        />

        <div className="relative mx-auto w-full max-w-[1280px] px-6 md:px-10">
          <motion.header
            initial={reduced ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="mb-14 text-center md:mb-20"
          >
            <h2
              id="portfolio-heading"
              className="mx-auto max-w-[20ch] text-[clamp(1.75rem,4.5vw,3.25rem)] leading-[1.05]"
              style={{
                fontFamily: "var(--font-syncopate), sans-serif",
                fontWeight: 700,
                letterSpacing: "5px",
                textTransform: "uppercase",
                background:
                  "linear-gradient(180deg, #FFFFFF 0%, #C0C0C0 50%, #8A8A8A 100%)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              See the Difference
            </h2>
            <p
              className="mx-auto mt-5 max-w-[60ch] text-base md:text-lg"
              style={{
                fontFamily: "var(--font-inter), sans-serif",
                color: "rgba(160,160,160,0.9)",
                fontWeight: 300,
                lineHeight: 1.6,
              }}
            >
              Real transformations. Drag to reveal the results.
            </p>
          </motion.header>

          {/* Slider */}
          <motion.div
            initial={reduced ? false : { opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={project.id}
                initial={reduced ? false : { opacity: 0, x: 32, filter: "blur(6px)" }}
                animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                exit={reduced ? undefined : { opacity: 0, x: -32, filter: "blur(6px)" }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              >
                <ComparisonSlider project={project} />
              </motion.div>
            </AnimatePresence>
          </motion.div>


          {/* Project navigation — minimalist arrows + dots, sits where info bar used to */}
          <div className="mt-6 flex items-center justify-center gap-5">
            <button
              type="button"
              onClick={() =>
                setActive((p) => (p - 1 + PROJECTS.length) % PROJECTS.length)
              }
              aria-label="Previous project"
              className="pf-nav inline-flex items-center justify-center"
              style={{
                width: 48,
                height: 48,
                borderRadius: 999,
                background: "rgba(255,255,255,0.03)",
                border: `1px solid ${SILVER}33`,
                color: SILVER,
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)",
              }}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>

            <div
              className="flex items-center gap-2"
              role="tablist"
              aria-label="Project pagination"
            >
              {PROJECTS.map((p, i) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setActive(i)}
                  aria-label={`Go to project ${i + 1}`}
                  aria-selected={i === active}
                  role="tab"
                  className="pf-dot"
                  style={{
                    width: i === active ? 28 : 8,
                    height: 8,
                    borderRadius: 999,
                    background: i === active ? RED : `${SILVER}40`,
                    boxShadow: i === active ? `0 0 12px ${RED}99` : "none",
                    transition: "all 0.4s cubic-bezier(0.22,1,0.36,1)",
                    border: 0,
                    cursor: "pointer",
                  }}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={() => setActive((p) => (p + 1) % PROJECTS.length)}
              aria-label="Next project"
              className="pf-nav inline-flex items-center justify-center"
              style={{
                width: 48,
                height: 48,
                borderRadius: 999,
                background: "rgba(255,255,255,0.03)",
                border: `1px solid ${SILVER}33`,
                color: SILVER,
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)",
              }}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>
        </div>

        <style jsx>{`
          .pf-nav:hover,
          .pf-nav:focus-visible {
            color: ${RED} !important;
            border-color: ${RED} !important;
            background: rgba(230, 57, 70, 0.08) !important;
            box-shadow: 0 0 24px ${RED}66;
            transform: translateY(-1px);
            outline: none;
          }
          .pf-nav:active {
            transform: translateY(0) scale(0.96);
          }
          .pf-dot:hover {
            background: ${RED}80 !important;
          }
          .ba-slider {
            transition: filter 0.4s ease, box-shadow 0.4s ease;
          }
          .ba-slider.is-hover :global(.ba-img),
          .ba-slider.is-dragging :global(.ba-img) {
            filter: contrast(1.08) saturate(1.06);
          }
          .ba-slider :global(.ba-img) {
            object-fit: cover;
            transition: filter 0.4s ease;
          }
          .ba-label {
            position: absolute;
            top: 24px;
            font-family: var(--font-syncopate), sans-serif;
            font-size: 10px;
            letter-spacing: 4px;
            text-transform: uppercase;
            color: ${SILVER};
            padding: 6px 14px;
            background: rgba(10, 10, 10, 0.55);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            border: 1px solid ${SILVER}26;
            border-radius: 32px;
            pointer-events: none;
            z-index: 2;
          }
          .ba-label-before { left: 24px; }
          .ba-label-after { right: 24px; color: #fff; }

          .ba-handle { z-index: 3; }

          /* Solid red vertical line — full edge-to-edge height */
          .ba-line-core {
            position: absolute;
            left: 50%;
            top: 0;
            bottom: 0;
            width: 2.5px;
            transform: translateX(-50%);
            background: ${RED};
            box-shadow:
              0 0 8px ${RED}cc,
              0 0 18px ${RED}80,
              0 0 36px ${RED}55;
            pointer-events: none;
          }

          /* Drag knob — prominent + elegant, perfectly centered */
          .ba-knob {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: radial-gradient(circle at 30% 30%, #1a1a1a 0%, #0a0a0a 100%);
            border: 1.5px solid ${RED};
            color: ${RED};
            display: inline-flex;
            align-items: center;
            justify-content: center;
            cursor: grab;
            pointer-events: auto;
            box-shadow:
              0 0 0 4px rgba(230, 57, 70, 0.14),
              0 0 18px ${RED}aa,
              0 0 36px ${RED}55,
              inset 0 1px 1px rgba(255, 255, 255, 0.1);
            transition: box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1),
              transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
            animation: knobBreath 2.6s ease-in-out infinite;
            will-change: transform;
          }
          .ba-knob:hover {
            transform: translate(-50%, -50%) scale(1.1);
            box-shadow:
              0 0 0 7px rgba(230, 57, 70, 0.18),
              0 0 28px ${RED}cc,
              0 0 56px ${RED}80,
              inset 0 1px 1px rgba(255, 255, 255, 0.12);
          }
          .ba-knob:active {
            cursor: grabbing;
            transform: translate(-50%, -50%) scale(1.05);
            animation: none;
          }
          .ba-knob:focus-visible {
            outline: 2px solid ${RED};
            outline-offset: 4px;
          }
          @keyframes knobBreath {
            0%, 100% {
              box-shadow:
                0 0 0 4px rgba(230, 57, 70, 0.14),
                0 0 18px ${RED}aa,
                0 0 36px ${RED}55,
                inset 0 1px 1px rgba(255, 255, 255, 0.1);
            }
            50% {
              box-shadow:
                0 0 0 11px rgba(230, 57, 70, 0),
                0 0 30px ${RED}cc,
                0 0 60px ${RED}80,
                inset 0 1px 1px rgba(255, 255, 255, 0.1);
            }
          }

          @media (max-width: 768px) {
            .ba-knob { width: 34px; height: 34px; border-width: 1.25px; }
            .ba-line-core { width: 2px; }
            .ba-label { top: 16px; font-size: 9px; padding: 5px 10px; }
            .ba-label-before { left: 16px; }
            .ba-label-after { right: 16px; }
          }

          @media (prefers-reduced-motion: reduce) {
            .ba-knob { animation: none; }
            .ba-slider, .ba-slider :global(.ba-img) { transition: none !important; }
          }
        `}</style>
      </section>
    </LazyMotion>
  );
}
