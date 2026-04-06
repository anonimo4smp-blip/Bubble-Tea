"use client";

import Link from "next/link";
import Icon from "@/components/Icon";
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
  const [menuOpen, setMenuOpen] = useState(false);

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

  const navLinks = [
    { href: isHome ? "#ciudades" : "/#ciudades", label: "Explorar ciudades" },
    { href: isHome ? "#ranking" : "/#ranking", label: "Rankings" },
    { href: isHome ? "#editorial" : "/#editorial", label: "Sobre nosotros" },
  ];

  return (
    <nav
      aria-label="Navegación principal"
      className="fixed left-0 w-full z-50 transition-[top,padding-left,padding-right] duration-200 ease-out"
      style={navStyle}
    >
      <div
        className="glass-nav transition-[border-radius] duration-200 ease-out"
        style={innerStyle}
      >
        <div className="flex items-center justify-between px-5 py-3">
          <div className="text-base font-black tracking-tighter text-primary shrink-0">
            <Link href="/">Bubble Tea España</Link>
          </div>
          <div className="hidden md:flex gap-6 items-center text-xs font-semibold uppercase tracking-widest">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="text-on-surface/50 hover:text-primary transition-colors"
              >
                {label}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <Link
              href={isHome ? "#ranking" : "/#ranking"}
              className="btn btn-primary btn-xs shrink-0 hidden md:inline-flex"
            >
              Ver ranking
            </Link>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden flex items-center justify-center w-10 h-10 rounded-full text-on-surface/70 hover:text-primary transition-colors"
              aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
            >
              <Icon name={menuOpen ? "close" : "menu"} className="text-xl" />
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="md:hidden px-5 pb-4 flex flex-col gap-3">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMenuOpen(false)}
                className="text-sm font-semibold uppercase tracking-widest text-on-surface/70 hover:text-primary transition-colors py-2"
              >
                {label}
              </Link>
            ))}
            <Link
              href={isHome ? "#ranking" : "/#ranking"}
              onClick={() => setMenuOpen(false)}
              className="btn btn-primary btn-sm text-center"
            >
              Ver ranking
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}

export default function Navbar() {
  const pathname = usePathname();

  return <NavbarInner key={pathname} pathname={pathname} />;
}
