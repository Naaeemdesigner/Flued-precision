import { z } from "zod";

const VEHICLE_TYPES = ["sedan", "suv", "truck", "exotic"] as const;
const PACKAGE_IDS = ["silver", "gold", "platinum"] as const;
const ADDON_IDS = ["pet", "headlight", "engine", "odor", "trim"] as const;

export const BookingPayload = z.object({
  vehicleType: z.enum(VEHICLE_TYPES),
  brand: z.string().trim().min(1).max(80),
  model: z.string().trim().min(1).max(80),
  packageId: z.enum(PACKAGE_IDS),
  addons: z.array(z.enum(ADDON_IDS)).max(5),
  address: z.string().trim().min(3).max(200),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "ISO date YYYY-MM-DD"),
  time: z.string().regex(/^\d{2}:\d{2}$/, "HH:MM"),
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(200),
  phone: z.string().trim().min(7).max(40),
  total: z.number().int().nonnegative().max(100000),
  duration: z.number().nonnegative().max(48),
  // Honeypot — bots fill, humans skip
  website: z.string().max(0).optional(),
});

export type BookingPayloadT = z.infer<typeof BookingPayload>;

export const VEHICLE_LABEL: Record<(typeof VEHICLE_TYPES)[number], string> = {
  sedan: "Sedan",
  suv: "SUV",
  truck: "Truck",
  exotic: "Exotic",
};

export const PACKAGE_LABEL: Record<(typeof PACKAGE_IDS)[number], string> = {
  silver: "Silver — Essential Refresh",
  gold: "Gold — Signature Detail",
  platinum: "Platinum — Ultimate Protection",
};

export const ADDON_LABEL: Record<(typeof ADDON_IDS)[number], { label: string; price: number }> = {
  pet: { label: "Pet Hair Removal", price: 50 },
  headlight: { label: "Headlight Restoration", price: 80 },
  engine: { label: "Engine Bay Detail", price: 75 },
  odor: { label: "Odor Elimination", price: 60 },
  trim: { label: "Trim Restoration", price: 50 },
};
