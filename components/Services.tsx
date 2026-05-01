"use client";

import { motion, LazyMotion, domAnimation, useReducedMotion } from "framer-motion";
import { Check, Clock, Sparkles } from "lucide-react";
import { useBooking } from "./BookingContext";

const SILVER = "#C0C0C0";
const RED = "#E63946";

type Pkg = {
  id: "silver" | "gold" | "platinum";
  name: string;
  tagline: string;
  price: string;
  duration: string;
  features: string[];
  cta: "glass" | "solid" | "outline";
  popular?: boolean;
};

const PACKAGES: Pkg[] = [
  {
    id: "silver",
    name: "Silver",
    tagline: "Essential Refresh",
    price: "$149+",
    duration: "1.5 – 2 Hours",
    features: [
      "pH-Neutral Hand Wash & Dry",
      "Wheels & Tire Dressing",
      "Interior Vacuum & Dusting",
      "Streak-Free Glass Cleaning",
      "Spray Wax for Instant Shine",
    ],
    cta: "glass",
  },
  {
    id: "gold",
    name: "Gold",
    tagline: "The Signature Detail",
    price: "$299+",
    duration: "3 – 4.5 Hours",
    features: [
      "Everything in Silver",
      "Clay Bar Paint Decontamination",
      "6-Month Ceramic Sealant",
      "Interior Steam Cleaning",
      "Leather Conditioning",
    ],
    cta: "solid",
    popular: true,
  },
  {
    id: "platinum",
    name: "Platinum",
    tagline: "Ultimate Protection",
    price: "$599+",
    duration: "6 – 8 Hours · Full Day",
    features: [
      "Everything in Gold",
      "Paint Enhancement (Swirl Removal)",
      "Entry-Level Ceramic Coating",
      "Deep Carpet Shampooing",
      "Engine Bay Detail & Protect",
    ],
    cta: "outline",
  },
];

const headerVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

const cardListVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

const checkVariants = {
  hidden: { opacity: 0, scale: 0.4 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    transition: {
      delay: 0.4 + i * 0.08,
      duration: 0.4,
      ease: [0.34, 1.56, 0.64, 1],
    },
  }),
};

function PackageCard({ pkg, index }: { pkg: Pkg; index: number }) {
  const priceColor = pkg.popular ? RED : SILVER;
  const { selectPackage } = useBooking();
  return (
    <motion.article
      variants={cardVariants}
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 260, damping: 24 }}
      className={`pkg-card relative flex flex-col p-7 md:p-8 ${pkg.popular ? "pkg-popular" : ""}`}
      style={{
        borderRadius: 32,
        background: "rgba(255,255,255,0.03)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: pkg.popular
          ? `1px solid ${RED}66`
          : `1px solid ${SILVER}26`,
        boxShadow: pkg.popular
          ? `0 0 40px ${RED}33, 0 0 80px ${RED}1a, 0 8px 32px rgba(0,0,0,0.4)`
          : "0 8px 32px rgba(0,0,0,0.3)",
      }}
      aria-labelledby={`pkg-${pkg.id}-name`}
    >
      {pkg.popular && (
        <span
          className="absolute left-1/2 -translate-x-1/2 -top-3 inline-flex items-center gap-1.5 px-4 py-1.5 text-white"
          style={{
            background: RED,
            borderRadius: 32,
            fontFamily: "var(--font-syncopate), sans-serif",
            fontSize: 10,
            letterSpacing: "3px",
            textTransform: "uppercase",
            boxShadow: `0 0 24px ${RED}80`,
          }}
        >
          <Sparkles size={11} strokeWidth={2} aria-hidden="true" />
          Most Popular
        </span>
      )}

      <header className="mb-6">
        <h3
          id={`pkg-${pkg.id}-name`}
          style={{
            fontFamily: "var(--font-syncopate), sans-serif",
            fontSize: 14,
            letterSpacing: "5px",
            textTransform: "uppercase",
            color: SILVER,
          }}
        >
          {pkg.name}
        </h3>
        <p
          style={{
            fontFamily: "var(--font-inter), sans-serif",
            fontSize: 13,
            color: "rgba(160,160,160,0.85)",
            marginTop: 4,
          }}
        >
          {pkg.tagline}
        </p>
      </header>

      <div className="mb-5 flex items-baseline gap-2">
        <span
          style={{
            fontFamily: "var(--font-syncopate), sans-serif",
            fontSize: 44,
            fontWeight: 700,
            letterSpacing: "1px",
            color: priceColor,
            lineHeight: 1,
            background: pkg.popular
              ? "linear-gradient(180deg, #FFFFFF 0%, #E63946 60%, #8A1F26 100%)"
              : "linear-gradient(180deg, #FFFFFF 0%, #C0C0C0 50%, #8A8A8A 100%)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          {pkg.price}
        </span>
      </div>

      <span
        className="mb-7 inline-flex items-center gap-2 self-start px-3 py-1.5"
        style={{
          background: "rgba(230,57,70,0.08)",
          border: `1px solid ${RED}40`,
          borderRadius: 32,
          fontFamily: "var(--font-inter), sans-serif",
          fontSize: 11,
          letterSpacing: "1px",
          color: SILVER,
        }}
      >
        <Clock size={12} strokeWidth={2} style={{ color: RED }} aria-hidden="true" />
        {pkg.duration}
      </span>

      <ul className="mb-8 flex flex-col gap-3" aria-label={`${pkg.name} package features`}>
        {pkg.features.map((f, i) => (
          <motion.li
            key={f}
            variants={checkVariants}
            custom={i + index * pkg.features.length * 0}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
            className="flex items-start gap-3"
            style={{
              fontFamily: "var(--font-inter), sans-serif",
              fontSize: 14,
              color: "rgba(192,192,192,0.92)",
              lineHeight: 1.5,
            }}
          >
            <span
              aria-hidden="true"
              className="mt-0.5 inline-flex h-5 w-5 flex-shrink-0 items-center justify-center"
              style={{
                borderRadius: 999,
                background: `${RED}1f`,
                border: `1px solid ${RED}55`,
              }}
            >
              <Check size={12} strokeWidth={3} style={{ color: RED }} />
            </span>
            <span>{f}</span>
          </motion.li>
        ))}
      </ul>

      <button
        type="button"
        onClick={() => selectPackage(pkg.id)}
        aria-label={`Select ${pkg.name} package and proceed to booking`}
        className={`pkg-cta-${pkg.cta} mt-auto inline-flex items-center justify-center px-6 py-4`}
        style={{
          fontFamily: "var(--font-syncopate), sans-serif",
          fontSize: 12,
          letterSpacing: "4px",
          textTransform: "uppercase",
          borderRadius: 32,
          ...(pkg.cta === "solid"
            ? {
                background: RED,
                color: "#fff",
              }
            : pkg.cta === "outline"
            ? {
                background: "rgba(255,255,255,0.02)",
                border: `1px solid ${SILVER}66`,
                color: SILVER,
                backdropFilter: "blur(12px)",
              }
            : {
                background: "rgba(255,255,255,0.05)",
                border: `1px solid ${SILVER}33`,
                color: SILVER,
                backdropFilter: "blur(12px)",
              }),
          transition: "all 0.4s cubic-bezier(0.4,0,0.2,1)",
        }}
      >
        Select Package
      </button>
    </motion.article>
  );
}

export default function Services() {
  const reduced = useReducedMotion();

  return (
    <LazyMotion features={domAnimation}>
      <section
        id="services"
        aria-labelledby="services-heading"
        className="relative overflow-hidden py-24 md:py-32"
        style={{ background: "#0A0A0A" }}
      >
        {/* Atmospheric mesh */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(45% 45% at 50% 30%, rgba(230,57,70,0.07) 0%, rgba(230,57,70,0) 70%)",
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
          {/* Header */}
          <motion.header
            variants={reduced ? undefined : headerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
            className="mb-14 text-center md:mb-20"
          >
            <h2
              id="services-heading"
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
              Choose Your Package
            </h2>
            <p
              className="mx-auto mt-5 max-w-[56ch] text-base md:text-lg"
              style={{
                fontFamily: "var(--font-inter), sans-serif",
                color: "rgba(160,160,160,0.9)",
                fontWeight: 300,
                lineHeight: 1.6,
              }}
            >
              Pick what fits your car and your needs.
            </p>
          </motion.header>

          {/* Cards */}
          <motion.div
            variants={reduced ? undefined : cardListVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-3 items-stretch gap-6 md:gap-8 lg:gap-10"
          >
            {PACKAGES.map((p, i) => (
              <PackageCard key={p.id} pkg={p} index={i} />
            ))}
          </motion.div>

          {/* Trust note */}
          <p
            className="mx-auto mt-12 max-w-[56ch] text-center"
            style={{
              fontFamily: "var(--font-inter), sans-serif",
              fontStyle: "italic",
              fontSize: 12,
              color: "rgba(160,160,160,0.7)",
              lineHeight: 1.6,
            }}
          >
            Final quote is based on vehicle size and condition. Mobile service
            fee included within 20 miles.
          </p>
        </div>

        <style jsx>{`
          .pkg-card {
            transition: backdrop-filter 0.4s ease, box-shadow 0.4s ease,
              border-color 0.4s ease;
          }
          .pkg-card:hover {
            backdrop-filter: blur(28px);
            -webkit-backdrop-filter: blur(28px);
            box-shadow: 0 16px 48px rgba(0, 0, 0, 0.5),
              0 0 24px rgba(230, 57, 70, 0.12);
          }
          .pkg-popular:hover {
            box-shadow: 0 0 56px ${RED}55, 0 0 96px ${RED}26,
              0 16px 48px rgba(0, 0, 0, 0.5);
          }
          .pkg-cta-glass:hover,
          .pkg-cta-glass:focus-visible {
            background: rgba(255, 255, 255, 0.09) !important;
            border-color: ${SILVER}80 !important;
            outline: none;
          }
          .pkg-cta-outline:hover,
          .pkg-cta-outline:focus-visible {
            background: rgba(255, 255, 255, 0.05) !important;
            border-color: ${SILVER}cc !important;
            outline: none;
          }
          .pkg-cta-solid:hover,
          .pkg-cta-solid:focus-visible {
            box-shadow: 0 0 32px ${RED}aa, 0 0 64px ${RED}55;
            transform: translateY(-1px);
            outline: none;
          }

          /* Stacked Gold card: ensure "Most Popular" badge clears the card above */
          @media (max-width: 767px) {
            :global(.pkg-popular) {
              margin-top: 16px;
            }
          }

          @media (prefers-reduced-motion: reduce) {
            .pkg-card {
              transition: none !important;
            }
          }
        `}</style>
      </section>
    </LazyMotion>
  );
}
