"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useState } from "react";
import { List, X } from "@phosphor-icons/react";

const links = [
  { href: "/", label: "Index" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Coaching" },
  { href: "/level-zero", label: "Level Zero" },
  { href: "/results", label: "Results" },
  { href: "/journal", label: "Journal" },
];

export function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b hairline bg-canvas/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-4 md:py-5">
        <Link
          href="/"
          className="flex items-center gap-2.5"
          onClick={() => setOpen(false)}
        >
          <span className="block h-2 w-2 rounded-full bg-ember animate-breathe" />
          <span className="font-display text-xl font-bold uppercase leading-none tracking-[0.02em] text-ink-900">
            Coached by Matt&nbsp;J
          </span>
          <span className="hidden font-mono text-[10px] uppercase tracking-[0.2em] text-ink-400 md:inline">
            /cbmj
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((link) => {
            const active =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-3.5 py-2 text-xs font-semibold uppercase tracking-[0.14em] transition ${
                  active ? "text-ink-900" : "text-ink-500 hover:text-ink-900"
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-x-2 -bottom-0.5 -z-10 h-0.5 rounded-full bg-ember-grad"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/apply"
            className="btn-ember group relative inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-xs font-bold uppercase tracking-[0.14em] md:px-5"
          >
            <span className="block h-1.5 w-1.5 rounded-full bg-white/90 animate-ember-pulse" />
            Apply
            <span className="font-mono text-[10px] text-white/70 transition group-hover:translate-x-0.5">
              →
            </span>
          </Link>
          <button
            type="button"
            aria-label="Toggle menu"
            onClick={() => setOpen((v) => !v)}
            className="rounded-full border hairline p-2 md:hidden"
          >
            {open ? <X size={18} weight="bold" /> : <List size={18} weight="bold" />}
          </button>
        </div>
      </div>

      {open && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 220, damping: 26 }}
          className="border-t hairline bg-canvas px-6 py-4 md:hidden"
        >
          <ul className="flex flex-col gap-1">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-2xl px-3 py-3 font-display text-lg font-semibold uppercase tracking-[0.06em] text-ink-800 hover:bg-ink-100"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </motion.div>
      )}
    </header>
  );
}
