"use client";

import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";

export type ComparableShop = {
  id: number;
  name: string;
  slug: string;
  citySlug: string;
  neighborhood: string | null;
  averagePrice: number | null;
  editorSummary: string | null;
  totalScore: number | null;
  imageUrl: string | null;
  imageAlt: string | null;
  features: {
    veganOptions: boolean;
    wifi: boolean;
    studyFriendly: boolean;
    photoFriendly: boolean;
    petFriendly: boolean;
    takeaway: boolean;
    seating: boolean;
    lactoseFreeOptions: boolean;
    glutenFreeOptions: boolean;
    wheelchairAccessible: boolean;
  } | null;
};

type CompareContextValue = {
  selected: ComparableShop[];
  toggle: (shop: ComparableShop) => void;
  remove: (id: number) => void;
  clear: () => void;
  isSelected: (id: number) => boolean;
  drawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  triggerRef: RefObject<HTMLButtonElement | null>;
};

const MAX = 3;

const CompareContext = createContext<CompareContextValue | null>(null);

export function CompareProvider({ children }: { children: ReactNode }) {
  const [selected, setSelected] = useState<ComparableShop[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  const toggle = useCallback((shop: ComparableShop) => {
    setSelected((prev) => {
      const exists = prev.find((s) => s.id === shop.id);
      if (exists) return prev.filter((s) => s.id !== shop.id);
      if (prev.length >= MAX) return prev;
      return [...prev, shop];
    });
  }, []);

  const remove = useCallback((id: number) => {
    setSelected((prev) => prev.filter((s) => s.id !== id));
  }, []);

  const clear = useCallback(() => {
    setSelected([]);
    setDrawerOpen(false);
  }, []);

  const isSelected = useCallback(
    (id: number) => selected.some((s) => s.id === id),
    [selected]
  );

  const openDrawer = useCallback(() => setDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setDrawerOpen(false), []);

  return (
    <CompareContext.Provider
      value={{ selected, toggle, remove, clear, isSelected, drawerOpen, openDrawer, closeDrawer, triggerRef }}
    >
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  const ctx = useContext(CompareContext);
  if (!ctx) throw new Error("useCompare must be used within CompareProvider");
  return ctx;
}
