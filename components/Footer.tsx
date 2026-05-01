"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Instagram, Facebook, ArrowUp, Mail, MapPin } from "lucide-react";

const SILVER = "#C0C0C0";
const RED = "#E63946";

const NAV_LINKS = [
  { label: "Home", href: "#home" },
  { label: "Services", href: "#services" },
  { label: "Booking", href: "#booking" },
  { label: "About the Specialist", href: "#about" },
  { label: "Service Map", href: "#service-area" },
  { label: "FAQ", href: "#faq" },
];

const COVERAGE = ["Brickell", "Coral Gables", "Sunny Isles", "Key Biscayne", "Aventura", "Pinecrest"];

function Logo() {
  return (
    <span
      style={{
        fontFamily: "var(--font-syncopate), sans-serif",
        fontSize: 22,
        fontWeight: 700,
        letterSpacing: "6px",
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

function ColumnHeader({ children }: { children: React.ReactNode }) {
  return (
    <h3
      style={{
        fontFamily: "var(--font-syncopate), sans-serif",
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: "4px",
        textTransform: "uppercase",
        color: SILVER,
        marginBottom: 24,
      }}
    >
      {children}
    </h3>
  );
}

export default function Footer() {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 600);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <>
      <footer
        aria-labelledby="footer-heading"
        className="relative mt-24 overflow-hidden"
        style={{
          borderTopLeftRadius: 32,
          borderTopRightRadius: 32,
          borderTop: `1px solid ${SILVER}40`,
          background: "rgba(18,18,18,0.85)",
          backdropFilter: "blur(30px)",
          WebkitBackdropFilter: "blur(30px)",
          boxShadow: "0 -16px 64px rgba(0,0,0,0.5)",
        }}
      >
        <h2 id="footer-heading" className="sr-only">
          Fluid Precision Footer
        </h2>

        <div className="mx-auto w-full max-w-[1280px] px-6 py-16 md:px-10 md:py-20">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4 lg:gap-10">
            {/* Col 1 — Brand */}
            <div>
              <Logo />
              <p
                className="mt-5"
                style={{
                  fontFamily: "var(--font-syncopate), sans-serif",
                  fontSize: 11,
                  letterSpacing: "3px",
                  textTransform: "uppercase",
                  color: SILVER,
                  lineHeight: 1.6,
                }}
              >
                Engineering Brilliance.
                <br />
                Surgical Precision.
              </p>
              <p
                className="mt-5 max-w-[36ch]"
                style={{
                  fontFamily: "var(--font-inter), sans-serif",
                  fontWeight: 300,
                  fontSize: 13,
                  lineHeight: 1.65,
                  color: "rgba(192,192,192,0.65)",
                }}
              >
                A 100% self-powered mobile elite service for owners who refuse
                to compromise on aesthetic integrity.
              </p>
            </div>

            {/* Col 2 — Navigation */}
            <nav aria-label="Footer navigation">
              <ColumnHeader>Navigation</ColumnHeader>
              <ul className="flex flex-col gap-3">
                {NAV_LINKS.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="ft-link"
                      style={{
                        fontFamily: "var(--font-inter), sans-serif",
                        fontWeight: 300,
                        fontSize: 14,
                        color: "rgba(192,192,192,0.8)",
                        transition: "color 0.3s ease",
                      }}
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Col 3 — Coverage */}
            <div>
              <ColumnHeader>Service Radius · Miami</ColumnHeader>
              <p
                className="mb-4 inline-flex items-center gap-2 px-3 py-1.5"
                style={{
                  borderRadius: 32,
                  background: `${RED}14`,
                  border: `1px solid ${RED}40`,
                  fontFamily: "var(--font-inter), sans-serif",
                  fontSize: 11,
                  letterSpacing: "1px",
                  color: SILVER,
                }}
              >
                <span
                  aria-hidden="true"
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ background: RED, boxShadow: `0 0 8px ${RED}` }}
                />
                Now accepting bookings
              </p>
              <ul className="grid grid-cols-2 gap-x-4 gap-y-2">
                {COVERAGE.map((c) => (
                  <li
                    key={c}
                    className="inline-flex items-center gap-1.5"
                    style={{
                      fontFamily: "var(--font-inter), sans-serif",
                      fontWeight: 300,
                      fontSize: 13,
                      color: "rgba(192,192,192,0.7)",
                    }}
                  >
                    <MapPin size={10} aria-hidden="true" style={{ color: RED }} />
                    {c}
                  </li>
                ))}
              </ul>
              <p
                className="mt-4"
                style={{
                  fontFamily: "var(--font-inter), sans-serif",
                  fontWeight: 300,
                  fontSize: 12,
                  color: "rgba(192,192,192,0.55)",
                  fontStyle: "italic",
                }}
              >
                Exotic & luxury assets prioritized.
              </p>
            </div>

            {/* Col 4 — Contact */}
            <div>
              <ColumnHeader>Specialist Contact</ColumnHeader>
              <a
                href="mailto:precision@fluid.com"
                className="ft-link inline-flex items-center gap-2"
                style={{
                  fontFamily: "var(--font-inter), sans-serif",
                  fontSize: 14,
                  color: SILVER,
                  transition: "color 0.3s",
                }}
              >
                <Mail size={14} strokeWidth={1.75} aria-hidden="true" />
                precision@fluid.com
              </a>

              <p
                className="mt-5"
                style={{
                  fontFamily: "var(--font-syncopate), sans-serif",
                  fontSize: 9,
                  letterSpacing: "3px",
                  textTransform: "uppercase",
                  color: "rgba(192,192,192,0.5)",
                }}
              >
                Hours
              </p>
              <p
                className="mt-2"
                style={{
                  fontFamily: "var(--font-inter), sans-serif",
                  fontWeight: 300,
                  fontSize: 13,
                  color: "rgba(192,192,192,0.7)",
                  lineHeight: 1.6,
                }}
              >
                Mon – Sat · 8:00 AM – 6:00 PM
                <br />
                Sundays by appointment
              </p>

              <div className="mt-6 flex items-center gap-3">
                {[
                  { Icon: Instagram, href: "https://instagram.com", label: "Instagram" },
                  { Icon: Facebook, href: "https://facebook.com", label: "Facebook" },
                ].map(({ Icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${label} (opens in new tab)`}
                    className="ft-social inline-flex items-center justify-center"
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 999,
                      background: "rgba(255,255,255,0.04)",
                      border: `1px solid ${SILVER}33`,
                      color: SILVER,
                      transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)",
                    }}
                  >
                    <Icon size={18} strokeWidth={1.75} aria-hidden="true" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Sub-footer */}
        <div
          style={{
            borderTop: `1px solid ${SILVER}1a`,
            background: "rgba(0,0,0,0.25)",
          }}
        >
          <div className="mx-auto flex w-full max-w-[1280px] flex-col items-start justify-between gap-3 px-6 py-5 md:flex-row md:items-center md:px-10">
            <p
              style={{
                fontFamily: "var(--font-syncopate), sans-serif",
                fontSize: 9,
                letterSpacing: "3px",
                textTransform: "uppercase",
                color: "rgba(192,192,192,0.55)",
              }}
            >
              © 2026 Fluid Precision · Surgical Care for Automotive Assets
            </p>
            <div className="flex items-center gap-4">
              <Link
                href="/privacy"
                className="ft-link"
                style={{
                  fontFamily: "var(--font-inter), sans-serif",
                  fontWeight: 300,
                  fontSize: 12,
                  color: "rgba(192,192,192,0.55)",
                }}
              >
                Privacy Policy
              </Link>
              <span aria-hidden="true" style={{ color: `${SILVER}33` }}>
                |
              </span>
              <Link
                href="/terms"
                className="ft-link"
                style={{
                  fontFamily: "var(--font-inter), sans-serif",
                  fontWeight: 300,
                  fontSize: 12,
                  color: "rgba(192,192,192,0.55)",
                }}
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>

        {/* Back to top */}
        <AnimatePresence>
          {showTop && (
            <motion.button
              type="button"
              onClick={scrollTop}
              aria-label="Scroll back to top"
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 10 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="ft-top fixed bottom-6 right-6 z-[200] inline-flex h-12 w-12 items-center justify-center md:bottom-8 md:right-8"
              style={{
                borderRadius: "50%",
                background: RED,
                color: SILVER,
                boxShadow: `0 0 0 6px ${RED}1a, 0 0 24px ${RED}80, 0 8px 20px rgba(0,0,0,0.5)`,
                border: `1px solid ${RED}`,
              }}
            >
              <ArrowUp size={18} strokeWidth={2} aria-hidden="true" />
            </motion.button>
          )}
        </AnimatePresence>

        <style jsx>{`
          .sr-only {
            position: absolute;
            width: 1px;
            height: 1px;
            padding: 0;
            margin: -1px;
            overflow: hidden;
            clip: rect(0, 0, 0, 0);
            white-space: nowrap;
            border: 0;
          }
          .ft-link:hover,
          .ft-link:focus-visible {
            color: ${RED} !important;
            outline: none;
          }
          .ft-social:hover,
          .ft-social:focus-visible {
            color: ${RED};
            border-color: ${RED};
            background: ${RED}14;
            box-shadow: 0 0 16px ${RED}55;
            outline: none;
          }
          .ft-top:hover,
          .ft-top:focus-visible {
            transform: translateY(-2px) scale(1.05);
            box-shadow: 0 0 0 8px ${RED}26, 0 0 32px ${RED}aa, 0 8px 24px rgba(0,0,0,0.6);
            outline: none;
          }
          @media (prefers-reduced-motion: reduce) {
            .ft-top { transition: none !important; }
          }
        `}</style>
      </footer>
    </>
  );
}
