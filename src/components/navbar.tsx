"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Terminal } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Journey", href: "/journey" },
    { name: "Elections", href: "/elections" },
    { name: "Simulate", href: "/simulate" },
    { name: "About", href: "/about" },
  ];

  return (
    <>
      {/* Floating Dark Navbar */}
      <div className="fixed top-6 left-0 right-0 z-[100] flex justify-center px-4 pointer-events-none">
        <motion.nav
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className={cn(
            "pointer-events-auto flex items-center gap-8 px-6 py-2.5 rounded-full border transition-all duration-500 w-full max-w-4xl backdrop-blur-xl",
            scrolled 
              ? "bg-zinc-950/80 border-white/10 shadow-[0_15px_30px_rgba(0,0,0,0.5)]" 
              : "bg-black/40 border-white/5"
          )}
        >
          {/* Logo Section */}
          <Link href="/" className="flex items-center gap-2 group flex-shrink-0">
              <div className="flex flex-col">
                  <span className="text-xl font-black text-white tracking-tighter font-heading leading-none">ELECTRA<span className="text-primary italic">.</span></span>
                  <span className="text-[7px] uppercase tracking-[0.4em] text-primary/80 font-mono font-bold">Sim Engine</span>
              </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8 flex-1 justify-center">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.href}
                className={cn(
                  "text-[11px] font-bold uppercase tracking-[0.2em] transition-all hover:text-primary font-mono",
                  pathname === link.href ? "text-primary" : "text-zinc-500"
                )}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <Link 
              href="/simulate" 
              className="hidden sm:flex items-center gap-2 px-5 py-2 rounded-full bg-white text-black text-[10px] font-bold uppercase tracking-widest hover:bg-zinc-200 transition-all font-mono"
            >
              <Terminal className="w-3 h-3" />
              Simulate
            </Link>

            <button 
              onClick={() => setIsOpen(true)}
              className="p-2 text-white md:hidden"
              aria-label="Open navigation menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </motion.nav>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            className="fixed inset-0 z-[110] bg-black p-8 flex flex-col font-heading"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation menu"
          >
            <div className="flex justify-between items-center mb-16">
              <span className="text-2xl font-black text-white">ELECTRA<span className="text-primary">.</span></span>
              <button 
                onClick={() => setIsOpen(false)} 
                className="p-2 text-white"
                aria-label="Close navigation menu"
              >
                <X className="w-8 h-8" />
              </button>
            </div>

            <div className="space-y-8 flex-grow">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="block text-5xl font-bold text-white hover:text-primary transition-colors tracking-tighter"
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            <div className="pb-12 pt-8 border-t border-white/10">
              <Link 
                href="/simulate"
                className="w-full py-5 rounded-2xl bg-primary text-white text-center font-bold text-lg inline-block"
                onClick={() => setIsOpen(false)}
              >
                Run Simulation
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
