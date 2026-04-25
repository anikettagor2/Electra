"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FileText, 
  Users, 
  CheckCircle, 
  XCircle, 
  Megaphone, 
  Vote, 
  BarChart3, 
  Trophy, 
  Building2, 
  Flag,
  ArrowRight
} from "lucide-react";

const STAGES = [
  {
    title: "Election Notification",
    description: "The President or Governor issues the notification as per ECI recommendation.",
    icon: FileText,
    color: "bg-blue-500",
    shadowColor: "shadow-blue-500/20",
    borderColor: "group-hover:border-blue-500/40",
    detail: {
      whoInvolved: ["President of India", "Governor (State)", "Election Commission of India"],
      keyFact: "The Model Code of Conduct (MCC) comes into force the moment the election schedule is announced.",
      duration: "Notification issued 21–48 days before polling.",
      law: "Representation of the People Act, 1951 — Section 73",
    },
  },
  {
    title: "Filing Nominations",
    description: "Candidates file their nomination papers with the Returning Officer.",
    icon: Users,
    color: "bg-purple-500",
    shadowColor: "shadow-purple-500/20",
    borderColor: "group-hover:border-purple-500/40",
    detail: {
      whoInvolved: ["Candidates", "Political Parties", "Returning Officer"],
      keyFact: "A candidate must be an Indian citizen, at least 25 years old for Lok Sabha, and enrolled as a voter.",
      duration: "Nomination window typically 7 days.",
      law: "Representation of the People Act, 1951 — Section 33",
    },
  },
  {
    title: "Scrutiny of Nominations",
    description: "Returning Officers verify the eligibility and documents of all candidates.",
    icon: CheckCircle,
    color: "bg-emerald-500",
    shadowColor: "shadow-emerald-500/20",
    borderColor: "group-hover:border-emerald-500/40",
    detail: {
      whoInvolved: ["Returning Officer", "Assistant Returning Officer", "Candidates' agents"],
      keyFact: "Form 26 (affidavit) must disclose criminal antecedents, assets, liabilities, and educational qualifications.",
      duration: "1 day after last date of nomination.",
      law: "Representation of the People Act, 1951 — Section 36",
    },
  },
  {
    title: "Withdrawal of Candidature",
    description: "Candidates are given a window to withdraw their names if they choose.",
    icon: XCircle,
    color: "bg-rose-500",
    shadowColor: "shadow-rose-500/20",
    borderColor: "group-hover:border-rose-500/40",
    detail: {
      whoInvolved: ["Candidates", "Returning Officer", "Party leadership"],
      keyFact: "After the withdrawal window closes, the final electoral roll of contestants is published along with ballot positions.",
      duration: "2 days after scrutiny.",
      law: "Representation of the People Act, 1951 — Section 37",
    },
  },
  {
    title: "Election Campaign",
    description: "Parties and candidates present their manifestos and reach out to voters.",
    icon: Megaphone,
    color: "bg-orange-500",
    shadowColor: "shadow-orange-500/20",
    borderColor: "group-hover:border-orange-500/40",
    detail: {
      whoInvolved: ["Candidates", "Political Parties", "Star Campaigners", "Media"],
      keyFact: "Campaign spending limits are set by ECI (₹70–95 lakh per LS constituency). The 'Silent Period' begins 48 hours before polling.",
      duration: "From withdrawal deadline to 48 hrs before polling day.",
      law: "Model Code of Conduct + Section 126 of R.P. Act",
    },
  },
  {
    title: "The Polling Day",
    description: "Voters across the nation cast their votes using EVMs and VVPATs.",
    icon: Vote,
    color: "bg-indigo-500",
    shadowColor: "shadow-indigo-500/20",
    borderColor: "group-hover:border-indigo-500/40",
    detail: {
      whoInvolved: ["Voters", "Presiding Officer", "Polling Agents", "CISF/Police"],
      keyFact: "Each polling station serves a maximum of 1,500 voters. VVPAT provides a paper trail for every vote cast on the EVM.",
      duration: "Usually 7 AM – 6 PM on designated date(s).",
      law: "Representation of the People Act, 1951 — Section 62",
    },
  },
  {
    title: "Counting of Votes",
    description: "Votes are counted under strict supervision and transparency.",
    icon: BarChart3,
    color: "bg-cyan-500",
    shadowColor: "shadow-cyan-500/20",
    borderColor: "group-hover:border-cyan-500/40",
    detail: {
      whoInvolved: ["Returning Officer", "Counting Agents", "ECI Observers", "Armed Security"],
      keyFact: "EVM counting halls are CCTV-monitored. Postal ballots are counted first. VVPAT slips from 5 booths per constituency are mandatorily verified.",
      duration: "Usually 1 day after polling ends (or on a specified date).",
      law: "Representation of the People Act, 1951 — Section 64",
    },
  },
  {
    title: "Declaration of Results",
    description: "Winners are officially announced and certificates are issued.",
    icon: Trophy,
    color: "bg-amber-500",
    shadowColor: "shadow-amber-500/20",
    borderColor: "group-hover:border-amber-500/40",
    detail: {
      whoInvolved: ["Returning Officer", "ECI", "Elected Candidates"],
      keyFact: "The elected candidate receives a certificate of election (Form 22). Results are simultaneously published on the ECI portal and Voter Helpline.",
      duration: "Same day as vote counting.",
      law: "Representation of the People Act, 1951 — Section 66",
    },
  },
  {
    title: "Formation of Government",
    description: "The majority party or coalition is invited to form the government.",
    icon: Building2,
    color: "bg-slate-500",
    shadowColor: "shadow-slate-500/20",
    borderColor: "group-hover:border-slate-500/40",
    detail: {
      whoInvolved: ["President / Governor", "Leaders of majority party/coalition", "Council of Ministers"],
      keyFact: "A party needs 272+ seats (simple majority) in Lok Sabha to form a government. If no party gets majority, coalition talks begin.",
      duration: "Within 2–4 weeks of results.",
      law: "Articles 74, 75 & 164 of the Constitution of India",
    },
  },
  {
    title: "Commencement of Term",
    description: "Elected representatives take oath and begin their service.",
    icon: Flag,
    color: "bg-red-600",
    shadowColor: "shadow-red-500/20",
    borderColor: "group-hover:border-red-500/40",
    detail: {
      whoInvolved: ["Elected MPs/MLAs", "President / Governor", "Speaker of Parliament"],
      keyFact: "Members take oath to bear true faith and allegiance to the Constitution. The Lok Sabha term is 5 years unless dissolved earlier.",
      duration: "New government sworn in within 30 days of results.",
      law: "Third Schedule of the Constitution of India",
    },
  },
];

export function ElectionProcess() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-black tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40"
          >
            THE ELECTORAL JOURNEY
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-zinc-400 text-lg max-w-2xl mx-auto uppercase tracking-[0.2em] font-bold"
          >
            Understanding the 10-stage lifecycle of Indian Democracy
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-zinc-600 text-xs font-mono uppercase tracking-widest"
          >
            Scroll down to trace the path of a vote
          </motion.p>
        </div>

        {/* Timeline Container */}
        <div className="relative max-w-4xl mx-auto pb-24 px-4 sm:px-6">
          {/* Central Vertical Line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-white/20 to-transparent -translate-x-1/2" />

          <div className="space-y-24 relative pt-12">
            {STAGES.map((stage, index) => {
              return (
                <div key={stage.title} className="group relative flex flex-col items-center">
                  
                  {/* Timeline Node (Centered above card) */}
                  <div className="absolute -top-12 left-1/2 w-16 h-16 rounded-full bg-zinc-950 border-4 border-zinc-800 -translate-x-1/2 flex items-center justify-center z-10 transition-all duration-500 group-hover:border-primary group-hover:scale-110 shadow-2xl">
                    <span className="text-2xl font-black text-zinc-400 group-hover:text-white transition-colors">{index + 1}</span>
                  </div>

                  {/* Card Container */}
                  <div className="w-full relative z-0 mt-8">
                    <StageCard stage={stage} index={index} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function StageCard({ stage, index }: { stage: (typeof STAGES)[0]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className={`w-full group relative p-8 rounded-[2.5rem] bg-zinc-900/50 border border-white/5 ${stage.borderColor} hover:bg-zinc-900 transition-all duration-300 flex flex-col overflow-hidden`}
    >
      {/* Stage number watermark */}
      <div className="absolute -right-4 -top-4 text-[10rem] font-black text-white/5 group-hover:text-primary/5 transition-colors leading-none pointer-events-none">
        {index + 1}
      </div>

      {/* Icon */}
      <div className={`w-16 h-16 rounded-3xl ${stage.color} flex items-center justify-center mb-8 shadow-2xl ${stage.shadowColor} transition-transform duration-300 group-hover:scale-110`}>
        <stage.icon className="w-8 h-8 text-white" />
      </div>

      {/* Title */}
      <h3 className="text-2xl font-black text-white mb-4 leading-tight uppercase tracking-tight">
        {stage.title}
      </h3>

      {/* Base description */}
      <p className="text-zinc-400 text-base leading-relaxed font-medium mb-8">
        {stage.description}
      </p>

      {/* Expanded detail panel */}
      <div className="space-y-6 flex-1 flex flex-col border-t border-white/5 pt-8">
        {/* Who is involved */}
        <div>
          <p className="text-[10px] font-black text-primary uppercase tracking-[0.25em] mb-3">
            Who's Involved
          </p>
          <div className="flex flex-wrap gap-2">
            {stage.detail.whoInvolved.map((person) => (
              <span
                key={person}
                className="text-[10px] font-bold text-zinc-300 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full"
              >
                {person}
              </span>
            ))}
          </div>
        </div>

        {/* Key fact */}
        <div>
          <p className="text-[10px] font-black text-primary uppercase tracking-[0.25em] mb-2">
            Key Fact
          </p>
          <p className="text-sm text-zinc-300 leading-relaxed font-medium">
            {stage.detail.keyFact}
          </p>
        </div>

        {/* Duration + Law side by side */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-auto pt-6">
          <div className="bg-black/40 rounded-2xl p-4 border border-white/5 flex flex-col justify-center">
            <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-1.5">Duration</p>
            <p className="text-xs font-bold text-zinc-300">{stage.detail.duration}</p>
          </div>
          <div className="bg-black/40 rounded-2xl p-4 border border-white/5 flex flex-col justify-center">
            <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-1.5">Legal Basis</p>
            <p className="text-xs font-bold text-zinc-400 line-clamp-3">{stage.detail.law}</p>
          </div>
        </div>
      </div>

      {/* Stage footer */}
      <div className="mt-8 pt-6 border-t border-white/5 flex items-center gap-3">
        <div className="w-2 h-2 rounded-full bg-primary/40 group-hover:bg-primary transition-colors" />
        <span className="text-[10px] font-black text-zinc-600 group-hover:text-primary/60 uppercase tracking-widest transition-colors">
          Stage {index + 1}
        </span>
        <ArrowRight className="w-4 h-4 text-zinc-700 ml-auto opacity-0 group-hover:opacity-100 group-hover:text-primary transition-all" />
      </div>
    </motion.div>
  );
}
