"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const NAV_SCROLL_RANGE = 100;
const NAV_MAX_TOP = 20;
const NAV_MAX_SIDE_PADDING_VW = 20;
const ROUTE_RESYNC_DELAYS = [0, 80, 180];

function getScrollProgress(): number {
  if (typeof window === "undefined") return 0;

  const scrollTop =
    window.scrollY ||
    document.documentElement.scrollTop ||
    document.body.scrollTop ||
    0;

  return Math.min(scrollTop / NAV_SCROLL_RANGE, 1);
}

function NavbarInner({ pathname }: { pathname: string }) {
  const isHome = pathname === "/";
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let raf = 0;
    const timers: number[] = [];

    const syncProgress = () => {
      const nextProgress = getScrollProgress();
      setProgress((currentProgress) =>
        Math.abs(currentProgress - nextProgress) < 0.01
          ? currentProgress
          : nextProgress
      );
    };

    const scheduleSync = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(syncProgress);
    };

    window.addEventListener("scroll", scheduleSync, { passive: true });
    window.addEventListener("resize", scheduleSync);
    window.addEventListener("pageshow", scheduleSync);

    scheduleSync();
    for (const delay of ROUTE_RESYNC_DELAYS) {
      timers.push(window.setTimeout(scheduleSync, delay));
    }

    return () => {
      window.removeEventListener("scroll", scheduleSync);
      window.removeEventListener("resize", scheduleSync);
      window.removeEventListener("pageshow", scheduleSync);
      cancelAnimationFrame(raf);
      for (const timer of timers) {
        window.clearTimeout(timer);
      }
    };
  }, []);

  const inverseProgress = 1 - progress;
  const navStyle = {
    top: `${NAV_MAX_TOP * inverseProgress}px`,
    paddingLeft: `${NAV_MAX_SIDE_PADDING_VW * inverseProgress}vw`,
    paddingRight: `${NAV_MAX_SIDE_PADDING_VW * inverseProgress}vw`,
  };
  const innerStyle = {
    borderRadius: `${9999 * inverseProgress}px`,
  };

  return (
    <nav
      className="fixed left-0 w-full z-50 transition-[top,padding-left,padding-right] duration-200 ease-out"
      style={navStyle}
    >
      <div
        className="glass-nav flex items-center justify-between px-5 py-3 transition-[border-radius] duration-200 ease-out"
        style={innerStyle}
      >
        <div className="text-base font-black tracking-tighter text-primary shrink-0">
          <Link href="/">Bubble Tea Espana</Link>
        </div>
        <div className="hidden md:flex gap-6 items-center text-xs font-semibold uppercase tracking-widest">
          <Link
            href={isHome ? "#ciudades" : "/#ciudades"}
            className="text-on-surface/50 hover:text-primary transition-colors"
          >
            Explorar ciudades
          </Link>
          <Link
            href={isHome ? "#ranking" : "/#ranking"}
            className="text-on-surface/50 hover:text-primary transition-colors"
          >
            Rankings
          </Link>
          <Link
            href={isHome ? "#editorial" : "/#editorial"}
            className="text-on-surface/50 hover:text-primary transition-colors"
          >
            Sobre nosotros
          </Link>
        </div>
        <button
          type="button"
          className="bg-primary text-on-primary px-5 py-2 rounded-full font-bold text-xs hover:scale-95 transition-all shrink-0"
        >
          Unete al club
        </button>
      </div>
    </nav>
  );
}

export default function Navbar() {
  const pathname = usePathname();

  return <NavbarInner key={pathname} pathname={pathname} />;
}
