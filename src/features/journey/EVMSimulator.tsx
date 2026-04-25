"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Fingerprint, CheckCircle2, ChevronRight, Info } from "lucide-react";
import { Button } from "@/components/ui/button";

const CANDIDATES = [
  { id: 1, name: "Progressive Alliance", symbol: "☀", color: "bg-blue-500" },
  { id: 2, name: "Liberty Front", symbol: "⚖", color: "bg-emerald-500" },
  { id: 3, name: "Unity Party", symbol: "✋", color: "bg-orange-500" },
  { id: 4, name: "Green Future", symbol: "☘", color: "bg-green-500" },
];

export function EVMSimulator() {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isVoted, setIsVoted] = useState(false);
  const [showSlip, setShowSlip] = useState(false);

  const handleVote = (id: number) => {
    if (isVoted) return;
    setSelectedId(id);
    setIsVoted(true);
    
    // Simulate VVPAT Slip appearing
    setTimeout(() => {
      setShowSlip(true);
    }, 800);

    // Hide everything after a few seconds
    setTimeout(() => {
      setShowSlip(false);
      setIsVoted(false);
      setSelectedId(null);
    }, 5000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto grid md:grid-cols-[1.2fr_0.8fr] gap-8 items-start">
      {/* Control Unit (EVM) */}
      <div className="bg-zinc-800 rounded-[2.5rem] p-8 border-8 border-zinc-700 shadow-2xl relative overflow-hidden">
        <div className="flex items-center justify-between mb-8 px-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
            <span className="text-[10px] font-black uppercase tracking-tighter text-zinc-500">Ready</span>
          </div>
          <div className="text-[10px] font-black uppercase tracking-tighter text-zinc-500">Model EVM-2026</div>
        </div>

        <div className="space-y-4">
          {CANDIDATES.map((c) => (
            <div 
              key={c.id}
              className={`flex items-center gap-6 p-5 rounded-2xl border-2 transition-all ${
                selectedId === c.id ? 'bg-indigo-500/10 border-indigo-500' : 'bg-black/40 border-transparent hover:border-zinc-600'
              } ${isVoted && selectedId !== c.id ? 'opacity-50 grayscale' : ''}`}
            >
              <div className={`w-12 h-12 rounded-xl ${c.color} flex items-center justify-center text-2xl font-bold text-white shadow-lg`}>
                {c.symbol}
              </div>
              <div className="flex-1">
                <p className="text-base font-bold whitespace-nowrap">{c.name}</p>
                <p className="text-[10px] text-zinc-500 font-mono">ID: 00{c.id}</p>
              </div>
              <button
                onClick={() => handleVote(c.id)}
                disabled={isVoted}
                className={`w-12 h-12 rounded-full border-4 border-zinc-700 shadow-inner flex items-center justify-center transition-all ${
                  selectedId === c.id ? 'bg-red-500 border-red-400' : 'bg-blue-600 hover:bg-blue-500 active:scale-95'
                }`}
                aria-label={`Vote for ${c.name}`}
              >
                <div className={`w-4 h-4 rounded-full ${selectedId === c.id ? 'bg-white animate-pulse' : 'bg-white/20'}`} />
              </button>
            </div>
          ))}
        </div>

        {isVoted && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center"
          >
            <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl shadow-2xl flex flex-col items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center text-red-500 animate-pulse">
                <Fingerprint className="w-6 h-6" />
              </div>
              <p className="text-sm font-bold uppercase tracking-widest text-zinc-400">Processing Vote...</p>
            </div>
          </motion.div>
        )}
      </div>

      {/* VVPAT Printer Unit */}
      <div className="space-y-6">
        <div className="bg-zinc-900 rounded-[2rem] p-8 border border-zinc-800 shadow-xl relative min-h-[300px] flex flex-col items-center justify-center text-center">
          <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-[10px] font-black uppercase tracking-tighter text-zinc-500">VVPAT System Active</span>
          </div>

          <AnimatePresence>
            {showSlip ? (
              <motion.div
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 50, opacity: 0 }}
                className="bg-white text-black p-6 rounded-sm shadow-2xl w-48 font-mono text-[10px] space-y-4"
              >
                <div className="border-b border-black pb-2 text-center font-bold text-xs uppercase">
                  Voter Verifiable Paper Audit Trail
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between"><span>Candidate:</span><span className="font-bold">{CANDIDATES.find(c => c.id === selectedId)?.name}</span></div>
                  <div className="flex justify-between"><span>Symbol:</span><span className="text-xl font-bold">{CANDIDATES.find(c => c.id === selectedId)?.symbol}</span></div>
                  <div className="flex justify-between"><span>Time:</span><span>{new Date().toLocaleTimeString()}</span></div>
                </div>
                <div className="pt-4 flex flex-col items-center gap-2">
                  <div className="w-full h-8 bg-[url('https://www.transparenttextures.com/patterns/barcode.png')] opacity-80" />
                  <p className="text-[8px] text-zinc-400">YOUR VOTE IS SECURE</p>
                </div>
              </motion.div>
            ) : (
              <div className="space-y-4 opacity-30">
                <div className="w-20 h-20 bg-zinc-800 rounded-full flex items-center justify-center mx-auto">
                  <Info className="w-8 h-8 text-zinc-600" />
                </div>
                <p className="text-xs font-medium text-zinc-500 max-w-[160px]">The VVPAT slip will appear here once you cast your vote on the EVM.</p>
              </div>
            )}
          </AnimatePresence>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-32 h-1 bg-zinc-800 rounded-full" />
        </div>

        <div className="p-6 rounded-2xl bg-indigo-500/5 border border-indigo-500/10">
          <h4 className="text-sm font-bold mb-2 flex items-center gap-2 text-indigo-400">
            <CheckCircle2 className="w-4 h-4" />
            Did you know?
          </h4>
          <p className="text-xs text-zinc-400 leading-relaxed">
            The VVPAT system allows voters to verify that their vote was cast correctly. The slip is visible for 7 seconds before falling into a secure box.
          </p>
        </div>
      </div>
    </div>
  );
}
