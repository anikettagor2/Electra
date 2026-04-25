"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, 
  Calendar, 
  MapPin, 
  QrCode, 
  Download, 
  ShieldCheck, 
  Sparkles,
  ArrowRight,
  Fingerprint
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function VoterCardForm() {
  const [formData, setFormData] = useState({
    name: "",
    dob: "",
    gender: "Male",
    address: "",
  });
  const [isGenerated, setIsGenerated] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [epicNumber] = useState(() => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const nums = "0123456789";
    let res = "";
    for (let i = 0; i < 3; i++) res += chars[Math.floor(Math.random() * chars.length)];
    for (let i = 0; i < 7; i++) res += nums[Math.floor(Math.random() * nums.length)];
    return res;
  });

  const [photo, setPhoto] = useState<string | null>(null);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhoto(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (formData.name && formData.dob && photo) {
      const dobDate = new Date(formData.dob);
      const today = new Date();
      let age = today.getFullYear() - dobDate.getFullYear();
      const m = today.getMonth() - dobDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < dobDate.getDate())) {
        age--;
      }

      if (age < 18) {
        setError("You must be 18 years or older to generate an e-EPIC voter card.");
        return;
      }

      setIsVerifying(true);
      setTimeout(() => {
        setIsVerifying(false);
        setIsGenerated(true);
      }, 4000);
    }
  };

  return (
    <section id="voter-card" className="py-24 bg-black relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-10">
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.3em]"
              >
                <Fingerprint className="w-4 h-4" />
                <span>Verification Phase</span>
              </motion.div>
              <h2 className="text-5xl md:text-6xl font-black text-white leading-none tracking-tighter uppercase">
                Step 1: Your <br />
                <span className="text-primary">Digital Identity</span>
              </h2>
              <p className="text-zinc-400 text-lg font-medium leading-relaxed max-w-lg">
                Before you can cast your vote, you must be verified. Experience the virtual registration process and generate your secure <span className="text-white font-bold">e-EPIC card</span>.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 bg-zinc-900/50 p-10 rounded-[2.5rem] border border-white/5 backdrop-blur-xl relative overflow-hidden">
              <AnimatePresence>
                {isVerifying && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 z-50 bg-zinc-950/90 backdrop-blur-md flex flex-col items-center justify-center space-y-6"
                  >
                    <div className="relative">
                      <div className="w-24 h-24 rounded-full border-2 border-primary/20 flex items-center justify-center">
                        <ShieldCheck className="w-10 h-10 text-primary animate-pulse" />
                      </div>
                      <motion.div 
                        animate={{ 
                          top: ["0%", "100%", "0%"],
                        }}
                        transition={{ 
                          duration: 1.5, 
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                        className="absolute left-0 right-0 h-0.5 bg-primary shadow-[0_0_15px_rgba(var(--primary),0.8)]"
                      />
                    </div>
                    <div className="text-center space-y-2">
                      <p className="text-primary text-[10px] font-black uppercase tracking-[0.4em]">Vertex AI Vision Sync</p>
                      <p className="text-white font-bold">Verifying Biometric Integrity...</p>
                      <p className="text-zinc-500 text-[10px] uppercase font-mono">Analyzing face_landmarks_v2.json</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              
              {/* Photo Upload Section */}
              <div className="space-y-2">
                <label htmlFor="photo-upload" className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Biometric Photo</label>
                <div className="flex items-center gap-6">
                  <div className="relative w-24 h-24 rounded-2xl bg-zinc-950 border border-white/10 flex items-center justify-center overflow-hidden group">
                    {photo ? (
                      <img src={photo} alt="User biometric portrait" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-8 h-8 text-zinc-800" aria-hidden="true" />
                    )}
                    <input 
                      id="photo-upload"
                      type="file" 
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      aria-label="Upload Biometric Photo"
                    />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-white text-xs font-bold uppercase tracking-tight">Upload Profile Image</p>
                    <p className="text-zinc-500 text-[10px] leading-relaxed">Used for GCP Vision AI face verification. Must be a clear portrait.</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="legal-name" className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Legal Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary/60" aria-hidden="true" />
                  <input 
                    id="legal-name"
                    type="text" 
                    required
                    className="w-full pl-12 pr-4 py-4 rounded-2xl border border-white/10 bg-zinc-950 text-white focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all font-medium placeholder:text-zinc-700"
                    placeholder="Enter your name as per Aadhar"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="dob" className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Date of Birth</label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary/60" aria-hidden="true" />
                    <input 
                      id="dob"
                      type="date" 
                      required
                      className="w-full pl-12 pr-4 py-4 rounded-2xl border border-white/10 bg-zinc-950 text-white focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all font-medium [color-scheme:dark]"
                      value={formData.dob}
                      onChange={(e) => setFormData({...formData, dob: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="gender" className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Gender</label>
                  <select 
                    id="gender"
                    className="w-full px-4 py-4 rounded-2xl border border-white/10 bg-zinc-950 text-white focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all font-medium cursor-pointer appearance-none"
                    value={formData.gender}
                    onChange={(e) => setFormData({...formData, gender: e.target.value})}
                  >
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="address" className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Residential Address</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-4 w-5 h-5 text-primary/60" aria-hidden="true" />
                  <textarea 
                    id="address"
                    required
                    className="w-full pl-12 pr-4 py-4 rounded-2xl border border-white/10 bg-zinc-950 text-white focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all font-medium placeholder:text-zinc-700 min-h-[120px] resize-none"
                    placeholder="Enter your permanent address"
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                  />
                </div>
              </div>

              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium flex items-start gap-3"
                  >
                    <div className="mt-0.5">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <p>{error}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              <Button type="submit" className="w-full h-16 rounded-2xl text-base font-black bg-white text-black hover:bg-zinc-200 shadow-[0_20px_40px_rgba(255,255,255,0.1)] group overflow-hidden relative">
                <span className="relative z-10 flex items-center gap-2">
                  VERIFY & GENERATE e-EPIC
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </Button>
            </form>
          </div>

          <div className="relative flex justify-center">
            {/* Visual background for the card */}
            <div className="absolute -inset-20 bg-primary/5 blur-[100px] rounded-full" />
            
            <AnimatePresence mode="wait">
              {!isGenerated ? (
                <motion.div 
                  key="placeholder"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.1 }}
                  className="w-full max-w-[380px] aspect-[1/1.6] bg-zinc-900/50 rounded-[3rem] border-4 border-dashed border-white/5 flex flex-col items-center justify-center text-zinc-600 p-12 text-center gap-6 backdrop-blur-xl"
                >
                  <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center border border-white/10">
                    <Sparkles className="w-10 h-10 text-primary/40 animate-pulse" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-lg font-black text-white/40 uppercase tracking-tighter">Identity Pending</p>
                    <p className="text-sm font-medium leading-relaxed">Your secure digital voter ID will materialize here once verification is complete.</p>
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  key="card"
                  initial={{ opacity: 0, rotateY: 90, scale: 0.8 }}
                  animate={{ opacity: 1, rotateY: 0, scale: 1 }}
                  transition={{ type: "spring", stiffness: 100, damping: 15 }}
                  className="w-full max-w-[380px] bg-zinc-950 rounded-[2.5rem] shadow-[0_40px_80px_rgba(0,0,0,0.8)] overflow-hidden border border-white/10 flex flex-col relative group"
                >
                  {/* Gloss Effect */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/5 via-transparent to-transparent pointer-events-none" />
                  
                  {/* Header */}
                  <div className="bg-white p-6 text-black flex justify-between items-center">
                    <div className="space-y-1">
                      <div className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Election Commission of India</div>
                      <div className="text-lg font-black tracking-tighter">DIGITAL e-EPIC</div>
                    </div>
                    <ShieldCheck className="w-8 h-8 text-primary" />
                  </div>

                  <div className="p-8 space-y-8 flex-1">
                    <div className="flex gap-6">
                      <div className="absolute top-20 right-10 w-24 h-32 bg-zinc-950 rounded-lg border border-white/10 overflow-hidden">
                        {photo ? (
                          <img src={photo} alt="Avatar" className="w-full h-full object-cover grayscale contrast-125" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-zinc-800">
                            <User className="w-10 h-10" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-primary/10 mix-blend-overlay" />
                      </div>
                      <div className="flex-1 space-y-5 pt-2">
                        <div>
                          <div className="text-[10px] font-black text-primary uppercase tracking-widest">EPIC NUMBER</div>
                          <div className="text-2xl font-black font-mono tracking-tighter text-white">{epicNumber}</div>
                        </div>
                        <div className="space-y-2">
                           <div className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">Authentication Status</div>
                           <div className="w-full h-1.5 bg-zinc-900 rounded-full overflow-hidden">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: "85%" }}
                                className="h-full bg-primary" 
                              />
                           </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-5 border-t border-white/5 pt-6">
                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <div className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Full Name</div>
                          <div className="text-sm font-black text-white uppercase tracking-tight">{formData.name}</div>
                        </div>
                        <div>
                          <div className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">DOB / Age</div>
                          <div className="text-sm font-black text-white">{formData.dob}</div>
                        </div>
                      </div>
                      <div>
                        <div className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Residential Address</div>
                        <div className="text-[11px] font-medium leading-relaxed text-zinc-400 line-clamp-2">
                          {formData.address}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-end pt-6 border-t border-white/5">
                      <div className="space-y-2">
                         <QrCode className="w-14 h-14 text-white" />
                         <div className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">Secure QR-Link</div>
                      </div>
                      <div className="text-right space-y-1">
                         <div className="text-xs font-black text-primary uppercase tracking-widest">Authenticated Proof</div>
                         <div className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest">ECI-VERIFIED · {new Date().getFullYear()}</div>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 bg-zinc-900/50 border-t border-white/5 flex gap-4">
                    <Button variant="outline" className="flex-1 rounded-xl h-12 text-[10px] font-black uppercase tracking-widest border-white/10 hover:bg-white hover:text-black transition-all">
                      <Download className="w-3 h-3 mr-2" /> Download
                    </Button>
                    <Button 
                      onClick={() => document.getElementById('polling-booth')?.scrollIntoView({ behavior: 'smooth' })} 
                      className="flex-1 rounded-xl h-12 text-[10px] font-black uppercase tracking-widest bg-primary text-black hover:bg-primary/80 shadow-[0_10px_20px_rgba(var(--primary),0.3)]"
                    >
                      Find Booth
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
