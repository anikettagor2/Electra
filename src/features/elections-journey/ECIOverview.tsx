"use client";

import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Scale, Eye, Zap, Lock, Globe } from "lucide-react";

const PILLARS = [
  {
    title: "Independence",
    text: "The ECI functions autonomously, free from executive influence, ensuring neutral oversight of every poll.",
    icon: ShieldCheck,
  },
  {
    title: "Model Code of Conduct",
    text: "Strict guidelines for parties and candidates to maintain a level playing field and prevent misuse of power.",
    icon: Scale,
  },
  {
    title: "Vigilance & Monitoring",
    text: "C-Vigil and other digital tools allow citizens to report violations in real-time for immediate action.",
    icon: Eye,
  },
  {
    title: "VVPAT Verification",
    text: "Every vote cast on an EVM is verified by a paper slip, ensuring 100% auditability and trust.",
    icon: Zap,
  },
  {
    title: "Secure Logistics",
    text: "Multi-layered security protocols for EVM transport and storage, guarded by central forces.",
    icon: Lock,
  },
  {
    title: "Universal Access",
    text: "Ensuring every eligible citizen, even in the remotest corners, has a polling station within 2km.",
    icon: Globe,
  },
];

export function ECIOverview() {
  return (
    <section className="py-24 bg-zinc-950 relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent opacity-50" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          <div className="lg:w-1/2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-black uppercase tracking-widest">
                <ShieldCheck className="w-4 h-4" />
                <span>The Guardian of Democracy</span>
              </div>
              <h2 className="text-5xl md:text-6xl font-black text-white leading-none tracking-tighter">
                ELECTION COMMISSION <br />
                <span className="text-primary">OF INDIA</span>
              </h2>
              <p className="text-zinc-400 text-lg font-medium leading-relaxed max-w-xl">
                The Constitution of India vests the ECI with the power of superintendence, direction, and control of the entire process for conduct of elections.
              </p>
              
              <div className="pt-8 grid grid-cols-2 gap-8">
                <div className="space-y-2">
                  <div className="text-3xl font-black text-white">900M+</div>
                  <div className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Registered Voters</div>
                </div>
                <div className="space-y-2">
                  <div className="text-3xl font-black text-white">1M+</div>
                  <div className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Polling Stations</div>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="lg:w-1/2 grid md:grid-cols-2 gap-4">
            {PILLARS.map((pillar, index) => (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-8 rounded-3xl bg-zinc-900 border border-white/5 hover:bg-zinc-800/50 transition-all group"
              >
                <div className="w-12 h-12 rounded-2xl bg-zinc-800 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <pillar.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-black text-white mb-3 uppercase tracking-tight">
                  {pillar.title}
                </h3>
                <p className="text-zinc-500 text-xs font-medium leading-relaxed">
                  {pillar.text}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
