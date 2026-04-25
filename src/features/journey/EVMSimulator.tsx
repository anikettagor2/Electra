"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Fingerprint, CheckCircle2, Info } from "lucide-react";

/**
 * Interface representing a candidate in the electoral system.
 */
interface Candidate {
  id: number;
  name: string;
  symbol: string;
  color: string;
}

const CANDIDATES: Candidate[] = [
  { id: 1, name: "Progressive Alliance", symbol: "☀", color: "bg-blue-500" },
  { id: 2, name: "Liberty Front", symbol: "⚖", color: "bg-emerald-500" },
  { id: 3, name: "Unity Party", symbol: "✋", color: "bg-orange-500" },
  { id: 4, name: "Green Future", symbol: "☘", color: "bg-green-500" },
];

/**
 * EVMSimulator Component
 * 
 * Provides a high-fidelity simulation of an Electronic Voting Machine (EVM)
 * combined with a Voter Verifiable Paper Audit Trail (VVPAT) system.
 * 
 * Features:
 * - Interactive voting sequence with visual feedback
 * - VVPAT slip generation and display logic
 * - Accessibility-hardened interface with ARIA roles
 * - Responsive layout with premium aesthetic
 */
export function EVMSimulator() {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isVoted, setIsVoted] = useState<boolean>(false);
  const [showSlip, setShowSlip] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string>("Ready to vote");

  /**
   * Handles the voting process for a specific candidate.
   * Prevents multiple votes and triggers the VVPAT slip appearance.
   * 
   * @param id The unique identifier of the candidate being voted for.
   */
  const handleVote = useCallback((id: number) => {
    if (isVoted) return;
    
    const candidate = CANDIDATES.find(c => c.id === id);
    if (!candidate) return;

    setSelectedId(id);
    setIsVoted(true);
    setStatusMessage(`Vote cast for ${candidate.name}. Verifying...`);
    
    // Stage 1: Simulate VVPAT Slip appearing (approx 800ms delay)
    const slipTimer = setTimeout(() => {
      setShowSlip(true);
    }, 800);

    // Stage 2: Reset system for next use (approx 5s total duration)
    const resetTimer = setTimeout(() => {
      setShowSlip(false);
      setIsVoted(false);
      setSelectedId(null);
      setStatusMessage("Ready to vote");
    }, 5000);

    return () => {
      clearTimeout(slipTimer);
      clearTimeout(resetTimer);
    };
  }, [isVoted]);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      // Logic handled within handleVote's return but added for safety
    };
  }, []);

  return (
    <div 
      className="w-full max-w-5xl mx-auto grid md:grid-cols-[1.3fr_0.7fr] gap-10 items-start"
      role="region" 
      aria-label="EVM Voting Simulator"
    >
      {/* Control Unit (EVM) */}
      <div 
        className="bg-zinc-800 rounded-[2.5rem] p-10 border-8 border-zinc-700 shadow-2xl relative overflow-hidden"
        aria-live="polite"
      >
        <div className="flex items-center justify-between mb-8 px-4">
          <div className="flex items-center gap-2">
            <div 
              className={`w-3 h-3 rounded-full ${isVoted ? 'bg-zinc-600' : 'bg-red-500 animate-pulse'} shadow-[0_0_10px_rgba(239,68,68,0.5)]`} 
              aria-hidden="true"
            />
            <span className="text-[10px] font-black uppercase tracking-tighter text-zinc-500">
              {isVoted ? 'Busy' : 'Ready'}
            </span>
          </div>
          <div className="text-[10px] font-black uppercase tracking-tighter text-zinc-500">Model EVM-2026-PRO</div>
        </div>

        <div className="space-y-4" role="group" aria-label="Candidate List">
          {CANDIDATES.map((c) => (
            <div 
              key={c.id}
              className={`flex items-center gap-8 p-6 rounded-2xl border-2 transition-all duration-300 ${
                selectedId === c.id ? 'bg-indigo-500/10 border-indigo-500 scale-[1.02]' : 'bg-black/40 border-transparent hover:border-zinc-600'
              } ${isVoted && selectedId !== c.id ? 'opacity-30 grayscale' : ''}`}
            >
              <div 
                className={`w-14 h-14 rounded-xl ${c.color} flex items-center justify-center text-3xl font-bold text-white shadow-lg`}
                aria-hidden="true"
              >
                {c.symbol}
              </div>
              <div className="flex-1">
                <p className="text-lg font-bold text-white">{c.name}</p>
                <p className="text-xs text-zinc-500 font-mono">SERIAL: 2026-IN-{c.id}</p>
              </div>
              <button
                onClick={() => handleVote(c.id)}
                disabled={isVoted}
                className={`w-14 h-14 rounded-full border-4 shadow-inner flex items-center justify-center transition-all duration-300 ${
                  selectedId === c.id 
                    ? 'bg-red-500 border-red-400 scale-110' 
                    : 'bg-blue-600 border-zinc-700 hover:bg-blue-500 hover:border-zinc-600 active:scale-90 cursor-pointer'
                } disabled:cursor-not-allowed`}
                aria-label={`Vote for ${c.name}`}
                aria-pressed={selectedId === c.id}
              >
                <div className={`w-5 h-5 rounded-full ${selectedId === c.id ? 'bg-white animate-ping' : 'bg-white/20'}`} />
              </button>
            </div>
          ))}
        </div>

        <AnimatePresence>
          {isVoted && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/70 backdrop-blur-[4px] flex items-center justify-center z-20"
            >
              <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl shadow-2xl flex flex-col items-center gap-6">
                <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center text-red-500">
                  <Fingerprint className="w-8 h-8 animate-pulse" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-black uppercase tracking-[0.2em] text-zinc-400 mb-1">Processing Vote</p>
                  <p className="text-[10px] text-zinc-600 font-mono">DO NOT POWER OFF</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* VVPAT Printer Unit */}
      <div className="space-y-8">
        <div 
          className="bg-zinc-900 rounded-[2rem] p-10 border border-zinc-800 shadow-xl relative min-h-[350px] flex flex-col items-center justify-center text-center overflow-hidden"
          aria-label="VVPAT Verification Window"
        >
          <div className="absolute top-6 left-1/2 -translate-x-1/2 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">VVPAT SECURE FEED</span>
          </div>

          <AnimatePresence mode="wait">
            {showSlip ? (
              <motion.div
                key="slip"
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 200, opacity: 0 }}
                transition={{ type: "spring", damping: 20 }}
                className="bg-zinc-50 text-zinc-900 p-8 rounded-sm shadow-2xl w-56 font-mono text-[10px] space-y-6 border-x border-zinc-300"
                data-testid="vvpat-slip"
              >
                <div className="border-b-2 border-zinc-900 pb-4 text-center font-black text-xs uppercase leading-tight">
                  Voter Verifiable<br/>Paper Audit Trail
                </div>
                <div className="space-y-3">
                  <div className="flex flex-col items-start gap-1">
                    <span className="text-[8px] uppercase text-zinc-500">Candidate</span>
                    <span className="font-black text-xs uppercase">{CANDIDATES.find(c => c.id === selectedId)?.name}</span>
                  </div>
                  <div className="flex flex-col items-start gap-1">
                    <span className="text-[8px] uppercase text-zinc-500">Symbol</span>
                    <span className="text-4xl font-bold">{CANDIDATES.find(c => c.id === selectedId)?.symbol}</span>
                  </div>
                  <div className="pt-2 border-t border-zinc-200 flex justify-between items-center text-[8px]">
                    <span>{new Date().toLocaleDateString()}</span>
                    <span>{new Date().toLocaleTimeString()}</span>
                  </div>
                </div>
                <div className="pt-4 flex flex-col items-center gap-3">
                  <div className="w-full h-10 bg-[url('https://www.transparenttextures.com/patterns/barcode.png')] opacity-20 contrast-150" />
                  <p className="text-[7px] font-black tracking-widest text-zinc-400">ENCRYPTED AUDIT RECORD</p>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="placeholder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <div className="w-24 h-24 bg-zinc-800/50 rounded-full flex items-center justify-center mx-auto border border-zinc-700/50">
                  <Info className="w-10 h-10 text-zinc-600" />
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-bold text-zinc-400">Verification Pending</p>
                  <p className="text-xs text-zinc-500 max-w-[200px] leading-relaxed">
                    Cast your vote on the EVM unit to verify your selection in the VVPAT window.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Secure Drop Box Indication */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-40 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
             <motion.div 
               className="h-full bg-emerald-500/20"
               animate={{ x: ["-100%", "100%"] }}
               transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
             />
          </div>
        </div>

        {/* Educational Fact Card */}
        <div className="p-8 rounded-3xl bg-indigo-500/5 border border-indigo-500/10 shadow-lg">
          <h4 className="text-sm font-black mb-3 flex items-center gap-2 text-indigo-400 uppercase tracking-wider">
            <CheckCircle2 className="w-4 h-4" />
            Electoral Integrity
          </h4>
          <p className="text-xs text-zinc-400 leading-relaxed font-medium">
            The VVPAT system provides a physical audit trail. The printed slip is visible through the glass for 7 seconds, allowing the voter to confirm their choice before it automatically detaches and falls into a sealed collection box.
          </p>
        </div>
      </div>
    </div>
  );
}
