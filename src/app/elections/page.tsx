"use client";

import React from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ElectionProcess } from "@/features/elections-journey/ElectionProcess";
import { ECIOverview } from "@/features/elections-journey/ECIOverview";
import { VoterCardForm } from "@/features/elections-journey/VoterCardForm";
import { IndiaMap } from "@/features/elections-journey/IndiaMap";
import { EVMJourney } from "@/features/elections-journey/EVMJourney";
import { PollingBoothFinder } from "@/features/elections-journey/PollingBoothFinder";
import { motion } from "framer-motion";

export default function ElectionsPage() {
  return (
    <main className="min-h-screen bg-black selection:bg-primary selection:text-black">
      <Navbar />
      
      {/* Hero Header for Journey */}
      <section className="pt-40 pb-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-block px-6 py-2 rounded-full border border-white/10 bg-zinc-900/50 backdrop-blur-xl text-primary text-xs font-black uppercase tracking-[0.4em] mb-10"
          >
            The Great Indian Democratic Exercise
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-7xl md:text-9xl font-black text-white tracking-tighter uppercase leading-[0.8] mb-8"
          >
            VOTE FOR <br />
            <span className="text-primary">THE FUTURE.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-zinc-500 text-xl md:text-2xl font-medium max-w-3xl mx-auto leading-relaxed"
          >
            An immersive walkthrough of India's electoral process. From the halls of the Election Commission to the tactile click of the EVM.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-16 animate-bounce"
          >
            <div className="w-px h-12 bg-gradient-to-b from-primary to-transparent mx-auto" />
          </motion.div>
        </div>
      </section>

      {/* 1. Election Process (Stages) */}
      <ElectionProcess />

      {/* 2. Geospatial Intelligence (India Map) */}
      <IndiaMap />

      {/* 3. ECI Overview (Fairness) */}
      <ECIOverview />

      {/* 4. Voter Registration (Form) */}
      <VoterCardForm />

      {/* 5. Polling Booth Finder */}
      <PollingBoothFinder />

      {/* 6. EVM Animation & Final Outro */}
      <EVMJourney />

      <Footer />
    </main>
  );
}
