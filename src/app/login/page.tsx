"use client";

import { motion } from "framer-motion";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { LenisProvider } from "@/components/home/lenis-provider";
import { Mail, Lock, ArrowRight, Github, Chrome, Zap } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <LenisProvider>
      <main className="bg-black text-white min-h-screen flex flex-col font-sans">
        <Navbar />

        <div className="flex-grow flex items-center justify-center pt-32 pb-20 px-4 relative overflow-hidden">
          {/* Background Tech Elements */}
          <div className="absolute top-1/4 -left-20 w-80 h-80 bg-primary/20 blur-[100px] rounded-full pointer-events-none" />
          <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-violet-500/10 blur-[100px] rounded-full pointer-events-none" />
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md relative z-10"
          >
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-6">
                <Zap className="w-3 h-3 text-primary" />
                <span className="text-[9px] uppercase tracking-[0.3em] font-bold text-primary font-mono">Secure Access</span>
              </div>
              <h1 className="text-4xl font-bold text-white mb-2 font-heading tracking-tighter">
                {isLogin ? "Welcome Back" : "Start Your Mission"}
              </h1>
              <p className="text-zinc-500 text-sm">
                Enter your credentials to access the Viosner ecosystem.
              </p>
            </div>

            <div className="p-8 sm:p-10 rounded-[2.5rem] bg-zinc-900/40 border border-white/5 backdrop-blur-xl shadow-2xl">
              <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                {!isLogin && (
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-zinc-500 ml-1">Creator Handle</label>
                    <div className="relative">
                      <input className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-primary transition-colors text-white" placeholder="John Doe" />
                    </div>
                  </div>
                )}
                
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-zinc-500 ml-1">Relay Address</label>
                  <div className="relative">
                    <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                    <input type="email" className="w-full bg-white/[0.03] border border-white/10 rounded-2xl pl-14 pr-6 py-4 focus:outline-none focus:border-primary transition-colors text-white" placeholder="hello@creator.com" />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center px-1">
                    <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-zinc-500">Security Key</label>
                    {isLogin && <button className="text-[10px] uppercase tracking-[0.1em] text-primary hover:underline">Reset</button>}
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                    <input type="password" className="w-full bg-white/[0.03] border border-white/10 rounded-2xl pl-14 pr-6 py-4 focus:outline-none focus:border-primary transition-colors text-white" placeholder="••••••••" />
                  </div>
                </div>

                <button className="w-full py-4 rounded-2xl bg-white text-black font-bold text-sm tracking-widest uppercase hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2">
                  {isLogin ? "Initialize Sync" : "Deploy Profile"}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              <div className="my-8 flex items-center gap-4">
                <div className="h-px flex-grow bg-white/5" />
                <span className="text-[10px] text-zinc-600 uppercase font-bold tracking-widest">Or Link</span>
                <div className="h-px flex-grow bg-white/5" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button className="flex items-center justify-center gap-3 py-3.5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                  <Chrome className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">Google</span>
                </button>
                <button className="flex items-center justify-center gap-3 py-3.5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                  <Github className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">Github</span>
                </button>
              </div>
            </div>

            <div className="mt-8 text-center">
              <p className="text-zinc-500 text-sm">
                {isLogin ? "No identity yet?" : "Already part of the network?"}{" "}
                <button 
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-primary font-bold hover:underline"
                >
                  {isLogin ? "Create one" : "Login here"}
                </button>
              </p>
            </div>
          </motion.div>
        </div>

        <Footer />
      </main>
    </LenisProvider>
  );
}
