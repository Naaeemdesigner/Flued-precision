"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, LazyMotion, domAnimation, useReducedMotion } from "framer-motion";
import { Star, BadgeCheck, ChevronLeft, ChevronRight, Quote } from "lucide-react";

const SILVER = "#C0C0C0";
const RED = "#E63946";

type Testimonial = {
  id: string;
  rating: number;
  quote: string;
  name: string;
  role: string;
};

const TESTIMONIALS: Testimonial[] = [
  {
    id: "harrison",
    rating: 5,
    quote:
      "The attention to detail is surgical. They didn't just clean my car; they restored its soul. The best mobile service in the city, hands down.",
    name: "Mark Harrison",
    role: "Owner of 2024 Porsche 911",
  },
  {
    id: "chen",
    rating: 5,
    quote:
      "I expected a wash. I got concours-level work in my driveway. The ceramic coating still beads water like glass after eight months of daily driving.",
    name: "Sarah Chen",
    role: "Owner of 2023 Range Rover Autobiography",
  },
  {
    id: "delgado",
    rating: 5,
    quote:
      "Punctual, meticulous, and genuinely passionate. They treat your car the way you wish every shop did. Worth every dollar — and then some.",
    name: "Antonio Delgado",
    role: "Owner of 2024 Mercedes-AMG G63",
  },
  {
    id: "patel",
    rating: 5,
    quote:
      "Took my matte-finish AMG GT in for paint correction. Came back looking factory-fresh. Their technical knowledge is unmatched in this market.",
    name: "Ravi Patel",
    role: "Owner of 2022 Mercedes-AMG GT",
  },
  {
    id: "novak",
    rating: 5,
    quote:
      "Watched them work for ten minutes and immediately understood the price. Surgeons of automotive aesthetics. Already booked the next two services.",
    name: "Elena Novak",
    role: "Owner of 2024 Lamborghini Urus",
  },
  {
    id: "okafor",
    rating: 5,
    quote:
      "Brought my Bentley out of a long winter storage a complete mess. They turned a half-day in my driveway into a complete restoration. Showroom standard.",
    name: "Adaeze Okafor",
    role: "Owner of 2023 Bentley Continental GT",
  },
  {
    id: "rosenthal",
    rating: 5,
    quote:
      "The graphene coating they applied has changed how I think about car care. Six months of daily commuting and the paint still looks like glass.",
    name: "David Rosenthal",
    role: "Owner of 2024 Aston Martin DB12",
  },
  {
    id: "fontaine",
    rating: 5,
    quote:
      "Booked a quick refresh before a charity gala. They arrived on time, worked silently, and the car turned heads at valet. That is service.",
    name: "Camille Fontaine",
    role: "Owner of 2023 Bentley Bentayga",
  },
  {
    id: "kapoor",
    rating: 5,
    quote:
      "Five years of swirl marks gone in a single session. Paint depth gauge readings, before and after photos, full report. Engineering, not detailing.",
    name: "Arjun Kapoor",
    role: "Owner of 2019 Audi R8",
  },
  {
    id: "vasquez",
    rating: 5,
    quote:
      "Interior steam clean was extraordinary. My toddler had destroyed the leather. Came back smelling like the showroom floor. They saved my resale value.",
    name: "Sofia Vasquez",
    role: "Owner of 2024 Cadillac Escalade-V",
  },
  {
    id: "müller",
    rating: 5,
    quote:
      "Coming from Germany I had high standards. Fluid Precision exceeded them. Professional, measured, and the ceramic finish rivals what I knew at home.",
    name: "Lukas Müller",
    role: "Owner of 2024 BMW M5 Touring",
  },
  {
    id: "tanaka",
    rating: 5,
    quote:
      "I have a small collection. They are now the only team I let near any of them. Discreet, careful, and the results speak for themselves on every car.",
    name: "Hiroshi Tanaka",
    role: "Collector · Ferrari, McLaren, Porsche",
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15, delayChildren: 0.1 } },
};

function Stars({ count, label }: { count: number; label: string }) {
  return (
    <div
      className="flex items-center gap-1"
      role="img"
      aria-label={`${count} out of 5 stars — ${label}`}
    >
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={14}
          strokeWidth={0}
          aria-hidden="true"
          style={{
            fill: i < count ? RED : "rgba(192,192,192,0.15)",
            filter: i < count ? `drop-shadow(0 0 6px ${RED}80)` : "none",
          }}
        />
      ))}
    </div>
  );
}

function TestimonialCard({ t }: { t: Testimonial }) {
  return (
    <motion.article
      variants={cardVariants}
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 280, damping: 22 }}
      className="tcard relative flex h-full flex-col p-7 md:p-8"
      style={{
        borderRadius: 32,
        background: "rgba(255,255,255,0.03)",
        backdropFilter: "blur(25px)",
        WebkitBackdropFilter: "blur(25px)",
        border: `1px solid ${SILVER}26`,
        boxShadow: "0 8px 32px rgba(0,0,0,0.35)",
      }}
      aria-label={`Testimonial from ${t.name}`}
    >
      {/* Decorative quote glyph */}
      <Quote
        size={28}
        strokeWidth={1.5}
        aria-hidden="true"
        className="absolute right-7 top-7 opacity-15"
        style={{ color: SILVER }}
      />

      <Stars count={t.rating} label={`Rating from ${t.name}`} />

      <blockquote
        className="mt-6 flex-1"
        style={{
          fontFamily: "var(--font-inter), sans-serif",
          fontStyle: "italic",
          fontSize: 15,
          lineHeight: 1.65,
          color: "rgba(240,240,240,0.92)",
        }}
      >
        &ldquo;{t.quote}&rdquo;
      </blockquote>

      <footer className="mt-7 flex items-start gap-3 border-t pt-5" style={{ borderColor: `${SILVER}1f` }}>
        <div className="flex-1">
          <p
            style={{
              fontFamily: "var(--font-syncopate), sans-serif",
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: "3px",
              textTransform: "uppercase",
              color: SILVER,
            }}
          >
            {t.name}
          </p>
          <p
            className="mt-1"
            style={{
              fontFamily: "var(--font-inter), sans-serif",
              fontSize: 12,
              color: "rgba(160,160,160,0.85)",
            }}
          >
            {t.role}
          </p>
        </div>
        <span
          className="inline-flex items-center gap-1 px-2.5 py-1"
          style={{
            background: "rgba(192,192,192,0.06)",
            border: `1px solid ${SILVER}26`,
            borderRadius: 32,
            fontFamily: "var(--font-inter), sans-serif",
            fontSize: 10,
            color: "rgba(192,192,192,0.85)",
            letterSpacing: "0.5px",
          }}
          title="Verified Client"
        >
          <BadgeCheck size={12} strokeWidth={2} style={{ color: SILVER }} aria-hidden="true" />
          Verified
        </span>
      </footer>
    </motion.article>
  );
}

export default function Testimonials() {
  const reduced = useReducedMotion();
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const updateNav = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 8);
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 8);
  }, []);

  useEffect(() => {
    updateNav();
    const el = trackRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateNav, { passive: true });
    window.addEventListener("resize", updateNav);
    return () => {
      el.removeEventListener("scroll", updateNav);
      window.removeEventListener("resize", updateNav);
    };
  }, [updateNav]);

  const scrollBy = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>(".tcard-slide");
    const step = card ? card.offsetWidth + 24 : el.clientWidth * 0.85;
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  return (
    <LazyMotion features={domAnimation}>
      <section
        id="testimonials"
        aria-labelledby="testimonials-heading"
        className="relative overflow-hidden py-24 md:py-32"
        style={{ background: "#0A0A0A" }}
      >
        {/* Atmospheric mesh */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(50% 40% at 20% 30%, rgba(230,57,70,0.06) 0%, rgba(230,57,70,0) 70%), radial-gradient(45% 35% at 85% 70%, rgba(230,57,70,0.05) 0%, rgba(230,57,70,0) 70%)",
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
              id="testimonials-heading"
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
              Client testimonials
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
              
            </p>
          </motion.header>

          {/* Desktop row — horizontal layout, generous spacing */}
          {/* Carousel — mobile: 1-up swipe; desktop: 3-up scroll-snap with arrows */}
          <motion.div
            variants={reduced ? undefined : containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <div
              ref={trackRef}
              className="t-track flex gap-5 overflow-x-auto pb-6 md:gap-7 lg:gap-10"
              style={{
                scrollSnapType: "x mandatory",
                scrollbarWidth: "none",
                WebkitOverflowScrolling: "touch",
                margin: "0 -24px",
                padding: "8px 24px 24px",
              }}
            >
              {TESTIMONIALS.map((t) => (
                <div
                  key={t.id}
                  className="tcard-slide flex-shrink-0 w-[85%] md:w-[calc((100%-2*1.75rem)/3)] lg:w-[calc((100%-2*2.5rem)/3)]"
                  style={{ scrollSnapAlign: "start" }}
                >
                  <TestimonialCard t={t} />
                </div>
              ))}
            </div>

            <div className="mt-4 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => scrollBy(-1)}
                disabled={!canPrev}
                aria-label="Previous testimonial"
                className="t-arrow"
              >
                <ChevronLeft size={18} strokeWidth={2} aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => scrollBy(1)}
                disabled={!canNext}
                aria-label="Next testimonial"
                className="t-arrow"
              >
                <ChevronRight size={18} strokeWidth={2} aria-hidden="true" />
              </button>
            </div>
          </motion.div>
        </div>

        <style jsx>{`
          :global(.tcard) {
            transition: border-color 0.4s ease, box-shadow 0.4s ease,
              background 0.4s ease;
          }
          :global(.tcard:hover) {
            border-color: ${RED}66 !important;
            background: rgba(255, 255, 255, 0.04) !important;
            box-shadow: 0 0 32px ${RED}33, 0 0 64px ${RED}1a,
              0 16px 48px rgba(0, 0, 0, 0.5) !important;
          }
          .t-track::-webkit-scrollbar { display: none; }

          .t-arrow {
            width: 44px;
            height: 44px;
            border-radius: 50%;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            background: rgba(255, 255, 255, 0.04);
            border: 1px solid ${SILVER}33;
            color: ${SILVER};
            backdrop-filter: blur(12px);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            cursor: pointer;
          }
          .t-arrow:hover:not(:disabled),
          .t-arrow:focus-visible:not(:disabled) {
            border-color: ${RED};
            color: ${RED};
            background: ${RED}14;
            box-shadow: 0 0 20px ${RED}55;
            outline: none;
          }
          .t-arrow:disabled {
            opacity: 0.35;
            cursor: not-allowed;
          }

          @media (prefers-reduced-motion: reduce) {
            :global(.tcard) {
              transition: none !important;
            }
          }
        `}</style>
      </section>
    </LazyMotion>
  );
}
