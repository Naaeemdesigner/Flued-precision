"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useBooking } from "./BookingContext";
import {
  motion,
  AnimatePresence,
  LazyMotion,
  domAnimation,
  useReducedMotion,
} from "framer-motion";
import {
  Car,
  CarFront,
  Truck,
  Zap,
  Check,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Calendar as CalendarIcon,
  Clock,
  Sparkles,
  Mail,
  Phone,
  User,
  CalendarPlus,
  PartyPopper,
} from "lucide-react";

const SILVER = "#C0C0C0";
const RED = "#E63946";

type VehicleType = "sedan" | "suv" | "truck" | "exotic";
type PackageId = "silver" | "gold" | "platinum";

const VEHICLE_MULTIPLIER: Record<VehicleType, number> = {
  sedan: 0,
  suv: 50,
  truck: 100,
  exotic: 75,
};
const VEHICLE_DURATION_ADD: Record<VehicleType, number> = {
  sedan: 0,
  suv: 0.5,
  truck: 0.75,
  exotic: 0.5,
};
const VEHICLE_LABEL: Record<VehicleType, string> = {
  sedan: "Sedan",
  suv: "SUV",
  truck: "Truck",
  exotic: "Exotic",
};

const PACKAGES: { id: PackageId; name: string; basePrice: number; duration: number; description: string }[] = [
  { id: "silver", name: "Silver", basePrice: 149, duration: 1.75, description: "Essential Refresh" },
  { id: "gold", name: "Gold", basePrice: 299, duration: 3.75, description: "The Signature Detail" },
  { id: "platinum", name: "Platinum", basePrice: 599, duration: 7, description: "Ultimate Protection" },
];

const PACKAGE_FEATURES: Record<PackageId, string[]> = {
  silver: [
    "pH-Neutral Hand Wash & Dry",
    "Wheels & Tire Dressing",
    "Interior Vacuum & Dusting",
    "Streak-Free Glass Cleaning",
    "Spray Wax for Instant Shine",
  ],
  gold: [
    "Everything in Silver",
    "Clay Bar Paint Decontamination",
    "6-Month Ceramic Sealant",
    "Interior Steam Cleaning",
    "Leather Conditioning",
  ],
  platinum: [
    "Everything in Gold",
    "Paint Enhancement (Swirl Removal)",
    "Entry-Level Ceramic Coating",
    "Deep Carpet Shampooing",
    "Engine Bay Detail & Protect",
  ],
};

const PACKAGE_DURATION_LABEL: Record<PackageId, string> = {
  silver: "1.5 – 2 Hours",
  gold: "3 – 4.5 Hours",
  platinum: "6 – 8 Hours · Full Day",
};

const ADDONS = [
  { id: "pet", label: "Pet Hair Removal", desc: "Deep cleaning for carpets & seats", price: 50, dur: 0.5 },
  { id: "headlight", label: "Headlight Restoration", desc: "Clear coat for oxidized lenses", price: 80, dur: 0.5 },
  { id: "engine", label: "Engine Bay Detail", desc: "Degrease & protective dressing", price: 75, dur: 0.75 },
  { id: "odor", label: "Odor Elimination", desc: "Professional ozone treatment", price: 60, dur: 0.5 },
  { id: "trim", label: "Trim Restoration", desc: "UV protection for exterior plastics", price: 50, dur: 0.25 },
] as const;

type AddonId = (typeof ADDONS)[number]["id"];

const ADDRESS_SUGGESTIONS = [
  "1200 Wilshire Blvd, Los Angeles, CA",
  "850 5th Ave, New York, NY",
  "2500 Brickell Ave, Miami, FL",
  "1100 Lake Shore Dr, Chicago, IL",
  "401 Sansome St, San Francisco, CA",
];

const TIME_SLOTS = ["08:00", "10:00", "12:00", "14:00", "16:00", "18:00"];

const STEPS = [
  "Vehicle",
  "Package",
  "Add-Ons",
  "Schedule",
  "Confirm",
] as const;

type State = {
  vehicleType: VehicleType | null;
  brand: string;
  model: string;
  packageId: PackageId | null;
  addons: AddonId[];
  address: string;
  date: string;
  time: string;
  name: string;
  email: string;
  phone: string;
};

const initialState: State = {
  vehicleType: null,
  brand: "",
  model: "",
  packageId: null,
  addons: [],
  address: "",
  date: "",
  time: "",
  name: "",
  email: "",
  phone: "",
};

function computeTotal(s: State): { total: number; duration: number } {
  if (!s.packageId) return { total: 0, duration: 0 };
  const pkg = PACKAGES.find((p) => p.id === s.packageId)!;
  const vMult = s.vehicleType ? VEHICLE_MULTIPLIER[s.vehicleType] : 0;
  const vDur = s.vehicleType ? VEHICLE_DURATION_ADD[s.vehicleType] : 0;
  const addonsTotal = ADDONS.filter((a) => s.addons.includes(a.id)).reduce((sum, a) => sum + a.price, 0);
  const addonsDur = ADDONS.filter((a) => s.addons.includes(a.id)).reduce((sum, a) => sum + a.dur, 0);
  return { total: pkg.basePrice + vMult + addonsTotal, duration: pkg.duration + vDur + addonsDur };
}

function inputStyle(): React.CSSProperties {
  return {
    width: "100%",
    padding: "16px 18px",
    background: "rgba(255,255,255,0.03)",
    border: `1px solid ${SILVER}26`,
    borderRadius: 16,
    color: SILVER,
    fontFamily: "var(--font-inter), sans-serif",
    fontSize: 14,
    outline: "none",
    transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)",
  };
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <label
      style={{
        display: "block",
        fontFamily: "var(--font-syncopate), sans-serif",
        fontSize: 10,
        letterSpacing: "3px",
        textTransform: "uppercase",
        color: "rgba(192,192,192,0.7)",
        marginBottom: 8,
      }}
    >
      {children}
    </label>
  );
}

function StepHeader({ kicker, title }: { kicker: string; title: string }) {
  return (
    <div className="mb-4 md:mb-8">
      <p
        style={{
          fontFamily: "var(--font-syncopate), sans-serif",
          fontSize: 10,
          letterSpacing: "4px",
          textTransform: "uppercase",
          color: RED,
          marginBottom: 4,
        }}
      >
        {kicker}
      </p>
      <h3
        style={{
          fontFamily: "var(--font-syncopate), sans-serif",
          fontWeight: 700,
          fontSize: "clamp(1.05rem,2.5vw,1.75rem)",
          letterSpacing: "4px",
          textTransform: "uppercase",
          background: "linear-gradient(180deg, #FFFFFF 0%, #C0C0C0 50%, #8A8A8A 100%)",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          color: "transparent",
          lineHeight: 1.15,
        }}
      >
        {title}
      </h3>
    </div>
  );
}

function ErrorMsg({ show, children }: { show: boolean; children?: React.ReactNode }) {
  return (
    <AnimatePresence initial={false}>
      {show && (
        <motion.p
          initial={{ opacity: 0, y: -4, height: 0 }}
          animate={{ opacity: 1, y: 0, height: "auto" }}
          exit={{ opacity: 0, y: -4, height: 0 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          role="alert"
          style={{
            fontSize: 11,
            color: RED,
            marginTop: 6,
            fontFamily: "var(--font-inter), sans-serif",
            letterSpacing: "0.5px",
            overflow: "hidden",
          }}
        >
          {children ?? "Required"}
        </motion.p>
      )}
    </AnimatePresence>
  );
}

type StepErrors = {
  vehicleType?: boolean;
  brand?: boolean;
  model?: boolean;
  address?: boolean;
  date?: boolean;
  time?: boolean;
  name?: boolean;
  email?: boolean;
  phone?: boolean;
};

function VehicleStep({
  state,
  set,
  errors,
}: {
  state: State;
  set: (p: Partial<State>) => void;
  errors: StepErrors;
}) {
  const items: { id: VehicleType; label: string; Icon: React.FC<{ size?: number; strokeWidth?: number }>; add: number }[] = [
    { id: "sedan", label: "Sedan", Icon: Car, add: 0 },
    { id: "suv", label: "SUV", Icon: CarFront, add: 50 },
    { id: "truck", label: "Truck", Icon: Truck, add: 100 },
    { id: "exotic", label: "Exotic", Icon: Zap, add: 75 },
  ];
  return (
    <>
      <StepHeader kicker="Step 01" title="Vehicle Identity" />
      <div
        className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4"
        style={{
          padding: errors.vehicleType ? 4 : 0,
          borderRadius: 36,
          border: errors.vehicleType ? `1px solid ${RED}66` : "1px solid transparent",
          transition: "border-color 0.3s cubic-bezier(0.22,1,0.36,1), padding 0.3s",
        }}
      >
        {items.map(({ id, label, Icon, add }) => {
          const active = state.vehicleType === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => set({ vehicleType: id })}
              aria-pressed={active}
              className="vehicle-tile flex flex-col items-center justify-center gap-2 p-3 md:gap-3 md:p-5"
              style={{
                borderRadius: 24,
                background: active ? "rgba(230,57,70,0.08)" : "rgba(255,255,255,0.03)",
                border: `1px solid ${active ? RED : `${SILVER}26`}`,
                color: active ? RED : SILVER,
                aspectRatio: "1",
                boxShadow: active ? `0 0 28px ${RED}33` : "none",
                transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)",
              }}
            >
              <Icon size={32} strokeWidth={1.5} />
              <span
                style={{
                  fontFamily: "var(--font-syncopate), sans-serif",
                  fontSize: 11,
                  letterSpacing: "3px",
                  textTransform: "uppercase",
                }}
              >
                {label}
              </span>
              <span
                style={{
                  fontFamily: "var(--font-inter), sans-serif",
                  fontSize: 11,
                  color: active ? RED : "rgba(192,192,192,0.5)",
                }}
              >
                {add === 0 ? "Base" : `+$${add}`}
              </span>
            </button>
          );
        })}
      </div>
      <ErrorMsg show={!!errors.vehicleType}>Required · Select a vehicle category</ErrorMsg>

      <div className="mt-4 grid gap-3 md:mt-7 md:grid-cols-2 md:gap-4">
        <div>
          <Label>Brand</Label>
          <input
            type="text"
            placeholder="e.g., Tesla"
            value={state.brand}
            onChange={(e) => set({ brand: e.target.value })}
            style={{ ...inputStyle(), borderColor: errors.brand ? RED : `${SILVER}26` }}
            className="bk-input"
            aria-invalid={!!errors.brand}
          />
          <ErrorMsg show={!!errors.brand} />
        </div>
        <div>
          <Label>Model / Year</Label>
          <input
            type="text"
            placeholder="e.g., Model 3 / 2024"
            value={state.model}
            onChange={(e) => set({ model: e.target.value })}
            style={{ ...inputStyle(), borderColor: errors.model ? RED : `${SILVER}26` }}
            className="bk-input"
            aria-invalid={!!errors.model}
          />
          <ErrorMsg show={!!errors.model} />
        </div>
      </div>
    </>
  );
}

function PackageStep({ state, set }: { state: State; set: (p: Partial<State>) => void }) {
  const vMult = state.vehicleType ? VEHICLE_MULTIPLIER[state.vehicleType] : 0;
  return (
    <>
      <StepHeader kicker="Step 02" title="Service Selection" />
      {state.vehicleType && (
        <div
          className="mb-6 inline-flex items-center gap-2 rounded-full px-4 py-1.5"
          style={{
            background: "rgba(230,57,70,0.08)",
            border: `1px solid ${RED}40`,
            fontFamily: "var(--font-inter), sans-serif",
            fontSize: 11,
            color: SILVER,
            letterSpacing: "1px",
          }}
        >
          <Sparkles size={12} style={{ color: RED }} aria-hidden="true" />
          Customized for your {VEHICLE_LABEL[state.vehicleType]}
        </div>
      )}
      <div className="bk-pkg-track flex flex-row gap-4 overflow-x-auto snap-x snap-mandatory -mx-6 px-6 pb-2 md:grid md:grid-cols-3 md:overflow-visible md:snap-none md:mx-0 md:px-0 md:pb-0 no-scrollbar">
        {PACKAGES.map((p) => {
          const active = state.packageId === p.id;
          const isPopular = p.id === "gold";
          const price = p.basePrice + vMult;
          const features = PACKAGE_FEATURES[p.id];
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => set({ packageId: p.id })}
              aria-pressed={active}
              aria-label={`Select ${p.name} package · $${price}`}
              className="pkg-tile relative flex h-full min-w-[82%] flex-shrink-0 snap-center flex-col p-5 text-left md:min-w-0 md:flex-shrink md:snap-align-none md:p-6"
              style={{
                borderRadius: 32,
                background: active ? "rgba(230,57,70,0.06)" : "rgba(255,255,255,0.03)",
                border: active
                  ? `1px solid ${RED}`
                  : isPopular
                  ? `1px solid ${RED}66`
                  : `1px solid ${SILVER}26`,
                boxShadow: active
                  ? `0 0 40px ${RED}55, 0 0 80px ${RED}26`
                  : isPopular
                  ? `0 0 32px ${RED}1f`
                  : "none",
                transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)",
              }}
            >
              {isPopular && (
                <span
                  className="absolute left-1/2 -translate-x-1/2 -top-3 inline-flex items-center gap-1.5 px-3 py-1"
                  style={{
                    background: RED,
                    color: "#fff",
                    borderRadius: 32,
                    fontFamily: "var(--font-syncopate), sans-serif",
                    fontSize: 9,
                    fontWeight: 700,
                    letterSpacing: "2.5px",
                    textTransform: "uppercase",
                    boxShadow: `0 0 20px ${RED}80`,
                    whiteSpace: "nowrap",
                  }}
                >
                  <Sparkles size={10} strokeWidth={2.5} aria-hidden="true" />
                  Most Popular
                </span>
              )}

              {/* Header */}
              <header className="mb-4">
                <span
                  style={{
                    display: "block",
                    fontFamily: "var(--font-syncopate), sans-serif",
                    fontSize: 12,
                    fontWeight: 700,
                    letterSpacing: "4px",
                    textTransform: "uppercase",
                    color: active ? RED : SILVER,
                  }}
                >
                  {p.name}
                </span>
                <span
                  style={{
                    display: "block",
                    fontFamily: "var(--font-inter), sans-serif",
                    fontSize: 12,
                    color: "rgba(160,160,160,0.85)",
                    marginTop: 4,
                  }}
                >
                  {p.description}
                </span>
              </header>

              {/* Price */}
              <span
                style={{
                  display: "inline-block",
                  fontFamily: "var(--font-syncopate), sans-serif",
                  fontSize: 36,
                  fontWeight: 700,
                  letterSpacing: "1px",
                  lineHeight: 1,
                  marginBottom: 16,
                  ...(active
                    ? {
                        color: "#FFFFFF",
                        textShadow: `0 2px 16px ${RED}aa`,
                      }
                    : {
                        background: isPopular
                          ? "linear-gradient(180deg,#FFFFFF 0%,#E63946 60%,#8A1F26 100%)"
                          : "linear-gradient(180deg,#FFFFFF 0%,#C0C0C0 50%,#8A8A8A 100%)",
                        WebkitBackgroundClip: "text",
                        backgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                      }),
                }}
              >
                ${price}
              </span>

              {/* Duration badge */}
              <span
                className="mb-5 inline-flex items-center gap-2 self-start px-3 py-1.5"
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
                <Clock size={11} strokeWidth={2} style={{ color: RED }} aria-hidden="true" />
                {PACKAGE_DURATION_LABEL[p.id]}
              </span>

              {/* Feature list */}
              <ul className="flex flex-col gap-2.5">
                {features.map((f) => (
                  <li
                    key={f}
                    className="flex items-start gap-2.5"
                    style={{
                      fontFamily: "var(--font-inter), sans-serif",
                      fontSize: 13,
                      color: "rgba(192,192,192,0.92)",
                      lineHeight: 1.5,
                    }}
                  >
                    <span
                      aria-hidden="true"
                      className="mt-0.5 inline-flex h-4 w-4 flex-shrink-0 items-center justify-center"
                      style={{
                        borderRadius: 999,
                        background: `${RED}1f`,
                        border: `1px solid ${RED}55`,
                      }}
                    >
                      <Check size={10} strokeWidth={3} style={{ color: RED }} />
                    </span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              {/* Selected confirm pill */}
              {active && (
                <span
                  className="mt-5 inline-flex items-center justify-center gap-2 px-4 py-2 self-start"
                  style={{
                    background: RED,
                    color: "#fff",
                    borderRadius: 32,
                    fontFamily: "var(--font-syncopate), sans-serif",
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: "3px",
                    textTransform: "uppercase",
                  }}
                >
                  <Check size={11} strokeWidth={3} aria-hidden="true" />
                  Selected
                </span>
              )}
            </button>
          );
        })}
      </div>
    </>
  );
}

function AddonsStep({ state, set }: { state: State; set: (p: Partial<State>) => void }) {
  const toggle = (id: AddonId) => {
    set({
      addons: state.addons.includes(id)
        ? state.addons.filter((a) => a !== id)
        : [...state.addons, id],
    });
  };
  return (
    <>
      <StepHeader kicker="Step 03 · Optional" title="Tailor Your Session" />
      <div className="bk-addon-track grid gap-3 overflow-x-auto pb-2 snap-x snap-mandatory -mx-6 px-6 [grid-auto-flow:column] [grid-template-rows:repeat(3,auto)] [grid-auto-columns:100%] md:[grid-auto-flow:row] md:grid-cols-2 md:[grid-template-rows:none] md:[grid-auto-columns:auto] md:overflow-visible md:snap-none md:mx-0 md:px-0 md:pb-0 no-scrollbar">
        {ADDONS.map((a) => {
          const active = state.addons.includes(a.id);
          return (
            <button
              key={a.id}
              type="button"
              onClick={() => toggle(a.id)}
              aria-pressed={active}
              className="addon-tile flex w-full min-w-0 snap-start items-start gap-3 p-3 text-left md:w-auto md:gap-4 md:p-5"
              style={{
                borderRadius: 20,
                background: active ? "rgba(230,57,70,0.06)" : "rgba(255,255,255,0.03)",
                border: `1px solid ${active ? RED : `${SILVER}26`}`,
                transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)",
              }}
            >
              <span
                aria-hidden="true"
                className="mt-1 flex h-5 w-5 flex-shrink-0 items-center justify-center"
                style={{
                  borderRadius: 6,
                  background: active ? RED : "rgba(255,255,255,0.05)",
                  border: `1px solid ${active ? RED : `${SILVER}40`}`,
                }}
              >
                {active && <Check size={12} strokeWidth={3} color="#fff" />}
              </span>
              <div className="flex-1">
                <div className="flex items-center justify-between gap-3">
                  <span
                    style={{
                      fontFamily: "var(--font-syncopate), sans-serif",
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: "2px",
                      textTransform: "uppercase",
                      color: SILVER,
                    }}
                  >
                    {a.label}
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--font-syncopate), sans-serif",
                      fontSize: 13,
                      fontWeight: 700,
                      color: RED,
                    }}
                  >
                    +${a.price}
                  </span>
                </div>
                <p
                  style={{
                    marginTop: 4,
                    fontFamily: "var(--font-inter), sans-serif",
                    fontSize: 12,
                    color: "rgba(192,192,192,0.7)",
                    lineHeight: 1.5,
                  }}
                >
                  {a.desc}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </>
  );
}

function ScheduleStep({
  state,
  set,
  errors,
}: {
  state: State;
  set: (p: Partial<State>) => void;
  errors: StepErrors;
}) {
  const [showSugg, setShowSugg] = useState(false);
  const filtered = useMemo(
    () =>
      ADDRESS_SUGGESTIONS.filter((s) =>
        s.toLowerCase().includes(state.address.toLowerCase())
      ),
    [state.address]
  );

  // Build next 14 days
  const days = useMemo(() => {
    const out: { iso: string; day: number; weekday: string; month: string }[] = [];
    const today = new Date();
    for (let i = 0; i < 14; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      out.push({
        iso: d.toISOString().slice(0, 10),
        day: d.getDate(),
        weekday: d.toLocaleDateString(undefined, { weekday: "short" }),
        month: d.toLocaleDateString(undefined, { month: "short" }),
      });
    }
    return out;
  }, []);

  return (
    <>
      <StepHeader kicker="Step 04" title="Logistics & Scheduling" />

      <div className="relative">
        <Label>Service Address</Label>
        <div className="relative">
          <MapPin
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
            type="text"
            placeholder="Start typing your address..."
            value={state.address}
            onChange={(e) => {
              set({ address: e.target.value });
              setShowSugg(true);
            }}
            onFocus={() => setShowSugg(true)}
            onBlur={() => setTimeout(() => setShowSugg(false), 150)}
            style={{
              ...inputStyle(),
              paddingLeft: 44,
              borderColor: errors.address ? RED : `${SILVER}26`,
            }}
            className="bk-input"
            autoComplete="off"
            aria-autocomplete="list"
            aria-invalid={!!errors.address}
          />
        </div>
        <ErrorMsg show={!!errors.address} />
        {showSugg && state.address && filtered.length > 0 && (
          <ul
            role="listbox"
            className="absolute left-0 right-0 z-10 mt-2 max-h-56 overflow-y-auto p-2"
            style={{
              background: "rgba(15,15,15,0.95)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: `1px solid ${SILVER}33`,
              borderRadius: 20,
              boxShadow: "0 16px 48px rgba(0,0,0,0.6)",
            }}
          >
            {filtered.map((s) => (
              <li key={s} role="option" aria-selected={state.address === s}>
                <button
                  type="button"
                  onMouseDown={() => {
                    set({ address: s });
                    setShowSugg(false);
                  }}
                  className="w-full px-3 py-2.5 text-left"
                  style={{
                    borderRadius: 12,
                    background: "transparent",
                    color: SILVER,
                    fontFamily: "var(--font-inter), sans-serif",
                    fontSize: 13,
                    transition: "background 0.2s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(230,57,70,0.08)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  <MapPin size={12} style={{ display: "inline", marginRight: 8, color: RED }} aria-hidden="true" />
                  {s}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-7">
        <Label>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
            <CalendarIcon size={11} aria-hidden="true" /> Choose a Date
          </span>
        </Label>
        <div
          className="flex gap-2 overflow-x-auto pb-2"
          style={{
            scrollbarWidth: "none",
            padding: errors.date ? 4 : 0,
            borderRadius: 24,
            border: errors.date ? `1px solid ${RED}66` : "1px solid transparent",
            transition: "border-color 0.3s cubic-bezier(0.22,1,0.36,1)",
          }}
        >
          {days.map((d) => {
            const active = state.date === d.iso;
            return (
              <button
                key={d.iso}
                type="button"
                onClick={() => set({ date: d.iso })}
                aria-pressed={active}
                className="flex flex-shrink-0 flex-col items-center px-4 py-3"
                style={{
                  minWidth: 64,
                  borderRadius: 20,
                  background: active ? RED : "rgba(255,255,255,0.03)",
                  border: `1px solid ${active ? RED : `${SILVER}26`}`,
                  color: active ? "#fff" : SILVER,
                  transition: "all 0.3s",
                }}
              >
                <span style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 10, opacity: 0.75, textTransform: "uppercase", letterSpacing: "1px" }}>
                  {d.weekday}
                </span>
                <span style={{ fontFamily: "var(--font-syncopate), sans-serif", fontSize: 18, fontWeight: 700, marginTop: 4 }}>
                  {d.day}
                </span>
                <span style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 9, opacity: 0.7, textTransform: "uppercase", letterSpacing: "1px" }}>
                  {d.month}
                </span>
              </button>
            );
          })}
        </div>
        <ErrorMsg show={!!errors.date} />
      </div>

      <div className="mt-6">
        <Label>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
            <Clock size={11} aria-hidden="true" /> Time Slot
          </span>
        </Label>
        <div
          className="grid grid-cols-3 gap-2 md:grid-cols-6"
          style={{
            padding: errors.time ? 4 : 0,
            borderRadius: 20,
            border: errors.time ? `1px solid ${RED}66` : "1px solid transparent",
            transition: "border-color 0.3s cubic-bezier(0.22,1,0.36,1)",
          }}
        >
          {TIME_SLOTS.map((t) => {
            const active = state.time === t;
            return (
              <button
                key={t}
                type="button"
                onClick={() => set({ time: t })}
                aria-pressed={active}
                className="py-3 text-center"
                style={{
                  borderRadius: 16,
                  background: active ? RED : "rgba(255,255,255,0.03)",
                  border: `1px solid ${active ? RED : `${SILVER}26`}`,
                  color: active ? "#fff" : SILVER,
                  fontFamily: "var(--font-inter), sans-serif",
                  fontSize: 13,
                  letterSpacing: "1px",
                  transition: "all 0.3s",
                }}
              >
                {t}
              </button>
            );
          })}
        </div>
        <ErrorMsg show={!!errors.time} />
      </div>
    </>
  );
}

function ConfirmStep({
  state,
  set,
  total,
  duration,
  errors,
}: {
  state: State;
  set: (p: Partial<State>) => void;
  total: number;
  duration: number;
  errors: StepErrors;
}) {
  const pkg = PACKAGES.find((p) => p.id === state.packageId);
  const addons = ADDONS.filter((a) => state.addons.includes(a.id));

  return (
    <>
      <StepHeader kicker="Step 05" title="Final Contact & Confirmation" />
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Label>Full Name</Label>
          <div className="relative">
            <User size={14} aria-hidden="true" style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", color: SILVER }} />
            <input
              type="text"
              value={state.name}
              onChange={(e) => set({ name: e.target.value })}
              placeholder="Mark Harrison"
              style={{ ...inputStyle(), paddingLeft: 42, borderColor: errors.name ? RED : `${SILVER}26` }}
              className="bk-input"
              required
            />
          </div>
          {errors.name && <p style={{ fontSize: 11, color: RED, marginTop: 6, fontFamily: "var(--font-inter)" }}>Required</p>}
        </div>
        <div>
          <Label>Email</Label>
          <div className="relative">
            <Mail size={14} aria-hidden="true" style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", color: SILVER }} />
            <input
              type="email"
              value={state.email}
              onChange={(e) => set({ email: e.target.value })}
              placeholder="you@domain.com"
              style={{ ...inputStyle(), paddingLeft: 42, borderColor: errors.email ? RED : `${SILVER}26` }}
              className="bk-input"
              required
            />
          </div>
          {errors.email && <p style={{ fontSize: 11, color: RED, marginTop: 6, fontFamily: "var(--font-inter)" }}>Valid email required</p>}
        </div>
        <div className="md:col-span-2">
          <Label>Phone</Label>
          <div className="relative">
            <Phone size={14} aria-hidden="true" style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", color: SILVER }} />
            <input
              type="tel"
              value={state.phone}
              onChange={(e) => set({ phone: e.target.value })}
              placeholder="+1 (555) 000-0000"
              style={{ ...inputStyle(), paddingLeft: 42, borderColor: errors.phone ? RED : `${SILVER}26` }}
              className="bk-input"
              required
            />
          </div>
          {errors.phone && <p style={{ fontSize: 11, color: RED, marginTop: 6, fontFamily: "var(--font-inter)" }}>Required</p>}
        </div>
      </div>

      <div
        className="mt-7 p-6"
        style={{
          borderRadius: 24,
          background: "rgba(255,255,255,0.02)",
          border: `1px solid ${SILVER}26`,
        }}
      >
        <h4
          style={{
            fontFamily: "var(--font-syncopate), sans-serif",
            fontSize: 11,
            letterSpacing: "4px",
            textTransform: "uppercase",
            color: RED,
            marginBottom: 14,
          }}
        >
          Order Summary
        </h4>
        <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 10, fontFamily: "var(--font-inter)", fontSize: 13, color: SILVER }}>
          {state.vehicleType && (
            <li className="flex justify-between">
              <span>{VEHICLE_LABEL[state.vehicleType]} {state.brand && `· ${state.brand}`} {state.model && state.model}</span>
              <span style={{ color: "rgba(192,192,192,0.7)" }}>+${VEHICLE_MULTIPLIER[state.vehicleType]}</span>
            </li>
          )}
          {pkg && (
            <li className="flex justify-between">
              <span>{pkg.name} Package</span>
              <span>${pkg.basePrice}</span>
            </li>
          )}
          {addons.map((a) => (
            <li key={a.id} className="flex justify-between">
              <span>{a.label}</span>
              <span>+${a.price}</span>
            </li>
          ))}
          {state.date && state.time && (
            <li className="flex justify-between" style={{ color: "rgba(192,192,192,0.7)" }}>
              <span>{state.date} at {state.time}</span>
              <span>{duration.toFixed(1)} hrs</span>
            </li>
          )}
          {state.address && (
            <li style={{ color: "rgba(192,192,192,0.7)", fontSize: 12 }}>{state.address}</li>
          )}
        </ul>
        <div
          className="mt-4 flex items-baseline justify-between border-t pt-4"
          style={{ borderColor: `${SILVER}1f` }}
        >
          <span style={{ fontFamily: "var(--font-syncopate)", fontSize: 12, letterSpacing: "3px", color: SILVER, textTransform: "uppercase" }}>Total</span>
          <span style={{ fontFamily: "var(--font-syncopate)", fontSize: 28, fontWeight: 700, color: RED }}>${total}</span>
        </div>
      </div>
    </>
  );
}

function SuccessOverlay({
  state,
  total,
  bookingRef,
  onClose,
}: {
  state: State;
  total: number;
  bookingRef: string | null;
  onClose: () => void;
}) {
  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label="Booking confirmed"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[10000] flex items-center justify-center px-6"
      style={{ background: "rgba(10,10,10,0.95)", backdropFilter: "blur(45px)" }}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 22 }}
        className="w-full max-w-lg p-10 text-center"
        style={{
          borderRadius: 32,
          background: "rgba(255,255,255,0.03)",
          border: `1px solid ${RED}66`,
          boxShadow: `0 0 80px ${RED}44`,
        }}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 280, damping: 18, delay: 0.1 }}
          className="mx-auto mb-6 flex h-20 w-20 items-center justify-center"
          style={{
            borderRadius: "50%",
            background: RED,
            boxShadow: `0 0 40px ${RED}aa`,
          }}
        >
          <PartyPopper size={36} color="#fff" strokeWidth={2} aria-hidden="true" />
        </motion.div>
        <h3
          style={{
            fontFamily: "var(--font-syncopate)",
            fontSize: 22,
            fontWeight: 700,
            letterSpacing: "5px",
            textTransform: "uppercase",
            color: SILVER,
            marginBottom: 12,
          }}
        >
          Booking Confirmed
        </h3>
        <p style={{ fontFamily: "var(--font-inter)", fontSize: 14, color: "rgba(192,192,192,0.85)", lineHeight: 1.6, marginBottom: 24 }}>
          Confirmation sent to <span style={{ color: SILVER }}>{state.email}</span>. Your concierge will call to confirm details within 30 minutes.
        </p>
        <p style={{ fontFamily: "var(--font-syncopate)", fontSize: 14, letterSpacing: "3px", color: RED, marginBottom: 12 }}>
          ${total} · {state.date} · {state.time}
        </p>
        {bookingRef && (
          <p
            style={{
              fontFamily: "var(--font-inter)",
              fontSize: 11,
              letterSpacing: "1px",
              color: "rgba(192,192,192,0.55)",
              marginBottom: 28,
            }}
          >
            Reference:{" "}
            <span style={{ fontFamily: "var(--font-syncopate)", color: SILVER, letterSpacing: "2px" }}>
              {bookingRef}
            </span>
          </p>
        )}
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <a
            href="#"
            className="inline-flex items-center justify-center gap-2 px-5 py-3"
            style={{
              borderRadius: 32,
              background: "rgba(255,255,255,0.05)",
              border: `1px solid ${SILVER}40`,
              color: SILVER,
              fontFamily: "var(--font-syncopate)",
              fontSize: 11,
              letterSpacing: "3px",
              textTransform: "uppercase",
            }}
          >
            <CalendarPlus size={14} aria-hidden="true" />
            Add to Calendar
          </a>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center justify-center px-5 py-3"
            style={{
              borderRadius: 32,
              background: RED,
              color: "#fff",
              fontFamily: "var(--font-syncopate)",
              fontSize: 11,
              letterSpacing: "3px",
              textTransform: "uppercase",
            }}
          >
            Done
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Booking() {
  const reduced = useReducedMotion();
  const { prefilledPackage, prefillVersion, clearPrefill } = useBooking();
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [state, setStateRaw] = useState<State>(initialState);
  const [confirmed, setConfirmed] = useState(false);
  const [showErrors, setShowErrors] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [bookingRef, setBookingRef] = useState<string | null>(null);
  const honeypotRef = useRef<HTMLInputElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const set = (p: Partial<State>) => setStateRaw((s) => ({ ...s, ...p }));

  // Pre-selection from Service section: apply package, but stay on current step.
  // User must still complete Step 1, 3, 4, 5 manually. If they're past Step 2,
  // re-selecting from Services updates the package without rewinding.
  useEffect(() => {
    if (!prefilledPackage) return;
    setStateRaw((s) => ({ ...s, packageId: prefilledPackage }));
    clearPrefill();
  }, [prefilledPackage, prefillVersion, clearPrefill]);

  const { total, duration } = useMemo(() => computeTotal(state), [state]);

  const canAdvance = useMemo(() => {
    if (step === 0) return !!state.vehicleType && state.brand.trim() && state.model.trim();
    if (step === 1) return !!state.packageId;
    if (step === 2) return true;
    if (step === 3) return state.address.trim() && state.date && state.time;
    if (step === 4) {
      const emailOk = /^\S+@\S+\.\S+$/.test(state.email);
      return state.name.trim() && emailOk && state.phone.trim().length >= 7;
    }
    return false;
  }, [step, state]);

  const errors = useMemo<StepErrors>(() => {
    if (!showErrors) return {};
    if (step === 0) {
      return {
        vehicleType: !state.vehicleType,
        brand: !state.brand.trim(),
        model: !state.model.trim(),
      };
    }
    if (step === 3) {
      return {
        address: !state.address.trim(),
        date: !state.date,
        time: !state.time,
      };
    }
    if (step === 4) {
      return {
        name: !state.name.trim(),
        email: !/^\S+@\S+\.\S+$/.test(state.email),
        phone: state.phone.trim().length < 7,
      };
    }
    return {};
  }, [showErrors, step, state]);

  const submitBooking = async () => {
    setSubmitting(true);
    setSubmitError(null);
    try {
      const payload = {
        vehicleType: state.vehicleType,
        brand: state.brand.trim(),
        model: state.model.trim(),
        packageId: state.packageId,
        addons: state.addons,
        address: state.address.trim(),
        date: state.date,
        time: state.time,
        name: state.name.trim(),
        email: state.email.trim(),
        phone: state.phone.trim(),
        total,
        duration,
        website: honeypotRef.current?.value ?? "",
      };
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
        ref?: string;
      };
      if (!res.ok || !data.ok) {
        throw new Error(data.error ?? `Server returned ${res.status}`);
      }
      setBookingRef(data.ref ?? null);
      setConfirmed(true);
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : "Could not send your booking. Try again or call us.";
      setSubmitError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const next = () => {
    if (submitting) return;
    if (!canAdvance) {
      setShowErrors(true);
      return;
    }
    setShowErrors(false);
    if (step === STEPS.length - 1) {
      void submitBooking();
      return;
    }
    setDirection(1);
    setStep((s) => Math.min(STEPS.length - 1, s + 1));
  };

  const back = () => {
    setShowErrors(false);
    setDirection(-1);
    setStep((s) => Math.max(0, s - 1));
  };

  // Reset errors when step changes (covers any path)
  useEffect(() => {
    setShowErrors(false);
  }, [step]);

  // Skip first mount — only scroll into view when user actually advances/back-navigates.
  // Without this guard the page jumps to the booking section on initial page load.
  const initialMountRef = useRef(true);
  useEffect(() => {
    if (initialMountRef.current) {
      initialMountRef.current = false;
      return;
    }
    containerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [step]);

  const slideVariants = {
    enter: (dir: 1 | -1) => ({ x: dir * 60, opacity: 0, filter: "blur(8px)" }),
    center: { x: 0, opacity: 1, filter: "blur(0px)" },
    exit: (dir: 1 | -1) => ({ x: dir * -60, opacity: 0, filter: "blur(8px)" }),
  };

  const progressPct = ((step + 1) / STEPS.length) * 100;
  const summary = useMemo(() => {
    const parts: string[] = [];
    if (state.packageId) parts.push(PACKAGES.find((p) => p.id === state.packageId)!.name);
    if (state.vehicleType) parts.push(VEHICLE_LABEL[state.vehicleType]);
    if (state.addons.length) parts.push(`+${state.addons.length} add-on${state.addons.length > 1 ? "s" : ""}`);
    return parts.join(" · ") || "Configure your booking";
  }, [state]);

  return (
    <LazyMotion features={domAnimation}>
      <section
        id="booking"
        aria-labelledby="booking-heading"
        className="relative overflow-hidden py-12 md:py-32"
        style={{ background: "#0A0A0A" }}
      >
        {/* Mesh */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(50% 40% at 50% 20%, rgba(230,57,70,0.08) 0%, rgba(230,57,70,0) 70%)",
          }}
        />

        <div ref={containerRef} className="relative mx-auto w-full max-w-[920px] px-4 md:px-6">
          <header className="mb-5 text-center md:mb-10">
            <h2
              id="booking-heading"
              style={{
                fontFamily: "var(--font-syncopate), sans-serif",
                fontWeight: 700,
                fontSize: "clamp(1.25rem,4.5vw,3rem)",
                letterSpacing: "4px",
                textTransform: "uppercase",
                background: "linear-gradient(180deg,#FFFFFF 0%,#C0C0C0 50%,#8A8A8A 100%)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              Book Your Shine
            </h2>
            <p
              className="hidden md:block"
              style={{
                fontFamily: "var(--font-inter), sans-serif",
                color: "rgba(160,160,160,0.9)",
                fontSize: 16,
                marginTop: 12,
              }}
            >
              Five-step concierge booking. No hidden fees.
            </p>
          </header>

          <div
            className="relative"
            style={{
              borderRadius: 32,
              background: "rgba(255,255,255,0.03)",
              border: `1px solid ${SILVER}33`,
              backdropFilter: "blur(25px)",
              WebkitBackdropFilter: "blur(25px)",
              overflow: "hidden",
              boxShadow: "0 24px 64px rgba(0,0,0,0.5)",
            }}
          >
            {/* Progress bar */}
            <div className="relative h-[3px] w-full" style={{ background: "rgba(255,255,255,0.05)" }}>
              <motion.div
                animate={{ width: `${progressPct}%` }}
                transition={{ type: "spring", stiffness: 140, damping: 22 }}
                className="absolute left-0 top-0 h-full"
                style={{ background: RED, boxShadow: `0 0 16px ${RED}` }}
              />
            </div>

            {/* Step indicators */}
            <div className="flex items-center justify-between px-4 pt-3 md:px-10 md:pt-5">
              <div className="flex items-center gap-2">
                {STEPS.map((label, i) => (
                  <div key={label} className="flex items-center gap-2">
                    <span
                      aria-current={i === step ? "step" : undefined}
                      className="flex h-6 w-6 items-center justify-center"
                      style={{
                        borderRadius: "50%",
                        background: i <= step ? RED : "transparent",
                        border: `1px solid ${i <= step ? RED : `${SILVER}40`}`,
                        color: i <= step ? "#fff" : `${SILVER}80`,
                        fontFamily: "var(--font-syncopate)",
                        fontSize: 9,
                        fontWeight: 700,
                      }}
                    >
                      {i < step ? <Check size={11} strokeWidth={3} /> : i + 1}
                    </span>
                    {i < STEPS.length - 1 && (
                      <span
                        aria-hidden="true"
                        className="hidden h-px w-6 md:inline-block"
                        style={{ background: i < step ? RED : `${SILVER}26` }}
                      />
                    )}
                  </div>
                ))}
              </div>
              {step > 0 && !confirmed && (
                <button
                  type="button"
                  onClick={back}
                  className="inline-flex items-center gap-1.5"
                  style={{
                    fontFamily: "var(--font-syncopate)",
                    fontSize: 10,
                    letterSpacing: "3px",
                    textTransform: "uppercase",
                    color: "rgba(192,192,192,0.7)",
                    transition: "color 0.2s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = SILVER)}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(192,192,192,0.7)")}
                >
                  <ChevronLeft size={14} aria-hidden="true" />
                  Back
                </button>
              )}
            </div>

            {/* Steps body */}
            <div className="relative px-5 py-5 md:px-10 md:py-10 md:min-h-[460px]">
              <AnimatePresence custom={direction} initial={false} mode="wait">
                <motion.div
                  key={step}
                  custom={direction}
                  variants={reduced ? undefined : slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                >
                  {step === 0 && <VehicleStep state={state} set={set} errors={errors} />}
                  {step === 1 && <PackageStep state={state} set={set} />}
                  {step === 2 && <AddonsStep state={state} set={set} />}
                  {step === 3 && <ScheduleStep state={state} set={set} errors={errors} />}
                  {step === 4 && (
                    <ConfirmStep state={state} set={set} total={total} duration={duration} errors={errors} />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Sticky bottom bar — mobile compact, desktop full */}
            <div
              className="flex flex-row items-center justify-between gap-3 border-t px-4 py-3 md:gap-4 md:px-8 md:py-5"
              style={{ borderColor: `${SILVER}1f`, background: "rgba(0,0,0,0.4)" }}
            >
              <div className="hidden flex-col gap-1 md:flex">
                <span style={{ fontFamily: "var(--font-syncopate)", fontSize: 9, letterSpacing: "3px", color: "rgba(192,192,192,0.6)", textTransform: "uppercase" }}>
                  Selection
                </span>
                <span style={{ fontFamily: "var(--font-inter)", fontSize: 13, color: SILVER }}>
                  {summary}
                </span>
              </div>
              <div className="flex flex-1 items-center justify-between gap-3 md:flex-none md:gap-8">
                <div className="flex flex-col items-start md:items-end">
                  <span style={{ fontFamily: "var(--font-syncopate)", fontSize: 9, letterSpacing: "3px", color: "rgba(192,192,192,0.6)", textTransform: "uppercase" }}>
                    Estimate
                  </span>
                  <span style={{ fontFamily: "var(--font-syncopate)", fontSize: 20, fontWeight: 700, color: RED, lineHeight: 1.1 }} className="md:text-[22px]">
                    ${total}
                  </span>
                  {duration > 0 && (
                    <span style={{ fontFamily: "var(--font-inter)", fontSize: 10, color: "rgba(192,192,192,0.6)" }} className="md:text-[11px]">
                      ~{duration.toFixed(1)} hrs
                    </span>
                  )}
                </div>

                {step === 2 && (
                  <button
                    type="button"
                    onClick={() => {
                      set({ addons: [] });
                      setDirection(1);
                      setStep(3);
                    }}
                    className="hidden md:inline-flex"
                    style={{
                      fontFamily: "var(--font-inter)",
                      fontSize: 12,
                      color: "rgba(192,192,192,0.6)",
                      textDecoration: "underline",
                      textUnderlineOffset: 4,
                    }}
                  >
                    Skip these add-ons
                  </button>
                )}

                <button
                  type="button"
                  onClick={next}
                  disabled={submitting}
                  aria-busy={submitting}
                  aria-label={
                    step === 0
                      ? "Next step"
                      : step === 1
                      ? "Next step"
                      : step === 2
                      ? "Next step"
                      : step === 3
                      ? "Next final step"
                      : submitting
                      ? "Sending reservation"
                      : "Reserve your appointment"
                  }
                  className="next-btn inline-flex items-center gap-2 px-6 py-3"
                  style={{
                    background: RED,
                    color: "#fff",
                    border: "1px solid transparent",
                    borderRadius: 32,
                    fontFamily: "var(--font-syncopate)",
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: "3px",
                    textTransform: "uppercase",
                    cursor: submitting ? "wait" : "pointer",
                    opacity: submitting ? 0.7 : 1,
                    transition: "transform 0.3s cubic-bezier(0.4,0,0.2,1), box-shadow 0.3s cubic-bezier(0.4,0,0.2,1), background 0.3s, opacity 0.3s",
                    minHeight: 44,
                  }}
                >
                  {step === 0 && "Next"}
                  {step === 1 && "Next"}
                  {step === 2 && "Next"}
                  {step === 3 && "Next Final Step"}
                  {step === 4 && (submitting ? "Sending…" : "Reserve Your Appointment")}
                  {submitting ? (
                    <span
                      aria-hidden="true"
                      className="next-spinner"
                      style={{
                        width: 14,
                        height: 14,
                        borderRadius: "50%",
                        border: "2px solid rgba(255,255,255,0.4)",
                        borderTopColor: "#fff",
                      }}
                    />
                  ) : (
                    <ChevronRight size={14} aria-hidden="true" />
                  )}
                </button>
              </div>
            </div>
            {/* Submit error banner — only on step 5 */}
            <AnimatePresence>
              {step === 4 && submitError && (
                <motion.div
                  role="alert"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  style={{
                    overflow: "hidden",
                    borderTop: `1px solid ${RED}40`,
                    background: "rgba(230,57,70,0.08)",
                  }}
                >
                  <div
                    style={{
                      padding: "12px 24px",
                      fontFamily: "var(--font-inter), sans-serif",
                      fontSize: 13,
                      color: "#fff",
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                    }}
                  >
                    <span
                      aria-hidden="true"
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        background: RED,
                        boxShadow: `0 0 12px ${RED}`,
                        flexShrink: 0,
                      }}
                    />
                    <span style={{ flex: 1 }}>{submitError}</span>
                    <button
                      type="button"
                      onClick={() => setSubmitError(null)}
                      aria-label="Dismiss error"
                      style={{
                        background: "transparent",
                        border: 0,
                        color: SILVER,
                        fontFamily: "var(--font-syncopate)",
                        fontSize: 10,
                        letterSpacing: "2px",
                        textTransform: "uppercase",
                        cursor: "pointer",
                      }}
                    >
                      Dismiss
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          {/* Honeypot — visually hidden, bots fill, humans don't */}
          <input
            ref={honeypotRef}
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            style={{
              position: "absolute",
              left: "-9999px",
              top: "auto",
              width: 1,
              height: 1,
              overflow: "hidden",
            }}
          />
        </div>

        <AnimatePresence>
          {confirmed && (
            <SuccessOverlay
              state={state}
              total={total}
              bookingRef={bookingRef}
              onClose={() => {
                setConfirmed(false);
                setBookingRef(null);
                setSubmitError(null);
                setStateRaw(initialState);
                setStep(0);
              }}
            />
          )}
        </AnimatePresence>

        <style jsx>{`
          .bk-input:focus,
          .bk-input:focus-visible {
            border-color: ${RED} !important;
            background: rgba(230, 57, 70, 0.04) !important;
            outline: none;
          }
          .vehicle-tile:hover:not([aria-pressed="true"]),
          .pkg-tile:hover:not([aria-pressed="true"]),
          .addon-tile:hover:not([aria-pressed="true"]) {
            border-color: ${SILVER}66 !important;
            background: rgba(255, 255, 255, 0.05) !important;
          }
          .next-btn {
            animation: ctaPulse 2.4s ease-in-out infinite;
          }
          .next-btn:hover,
          .next-btn:focus-visible {
            box-shadow: 0 0 32px ${RED}cc, 0 0 64px ${RED}55;
            transform: translateY(-1px) scale(1.02);
            outline: none;
          }
          .next-btn:active {
            transform: translateY(0) scale(0.99);
          }
          @keyframes ctaPulse {
            0%, 100% { box-shadow: 0 0 0 0 ${RED}55; }
            50% { box-shadow: 0 0 24px ${RED}99; }
          }
          .next-spinner {
            animation: spin 0.7s linear infinite;
          }
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
          @media (prefers-reduced-motion: reduce) {
            .next-btn { animation: none !important; }
            .next-spinner { animation-duration: 1.4s !important; }
            .next-btn:hover { transform: none !important; }
          }
        `}</style>
      </section>
    </LazyMotion>
  );
}
