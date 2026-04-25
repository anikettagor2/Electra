"use client";

import Link from "next/link";
import { Twitter, Instagram, Linkedin, Youtube, MapPin, Zap } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-white/5 bg-black py-16 text-zinc-400 font-sans">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          {/* Brand */}
          <div className="space-y-6">
            <Link href="/" className="block group">
                <div className="flex flex-col">
                    <span className="text-2xl font-black text-white tracking-tighter font-heading">ELECTRA<span className="text-primary italic">.</span></span>
                    <span className="text-[9px] uppercase tracking-[0.4em] text-zinc-600 font-bold font-mono">Sim Engine</span>
                </div>
            </Link>
            <p className="text-zinc-500 leading-relaxed text-sm max-w-xs">
              Engineering democratic projections for the next generation of strategists. Predictive modeling at the speed of thought.
            </p>
            <div className="flex space-x-3">
              <SocialIcon href="#" icon={<Twitter className="w-4 h-4" />} label="Twitter" />
              <SocialIcon href="#" icon={<Instagram className="w-4 h-4" />} label="Instagram" />
              <SocialIcon href="#" icon={<Linkedin className="w-4 h-4" />} label="LinkedIn" />
              <SocialIcon href="#" icon={<Youtube className="w-4 h-4" />} label="YouTube" />
            </div>
          </div>

          {/* Visit Us */}
          <div>
            <h3 className="text-white font-bold font-heading text-lg mb-6 tracking-tight uppercase">Base Of Operations</h3>
            <div className="flex items-start space-x-3 text-zinc-500 text-sm leading-relaxed">
              <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <p className="font-sans">
                Ballia, Uttar Pradesh <br />
                Pincode 277303 <br />
                <span className="text-zinc-700 italic">Remote First · Global Reach</span>
              </p>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white font-bold font-heading text-lg mb-6 tracking-tight uppercase">Operational Models</h3>
            <ul className="space-y-4">
              <FooterLink href="/simulate">National Simulation</FooterLink>
              <FooterLink href="/simulate">State Simulation</FooterLink>
              <FooterLink href="/simulate">Sentiment Analysis</FooterLink>
              <FooterLink href="/simulate">Rapid Prototyping</FooterLink>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-white font-bold font-heading text-lg mb-6 tracking-tight uppercase">The Engine</h3>
            <ul className="space-y-4">
              <FooterLink href="/about">About Us</FooterLink>
              <FooterLink href="/elections">Elections Journey</FooterLink>
              <FooterLink href="/simulate">Simulate</FooterLink>
              <FooterLink href="/login">Sync Login</FooterLink>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between text-xs font-mono">
          <div className="flex flex-col gap-1">
            <p>© 2026 ELECTRA SIM ENGINE. ALL RIGHTS RESERVED.</p>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-zinc-700 uppercase">System Status: Fully Operational</span>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-6">
            <span className="text-zinc-600 select-all">
              ID: SCRS_ARENA_A44 // TSTAMP: 2026.04.18
            </span>
            <Link href="/privacy" className="text-zinc-500 hover:text-white transition-colors">PRIVACY_PROT</Link>
            <Link href="/terms" className="text-zinc-500 hover:text-white transition-colors">TERMS_COND</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function SocialIcon({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <Link
      href={href}
      className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-zinc-500 hover:bg-primary hover:border-primary hover:text-white transition-all duration-300"
      aria-label={label}
    >
      {icon}
    </Link>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link href={href} className="text-sm hover:text-primary transition-colors flex items-center gap-2 group">
        <span className="w-1.5 h-px bg-zinc-800 group-hover:w-3 group-hover:bg-primary transition-all" />
        {children}
      </Link>
    </li>
  );
}
