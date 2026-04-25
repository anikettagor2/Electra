"use client";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { LenisProvider } from "@/components/home/lenis-provider";
import { Shield, Lock, Eye, FileText, ChevronRight } from "lucide-react";

export default function PrivacyPage() {
  const sections = [
    {
      title: "Data Collection",
      icon: Eye,
      content: "We collect information you provide directly to us, such as when you create an account, initiate a simulation, or contact us. This includes your name, email, campaign data, and polling metrics."
    },
    {
      title: "How We Use Data",
      icon: Shield,
      content: "We use your data to provide our election simulation services, process payments, and generate predictive reports. We strictly adhere to campaign confidentiality and never sell your strategic data to third parties."
    },
    {
      title: "Security Measures",
      icon: Lock,
      content: "We implement military-grade security protocols including end-to-end encryption for strategic data transfers and secure processing via isolated AI compute clusters."
    },
    {
      title: "Cookies",
      icon: FileText,
      content: "We use cookies to maintain your simulation session and analyze platform performance. You can control cookie settings through your browser at any time."
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
              <h1 className="text-4xl sm:text-6xl font-bold text-white mb-6 font-heading tracking-tighter">Privacy Policy</h1>
              <p className="text-zinc-500 text-xs sm:text-sm uppercase tracking-[0.3em] font-mono">Last Synchronized: April 24, 2026</p>
            </div>

            <div className="space-y-8 bg-zinc-900/40 rounded-[2.5rem] border border-white/5 backdrop-blur-md p-8 sm:p-12 mb-12">
              <p className="text-zinc-400 leading-relaxed text-lg">
                At Electra, your privacy and the security of your strategic campaign data are paramount. This policy outlines our commitment to total confidentiality and data protection in our predictive ecosystem.
              </p>

              <div className="grid grid-cols-1 gap-8 pt-6">
                {sections.map((section, i) => (
                  <div key={i} className="flex gap-6 group">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center shrink-0 border border-white/10 group-hover:bg-indigo-500 group-hover:border-indigo-500 group-hover:text-white transition-all duration-300">
                      <section.icon className="w-5 h-5 transition-transform group-hover:scale-110" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2 font-heading">
                        {section.title} <ChevronRight className="w-4 h-4 text-zinc-700" />
                      </h3>
                      <p className="text-zinc-500 leading-relaxed text-sm">{section.content}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-8 border-t border-white/5 mt-8">
                <h3 className="text-xl font-bold text-white mb-4 font-heading">Contacting DPO</h3>
                <p className="text-zinc-500 leading-relaxed text-sm">
                  If you have any questions about this Privacy Policy, please reach out to our Data Protection Officer at <span className="text-indigo-400 font-bold font-mono">privacy@electra-sim.com</span>.
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
