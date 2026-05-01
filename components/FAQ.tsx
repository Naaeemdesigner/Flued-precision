"use client";

import { useState } from "react";
import { motion, AnimatePresence, LazyMotion, domAnimation, useReducedMotion } from "framer-motion";
import { Plus } from "lucide-react";

const SILVER = "#C0C0C0";
const RED = "#E63946";

type QA = { id: string; q: string; a: string };

const FAQS: QA[] = [
  {
    id: "utilities",
    q: "Do I need to provide water or electricity?",
    a: "No. Our mobile units are fully self-sustained with professional-grade deionized water tanks and silent power generators. We only need access to your vehicle.",
  },
  {
    id: "weather",
    q: "What is your policy for rainy weather?",
    a: "Precision requires perfect conditions. If rain is forecasted, we will contact you 24 hours in advance to reschedule your session at no extra cost to ensure a flawless finish.",
  },
  {
    id: "duration",
    q: "How long does a typical session take?",
    a: "Quality cannot be rushed. Depending on your chosen package and vehicle size, a session typically lasts between 2 to 6 hours.",
  },
  {
    id: "insurance",
    q: "Are you insured to work on luxury and exotic vehicles?",
    a: "Absolutely. We are fully insured and specialized in handling high-value assets with surgical care and specialized tools.",
  },
  {
    id: "cancel",
    q: "Can I cancel or reschedule my appointment?",
    a: "Yes. You can reschedule or cancel up to 48 hours before your appointment through your confirmation email without any penalty.",
  },
];

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

function Panel({ qa, isOpen, onToggle }: { qa: QA; isOpen: boolean; onToggle: () => void }) {
  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ y: -3 }}
      transition={{ type: "spring", stiffness: 280, damping: 24 }}
      className="faq-panel"
      style={{
        borderRadius: 20,
        background: "rgba(255,255,255,0.02)",
        border: `1px solid ${isOpen ? RED + "66" : SILVER + "26"}`,
        backdropFilter: "blur(15px)",
        WebkitBackdropFilter: "blur(15px)",
        boxShadow: isOpen
          ? `0 0 28px ${RED}33, 0 0 56px ${RED}1a`
          : "0 4px 16px rgba(0,0,0,0.25)",
        transition: "border-color 0.4s ease, box-shadow 0.4s ease",
        overflow: "hidden",
      }}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={`faq-${qa.id}`}
        id={`faq-trigger-${qa.id}`}
        className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left md:px-7 md:py-6"
        style={{ cursor: "pointer", color: SILVER }}
      >
        <span
          style={{
            fontFamily: "var(--font-syncopate), sans-serif",
            fontSize: "clamp(13px, 1.5vw, 15px)",
            fontWeight: 700,
            letterSpacing: "2px",
            textTransform: "uppercase",
            color: isOpen ? "#fff" : SILVER,
            transition: "color 0.3s",
            lineHeight: 1.4,
          }}
        >
          {qa.q}
        </span>
        <motion.span
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
          className="flex h-9 w-9 flex-shrink-0 items-center justify-center"
          style={{
            borderRadius: 999,
            background: isOpen ? RED : `${RED}1a`,
            border: `1px solid ${RED}80`,
            color: isOpen ? "#fff" : RED,
            boxShadow: isOpen ? `0 0 16px ${RED}80` : "none",
            transition: "background 0.3s, color 0.3s, box-shadow 0.3s",
          }}
          aria-hidden="true"
        >
          <Plus size={18} strokeWidth={2.5} />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={`faq-${qa.id}`}
            role="region"
            aria-labelledby={`faq-trigger-${qa.id}`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{
              height: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
              opacity: { duration: 0.3, ease: "easeOut" },
            }}
            style={{ overflow: "hidden" }}
          >
            <div
              className="px-6 pb-6 md:px-7 md:pb-7"
              style={{
                fontFamily: "var(--font-inter), sans-serif",
                fontSize: 15,
                lineHeight: 1.7,
                color: "rgba(192,192,192,0.85)",
                maxWidth: "62ch",
              }}
            >
              {qa.a}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function FAQ() {
  const reduced = useReducedMotion();
  const [openId, setOpenId] = useState<string | null>(FAQS[0].id);

  return (
    <LazyMotion features={domAnimation}>
      <section
        id="faq"
        aria-labelledby="faq-heading"
        className="relative overflow-hidden py-24 md:py-32"
        style={{ background: "#0A0A0A" }}
      >
        {/* Atmospheric mesh */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(45% 35% at 50% 30%, rgba(230,57,70,0.06) 0%, rgba(230,57,70,0) 70%)",
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

        <div className="relative mx-auto w-full max-w-[920px] px-6 md:px-10">
          <motion.header
            initial={reduced ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="mb-12 text-center md:mb-16"
          >
            <h2
              id="faq-heading"
              className="mx-auto max-w-[20ch] text-[clamp(1.75rem,4.5vw,3rem)] leading-[1.05]"
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
              Answers in Precision
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
              Everything you need to know about our elite mobile detailing process.
            </p>
          </motion.header>

          <motion.div
            variants={reduced ? undefined : containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            className="flex flex-col gap-3 md:gap-4"
            style={{
              padding: 16,
              borderRadius: 32,
              background: "rgba(255,255,255,0.015)",
              border: `1px solid ${SILVER}1a`,
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
            }}
          >
            {FAQS.map((qa) => (
              <Panel
                key={qa.id}
                qa={qa}
                isOpen={openId === qa.id}
                onToggle={() => setOpenId((cur) => (cur === qa.id ? null : qa.id))}
              />
            ))}
          </motion.div>

          <p
            className="mt-10 text-center"
            style={{
              fontFamily: "var(--font-inter), sans-serif",
              fontSize: 13,
              letterSpacing: "1px",
              color: "rgba(192,192,192,0.65)",
            }}
          >
            Still have questions?{" "}
            <a
              href="#booking"
              className="faq-contact"
              style={{
                color: SILVER,
                textDecoration: "underline",
                textUnderlineOffset: 4,
                transition: "color 0.3s",
              }}
            >
              Contact our specialist
            </a>
          </p>
        </div>

        <style jsx>{`
          .faq-panel:hover {
            border-color: ${SILVER}40 !important;
          }
          .faq-contact:hover,
          .faq-contact:focus-visible {
            color: ${RED} !important;
            outline: none;
          }
          @media (prefers-reduced-motion: reduce) {
            .faq-panel { transition: none !important; }
          }
        `}</style>
      </section>
    </LazyMotion>
  );
}
