"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Loader2 } from "lucide-react";

const CANDIDATES = [
  { id: 1, name: "Unified Alliance", symbol: "✦" },
  { id: 2, name: "Regional Progress", symbol: "❖" },
  { id: 3, name: "Democratic Front", symbol: "❈" },
  { id: 4, name: "Youth Forward", symbol: "✺" },
  { id: 5, name: "NOTA", symbol: "⊗" },
];

export function EVMAnimation() {
  const [selected, setSelected] = useState<number | null>(null);
  const [isPrinting, setIsPrinting] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);

  const handleVote = (id: number) => {
    if (isPrinting || hasVoted) return;
    setSelected(id);
    setIsPrinting(true);
    
    // Simulate printing and then completion
    setTimeout(() => {
      setIsPrinting(false);
      setHasVoted(true);
      setTimeout(() => {
        setHasVoted(false);
        setSelected(null);
      }, 3000);
    }, 4000);
  };

  return (
    <section className="relative min-h-screen bg-black overflow-hidden flex flex-col justify-center px-6 py-24 selection:bg-primary selection:text-white">
      {/* Ambient Background Lights */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/10 blur-[150px] rounded-full" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-violet-600/10 blur-[150px] rounded-full" />

      <div className="relative z-10 max-w-7xl mx-auto w-full">
        <div className="space-y-4 mb-16 text-center md:text-left">
          <span className="text-primary text-[10px] font-black uppercase tracking-[0.4em] font-mono">HARDWARE // SIMULATION</span>
          <h2 className="text-4xl md:text-7xl font-black uppercase text-white tracking-tighter font-heading italic">
            Digital <span className="text-zinc-800">EVM Interface</span>
          </h2>
          <p className="text-zinc-500 max-w-xl font-mono text-xs uppercase tracking-widest leading-loose">
            High-fidelity hardware modeling for voter experience testing. Experience the tactile interaction of democratic choice.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 items-center justify-center">
          {/* Balloting Unit */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="relative w-full max-w-md bg-zinc-900 border border-white/10 rounded-[2rem] p-8 shadow-2xl overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
            
            <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-4">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${hasVoted ? 'bg-red-500 shadow-[0_0_10px_red]' : 'bg-zinc-700'}`} />
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-tighter font-bold">Ready to Vote</span>
              </div>
              <div className="text-[10px] font-mono text-primary font-black tracking-[0.2em]">ELECTRA // BU-2024</div>
            </div>

            <div className="space-y-4">
              {CANDIDATES.map((c) => (
                <div key={c.id} className="flex items-center gap-4 bg-black/40 p-4 rounded-2xl border border-white/5 group hover:border-primary/30 transition-all">
                  <div className="w-8 h-8 flex items-center justify-center bg-zinc-800 rounded-lg text-xl font-bold text-zinc-400 group-hover:text-primary transition-colors">
                    {c.symbol}
                  </div>
                  <div className="flex-1">
                    <div className="text-xs font-bold text-zinc-300 uppercase tracking-wider">{c.name}</div>
                    <div className="text-[8px] font-mono text-zinc-600 mt-1 uppercase">Candidate_Ref_{c.id * 1024}</div>
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleVote(c.id)}
                    disabled={isPrinting || hasVoted}
                    className={`w-12 h-12 rounded-full border-4 flex items-center justify-center transition-all shadow-inner ${
                      selected === c.id 
                        ? 'bg-primary border-primary/50 shadow-[0_0_20px_rgba(99,102,241,0.5)]' 
                        : 'bg-zinc-800 border-zinc-700 hover:border-primary/50'
                    } disabled:cursor-not-allowed`}
                  >
                    <div className={`w-4 h-4 rounded-full ${selected === c.id ? 'bg-white' : 'bg-red-900/50'}`} />
                  </motion.button>
                </div>
              ))}
            </div>

            <div className="mt-8 p-4 rounded-xl bg-primary/5 border border-primary/10">
              <p className="text-[10px] text-zinc-500 font-mono leading-relaxed italic">
                {">"} Ensure the LED glow matches your choice. The VVPAT will display your ballot for verification.
              </p>
            </div>
          </motion.div>

          {/* VVPAT Unit */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="relative w-full max-w-sm bg-zinc-900 border border-white/10 rounded-[2rem] p-8 shadow-2xl aspect-[3/4] flex flex-col"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent pointer-events-none" />
            
            <div className="flex items-center justify-between mb-8">
              <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest font-bold">VVPAT // Verification</span>
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/50" />
                <div className="w-1.5 h-1.5 rounded-full bg-zinc-700" />
              </div>
            </div>

            {/* Glass Window */}
            <div className="flex-1 bg-black/80 rounded-3xl border border-white/5 relative overflow-hidden flex items-center justify-center">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_black_90%)]" />
              <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-transparent pointer-events-none" />
              <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
              
              <AnimatePresence>
                {isPrinting && selected && (
                  <motion.div
                    initial={{ y: -200, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 200, opacity: 0 }}
                    transition={{ type: "spring", damping: 12, stiffness: 100 }}
                    className="w-48 h-64 bg-white p-6 shadow-2xl relative"
                  >
                    <div className="border-2 border-black h-full flex flex-col items-center justify-between py-4 text-black">
                      <div className="text-[8px] font-black uppercase tracking-widest border-b border-black w-full text-center pb-2">Ballot Verification</div>
                      <div className="text-4xl font-black">{CANDIDATES.find(c => c.id === selected)?.symbol}</div>
                      <div className="text-center">
                        <div className="text-[10px] font-black uppercase">{CANDIDATES.find(c => c.id === selected)?.name}</div>
                        <div className="text-[8px] font-mono mt-1">S.No: 0{selected}</div>
                      </div>
                      <div className="w-full h-8 bg-zinc-100 flex items-center justify-center">
                         <div className="w-full h-1 bg-black/10 mx-2" />
                      </div>
                      <div className="text-[6px] font-mono uppercase text-zinc-400">Electra Simulation Protocol v1.5</div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {!isPrinting && !hasVoted && (
                <div className="text-center space-y-4">
                  <div className="w-12 h-12 rounded-full border-2 border-zinc-800 flex items-center justify-center mx-auto">
                    <Loader2 className="w-6 h-6 text-zinc-800 animate-spin" />
                  </div>
                  <p className="text-[10px] font-mono text-zinc-700 uppercase tracking-widest">Waiting for Input</p>
                </div>
              )}

              {hasVoted && !isPrinting && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center space-y-4"
                >
                  <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                    <Check className="w-8 h-8 text-emerald-500" />
                  </div>
                  <p className="text-[10px] font-mono text-emerald-500 uppercase tracking-[0.2em] font-bold">Vote Verified</p>
                </motion.div>
              )}
            </div>

            <div className="mt-8 flex justify-between items-end">
               <div className="space-y-1">
                  <div className="text-[8px] font-mono text-zinc-600 uppercase">Printer_Status</div>
                  <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">{isPrinting ? 'Executing Print...' : 'Standby'}</div>
               </div>
               <div className="w-12 h-12 bg-zinc-800/50 rounded-xl border border-white/5 flex items-center justify-center">
                  <div className={`w-2 h-2 rounded-full ${isPrinting ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500/50'}`} />
               </div>
            </div>
          </motion.div>
        </div>

        {/* Narrative Text */}
        <div className="mt-24 max-w-3xl mx-auto text-center">
            <p className="text-zinc-500 text-lg leading-relaxed font-mono text-sm uppercase tracking-wide">
                <span className="text-primary mr-3">{">>"}</span> We model the entire democratic journey. From the tactile press of the button to the cryptographic verification of the ballot, Electra ensures that simulation fidelity extends to the very point of voter interaction.
            </p>
        </div>
      </div>
    </section>
  );
}
