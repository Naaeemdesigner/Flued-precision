"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

const SILVER = "#C0C0C0";
const RED = "#E63946";

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      delayChildren: 0.2,
      staggerChildren: 0.12,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function Hero() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const prefersReducedMotion = useReducedMotion();
  const [videoReady, setVideoReady] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion) return;
    const v = videoRef.current;
    if (!v) return;
    // `loadeddata` fires when the first frame is decoded — earlier than `canplay`.
    // Triggering the swap here removes perceived lag between poster and motion.
    const onReady = () => setVideoReady(true);
    if (v.readyState >= 2) {
      // Already past first-frame — covers HMR / cache hits.
      onReady();
    } else {
      v.addEventListener("loadeddata", onReady, { once: true });
    }
    // Kick the network — guarantees the browser starts fetching immediately.
    try {
      v.load();
      const playPromise = v.play();
      if (playPromise && typeof playPromise.catch === "function") {
        playPromise.catch(() => {
          /* autoplay blocked — muted+playsInline should usually pass; ignore */
        });
      }
    } catch {
      /* ignore */
    }
    return () => v.removeEventListener("loadeddata", onReady);
  }, [prefersReducedMotion]);

  return (
    <>
      <section
        id="home"
        aria-label="Fluid Precision — Showroom Shine"
        className="relative isolate flex min-h-[100svh] w-full items-center overflow-hidden"
        style={{ background: "#0A0A0A" }}
      >
        {/* LCP — Hero poster as priority Image (preloaded in <head>) */}
        <Image
          src="/media/hero/carhero.png"
          alt=""
          role="presentation"
          fill
          priority
          fetchPriority="high"
          sizes="100vw"
          className="-z-30 object-cover"
          style={{
            opacity: videoReady ? 0 : 1,
            transition: "opacity 0.6s ease-out",
          }}
        />
        {/* Video — preload="auto" + warm play() call: starts immediately. Sits ABOVE the poster so first painted frame instantly covers it. */}
        {!prefersReducedMotion && (
          <video
            ref={videoRef}
            className="absolute inset-0 -z-30 h-full w-full object-cover"
            src="/media/hero/herovideo.webm"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            disableRemotePlayback
            aria-hidden="true"
            tabIndex={-1}
            style={{
              opacity: videoReady ? 1 : 0,
              transition: "opacity 0.25s ease-out",
            }}
          />
        )}

        {/* Readability gradient — left-dark → transparent */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-20"
          style={{
            background:
              "linear-gradient(90deg, rgba(10,10,10,0.85) 0%, rgba(10,10,10,0.7) 35%, rgba(10,10,10,0.25) 70%, rgba(10,10,10,0) 100%)",
          }}
        />

        {/* Atmospheric red mesh glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-20"
          style={{
            background:
              "radial-gradient(60% 50% at 15% 65%, rgba(230,57,70,0.10) 0%, rgba(230,57,70,0) 70%), radial-gradient(45% 40% at 85% 25%, rgba(230,57,70,0.06) 0%, rgba(230,57,70,0) 70%)",
          }}
        />

        {/* Grain/noise overlay — inline SVG, 3% opacity */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 mix-blend-overlay"
          style={{
            opacity: 0.03,
            backgroundImage:
              "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.9 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
            backgroundSize: "240px 240px",
          }}
        />

        {/* Content */}
        <motion.div
          variants={prefersReducedMotion ? undefined : containerVariants}
          initial="hidden"
          animate="visible"
          className="relative z-10 mx-auto w-full max-w-[1280px] px-6 pt-32 pb-20 md:px-10 md:pt-40 md:pb-28"
        >
          <div className="flex flex-col items-center text-center md:items-start md:text-left">
            {/* Eyebrow — desktop only */}
            <motion.span
              variants={itemVariants}
              className="mb-6 hidden items-center gap-2 rounded-full border px-4 py-2 md:inline-flex"
              style={{
                borderColor: `${SILVER}33`,
                background: "rgba(255,255,255,0.03)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                fontFamily: "var(--font-syncopate), sans-serif",
                fontSize: 10,
                letterSpacing: "4px",
                textTransform: "uppercase",
                color: SILVER,
              }}
            >
              <Sparkles size={12} strokeWidth={1.5} aria-hidden="true" style={{ color: RED }} />
              Mobile Detailing · Precision Crafted
            </motion.span>

            {/* H1 */}
            <motion.h1
              variants={itemVariants}
              className="max-w-[18ch] text-[clamp(2.5rem,7vw,6rem)] font-normal leading-[0.95]"
              style={{
                fontFamily: "var(--font-syncopate), sans-serif",
                letterSpacing: "5px",
                textTransform: "uppercase",
                background:
                  "linear-gradient(180deg, #FFFFFF 50%, #7a7a7a 30%, #474747 40%)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
                textShadow: "0 2px 24px rgba(0,0,0,0.6)",
                filter: "drop-shadow(0 1px 1px rgba(0,0,0,0.5))",
              }}
            >
              Showroom <br />
              <span
                style={{
                  background:
                    "linear-gradient(180deg, #FFFFFF 40%, #fcfcfc 60%, #474747 100%)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  color: "transparent",
                }}
              >
                Shine
              </span>
            </motion.h1>

            {/* Sub-headline */}
            <motion.p
              variants={itemVariants}
              className="mt-6 max-w-[44ch] text-base md:text-lg"
              style={{
                fontFamily: "var(--font-inter), sans-serif",
                color: "rgba(160,160,160,0.9)",
                lineHeight: 1.6,
              }}
            >
             Precision mobile detailing that delivers flawless 
results right at your doorstep. 
              
              
            </motion.p>

            {/* CTA hub */}
            <motion.div
              variants={itemVariants}
              className="mt-10 flex flex-col items-stretch gap-4 sm:flex-row sm:items-center sm:gap-6"
            >
              <Link
                href="#booking"
                aria-label="Book your detailing appointment"
                onMouseMove={(e) => {
                  const r = e.currentTarget.getBoundingClientRect();
                  e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
                  e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
                }}
                className="cta-primary group relative inline-flex items-center justify-center gap-2 overflow-hidden px-8 py-4 text-white"
                style={{
                  fontFamily: "var(--font-syncopate), sans-serif",
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: "4px",
                  textTransform: "uppercase",
                  background:
                    "linear-gradient(180deg, #FF5664 0%, #E63946 50%, #B8202D 100%)",
                  borderRadius: 32,
                  border: "1px solid rgba(230,57,70,0.85)",
                  willChange: "transform, box-shadow",
                }}
              >
                <span className="cta-content">
                  Book Your Shine
                  <ArrowRight
                    size={16}
                    strokeWidth={2}
                    aria-hidden="true"
                    className="cta-arrow"
                  />
                </span>
              </Link>

              <Link
                href="#services"
                aria-label="View detailing services"
                onMouseMove={(e) => {
                  const r = e.currentTarget.getBoundingClientRect();
                  e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
                  e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
                }}
                className="cta-secondary relative inline-flex items-center justify-center overflow-hidden px-8 py-4"
                style={{
                  fontFamily: "var(--font-syncopate), sans-serif",
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: "4px",
                  textTransform: "uppercase",
                  color: SILVER,
                  background:
                    "linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)",
                  border: "1px solid rgba(255,255,255,0.18)",
                  borderRadius: 32,
                  backdropFilter: "blur(18px) saturate(160%)",
                  WebkitBackdropFilter: "blur(18px) saturate(160%)",
                }}
              >
                <span className="cta-content">View Services</span>
              </Link>
            </motion.div>

            {/* Trust strip */}
            <motion.div
              variants={itemVariants}
              className="mt-14 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 md:justify-start"
              style={{
                fontFamily: "var(--font-inter), sans-serif",
                fontSize: 12,
                color: `${SILVER}99`,
                letterSpacing: "1px",
              }}
            >
              <span className="inline-flex items-center gap-2">
                <span
                  aria-hidden="true"
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ background: RED, boxShadow: `0 0 8px ${RED}` }}
                />
                IDA Certified
              </span>
              <span>Ceramic Pro Authorized</span>
              <span>5.0 ★ · 400+ Reviews</span>
            </motion.div>
          </div>
        </motion.div>

        {/* Bottom fade into page */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-32 -z-10"
          style={{
            background:
              "linear-gradient(180deg, rgba(10,10,10,0) 0%, #0A0A0A 100%)",
          }}
        />

        <style jsx>{`
          /* ========== PRIMARY CTA — Book Your Shine ========== */
          .cta-primary {
            position: relative;
            isolation: isolate;
            animation: ctaGlow 3s ease-in-out infinite;
            transition:
              transform 0.4s cubic-bezier(0.4, 0, 0.2, 1),
              filter 0.4s ease;
            --mx: 50%;
            --my: 50%;
          }
          /* Light sweep — left → right, infinite */
          .cta-primary::before {
            content: "";
            position: absolute;
            inset: 0;
            border-radius: inherit;
            background: linear-gradient(
              115deg,
              transparent 30%,
              rgba(255, 255, 255, 0.28) 50%,
              transparent 70%
            );
            transform: translateX(-100%);
            animation: ctaSweep 4s ease-in-out infinite;
            pointer-events: none;
            z-index: 1;
          }
          /* Mouse-follow radial spotlight */
          .cta-primary::after {
            content: "";
            position: absolute;
            inset: 0;
            border-radius: inherit;
            background: radial-gradient(
              140px circle at var(--mx) var(--my),
              rgba(255, 255, 255, 0.22),
              transparent 60%
            );
            opacity: 0;
            transition: opacity 0.3s ease;
            pointer-events: none;
            z-index: 1;
          }
          .cta-primary:hover::after {
            opacity: 1;
          }
          .cta-content {
            position: relative;
            display: inline-flex;
            align-items: center;
            gap: 8px;
            z-index: 2;
          }
          .cta-primary:hover,
          .cta-primary:focus-visible {
            transform: translateY(-2px) scale(1.02);
            filter: brightness(1.08);
            outline: none;
          }
          .cta-primary:active {
            animation: none;
            box-shadow:
              0 0 0 4px rgba(230, 57, 70, 0.18),
              0 0 36px rgba(230, 57, 70, 0.85),
              0 0 72px rgba(230, 57, 70, 0.55);
            transform: translateY(0) scale(0.98);
            filter: brightness(1.1);
          }
          @keyframes ctaGlow {
            0%, 100% {
              box-shadow:
                0 0 14px rgba(230, 57, 70, 0.3),
                0 0 30px rgba(230, 57, 70, 0.15);
            }
            50% {
              box-shadow:
                0 0 22px rgba(230, 57, 70, 0.5),
                0 0 50px rgba(230, 57, 70, 0.28);
            }
          }
          @keyframes ctaSweep {
            0%, 8% {
              transform: translateX(-100%);
            }
            55%, 100% {
              transform: translateX(100%);
            }
          }

          .cta-arrow {
            transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          }
          .cta-primary:hover .cta-arrow,
          .cta-primary:focus-visible .cta-arrow {
            transform: translateX(5px);
          }

          /* ========== SECONDARY CTA — View Services ========== */
          .cta-secondary {
            position: relative;
            isolation: isolate;
            transition:
              border-color 0.4s cubic-bezier(0.22, 1, 0.36, 1),
              background 0.4s ease,
              box-shadow 0.5s cubic-bezier(0.22, 1, 0.36, 1),
              transform 0.4s cubic-bezier(0.4, 0, 0.2, 1),
              color 0.3s ease,
              backdrop-filter 0.4s ease;
            --mx: 50%;
            --my: 50%;
          }
          /* Subtle red sweep — runs slightly slower, dimmer than primary */
          .cta-secondary::before {
            content: "";
            position: absolute;
            inset: 0;
            border-radius: inherit;
            background: linear-gradient(
              115deg,
              transparent 35%,
              rgba(230, 57, 70, 0.22) 50%,
              transparent 65%
            );
            transform: translateX(-100%);
            animation: ctaSweep 5s ease-in-out infinite;
            animation-delay: 1.5s;
            pointer-events: none;
            z-index: 1;
          }
          /* Mouse-follow red radial spotlight */
          .cta-secondary::after {
            content: "";
            position: absolute;
            inset: 0;
            border-radius: inherit;
            background: radial-gradient(
              160px circle at var(--mx) var(--my),
              rgba(230, 57, 70, 0.32),
              transparent 65%
            );
            opacity: 0;
            transition: opacity 0.3s ease;
            pointer-events: none;
            z-index: 1;
          }
          .cta-secondary:hover::after {
            opacity: 1;
          }
          .cta-secondary:hover,
          .cta-secondary:focus-visible {
            border-color: rgba(230, 57, 70, 0.55);
            background: linear-gradient(
              180deg,
              rgba(255, 255, 255, 0.1) 0%,
              rgba(255, 255, 255, 0.04) 100%
            );
            backdrop-filter: blur(22px) saturate(180%);
            -webkit-backdrop-filter: blur(22px) saturate(180%);
            color: #fff;
            transform: translateY(-2px) scale(1.02);
            outline: none;
          }
          .cta-secondary:active {
            border-color: ${RED};
            color: #fff;
            box-shadow:
              0 0 0 1px ${RED} inset,
              0 0 0 4px rgba(230, 57, 70, 0.18),
              0 0 28px rgba(230, 57, 70, 0.7),
              0 0 56px rgba(230, 57, 70, 0.35);
            transform: translateY(0) scale(0.98);
          }

          @media (prefers-reduced-motion: reduce) {
            .cta-primary,
            .cta-secondary,
            .cta-arrow,
            .cta-primary::before,
            .cta-primary::after,
            .cta-secondary::before,
            .cta-secondary::after {
              animation: none !important;
              transition: none !important;
              transform: none !important;
            }
          }
        `}</style>
      </section>
    </>
  );
}
