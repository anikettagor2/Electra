"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, User, Fingerprint, ShieldCheck, Mail, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function VoterRegistration() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    epic: "",
    state: ""
  });

  const handleNext = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(s => s + 1);
    }, 1500);
  };

  return (
    <div 
      className="w-full max-w-xl mx-auto p-8 rounded-[2rem] bg-zinc-900/50 border border-white/5 backdrop-blur-xl shadow-2xl overflow-hidden"
      role="region"
      aria-label="Voter Registration Simulator"
    >
      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
            role="form"
            aria-labelledby="step1-title"
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary" aria-hidden="true">
                <User className="w-6 h-6" />
              </div>
              <div>
                <h3 id="step1-title" className="text-xl font-bold">Voter Identity Verification</h3>
                <p className="text-zinc-400 text-sm">Enter your details to start registration</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="full-name" className="text-xs font-bold uppercase tracking-wider text-zinc-500">Full Name</label>
                <Input 
                  id="full-name"
                  placeholder="e.g. John Doe" 
                  className="bg-black/40 border-white/10 h-12 rounded-xl focus:ring-primary/20"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  aria-required="true"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="state-province" className="text-xs font-bold uppercase tracking-wider text-zinc-500">State / Province</label>
                <Input 
                  id="state-province"
                  placeholder="e.g. Maharashtra" 
                  className="bg-black/40 border-white/10 h-12 rounded-xl focus:ring-primary/20"
                  value={formData.state}
                  onChange={e => setFormData({...formData, state: e.target.value})}
                  aria-required="true"
                />
              </div>
            </div>

            <Button 
              className="w-full h-12 rounded-xl font-bold gap-2" 
              onClick={handleNext}
              disabled={!formData.name || loading}
              aria-live="polite"
            >
              {loading ? "Verifying..." : "Verify Identity"}
            </Button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
            role="status"
            aria-labelledby="step2-title"
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-emerald-400/10 flex items-center justify-center text-emerald-400" aria-hidden="true">
                <Fingerprint className="w-6 h-6" />
              </div>
              <div>
                <h3 id="step2-title" className="text-xl font-bold">Digital Biometrics</h3>
                <p className="text-zinc-400 text-sm">Validating your digital footprint</p>
              </div>
            </div>

            <div className="p-8 rounded-2xl border border-white/5 bg-black/40 flex flex-col items-center justify-center gap-6">
              <motion.div 
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="w-20 h-20 rounded-full border-2 border-emerald-400/50 flex items-center justify-center"
                aria-hidden="true"
              >
                <Fingerprint className="w-10 h-10 text-emerald-400" />
              </motion.div>
              <div className="text-center">
                <p className="text-sm font-medium text-zinc-300">Scanning Identity Record...</p>
                <div className="w-48 h-1 bg-zinc-800 rounded-full mt-4 overflow-hidden" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={loading ? 50 : 100}>
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 2 }}
                    className="h-full bg-emerald-400"
                  />
                </div>
              </div>
            </div>

            <Button 
              className="w-full h-12 rounded-xl font-bold bg-emerald-500 hover:bg-emerald-600" 
              onClick={handleNext}
              disabled={loading}
              aria-live="polite"
            >
              {loading ? "Processing..." : "Complete Registration"}
            </Button>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-8 space-y-6"
            role="alert"
            aria-labelledby="success-title"
          >
            <div className="w-20 h-20 bg-emerald-400/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto" aria-hidden="true">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div>
              <h3 id="success-title" className="text-2xl font-black mb-2">Registration Successful!</h3>
              <p className="text-zinc-400">Welcome, <span className="text-white font-bold">{formData.name}</span>. You are now a registered digital voter.</p>
            </div>
            <div className="p-4 rounded-xl bg-zinc-800/50 border border-white/5 flex items-center gap-3 text-left">
              <div className="w-10 h-10 rounded-lg bg-zinc-900 flex items-center justify-center text-xs font-mono font-bold text-zinc-500" aria-hidden="true">
                EPIC
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-zinc-500 tracking-tighter">Your Digital Voter ID</p>
                <p className="font-mono text-emerald-400" aria-label={`Voter ID: VPW2026-${formData.epic}`}>VPW2026-{Math.random().toString(36).substring(2, 10).toUpperCase()}</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              className="w-full h-12 rounded-xl border-white/10" 
              onClick={() => setStep(1)}
            >
              Back to Start
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
