"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { EVMAnimation } from "@/components/home/evm-animation";
import { Sparkles, CheckCircle2, Award, Info, Landmark } from "lucide-react";

export function EVMJourney() {
  const [hasVoted, setHasVoted] = useState(false);

  return (
    <section id="evm-interface" className="py-32 bg-zinc-950 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[150px] rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary/5 blur-[150px] rounded-full translate-y-1/2 -translate-x-1/2" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-24 space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-zinc-900 border border-white/10 text-primary text-xs font-black uppercase tracking-[0.4em]"
          >
            <Landmark className="w-4 h-4" />
            <span>Polling Station Alpha-01</span>
          </motion.div>
          <h2 className="text-6xl md:text-8xl font-black text-white tracking-tighter uppercase leading-none">
            CAST YOUR <br />
            <span className="text-primary italic">FIRST VOTE.</span>
          </h2>
          <p className="text-zinc-500 text-lg font-medium max-w-2xl mx-auto leading-relaxed">
            The power of a billion people distilled into a single button. Experience the cutting-edge technology and transparency of India's Electronic Voting Machines.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-16 items-start">
          <div className="lg:col-span-8">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-primary/5 to-primary/20 rounded-[3rem] blur-xl opacity-50" />
              <div className="relative bg-zinc-900 border border-white/5 rounded-[3rem] p-4 shadow-2xl">
                {/* Simulated Polling Booth Backdrop */}
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 rounded-[3rem]" />
                <div className="relative z-10">
                  <EVMAnimation />
                </div>
              </div>
            </div>
            
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-12 flex items-center justify-center gap-8 px-8 py-6 rounded-3xl bg-zinc-900/50 border border-white/5 backdrop-blur-sm"
            >
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-black text-white uppercase tracking-widest">EVM Status: Ready</span>
              </div>
              <div className="w-px h-4 bg-white/10" />
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-primary/50 animate-pulse" />
                <span className="text-[10px] font-black text-white uppercase tracking-widest">VVPAT: Online</span>
              </div>
              <div className="w-px h-4 bg-white/10" />
              <div className="flex items-center gap-3 text-zinc-500 hover:text-white transition-colors cursor-help">
                <Info className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-widest">Secure Protocol v4.2</span>
              </div>
            </motion.div>
          </div>

          <div className="lg:col-span-4 space-y-8">
            <div className="bg-zinc-900 rounded-[2.5rem] p-10 border border-white/5 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-1000" />
              <h3 className="text-xl font-black text-white mb-8 uppercase tracking-tight">The Voting Protocol</h3>
              <ul className="space-y-8">
                {[
                  { num: "01", title: "Select Candidate", text: "Press the blue button next to your chosen representative's symbol on the Balloting Unit." },
                  { num: "02", title: "Verify Receipt", text: "Watch the VVPAT window. A slip will be printed and shown for 7 seconds to confirm your choice." },
                  { num: "03", title: "Secure Drop", text: "The slip is automatically cut and dropped into the secure VVPAT ballot box." },
                ].map((item, idx) => (
                  <li key={idx} className="flex gap-5">
                    <div className="text-2xl font-black text-primary/20 group-hover:text-primary transition-colors">{item.num}</div>
                    <div>
                      <div className="text-sm font-black text-white uppercase mb-1 tracking-tight">{item.title}</div>
                      <div className="text-xs text-zinc-500 font-medium leading-relaxed">{item.text}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <AnimatePresence>
              {/* Note: This logic depends on the internal state of EVMAnimation. 
                  In a real app, I'd lift state up. For now, I'll show a "How it feels" card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                className="bg-primary/5 border border-primary/10 rounded-[2.5rem] p-10 text-center space-y-6"
              >
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto border border-primary/20">
                  <Award className="w-8 h-8 text-primary" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-black text-white uppercase tracking-tighter italic">Democracy in Action</h3>
                  <p className="text-sm text-zinc-400 font-medium leading-relaxed">
                    By casting this vote, you participate in the largest exercise of franchise in human history. 
                  </p>
                </div>
                <div className="pt-4 flex justify-center">
                  <div className="px-6 py-2 rounded-full bg-primary text-black text-[10px] font-black uppercase tracking-widest">
                    Verified Citizen Action
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Journey Conclusion Message (Footer of the scroll) */}
        <div className="mt-40 text-center space-y-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto space-y-6"
          >
            <div className="w-px h-24 bg-gradient-to-b from-transparent via-primary/50 to-primary mx-auto" />
            <h2 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter">
              YOU HAVE <span className="text-primary italic">CONTRIBUTED.</span>
            </h2>
            <p className="text-zinc-400 text-xl font-medium">
              That's how you have casted your first vote. The simulation ends here, but your democratic journey is just beginning.
            </p>
            <div className="pt-10">
              <div className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-zinc-900 border border-white/5 text-zinc-500 font-mono text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                <span>Simulation Protocol Complete: Final State Logged.</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
