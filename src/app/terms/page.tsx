"use client";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { LenisProvider } from "@/components/home/lenis-provider";
import { Gavel, RefreshCcw, FileCheck, AlertCircle, Scale } from "lucide-react";

export default function TermsPage() {
  const terms = [
    {
      title: "Service Delivery",
      icon: Gavel,
      content: "All simulation and analytical services are provided on a per-simulation or subscription basis. Inference times are estimates and may vary based on model complexity and data volume."
    },
    {
      title: "Intellectual Property",
      icon: FileCheck,
      content: "You retain 100% ownership of all input data and specific simulation outputs. Electra reserves the right to use aggregated, anonymized metadata to improve its predictive algorithms."
    },
    {
      title: "Financial Protocols",
      icon: Scale,
      content: "Payments are processed via encrypted gateways. Credits for failed simulations are issued to the user's dashboard balance within 24 hours of initialization."
    },
    {
      title: "Simulation Protocol",
      icon: RefreshCcw,
      content: "Standard plans include 5 rapid re-simulations per project. In-depth reports must be requested within 30 days of the primary simulation. Elite plans offer unlimited real-time drift analysis."
    }
  ];

  return (
    <LenisProvider>
      <main className="bg-black text-zinc-100 overflow-x-hidden min-h-screen font-sans">
        <Navbar />

        {/* Content */}
        <div className="pt-40 pb-20 px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h1 className="text-4xl sm:text-6xl font-bold text-white mb-6 font-heading tracking-tighter">Terms of Service</h1>
              <p className="text-zinc-500 text-xs sm:text-sm uppercase tracking-[0.3em] font-mono">Protocol Active: April 24, 2026</p>
            </div>

            <div className="space-y-8 bg-zinc-900/40 rounded-[2.5rem] border border-white/5 backdrop-blur-md p-8 sm:p-12 mb-12">
              <div className="flex items-start gap-4 p-6 rounded-2xl bg-indigo-500/5 border border-indigo-500/20 mb-8">
                <AlertCircle className="w-6 h-6 text-indigo-400 shrink-0 mt-0.5" />
                <p className="text-indigo-400/90 text-sm leading-relaxed font-sans">
                  Engagement with Electra systems constitutes acceptance of these operational protocols. Please review carefully.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-12">
                {terms.map((term, i) => (
                  <div key={i} className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-white/5 text-indigo-400 border border-white/5 group-hover:bg-indigo-500 group-hover:text-white transition-all">
                        <term.icon className="w-5 h-5" />
                      </div>
                      <h3 className="text-2xl font-bold text-white font-heading">{term.title}</h3>
                    </div>
                    <p className="text-zinc-500 text-base leading-relaxed pl-12 font-sans">{term.content}</p>
                  </div>
                ))}
              </div>

              <div className="pt-8 border-t border-white/5 mt-12 text-center">
                <p className="text-zinc-600 text-xs font-mono">
                  Operational inquiries? Reach out to <span className="text-indigo-400 font-bold">legal@electra-sim.com</span>.
                </p>
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </main>
    </LenisProvider>
  );
}
