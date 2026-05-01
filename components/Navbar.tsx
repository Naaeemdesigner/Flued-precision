"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { Phone } from "lucide-react";

type NavLink = { label: string; href: string };

const NAV_LINKS: NavLink[] = [
  { label: "Services", href: "#services" },
  { label: "Portfolio", href: "#portfolio" },
  { label: "Service Area", href: "#service-area" },
  { label: "About", href: "#about" },
];

const PHONE_HREF = "tel:+10000000000";

const SILVER = "#C0C0C0";
const RED = "#E63946";
const BLACK = "#0A0A0A";

function Logo({ className = "" }: { className?: string }) {
  return (
    <span
      className={className}
      style={{
        fontFamily: "var(--font-syncopate), sans-serif",
        fontSize: 18,
        fontWeight: 700,
        letterSpacing: "5px",
        textTransform: "uppercase",
        color: SILVER,
        lineHeight: 1,
        userSelect: "none",
      }}
    >
      FLUED
    </span>
  );
}

function HamburgerIcon({ open }: { open: boolean }) {
  const top = {
    closed: { rotate: 0, y: -4 },
    open: { rotate: 45, y: 0 },
  };
  const bottom = {
    closed: { rotate: 0, y: 4 },
    open: { rotate: -45, y: 0 },
  };
  return (
    <motion.svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      initial={false}
      animate={open ? "open" : "closed"}
      aria-hidden="true"
      focusable="false"
    >
      <motion.line
        x1="4"
        x2="20"
        y1="12"
        y2="12"
        stroke={SILVER}
        strokeWidth="1.5"
        strokeLinecap="round"
        variants={top}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        style={{ originX: "12px", originY: "12px" }}
      />
      <motion.line
        x1="4"
        x2="20"
        y1="12"
        y2="12"
        stroke={SILVER}
        strokeWidth="1.5"
        strokeLinecap="round"
        variants={bottom}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        style={{ originX: "12px", originY: "12px" }}
      />
    </motion.svg>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeId, setActiveId] = useState<string>("home");
  const { scrollY } = useScroll();

  // Scroll-spy: highlight nav link for section currently in view
  useEffect(() => {
    const ids = NAV_LINKS.map((l) => l.href.replace("#", "")).filter(Boolean);
    const targets = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => !!el);
    if (!targets.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActiveId(visible.target.id);
      },
      { rootMargin: "-30% 0px -55% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] },
    );
    targets.forEach((t) => observer.observe(t));
    return () => observer.disconnect();
  }, []);

  useMotionValueEvent(scrollY, "change", (y) => {
    setScrolled(y > 24);
  });

  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = original;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <motion.nav
        aria-label="Primary"
        initial={false}
        animate={{ height: scrolled ? 60 : 72 }}
        transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
        className="fixed left-1/2 -translate-x-1/2 top-5 w-[min(1200px,calc(100%-32px))]"
        style={{
          zIndex: 9999,
          borderRadius: 32,
          background:
            "linear-gradient(180deg, rgba(20,20,20,0.42) 0%, rgba(10,10,10,0.32) 100%)",
          backdropFilter: "blur(22px) saturate(180%)",
          WebkitBackdropFilter: "blur(22px) saturate(180%)",
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow:
            "0 1px 0 rgba(255,255,255,0.06) inset, 0 -1px 0 rgba(0,0,0,0.3) inset, 0 12px 40px rgba(0,0,0,0.35), 0 2px 8px rgba(0,0,0,0.25)",
        }}
      >
        <div className="flex h-full items-center justify-between px-5 md:px-7">
          {/* Zone A — Logo */}
          <Link
            href="#home"
            aria-label="Fluid Precision — Home"
            className="flex items-center"
          >
            <Logo className="h-5 w-auto md:h-6" />
          </Link>

          {/* Zone B — Desktop links */}
          <ul
            className="hidden md:flex items-center gap-9"
            role="menubar"
          >
            {NAV_LINKS.map((l) => {
              const active = l.href === `#${activeId}`;
              return (
                <li key={l.href} role="none">
                  <Link
                    href={l.href}
                    role="menuitem"
                    aria-current={active ? "page" : undefined}
                    className="nav-link relative inline-flex items-center"
                    style={{
                      fontFamily: "var(--font-syncopate), sans-serif",
                      fontSize: 12,
                      letterSpacing: "4px",
                      textTransform: "uppercase",
                      color: active ? RED : SILVER,
                      minHeight: 44,
                      padding: "0 4px",
                    }}
                  >
                    {l.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Zone C — Desktop CTA */}
          <div className="hidden md:flex items-center">
            <Link
              href={PHONE_HREF}
              aria-label="Call Fluid Precision now"
              onMouseMove={(e) => {
                const r = e.currentTarget.getBoundingClientRect();
                e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
                e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
              }}
              className="cta-pill relative inline-flex items-center overflow-hidden px-5 py-2.5 text-white"
              style={{
                fontFamily: "var(--font-syncopate), sans-serif",
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: "4px",
                textTransform: "uppercase",
                background:
                  "linear-gradient(180deg, #FF5664 0%, #E63946 50%, #B8202D 100%)",
                border: "1px solid rgba(230,57,70,0.85)",
                borderRadius: 999,
              }}
            >
              <span className="cta-pill-content inline-flex items-center gap-2">
                <Phone size={14} strokeWidth={2} aria-hidden="true" />
                Call Now
              </span>
            </Link>
          </div>

          {/* Mobile trigger — 44×44 thumb-zone */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            className="md:hidden flex h-11 w-11 items-center justify-center rounded-full"
            style={{ color: SILVER, minHeight: 44, minWidth: 44 }}
          >
            <HamburgerIcon open={open} />
          </button>
        </div>
      </motion.nav>

      {/* Mobile overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            className="fixed inset-0 md:hidden flex flex-col"
            style={{
              zIndex: 9998,
              background: "rgba(10, 10, 10, 0.98)",
              backdropFilter: "blur(45px)",
              WebkitBackdropFilter: "blur(45px)",
            }}
          >
            <div className="flex-1 flex flex-col justify-center px-8 pt-24 pb-8">
              <ul className="flex flex-col gap-6" role="menu">
                {NAV_LINKS.map((l, i) => (
                  <motion.li
                    key={l.href}
                    role="none"
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 12 }}
                    transition={{
                      duration: 0.4,
                      delay: 0.1 + i * 0.05,
                      ease: [0.4, 0, 0.2, 1],
                    }}
                  >
                    <Link
                      href={l.href}
                      role="menuitem"
                      onClick={() => setOpen(false)}
                      style={{
                        fontFamily: "var(--font-syncopate), sans-serif",
                        fontSize: 24,
                        letterSpacing: "4px",
                        textTransform: "uppercase",
                        color: SILVER,
                      }}
                    >
                      {l.label}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </div>

            <motion.div
              className="px-6 pb-10"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              transition={{
                duration: 0.4,
                delay: 0.1 + NAV_LINKS.length * 0.05,
                ease: [0.4, 0, 0.2, 1],
              }}
            >
              <Link
                href={PHONE_HREF}
                onClick={() => setOpen(false)}
                aria-label="Call Fluid Precision now"
                className="flex items-center justify-center gap-2 w-full py-4 text-white"
                style={{
                  fontFamily: "var(--font-syncopate), sans-serif",
                  fontSize: 14,
                  letterSpacing: "4px",
                  textTransform: "uppercase",
                  background: RED,
                  borderRadius: 32,
                  boxShadow: `0 0 32px ${RED}66`,
                }}
              >
                <Phone size={16} strokeWidth={2} aria-hidden="true" />
                Call Now
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .nav-link {
          transition: color 0.25s ease;
        }
        .nav-link::after {
          content: "";
          position: absolute;
          left: 0;
          right: 0;
          bottom: -6px;
          height: 1px;
          background: ${RED};
          transform: scaleX(0);
          transform-origin: center;
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .nav-link:hover,
        .nav-link:focus-visible {
          color: ${RED};
          outline: none;
        }
        .nav-link:hover::after,
        .nav-link:focus-visible::after {
          transform: scaleX(1);
        }
        /* Continuous subtle red glow — premium ambient pulse */
        .cta-pill {
          animation: pillGlow 3s ease-in-out infinite;
          transition:
            transform 0.3s cubic-bezier(0.4, 0, 0.2, 1),
            filter 0.3s ease,
            box-shadow 0.5s cubic-bezier(0.22, 1, 0.36, 1);
          --mx: 50%;
          --my: 50%;
        }
        /* Light sweep — same rhythm as primary CTA */
        .cta-pill::before {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: inherit;
          background: linear-gradient(
            115deg,
            transparent 30%,
            rgba(255, 255, 255, 0.32) 50%,
            transparent 70%
          );
          transform: translateX(-100%);
          animation: ctaSweep 4s ease-in-out infinite;
          animation-delay: 0.6s;
          pointer-events: none;
          z-index: 1;
        }
        /* Mouse-follow radial spotlight */
        .cta-pill::after {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: inherit;
          background: radial-gradient(
            100px circle at var(--mx) var(--my),
            rgba(255, 255, 255, 0.22),
            transparent 60%
          );
          opacity: 0;
          transition: opacity 0.3s ease;
          pointer-events: none;
          z-index: 1;
        }
        .cta-pill:hover::after {
          opacity: 1;
        }
        .cta-pill-content {
          position: relative;
          z-index: 2;
        }
        .cta-pill:hover,
        .cta-pill:focus-visible {
          transform: translateY(-2px) scale(1.03);
          filter: brightness(1.08);
          outline: none;
        }
        .cta-pill:active {
          animation: none;
          box-shadow:
            0 0 0 4px rgba(230, 57, 70, 0.18),
            0 0 26px rgba(230, 57, 70, 0.85),
            0 0 52px rgba(230, 57, 70, 0.5);
          transform: translateY(0) scale(0.98);
          filter: brightness(1.1);
        }
        @keyframes pillGlow {
          0%, 100% {
            box-shadow:
              0 0 12px rgba(230, 57, 70, 0.3),
              0 0 26px rgba(230, 57, 70, 0.15);
          }
          50% {
            box-shadow:
              0 0 20px rgba(230, 57, 70, 0.5),
              0 0 44px rgba(230, 57, 70, 0.28);
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
        @media (prefers-reduced-motion: reduce) {
          .nav-link::after,
          .cta-pill,
          .cta-pill::before,
          .cta-pill::after {
            transition: none !important;
            animation: none !important;
          }
        }
        :global(body.nav-open) {
          overflow: hidden;
        }
      `}</style>
    </>
  );
}
