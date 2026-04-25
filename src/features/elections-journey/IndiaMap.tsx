"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Map as MapIcon, Info, Users, BarChart, ShieldCheck, Globe } from "lucide-react";

const STATES_DATA = [
  { id: "UP", name: "Uttar Pradesh", seats: 80, sentiment: "Highly Competitive", turnout: "61.2%", color: "#6366f1" },
  { id: "MH", name: "Maharashtra", seats: 48, sentiment: "Neutral", turnout: "60.5%", color: "#8b5cf6" },
  { id: "WB", name: "West Bengal", seats: 42, sentiment: "High Volatility", turnout: "81.7%", color: "#ec4899" },
  { id: "BR", name: "Bihar", seats: 40, sentiment: "Strong Incumbency", turnout: "57.3%", color: "#f43f5e" },
  { id: "TN", name: "Tamil Nadu", seats: 39, sentiment: "Regional Dominance", turnout: "72.4%", color: "#06b6d4" },
  { id: "MP", name: "Madhya Pradesh", seats: 29, sentiment: "Stable", turnout: "71.1%", color: "#10b981" },
];

export function IndiaMap() {
  const [selectedState, setSelectedState] = useState<typeof STATES_DATA[0] | null>(null);

  return (
    <section className="py-24 bg-zinc-950 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />
      
      {/* Live Constituency Markers (Mock Data) */}
      {[
        { top: '30%', left: '45%', id: 'delhi' },
        { top: '65%', left: '35%', id: 'mumbai' },
        { top: '80%', left: '55%', id: 'bangalore' },
        { top: '45%', left: '65%', id: 'kolkata' },
        { top: '15%', left: '40%', id: 'srinagar' },
      ].map((marker) => (
        <motion.div
          key={marker.id}
          className="absolute w-3 h-3 bg-primary rounded-full z-20 pointer-events-none"
          style={{ top: marker.top, left: marker.left }}
          initial={{ scale: 0 }}
          animate={{ scale: [1, 2, 1], opacity: [0.8, 0, 0.8] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="absolute inset-0 bg-primary/40 rounded-full blur-md" />
        </motion.div>
      ))}

      {/* Map Content */}
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          <div className="lg:w-1/2 space-y-8">
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.4em]"
              >
                <Globe className="w-4 h-4" />
                <span>Geospatial Intelligence Layer</span>
              </motion.div>
              <h2 className="text-5xl md:text-6xl font-black text-white leading-none tracking-tighter uppercase">
                Constituency <br />
                <span className="text-primary">Data Mapping</span>
              </h2>
              <p className="text-zinc-400 text-lg font-medium leading-relaxed max-w-lg">
                Harnessing GCP Geospatial data to visualize electoral trends. Click on a region to drill down into localized simulation metrics.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <AnimatePresence mode="wait">
                {selectedState ? (
                  <motion.div
                    key={selectedState.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="col-span-2 p-8 rounded-[2.5rem] bg-zinc-900 border border-primary/20 shadow-[0_20px_40px_rgba(0,0,0,0.5)]"
                  >
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <h3 className="text-2xl font-black text-white uppercase tracking-tighter">{selectedState.name}</h3>
                        <p className="text-primary text-xs font-bold uppercase tracking-widest mt-1">Region Profile</p>
                      </div>
                      <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                        <BarChart className="w-6 h-6 text-primary" />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-6">
                      <div className="space-y-1">
                        <div className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">Total Seats</div>
                        <div className="text-xl font-black text-white">{selectedState.seats}</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">Avg. Turnout</div>
                        <div className="text-xl font-black text-white">{selectedState.turnout}</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">Sentiment</div>
                        <div className="text-xs font-black text-primary uppercase">{selectedState.sentiment}</div>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <div className="col-span-2 p-8 rounded-[2.5rem] border border-dashed border-white/5 bg-zinc-900/30 flex flex-col items-center justify-center text-center gap-4 py-16">
                    <MapIcon className="w-12 h-12 text-zinc-700 animate-pulse" />
                    <p className="text-zinc-500 font-medium max-w-[200px]">Select a region on the map to analyze data</p>
                  </div>
                )}
              </AnimatePresence>
            </div>
            
            <div className="pt-4 flex items-center gap-6 text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em]">
               <div className="flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-primary" />
                 <span>Real-time Sync</span>
               </div>
               <div className="flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-zinc-800" />
                 <span>BigQuery Source</span>
               </div>
            </div>
          </div>

          <div className="lg:w-1/2 relative flex justify-center items-center">
            {/* Simplified India SVG for visualization */}
            <div className="relative w-full max-w-[500px] aspect-[1/1.2]">
               <svg viewBox="0 0 500 600" className="w-full h-full drop-shadow-[0_0_30px_rgba(99,102,241,0.2)]">
                 {/* This is a placeholder for a complex map - using stylized shapes for states */}
                 {STATES_DATA.map((state, i) => (
                   <motion.path
                     key={state.id}
                     d={`M${150 + i * 40} ${200 + i * 50} L${250 + i * 30} ${200 + i * 50} L${250 + i * 30} ${300 + i * 40} L${150 + i * 40} ${300 + i * 40} Z`} // Mock paths
                     className="cursor-pointer transition-colors"
                     fill={selectedState?.id === state.id ? state.color : "#18181b"}
                     stroke={selectedState?.id === state.id ? "#fff" : "#27272a"}
                     strokeWidth="2"
                     whileHover={{ scale: 1.05, fill: state.color, zIndex: 10 }}
                     onClick={() => setSelectedState(state)}
                   />
                 ))}
                 
                 {/* Abstract "Network" lines to simulate data connections */}
                 <motion.path 
                    d="M100 100 Q 250 50 400 100" 
                    fill="none" 
                    stroke="url(#grad)" 
                    strokeWidth="1" 
                    strokeDasharray="5,5"
                    animate={{ strokeDashoffset: [0, -20] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                 />
                 
                 <defs>
                   <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
                     <stop offset="0%" stopColor="transparent" />
                     <stop offset="50%" stopColor="#6366f1" />
                     <stop offset="100%" stopColor="transparent" />
                   </linearGradient>
                 </defs>
               </svg>
               
               {/* Label Overlay */}
               <div className="absolute top-10 right-0 p-4 rounded-2xl bg-zinc-900/80 border border-white/10 backdrop-blur-md">
                 <div className="flex items-center gap-3">
                   <ShieldCheck className="w-4 h-4 text-emerald-500" />
                   <span className="text-[10px] font-black text-white uppercase tracking-widest">GCP Verified Node</span>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
