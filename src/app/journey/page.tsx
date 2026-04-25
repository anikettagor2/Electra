"use client";

import { motion } from "framer-motion";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { 
  Users, 
  Calendar, 
  FileText, 
  CheckCircle, 
  ShieldAlert, 
  Megaphone, 
  HandMetal, 
  Fingerprint, 
  BarChart3, 
  Trophy 
} from "lucide-react";
import { VoterRegistration } from "@/features/journey/VoterRegistration";
import { EVMSimulator } from "@/features/journey/EVMSimulator";

const STAGES = [
  {
    title: "Electoral Rolls",
    description: "Preparation and revision of the list of eligible voters by the ECI.",
    icon: Users,
    color: "text-blue-400",
    bg: "bg-blue-400/10",
    simulator: VoterRegistration
  },
  {
    title: "Election Schedule",
    description: "Official announcement of poll dates and implementation of the Model Code of Conduct.",
    icon: Calendar,
    color: "text-purple-400",
    bg: "bg-purple-400/10",
  },
  {
    title: "Issue of Notification",
    description: "Formal call for candidates to file their nominations for the respective constituencies.",
    icon: FileText,
    color: "text-indigo-400",
    bg: "bg-indigo-400/10",
  },
  {
    title: "Nominations & Scrutiny",
    description: "Filing of nomination papers by candidates and rigorous vetting by the ECI.",
    icon: ShieldAlert,
    color: "text-amber-400",
    bg: "bg-amber-400/10",
  },
  {
    title: "Withdrawal Period",
    description: "The timeframe allowed for candidates to withdraw their names from the contest.",
    icon: CheckCircle,
    color: "text-emerald-400",
    bg: "bg-emerald-400/10",
  },
  {
    title: "Campaign Period",
    description: "Political parties engage in rallies, digital outreach, and manifesto releases.",
    icon: Megaphone,
    color: "text-rose-400",
    bg: "bg-rose-400/10",
  },
  {
    title: "Polling Day",
    description: "Voters cast their ballots using Electronic Voting Machines (EVMs) and VVPATs.",
    icon: Fingerprint,
    color: "text-cyan-400",
    bg: "bg-cyan-400/10",
    simulator: EVMSimulator
  },
  {
    title: "Counting of Votes",
    description: "Secure counting of EVM data under the supervision of the Returning Officer.",
    icon: BarChart3,
    color: "text-orange-400",
    bg: "bg-orange-400/10",
  },
  {
    title: "Declaration of Results",
    description: "Official announcement of the winners and issue of certificate of election.",
    icon: Trophy,
    color: "text-yellow-400",
    bg: "bg-yellow-400/10",
  },
  {
    title: "Government Formation",
    description: "The final step where the majority party or coalition forms the new administration.",
    icon: HandMetal,
    color: "text-zinc-400",
    bg: "bg-zinc-400/10",
  }
];

export default function JourneyPage() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-primary/20 selection:text-primary">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-32 pb-24">
        <div className="max-w-4xl mx-auto text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-bold uppercase tracking-widest mb-6"
          >
            <ShieldAlert className="w-3 h-3" />
            Educational Module
          </motion.div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-zinc-500">
            The 10-Stage Election Lifecycle
          </h1>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto leading-relaxed">
            Explore the rigorous process managed by the Election Commission of India (ECI) to ensure a free and fair democratic exercise.
          </p>
        </div>

        <div className="relative max-w-5xl mx-auto">
          {/* Vertical Line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-zinc-800 hidden md:block" />

          <div className="space-y-12 md:space-y-24">
            {STAGES.map((stage, i) => (
              <motion.div
                key={stage.title}
                initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className={`relative flex flex-col ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-8 md:gap-16`}
              >
                {/* Number Indicator */}
                <div className="absolute left-1/2 -translate-x-1/2 top-0 md:top-1/2 md:-translate-y-1/2 w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-xs font-bold z-10 hidden md:flex">
                  {i + 1}
                </div>

                <div className="flex-1 w-full">
                  <div className={`p-8 rounded-3xl border border-white/5 bg-zinc-900/30 backdrop-blur-sm hover:bg-zinc-900/50 transition-all group`}>
                    <div className={`w-14 h-14 rounded-2xl ${stage.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                      <stage.icon className={`w-7 h-7 ${stage.color}`} />
                    </div>
                    <h3 className="text-2xl font-bold mb-3 tracking-tight">{stage.title}</h3>
                    <p className="text-zinc-400 leading-relaxed mb-8">
                      {stage.description}
                    </p>

                    {stage.simulator && (
                      <div className="mt-8 border-t border-white/5 pt-8">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 text-[10px] font-black uppercase tracking-widest mb-6">
                          <Fingerprint className="w-3 h-3" />
                          Interactive Experience
                        </div>
                        <stage.simulator />
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex-1 hidden md:block" />
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="mt-32 p-12 rounded-[3rem] bg-gradient-to-br from-indigo-600 to-violet-700 text-center text-white overflow-hidden relative"
        >
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
          <h2 className="text-3xl md:text-5xl font-black tracking-tighter mb-6 relative">Ready to apply these stages?</h2>
          <p className="text-indigo-100 text-lg mb-10 max-w-xl mx-auto relative">
            Take your knowledge to the next level by running a high-fidelity simulation of an actual election campaign.
          </p>
          <a
            href="/simulate"
            className="inline-flex items-center gap-3 px-10 py-5 bg-white text-indigo-600 rounded-2xl font-black text-lg hover:scale-105 transition-transform relative shadow-2xl"
          >
            Start AI Simulation
          </a>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
