"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const navRef = useRef<HTMLElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const isHome = pathname === "/";

  useEffect(() => {
    const nav = navRef.current;
    const inner = innerRef.current;
    if (!nav || !inner) return;

    let raf: number;
    const update = () => {
      const p = Math.min(window.scrollY / 100, 1);
      const inv = 1 - p;
      nav.style.top = `${20 * inv}px`;
      nav.style.paddingLeft = `${20 * inv}vw`;
      nav.style.paddingRight = `${20 * inv}vw`;
      inner.style.borderRadius = `${9999 * inv}px`;
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    update();

    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [pathname]);

  return (
    <nav ref={navRef} className="fixed left-0 w-full z-50">
      <div
        ref={innerRef}
        className="glass-nav flex items-center justify-between px-5 py-3"
      >
        <div className="text-base font-black tracking-tighter text-primary shrink-0">
          <a href="/">Bubble Tea España</a>
        </div>
        <div className="hidden md:flex gap-6 items-center text-xs font-semibold uppercase tracking-widest">
          <a
            href={isHome ? "#ciudades" : "/#ciudades"}
            className="text-on-surface/50 hover:text-primary transition-colors"
          >
            Explorar ciudades
          </a>
          <a
            href={isHome ? "#ranking" : "/#ranking"}
            className="text-on-surface/50 hover:text-primary transition-colors"
          >
            Rankings
          </a>
          <a
            href={isHome ? "#editorial" : "/#editorial"}
            className="text-on-surface/50 hover:text-primary transition-colors"
          >
            Sobre nosotros
          </a>
        </div>
        <button className="bg-primary text-on-primary px-5 py-2 rounded-full font-bold text-xs hover:scale-95 transition-all shrink-0">
          Únete al club
        </button>
      </div>
    </nav>
  );
}
