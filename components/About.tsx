"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import {
  motion,
  LazyMotion,
  domAnimation,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import {
  Award,
  ShieldCheck,
  Microscope,
  Droplets,
  Crosshair,
  Atom,
  ArrowRight,
} from "lucide-react";

const SILVER = "#C0C0C0";
const RED = "#E63946";

const PILLARS = [
  {
    n: "01",
    name: "Fluidity",
    Icon: Droplets,
    body: "We adapt our chemical selection to match your vehicle's specific DNA — paint hardness, age, and finish all dictate our protocol.",
  },
  {
    n: "02",
    name: "Precision",
    Icon: Crosshair,
    body: "Measured results using ultrasonic paint gauges and specialized swirl-detection lighting. Nothing left to guesswork.",
  },
  {
    n: "03",
    name: "Innovation",
    Icon: Atom,
    body: "Utilizing the latest in graphene and ceramic nano-technology, refreshed quarterly to stay ahead of every formulation.",
  },
];

const CREDENTIALS = [
  { Icon: Award, label: "10+ Years", desc: "in high-end automotive restoration" },
  { Icon: ShieldCheck, label: "IDA Validated", desc: "International Detailing Association · Skills Validated Specialist" },
  { Icon: Microscope, label: "Surface Engineering", desc: "philosophy: engineering over cleaning" },
];

function HeroVision() {
  const ref = useRef<HTMLDivElement | null>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const yShape1 = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [40, -40]);
  const yShape2 = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [-30, 30]);
  const yText = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [20, -20]);

  return (
    <div
      ref={ref}
      className="relative isolate overflow-hidden"
      style={{
        background: "#0A0A0A",
        paddingTop: "clamp(96px, 16vw, 192px)",
        paddingBottom: "clamp(96px, 16vw, 192px)",
      }}
    >
      {/* Background macro video — water beading on ceramic */}
      <video
        className="absolute inset-0 -z-30 h-full w-full object-cover"
        src="/media/water-beading.webm"
        poster="/media/water-beading-poster.avif"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden="true"
        style={{ filter: "brightness(0.55) contrast(1.1)" }}
      />

      {/* Flat charcoal shapes — no gradients */}
      <motion.div
        aria-hidden="true"
        style={{ y: yShape1 }}
        className="absolute -left-20 top-20 -z-20 hidden md:block"
      >
        <div
          style={{
            width: 380,
            height: 380,
            background: "#0E0E0E",
            borderRadius: 32,
            transform: "rotate(-8deg)",
            boxShadow: "0 24px 64px rgba(0,0,0,0.6)",
          }}
        />
      </motion.div>
      <motion.div
        aria-hidden="true"
        style={{ y: yShape2 }}
        className="absolute -right-24 bottom-12 -z-20 hidden md:block"
      >
        <div
          style={{
            width: 280,
            height: 280,
            background: "#0C0C0C",
            borderRadius: 32,
            transform: "rotate(12deg)",
            boxShadow: "0 24px 64px rgba(0,0,0,0.7)",
          }}
        />
      </motion.div>

      {/* Heavy darken overlay for legibility */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10"
        style={{ background: "rgba(10,10,10,0.55)" }}
      />

      <motion.div
        style={{ y: yText }}
        className="relative mx-auto max-w-[1080px] px-6 md:px-10 text-center"
      >
        
      </motion.div>
    </div>
  );
}

function MasterSpecialist() {
  const ref = useRef<HTMLDivElement | null>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const yCard = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [30, -30]);

  return (
    <div ref={ref} className="relative py-24 md:py-32">
      <div className="mx-auto max-w-[1280px] px-6 md:px-10">
        <motion.article
          initial={reduced ? false : { opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="grid items-stretch gap-0 overflow-hidden md:grid-cols-2"
          style={{
            y: yCard,
            borderRadius: 32,
            background: "rgba(255,255,255,0.025)",
            border: `1px solid ${SILVER}26`,
            backdropFilter: "blur(25px)",
            WebkitBackdropFilter: "blur(25px)",
            boxShadow: "0 24px 64px rgba(0,0,0,0.5)",
          }}
        >
          {/* Photo */}
          <div className="relative aspect-[4/5] md:aspect-auto" style={{ background: "#0a0a0a" }}>
            <Image
              src="/media/about/specialist.webp"
              alt="Master detailing specialist using a paint depth gauge on a luxury vehicle"
              fill
              sizes="(max-width: 768px) 100vw, 640px"
              className="object-cover"
              style={{ filter: "contrast(1.1) brightness(0.92)" }}
            />
            {/* Vignette */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "linear-gradient(180deg, rgba(10,10,10,0) 50%, rgba(10,10,10,0.7) 100%), linear-gradient(90deg, rgba(10,10,10,0.4) 0%, rgba(10,10,10,0) 35%)",
              }}
            />
            <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between">
              <span
                style={{
                  fontFamily: "var(--font-syncopate)",
                  fontSize: 10,
                  letterSpacing: "3px",
                  textTransform: "uppercase",
                  color: SILVER,
                  background: "rgba(10,10,10,0.65)",
                  border: `1px solid ${SILVER}33`,
                  borderRadius: 32,
                  padding: "6px 12px",
                  backdropFilter: "blur(12px)",
                }}
              >
                Master Specialist
              </span>
            </div>
          </div>

          {/* Credentials */}
          <div className="flex flex-col justify-center p-8 md:p-12">
            <p
              style={{
                fontFamily: "var(--font-syncopate)",
                fontSize: 10,
                letterSpacing: "4px",
                textTransform: "uppercase",
                color: RED,
                marginBottom: 12,
              }}
            >
              The Expertise
            </p>
            <h3
              className="text-[clamp(1.5rem,3.5vw,2.5rem)] leading-[1.05]"
              style={{
                fontFamily: "var(--font-syncopate)",
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
              Behind the Precision
            </h3>

            <ul className="mt-8 flex flex-col gap-5">
              {CREDENTIALS.map(({ Icon, label, desc }) => (
                <li key={label} className="flex items-start gap-4">
                  <span
                    aria-hidden="true"
                    className="cred-ico mt-0.5 inline-flex h-10 w-10 flex-shrink-0 items-center justify-center"
                    style={{
                      borderRadius: 999,
                      background: `${RED}14`,
                      border: `1px solid ${RED}66`,
                      color: RED,
                      transition: "transform 0.4s cubic-bezier(0.4,0,0.2,1)",
                    }}
                  >
                    <Icon size={16} strokeWidth={2} />
                  </span>
                  <div>
                    <p
                      style={{
                        fontFamily: "var(--font-syncopate)",
                        fontSize: 12,
                        fontWeight: 700,
                        letterSpacing: "3px",
                        textTransform: "uppercase",
                        color: SILVER,
                      }}
                    >
                      {label}
                    </p>
                    <p
                      className="mt-1"
                      style={{
                        fontFamily: "var(--font-inter)",
                        fontSize: 14,
                        color: "rgba(192,192,192,0.7)",
                        lineHeight: 1.6,
                      }}
                    >
                      {desc}
                    </p>
                  </div>
                </li>
              ))}
            </ul>

            <blockquote
              className="mt-9 border-l pl-5"
              style={{
                borderColor: RED,
                fontFamily: "var(--font-inter)",
                fontStyle: "italic",
                fontSize: 15,
                lineHeight: 1.65,
                color: "rgba(240,240,240,0.92)",
              }}
            >
              &ldquo;Surface engineering over surface cleaning.&rdquo;
            </blockquote>
          </div>
        </motion.article>

        <style jsx>{`
          .cred-ico:hover {
            transform: rotate(8deg) scale(1.08);
          }
          @media (prefers-reduced-motion: reduce) {
            .cred-ico:hover { transform: none; }
          }
        `}</style>
      </div>
    </div>
  );
}

function Pillars() {
  const reduced = useReducedMotion();
  return (
    <div className="relative py-24 md:py-32">
      <div className="mx-auto max-w-[1280px] px-6 md:px-10">
        <motion.header
          initial={reduced ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mb-14 text-center"
        >
          <p
            style={{
              fontFamily: "var(--font-syncopate)",
              fontSize: 10,
              letterSpacing: "4px",
              textTransform: "uppercase",
              color: RED,
              marginBottom: 12,
            }}
          >
            Brand DNA
          </p>
          <h3
            className="mx-auto max-w-[24ch] text-[clamp(1.5rem,4vw,2.75rem)]"
            style={{
              fontFamily: "var(--font-syncopate)",
              fontWeight: 700,
              letterSpacing: "5px",
              textTransform: "uppercase",
              background:
                "linear-gradient(180deg,#FFFFFF 0%,#C0C0C0 50%,#8A8A8A 100%)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
              lineHeight: 1.1,
            }}
          >
            Three Pillars of Execution
          </h3>
        </motion.header>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={
            reduced
              ? undefined
              : { hidden: {}, visible: { transition: { staggerChildren: 0.12 } } }
          }
          className="grid gap-5 md:grid-cols-3"
        >
          {PILLARS.map(({ n, name, Icon, body }) => (
            <motion.div
              key={n}
              variants={
                reduced
                  ? undefined
                  : {
                      hidden: { opacity: 0, y: 28 },
                      visible: {
                        opacity: 1,
                        y: 0,
                        transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
                      },
                    }
              }
              whileHover={{ y: -4 }}
              transition={{ type: "spring", stiffness: 280, damping: 22 }}
              className="pillar group flex flex-col p-7"
              style={{
                borderRadius: 20,
                background: "rgba(255,255,255,0.025)",
                border: `1px solid ${SILVER}26`,
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
              }}
            >
              <div className="mb-5 flex items-center justify-between">
                <span
                  className="pillar-ico inline-flex h-12 w-12 items-center justify-center"
                  style={{
                    borderRadius: 999,
                    background: `${RED}14`,
                    border: `1px solid ${RED}66`,
                    color: RED,
                    transition: "transform 0.5s cubic-bezier(0.4,0,0.2,1)",
                  }}
                  aria-hidden="true"
                >
                  <Icon size={20} strokeWidth={1.75} />
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-syncopate)",
                    fontSize: 24,
                    fontWeight: 700,
                    color: `${SILVER}26`,
                    letterSpacing: "2px",
                  }}
                >
                  {n}
                </span>
              </div>
              <h4
                style={{
                  fontFamily: "var(--font-syncopate)",
                  fontSize: 14,
                  fontWeight: 700,
                  letterSpacing: "5px",
                  textTransform: "uppercase",
                  color: SILVER,
                  marginBottom: 10,
                }}
              >
                {name}
              </h4>
              <p
                style={{
                  fontFamily: "var(--font-inter)",
                  fontSize: 14,
                  lineHeight: 1.65,
                  color: "rgba(192,192,192,0.75)",
                }}
              >
                {body}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <style jsx>{`
        .pillar:hover {
          border-color: ${SILVER}40 !important;
          background: rgba(255, 255, 255, 0.04) !important;
        }
        .pillar:hover .pillar-ico {
          transform: rotate(15deg) scale(1.08);
        }
        @media (prefers-reduced-motion: reduce) {
          .pillar:hover .pillar-ico { transform: none; }
        }
      `}</style>
    </div>
  );
}

function Commitment() {
  const reduced = useReducedMotion();
  return (
    <div className="relative py-24 md:py-32">
      <div className="mx-auto max-w-[1080px] px-6 md:px-10 text-center">
        <motion.h2
          initial={reduced ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto max-w-[22ch] text-[clamp(1.75rem,5vw,3.75rem)] leading-[1.05]"
          style={{
            fontFamily: "var(--font-syncopate)",
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
          Not a Service. <br />
          <span
            style={{
              background:
                "linear-gradient(180deg,#FFFFFF 0%,#E63946 60%,#8A1F26 100%)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            An Investment.
          </span>
        </motion.h2>
        <motion.p
          initial={reduced ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mt-8 max-w-[60ch]"
          style={{
            fontFamily: "var(--font-inter)",
            fontSize: 17,
            lineHeight: 1.65,
            color: "rgba(192,192,192,0.85)",
          }}
        >
          We treat every vehicle as a high-value asset. Our mission is to
          provide a mobile-first experience that prioritizes the longevity and
          aesthetic integrity of your automotive investment.
        </motion.p>

        {/* Vector silver line divider */}
        <div className="my-12 flex items-center justify-center" aria-hidden="true">
          <span
            style={{
              display: "block",
              width: 64,
              height: 1,
              background: `linear-gradient(90deg, transparent, ${SILVER}, transparent)`,
            }}
          />
          <span
            style={{
              display: "inline-block",
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: RED,
              boxShadow: `0 0 12px ${RED}`,
              margin: "0 16px",
            }}
          />
          <span
            style={{
              display: "block",
              width: 64,
              height: 1,
              background: `linear-gradient(90deg, transparent, ${SILVER}, transparent)`,
            }}
          />
        </div>

        <Link
          href="#booking"
          aria-label="Begin your detailing reservation"
          className="cmt-cta inline-flex items-center gap-2 px-8 py-4 text-white"
          style={{
            background: RED,
            borderRadius: 32,
            fontFamily: "var(--font-syncopate)",
            fontSize: 12,
            letterSpacing: "4px",
            textTransform: "uppercase",
            transition: "all 0.4s cubic-bezier(0.4,0,0.2,1)",
          }}
        >
          Begin Your Reservation
          <ArrowRight size={14} strokeWidth={2} aria-hidden="true" />
        </Link>

        <style jsx>{`
          .cmt-cta:hover,
          .cmt-cta:focus-visible {
            box-shadow: 0 0 32px ${RED}99, 0 0 64px ${RED}55;
            transform: translateY(-2px) scale(1.02);
            outline: none;
          }
        `}</style>
      </div>
    </div>
  );
}

export default function About() {
  return (
    <LazyMotion features={domAnimation}>
      <section
        id="about"
        aria-label="About Fluid Precision"
        style={{ background: "#0A0A0A" }}
      >
        <HeroVision />
        <MasterSpecialist />
        <Pillars />
        <Commitment />
      </section>
    </LazyMotion>
  );
}
