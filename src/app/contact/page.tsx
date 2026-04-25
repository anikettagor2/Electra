"use client";

import { motion, type Variants } from "framer-motion";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { LenisProvider } from "@/components/home/lenis-provider";
import { Mail, Phone, MapPin, Send, Instagram, Twitter, Linkedin, MessageSquare, Globe } from "lucide-react";
import { useState } from "react";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export default function ContactPage() {
  const [formState, setFormState] = useState<"idle" | "submitting" | "success">("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormState("submitting");
    setTimeout(() => setFormState("success"), 1500);
  };

  return (
    <LenisProvider>
      <main className="bg-black text-white overflow-x-hidden min-h-screen">
        <Navbar />

        <div className="pt-40 pb-32 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-20">
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-3 mb-8">
                <span className="w-12 h-[1px] bg-indigo-500" />
                <span className="text-indigo-400 font-mono text-xs uppercase tracking-[0.3em]">Direct Communication</span>
              </motion.div>
              <motion.h1 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="text-5xl sm:text-7xl md:text-9xl font-bold font-heading tracking-tighter leading-[0.85] mb-8"
              >
                Let's Make <br /> <span className="text-zinc-800">History.</span>
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                className="text-lg text-zinc-500 max-w-xl font-sans"
              >
                Ready to optimize your campaign? Contact our strategy team for a custom simulation quote or technical consultation.
              </motion.p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
              {/* Form */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="p-8 sm:p-12 rounded-[2.5rem] bg-zinc-900/30 border border-white/5 backdrop-blur-md"
              >
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-zinc-500 ml-1">Strategist Name</label>
                      <input required className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-indigo-500 transition-colors text-white font-sans" placeholder="Your Name" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-zinc-500 ml-1">Email Hash</label>
                      <input required type="email" className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-indigo-500 transition-colors text-white font-sans" placeholder="hq@electra-sim.com" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-zinc-500 ml-1">Simulation Scope</label>
                    <select className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-indigo-500 transition-colors text-zinc-400 font-sans cursor-pointer">
                      <option className="bg-zinc-900">National General Election</option>
                      <option className="bg-zinc-900">State Assembly Modeling</option>
                      <option className="bg-zinc-900">Demographic Micro-Targeting</option>
                      <option className="bg-zinc-900">Elite Ongoing Monitoring</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-zinc-500 ml-1">Mission Details</label>
                    <textarea required rows={5} className="w-full bg-white/[0.03] border border-white/10 rounded-3xl px-6 py-4 focus:outline-none focus:border-indigo-500 transition-colors text-white font-sans resize-none" placeholder="Describe your electoral objectives..." />
                  </div>

                  <button 
                    disabled={formState !== "idle"}
                    className="w-full group relative flex items-center justify-center p-px rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-600 overflow-hidden transition-all duration-300 active:scale-95"
                  >
                    <div className="relative w-full h-full bg-black/20 group-hover:bg-transparent transition-all duration-300 py-5 rounded-2xl flex items-center justify-center gap-3">
                      {formState === "idle" ? (
                        <>
                          <span className="font-bold tracking-widest uppercase text-xs">Initialize Sync</span>
                          <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </>
                      ) : formState === "submitting" ? (
                        <span className="font-bold tracking-widest uppercase text-xs animate-pulse">Processing...</span>
                      ) : (
                        <span className="font-bold tracking-widest uppercase text-xs text-emerald-400">Message Received</span>
                      )}
                    </div>
                  </button>
                </form>
              </motion.div>

              {/* Info Column */}
              <div className="space-y-12">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  {[
                    { icon: Mail, label: "Relay", val: "hi@electra-sim.com", sub: "Instant AI Response" },
                    { icon: Phone, label: "Priority Loop", val: "+91 63001 02441", sub: "24/7 War Room Support" },
                    { icon: MapPin, label: "HQ", val: "Bangalore, India", sub: "Intelligence Hub" },
                    { icon: Globe, label: "Global Presence", val: "Available Worldwide", sub: "Edge Computing" }
                  ].map((item, i) => (
                    <motion.div 
                      key={item.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + i*0.1 }}
                      className="p-8 rounded-3xl bg-zinc-900/40 border border-white/5 group hover:bg-zinc-800/40 transition-colors"
                    >
                      <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 group-hover:text-indigo-400 transition-colors">
                        <item.icon className="w-5 h-5" />
                      </div>
                      <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-zinc-500 mb-2">{item.label}</p>
                      <p className="text-xl font-bold font-heading mb-1">{item.val}</p>
                      <p className="text-[10px] text-zinc-600 font-mono italic">{item.sub}</p>
                    </motion.div>
                  ))}
                </div>

                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="p-10 rounded-[2.5rem] bg-indigo-600 group relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 blur-[60px] rounded-full" />
                  <div className="relative z-10">
                    <h3 className="text-2xl font-bold text-white mb-4 font-heading tracking-tight">Electra Intelligence Network</h3>
                    <p className="text-indigo-100 text-sm mb-8 font-sans max-w-xs">Join our ecosystem of 180+ successful campaigns. Follow us for strategic insights and modeling updates.</p>
                    <div className="flex gap-4">
                      {[Instagram, Twitter, Linkedin, MessageSquare].map((Icon, idx) => (
                        <a key={idx} href="#" className="w-12 h-12 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center hover:bg-white hover:text-indigo-600 transition-all duration-300">
                          <Icon className="w-5 h-5" />
                        </a>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </main>
    </LenisProvider>
  );
}
