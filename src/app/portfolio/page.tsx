"use client";

import { motion, type Variants } from "framer-motion";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { LenisProvider } from "@/components/home/lenis-provider";
import { Globe, Target, Users, BarChart3, ArrowUpRight, Shield, Zap, Search } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

const SIMULATIONS = [
  {
    title: "2024 General Election Model",
    category: "National",
    image: "https://images.unsplash.com/photo-1540910419892-f7ef7173fdd4?auto=format&fit=crop&q=80&w=800",
    client: "Unified Alliance",
    accuracy: "98.2%",
    tags: ["Seat Projection", "Coalition Math"],
  },
  {
    title: "UP Assembly Micro-Targeting",
    category: "State",
    image: "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&q=80&w=800",
    client: "Regional Progress Party",
    accuracy: "96.5%",
    tags: ["Caste Dynamics", "Booth Analysis"],
  },
  {
    title: "Urban Youth Sentiment Shift",
    category: "Demographic",
    image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800",
    client: "Youth Forward Init.",
    accuracy: "94.8%",
    tags: ["Social Media Pulse", "Jobs Policy"],
  },
  {
    title: "Karnataka Anti-Incumbency Map",
    category: "State",
    image: "https://images.unsplash.com/photo-1577412647305-991150c7d163?auto=format&fit=crop&q=80&w=800",
    client: "Democratic Front",
    accuracy: "97.1%",
    tags: ["Wave Detection", "Regional Grievances"],
  },
  {
    title: "Diaspora Impact Simulation",
    category: "Regional",
    image: "https://images.unsplash.com/photo-1526772662000-3f88f10405ff?auto=format&fit=crop&q=80&w=800",
    client: "Global Indian Forum",
    accuracy: "95.9%",
    tags: ["Foreign Funding", "Soft Power"],
  },
  {
    title: "Agricultural Belt Swing Study",
    category: "Demographic",
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=800",
    client: "Farmers Union",
    accuracy: "93.4%",
    tags: ["MSP Impact", "Rural Turnout"],
  },
];

const CATEGORIES = ["All", "National", "State", "Demographic", "Regional"];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

export default function PortfolioPage() {
  const [filter, setFilter] = useState("All");

  const filteredSimulations = SIMULATIONS.filter(p => filter === "All" || p.category === filter);

  return (
    <LenisProvider>
      <main className="bg-black text-white overflow-x-hidden min-h-screen font-sans">
        <Navbar />

        {/* Hero Section */}
        <section className="relative pt-40 pb-20 px-4 sm:px-6">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-indigo-500/10 blur-[120px] rounded-full opacity-50" />
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
              <div className="max-w-2xl">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-3 mb-6">
                  <span className="w-12 h-[1px] bg-indigo-500" />
                  <span className="text-indigo-400 font-mono text-xs uppercase tracking-[0.3em]">Simulation Intelligence</span>
                </motion.div>
                <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                  className="text-5xl sm:text-7xl md:text-8xl font-bold font-heading tracking-tighter leading-none mb-6">
                  Impact <br /> <span className="text-zinc-700">Gallery.</span>
                </motion.h1>
              </div>
              
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                className="flex flex-wrap gap-2 p-1.5 rounded-2xl bg-zinc-900/50 border border-white/5 backdrop-blur-xl">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setFilter(cat)}
                    className={`px-6 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                      filter === cat ? "bg-white text-black shadow-lg" : "text-zinc-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </motion.div>
            </div>
          </div>
        </section>

        {/* Portfolio Grid */}
        <section className="pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <motion.div 
            layout
            variants={stagger}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredSimulations.map((project, i) => (
              <motion.div 
                key={project.title}
                layout
                variants={fadeUp}
                className="group relative"
              >
                <div className="relative aspect-[16/10] overflow-hidden rounded-3xl bg-zinc-900 border border-white/5 group-hover:border-indigo-500/30 transition-all duration-500">
                  <div className="absolute inset-0 bg-zinc-950/20 group-hover:bg-transparent transition-colors duration-500 z-10" />
                  <Image 
                    src={project.image} 
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  
                  {/* Overlay Info */}
                  <div className="absolute bottom-6 left-6 right-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 z-20">
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.tags.map(tag => (
                        <span key={tag} className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[10px] uppercase font-bold tracking-widest text-zinc-300">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Icon Badge */}
                  <div className="absolute top-6 right-6 w-12 h-12 rounded-full bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center translate-y-[-10px] opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 z-20">
                    {project.category === "National" ? <Globe className="w-5 h-5 text-indigo-400" /> : 
                     project.category === "State" ? <Target className="w-5 h-5 text-rose-400" /> : 
                     project.category === "Demographic" ? <Users className="w-5 h-5 text-amber-400" /> :
                     <Shield className="w-5 h-5 text-emerald-400" />}
                  </div>
                </div>

                <div className="mt-6 flex justify-between items-start cursor-pointer">
                  <div>
                    <h3 className="text-xl font-bold font-heading group-hover:text-indigo-400 transition-colors duration-300">{project.title}</h3>
                    <p className="text-zinc-500 text-sm mt-1 font-sans">{project.client} · Accuracy: {project.accuracy}</p>
                  </div>
                  <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all duration-300">
                    <ArrowUpRight className="w-5 h-5" />
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Load More/Stats */}
          <div className="mt-32 p-12 rounded-[3rem] bg-zinc-900/30 border border-white/5 backdrop-blur-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-[80px] rounded-full" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 relative z-10 text-center">
              {[
                { label: "Simulations Run", val: "25,000+" },
                { label: "Data Nodes", val: "1.2B+" },
                { label: "Prediction Accuracy", val: "96.4%" },
                { label: "Campaigns Won", val: "180+" }
              ].map(stat => (
                <div key={stat.label}>
                  <p className="text-4xl font-bold font-mono tracking-tighter text-white mb-2">{stat.val}</p>
                  <p className="text-zinc-500 text-xs uppercase tracking-widest font-bold">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </LenisProvider>
  );
}
