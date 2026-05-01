"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import {
  motion,
  LazyMotion,
  domAnimation,
  AnimatePresence,
  useReducedMotion,
} from "framer-motion";
import { Search, Check, AlertCircle, MapPin } from "lucide-react";

const SILVER = "#C0C0C0";
const RED = "#E63946";
const RADIUS_MILES = 20;

type Status = "idle" | "in" | "out";

/** Mock address registry for the eligibility checker. Stand-in for the
 *  geocoded distance calculation that lived in the previous Maps integration. */
const ADDRESS_DB: { match: string; miles: number }[] = [
  { match: "brickell", miles: 0.4 },
  { match: "miami beach", miles: 5.2 },
  { match: "coral gables", miles: 4.8 },
  { match: "sunny isles", miles: 14.6 },
  { match: "key biscayne", miles: 7.1 },
  { match: "doral", miles: 9.3 },
  { match: "aventura", miles: 16.4 },
  { match: "pinecrest", miles: 11.4 },
  { match: "cutler bay", miles: 18.7 },
  { match: "fort lauderdale", miles: 27.8 },
  { match: "boca raton", miles: 44.3 },
  { match: "palm beach", miles: 65.2 },
];

export default function ServiceArea() {
  const reduced = useReducedMotion();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [distanceMi, setDistanceMi] = useState(0);
  const [resolvedAddress, setResolvedAddress] = useState("");

  const checkEligibility = useMemo(
    () => (q: string) => {
      const trimmed = q.trim();
      if (!trimmed) return;
      const ql = trimmed.toLowerCase();
      const hit = ADDRESS_DB.find((a) => ql.includes(a.match));
      // Default unmatched addresses to "out of zone" with a 25mi placeholder.
      const miles = hit?.miles ?? 25;
      setDistanceMi(miles);
      setResolvedAddress(trimmed);
      setStatus(miles <= RADIUS_MILES ? "in" : "out");
    },
    [],
  );

  return (
    <LazyMotion features={domAnimation}>
      <section
        id="service-area"
        aria-labelledby="service-area-heading"
        className="relative overflow-hidden py-24 md:py-32"
        style={{ background: "#0A0A0A" }}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(60% 50% at 50% 30%, rgba(230,57,70,0.07) 0%, rgba(230,57,70,0) 70%)",
          }}
        />

        <div className="relative mx-auto w-full max-w-[1280px] px-6 md:px-10">
          <header className="mb-12 grid gap-8 md:mb-16 md:grid-cols-[1fr_auto] md:items-end">
            <div>
              <p
                style={{
                  fontFamily: "var(--font-syncopate), sans-serif",
                  fontSize: 11,
                  letterSpacing: "4px",
                  textTransform: "uppercase",
                  color: RED,
                  marginBottom: 12,
                }}
              >
                Precision Coverage
              </p>
              <h2
                id="service-area-heading"
                className="text-[clamp(1.75rem,4.5vw,3.25rem)] leading-[1.05]"
                style={{
                  fontFamily: "var(--font-syncopate), sans-serif",
                  fontWeight: 700,
                  letterSpacing: "5px",
                  textTransform: "uppercase",
                  background:
                    "linear-gradient(180deg,#FFFFFF 0%,#C0C0C0 50%,#8A8A8A 100%)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  color: "transparent",
                }}
              >
                Where We Bring the Shine
              </h2>
              <p
                className="mt-5 max-w-[52ch] text-base md:text-lg"
                style={{
                  fontFamily: "var(--font-inter), sans-serif",
                  color: "rgba(160,160,160,0.9)",
                  fontWeight: 300,
                  lineHeight: 1.6,
                }}
              >
                Fully mobile, fully equipped. Drop your driveway address into
                the eligibility checker — instant confirmation if you&rsquo;re
                inside our 20-mile concierge radius.
              </p>
            </div>
            <ul
              className="flex flex-wrap items-center gap-x-6 gap-y-2"
              style={{
                fontFamily: "var(--font-inter), sans-serif",
                fontSize: 12,
                color: "rgba(192,192,192,0.7)",
              }}
            >
              <li className="inline-flex items-center gap-2">
                <span
                  aria-hidden="true"
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ background: RED, boxShadow: `0 0 8px ${RED}` }}
                />
                Active Hub: Miami
              </li>
              <li>20-mile radius</li>
              <li>7 days/wk</li>
            </ul>
          </header>

          <motion.div
            initial={reduced ? false : { opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full"
            style={{
              borderRadius: 32,
              border: `1px solid ${SILVER}26`,
              background: "rgba(255,255,255,0.02)",
              backdropFilter: "blur(30px)",
              WebkitBackdropFilter: "blur(30px)",
              boxShadow: "0 24px 64px rgba(0,0,0,0.55)",
              overflow: "hidden",
              aspectRatio: "16 / 10",
              minHeight: 420,
            }}
          >
            {/* Static map image */}
            <Image
              src="/media/service-area/location.webp"
              alt="Fluid Precision service area — 20-mile radius around Brickell, Miami"
              fill
              priority={false}
              sizes="(max-width: 768px) 100vw, 1280px"
              className="object-cover"
              style={{ filter: "saturate(0.85) brightness(0.95)" }}
            />

            {/* Vignette + brand glow overlays for visual cohesion */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "radial-gradient(ellipse 60% 55% at 50% 50%, rgba(10,10,10,0) 0%, rgba(10,10,10,0.55) 100%)",
              }}
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "radial-gradient(40% 40% at 50% 50%, rgba(230,57,70,0.10) 0%, rgba(230,57,70,0) 65%)",
                mixBlendMode: "screen",
              }}
            />

            {/* Search widget — top-left */}
            <div
              className="absolute left-4 right-4 top-4 md:left-6 md:right-auto md:top-6 md:max-w-md"
              style={{ zIndex: 5 }}
            >
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  checkEligibility(query);
                }}
                className="p-4 md:p-5"
                style={{
                  borderRadius: 24,
                  background: "rgba(10,10,10,0.78)",
                  border: `1px solid ${SILVER}33`,
                  backdropFilter: "blur(20px)",
                  WebkitBackdropFilter: "blur(20px)",
                  boxShadow: "0 16px 48px rgba(0,0,0,0.6)",
                }}
              >
                <label
                  htmlFor="sa-search"
                  className="mb-2 block"
                  style={{
                    fontFamily: "var(--font-syncopate)",
                    fontSize: 10,
                    letterSpacing: "3px",
                    textTransform: "uppercase",
                    color: "rgba(192,192,192,0.7)",
                  }}
                >
                  Eligibility Checker
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Search
                      size={16}
                      aria-hidden="true"
                      style={{
                        position: "absolute",
                        left: 16,
                        top: "50%",
                        transform: "translateY(-50%)",
                        color: RED,
                      }}
                    />
                    <input
                      id="sa-search"
                      type="text"
                      placeholder="Check your driveway eligibility..."
                      autoComplete="off"
                      value={query}
                      onChange={(e) => {
                        setQuery(e.target.value);
                        if (status !== "idle") setStatus("idle");
                      }}
                      style={{
                        width: "100%",
                        padding: "14px 16px 14px 44px",
                        background: "rgba(255,255,255,0.04)",
                        border: `1px solid ${SILVER}33`,
                        borderRadius: 16,
                        color: SILVER,
                        fontFamily: "var(--font-inter), sans-serif",
                        fontSize: 14,
                        outline: "none",
                      }}
                    />
                  </div>
                  <button
                    type="submit"
                    aria-label="Check eligibility"
                    style={{
                      padding: "0 18px",
                      borderRadius: 16,
                      background: RED,
                      color: "#fff",
                      fontFamily: "var(--font-syncopate)",
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: "2px",
                      textTransform: "uppercase",
                      border: 0,
                      cursor: "pointer",
                      transition: "box-shadow 0.3s",
                    }}
                  >
                    Check
                  </button>
                </div>

                <AnimatePresence mode="wait">
                  {status === "in" && (
                    <motion.div
                      key="in"
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.3 }}
                      className="mt-3 flex items-start gap-2 px-3 py-2"
                      style={{
                        borderRadius: 14,
                        background: "rgba(34,197,94,0.08)",
                        border: "1px solid rgba(34,197,94,0.4)",
                      }}
                      role="status"
                    >
                      <span
                        className="mt-0.5 inline-flex h-5 w-5 items-center justify-center"
                        style={{
                          borderRadius: 999,
                          background: "#22c55e",
                          boxShadow: "0 0 14px rgba(34,197,94,0.7)",
                        }}
                        aria-hidden="true"
                      >
                        <Check size={12} strokeWidth={3} color="#fff" />
                      </span>
                      <div>
                        <p
                          style={{
                            fontFamily: "var(--font-syncopate)",
                            fontSize: 11,
                            fontWeight: 700,
                            letterSpacing: "2px",
                            color: "#22c55e",
                            textTransform: "uppercase",
                          }}
                        >
                          You&rsquo;re in the Zone
                        </p>
                        <p
                          style={{
                            fontFamily: "var(--font-inter)",
                            fontSize: 12,
                            color: "rgba(192,192,192,0.85)",
                            marginTop: 2,
                          }}
                        >
                          We&rsquo;ll bring the shine to you · {distanceMi.toFixed(1)} mi from hub
                        </p>
                      </div>
                    </motion.div>
                  )}
                  {status === "out" && (
                    <motion.div
                      key="out"
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.3 }}
                      className="mt-3 flex items-start gap-2 px-3 py-2"
                      style={{
                        borderRadius: 14,
                        background: "rgba(192,192,192,0.05)",
                        border: `1px solid ${SILVER}40`,
                      }}
                      role="status"
                    >
                      <AlertCircle
                        size={16}
                        style={{ color: SILVER, marginTop: 2 }}
                        aria-hidden="true"
                      />
                      <div>
                        <p
                          style={{
                            fontFamily: "var(--font-syncopate)",
                            fontSize: 11,
                            fontWeight: 700,
                            letterSpacing: "2px",
                            color: SILVER,
                            textTransform: "uppercase",
                          }}
                        >
                          Just Outside · {distanceMi.toFixed(1)} mi
                        </p>
                        <p
                          style={{
                            fontFamily: "var(--font-inter)",
                            fontSize: 12,
                            color: "rgba(192,192,192,0.7)",
                            marginTop: 2,
                          }}
                        >
                          You&rsquo;re a bit far, but we might still make it.{" "}
                          <a
                            href="#booking"
                            style={{
                              color: RED,
                              textDecoration: "underline",
                              textUnderlineOffset: 2,
                            }}
                          >
                            Contact for a custom quote
                          </a>
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {status !== "idle" && resolvedAddress && (
                  <p
                    className="mt-2 truncate"
                    style={{
                      fontFamily: "var(--font-inter)",
                      fontSize: 11,
                      color: "rgba(192,192,192,0.5)",
                    }}
                  >
                    <MapPin
                      size={10}
                      aria-hidden="true"
                      style={{
                        display: "inline",
                        marginRight: 4,
                        color: RED,
                      }}
                    />
                    {resolvedAddress}
                  </p>
                )}
              </form>
            </div>

          </motion.div>

          <p
            className="mx-auto mt-6 max-w-[60ch] text-center"
            style={{
              fontFamily: "var(--font-inter)",
              fontSize: 12,
              color: "rgba(160,160,160,0.7)",
            }}
          >
            Outside the radius? We accept select bookings up to 35 miles for an
            additional travel fee. Just reach out.
          </p>
        </div>
      </section>
    </LazyMotion>
  );
}
