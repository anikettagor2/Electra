"use client";

import { motion } from "framer-motion";
import { Target, Lightbulb } from "lucide-react";
import Image from "next/image";


export function AboutContent() {
  return (
    <div className="bg-black text-white selection:bg-indigo-500 selection:text-white pb-32">
      {/* Cinematic Narrative Hero */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center text-center px-6 pt-20 overflow-hidden">
        <div className="absolute inset-0 bg-radial-gradient from-indigo-500/10 via-transparent to-transparent opacity-40" />
        
        <motion.div
            initial={{ opacity: 0, letterSpacing: "1em" }}
            animate={{ opacity: 1, letterSpacing: "0.3em" }}
            transition={{ duration: 1 }}
            className="text-indigo-400 font-black text-xs uppercase mb-8 font-mono"
        >
            [ ARCHITECT_PROTOCOL ]
        </motion.div>
        
        <motion.h1 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-[14vw] sm:text-[12vw] md:text-[8vw] font-black uppercase leading-[0.85] tracking-tighter mb-8 sm:mb-12 px-2 font-heading italic"
        >
            Predicting <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-white to-indigo-500">The Mandate</span>
        </motion.h1>
        
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="max-w-2xl text-zinc-500 text-base sm:text-xl font-medium leading-relaxed px-4 font-mono text-sm uppercase"
        >
            <span className="text-indigo-500 mr-2">{">>"}</span> Founded on the principle that democracy isn't just about noise—it's about the electrical pulse of public sentiment and the surgical precision of data science.
        </motion.div>
      </section>

      {/* Philosophy Section */}
      <section className="py-20 sm:py-32 md:py-40 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-20 items-center">
              <div className="w-full md:w-1/2 relative aspect-square min-h-[280px] sm:min-h-[360px] rounded-[3rem] overflow-hidden border border-white/5 shadow-2xl bg-zinc-900/20 backdrop-blur-xl">
                  <Image 
                    src="https://images.unsplash.com/photo-1551288049-bbdac8626ad1?auto=format&fit=crop&q=80&w=1200" 
                    alt="Data Analytics" 
                    fill 
                    className="object-cover opacity-50 contrast-125 grayscale hover:grayscale-0 transition-all duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-tr from-black via-transparent to-indigo-500/20" />
                  <div className="absolute bottom-6 left-6 text-[10px] font-mono text-white/20 uppercase tracking-[0.4em]">Core_Archive_01</div>
              </div>
              <div className="w-full md:w-1/2 space-y-12">
                  <div className="space-y-4">
                      <span className="text-indigo-400 text-[10px] font-black uppercase tracking-[0.4em] font-mono">MISSION // LOGISTICS</span>
                      <h2 className="text-3xl sm:text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none font-heading italic">The Electra <span className="text-zinc-800">Intelligence</span></h2>
                      <p className="text-zinc-500 text-xl leading-relaxed font-medium">
                          We recognized that modern campaigns didn't just need polling numbers; they needed an engine that could simulate every possible branch of the future, optimizing for the winning outcome at scale.
                      </p>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                      <div className="p-8 rounded-[2rem] bg-zinc-950 border border-white/5 hover:border-indigo-500/30 transition-all group overflow-hidden relative">
                          <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl group-hover:bg-indigo-500/10 transition-colors" />
                          <Target className="relative z-10 w-8 h-8 text-indigo-400 mb-6 group-hover:scale-110 transition-transform" />
                          <h4 className="relative z-10 text-lg font-black uppercase mb-2 font-heading">Our Mission</h4>
                          <p className="relative z-10 text-zinc-500 text-sm font-mono tracking-tight leading-relaxed">EMPOWERING DEMOCRATIC LEADERS WITH PREDICTIVE EDGE AND SURGICAL STRATEGY SINCE INITIALIZATION.</p>
                      </div>
                      <div className="p-8 rounded-[2rem] bg-zinc-950 border border-white/5 hover:border-indigo-500/30 transition-all group overflow-hidden relative">
                          <div className="absolute -top-10 -right-10 w-32 h-32 bg-purple-500/5 rounded-full blur-2xl group-hover:bg-purple-500/10 transition-colors" />
                          <Lightbulb className="relative z-10 w-8 h-8 text-purple-500 mb-6 group-hover:scale-110 transition-transform" />
                          <h4 className="relative z-10 text-lg font-black uppercase mb-2 font-heading">Our Vision</h4>
                          <p className="relative z-10 text-zinc-500 text-sm font-mono tracking-tight leading-relaxed">SETTING THE GLOBAL GOLD STANDARD FOR AI-DRIVEN ELECTORAL SIMULATION AND STRATEGIC MODELING.</p>
                      </div>
                  </div>
              </div>
          </div>
      </section>
    </div>
  );
}
