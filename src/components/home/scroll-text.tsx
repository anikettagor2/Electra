"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { Database, Zap, Cpu, Terminal } from "lucide-react";

function ScrollText() {
    const textRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);
        
        const words = textRef.current?.querySelectorAll(".word");
        if (words) {
            gsap.fromTo(words, 
                { opacity: 0.05, filter: "blur(4px)" },
                {
                    opacity: 1,
                    filter: "blur(0px)",
                    stagger: 0.08,
                    scrollTrigger: {
                        trigger: textRef.current,
                        start: "top 75%",
                        end: "bottom 30%",
                        scrub: true,
                    }
                }
            );
        }
    }, []);

    const text = "We simulate democratic outcomes. Our AI models analyze demographic trends across key voter blocks, projecting election results with surgical precision and predictive modeling.";

    const features = [
        { icon: Cpu, label: "Advanced AI Modeling" },
        { icon: Zap, label: "Unlimited Simulations" }, 
        { icon: Database, label: "Real-time Forecasting" },
        { icon: Terminal, label: "Scenario Analysis" }
    ];

    return (
        <section className="bg-black py-40 md:py-60 px-6 selection:bg-primary selection:text-white">
            <div className="max-w-6xl mx-auto">
                {/* Main Text */}
                <div ref={textRef} className="mb-32">
                    <p className="text-3xl sm:text-4xl md:text-6xl font-black text-white leading-[1.1] tracking-tighter font-heading uppercase italic">
                        {text.split(" ").map((word, i) => (
                            <span key={i} className="word inline-block mr-[0.25em]">{word}</span>
                        ))}
                    </p>
                </div>

                {/* Feature Pills */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((feature, i) => (
                        <div 
                            key={i} 
                            className="flex items-center gap-4 px-6 py-5 rounded-[2rem] bg-zinc-950 border border-white/5 hover:border-primary/40 transition-all group"
                        >
                            <feature.icon className="w-5 h-5 text-primary shrink-0 group-hover:scale-110 transition-transform" />
                            <span className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.2em] font-mono">{feature.label}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export { ScrollText };
