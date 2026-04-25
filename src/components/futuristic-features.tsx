"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";
import { BarChart3, Brain, Target, Wallet, GitBranch, LayoutDashboard } from "lucide-react";

const features = [
  {
    title: "Predictive Analytics",
    description: "Go beyond polling. Our models use historical data and current trends to project election outcomes with high precision.",
    icon: <BarChart3 className="w-10 h-10" />,
    color: "var(--neon-blue)"
  },
  {
    title: "Gemini 1.5 Pro AI",
    description: "Leveraging state-of-the-art Large Language Models to simulate complex voter reasoning and socio-political dynamics.",
    icon: <Brain className="w-10 h-10" />,
    color: "var(--neon-purple)"
  },
  {
    title: "Demographic Targeting",
    description: "Identify key voter segments across urban, rural, and youth populations to optimize campaign messaging.",
    icon: <Target className="w-10 h-10" />,
    color: "var(--neon-pink)"
  },
  {
    title: "Budget Modeling",
    description: "Simulate the impact of every dollar spent. Find the optimal split between digital, ground, and traditional media.",
    icon: <Wallet className="w-10 h-10" />,
    color: "var(--neon-green)"
  },
  {
    title: "Scenario Planning",
    description: "What if turnout drops? What if a key decision backfires? Model thousands of 'What-If' scenarios instantly.",
    icon: <GitBranch className="w-10 h-10" />,
    color: "var(--primary)"
  },
  {
    title: "Outcome Visualization",
    description: "Transform complex data into intuitive, high-fidelity dashboards that reveal the clear path to victory.",
    icon: <LayoutDashboard className="w-10 h-10" />,
    color: "var(--neon-blue)"
  }
];

export function FuturisticFeatures() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    if (!sectionRef.current) return;
    const cards = gsap.utils.toArray(".feature-card");
    
    cards.forEach((card: any) => {
      gsap.fromTo(card, 
        { opacity: 0, y: 50, scale: 0.95 },
        {
          opacity: 1, y: 0, scale: 1,
          duration: 0.8,
          scrollTrigger: {
            trigger: card,
            start: "top 90%",
            end: "top 70%",
            scrub: true,
          }
        }
      );
    });

    return () => ScrollTrigger.getAll().forEach(t => t.kill());
  }, []);

  return (
    <section ref={sectionRef} id="services" className="py-32 relative bg-transparent z-10">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="text-center mb-24 flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-primary font-black tracking-[0.4em] uppercase text-xs mb-4"
          >
            Capabilities
          </motion.div>
          <h2 className="text-4xl md:text-7xl font-black mb-6 tracking-tighter uppercase text-white">
            Precision Election <span className="text-primary italic">Intelligence</span>
          </h2>
          <p className="text-gray-400 max-w-2xl text-lg font-medium">
            We operate at the intersection of data science and political strategy to deliver projections that conventional pollsters can only dream of.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="feature-card futuristic-card p-10 rounded-[2.5rem] group border border-white/5 bg-white/[0.02] backdrop-blur-3xl flex flex-col items-center text-center transition-all duration-500 hover:border-primary/50 hover:bg-white/[0.05]"
            >
              <div className="mb-10 p-6 rounded-[2rem] bg-black/40 border border-white/10 text-primary group-hover:scale-110 group-hover:bg-primary/10 group-hover:border-primary/50 transition-all duration-500">
                <div style={{ color: feature.color }}>{feature.icon}</div>
              </div>
              <h3 className="text-2xl font-black mb-4 tracking-tight group-hover:text-primary transition-colors text-white">{feature.title}</h3>
              <p className="text-gray-400 leading-relaxed font-medium">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}