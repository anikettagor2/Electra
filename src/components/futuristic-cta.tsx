"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, MessageCircle, Clock, Shield, Users, Terminal, Zap } from "lucide-react";

export function FuturisticCTA() {
  return (
    <section className="py-24 md:py-40 relative overflow-hidden bg-black selection:bg-primary selection:text-white">
      {/* Background Orbs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-violet-600/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6">
        {/* Main CTA Card */}
        <div className="relative rounded-[3rem] p-8 md:p-20 overflow-hidden bg-zinc-950 border border-white/5 shadow-2xl">
          {/* Grid Pattern */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
               style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
          
          <div className="relative z-10 grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-[0.3em] font-mono"
              >
                <Zap className="w-3 h-3" />
                Operational Capacity: 94%
              </motion.div>

              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="text-4xl sm:text-5xl md:text-7xl font-black text-white leading-[0.9] tracking-tighter font-heading uppercase"
              >
                Simulate Your <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-violet-400 to-primary">Next Election</span>
              </motion.h2>

              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="text-lg text-zinc-500 max-w-lg leading-relaxed font-jakarta"
              >
                Join top-tier political strategists who leverage our AI to accurately forecast elections. Predictive analytics at the speed of thought.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="flex flex-col sm:flex-row gap-4 pt-4"
              >
                <Link href="/simulate" className="w-full sm:w-auto">
                  <button className="group flex items-center justify-center gap-4 px-10 py-5 bg-white text-black font-black text-xs uppercase tracking-[0.2em] rounded-2xl hover:bg-zinc-200 transition-all font-mono">
                    Run Simulation
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                  </button>
                </Link>
                <Link href="/elections" className="w-full sm:w-auto">
                  <button className="flex items-center justify-center gap-4 px-10 py-5 bg-white/5 border border-white/10 text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl hover:bg-white/10 transition-all font-mono">
                    <Terminal className="w-4 h-4" />
                    View Dashboard
                  </button>
                </Link>
              </motion.div>
            </div>

            {/* Right Side - Features */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
              <FeatureCard 
                icon={<Clock className="w-5 h-5" />}
                title="Rapid Analysis"
                desc="<2s real-time turnaround"
              />
              <FeatureCard 
                icon={<Shield className="w-5 h-5" />}
                title="Secure Models"
                desc="Encrypted data management"
              />
              <FeatureCard 
                icon={<Users className="w-5 h-5" />}
                title="Elite Models"
                desc="Gemini 1.5 Pro inference"
              />
              <FeatureCard 
                icon={<Terminal className="w-5 h-5" />}
                title="Live Link"
                desc="Real-time streaming insights"
              />
            </motion.div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-24">
          <StatItem value="1M+" label="SIMULATIONS RUN" />
          <StatItem value="<2s" label="AVG TURNAROUND" />
          <StatItem value="1B+" label="VOTES MODELED" />
          <StatItem value="99%" label="ACCURACY RATE" />
        </div>
      </div>
    </section>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="p-8 rounded-[2rem] bg-black/40 border border-white/5 hover:border-primary/40 transition-all group">
      <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-white font-bold font-heading uppercase tracking-tight mb-2">{title}</h3>
      <p className="text-xs text-zinc-600 leading-relaxed font-mono font-bold">{desc}</p>
    </div>
  );
}

function StatItem({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-left space-y-2">
      <div className="text-4xl md:text-5xl font-black text-white font-heading tracking-tighter italic">{value}</div>
      <div className="text-[10px] text-zinc-700 font-bold uppercase tracking-[0.3em] font-mono leading-none">{label}</div>
    </div>
  );
}
