"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";

export type PackageId = "silver" | "gold" | "platinum";

type BookingContextValue = {
  prefilledPackage: PackageId | null;
  prefillVersion: number;
  selectPackage: (id: PackageId) => void;
  clearPrefill: () => void;
};

const Ctx = createContext<BookingContextValue | null>(null);

export function BookingProvider({ children }: { children: React.ReactNode }) {
  const [prefilledPackage, setPrefilledPackage] = useState<PackageId | null>(null);
  /**
   * `prefillVersion` increments on each `selectPackage` call so consumers can
   * react to *every* selection — including re-selecting the same package after
   * the user navigated away and changed it.
   */
  const [prefillVersion, setVersion] = useState(0);

  const selectPackage = useCallback((id: PackageId) => {
    setPrefilledPackage(id);
    setVersion((v) => v + 1);
    if (typeof document === "undefined") return;
    const el = document.getElementById("booking");
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
  }, []);

  const clearPrefill = useCallback(() => setPrefilledPackage(null), []);

  const value = useMemo<BookingContextValue>(
    () => ({ prefilledPackage, prefillVersion, selectPackage, clearPrefill }),
    [prefilledPackage, prefillVersion, selectPackage, clearPrefill],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useBooking(): BookingContextValue {
  const v = useContext(Ctx);
  if (!v) {
    // Safe fallback for SSR / unprovider'd render — no-op
    return {
      prefilledPackage: null,
      prefillVersion: 0,
      selectPackage: () => {},
      clearPrefill: () => {},
    };
  }
  return v;
}
