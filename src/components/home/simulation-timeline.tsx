"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { Play, Database, Layers, BarChart3, Binary, Terminal, Activity, Globe } from "lucide-react";

export function SimulationTimeline() {
    const containerRef = useRef<HTMLDivElement>(null);
    const timelineRef = useRef<HTMLDivElement>(null);
    const playheadRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);

        const ctx = gsap.context(() => {
            ScrollTrigger.create({
                trigger: containerRef.current,
                start: "top top",
                end: "+=200%",
                pin: true,
                scrub: 1,
            });

            gsap.to(playheadRef.current, {
                left: "100%",
                ease: "none",
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top top",
                    end: "+=200%",
                    scrub: 0.5,
                }
            });

            gsap.from(".timeline-clip", {
                x: (i) => (i % 2 === 0 ? -100 : 100),
                opacity: 0,
                stagger: 0.1,
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top 80%",
                    end: "top 20%",
                    scrub: 1,
                }
            });

            gsap.to(".floating-tool", {
                y: -10,
                duration: 2,
                repeat: -1,
                yoyo: true,
                stagger: 0.2,
                ease: "power1.inOut"
            });
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={containerRef} className="relative h-screen bg-black overflow-hidden flex flex-col justify-center px-10 selection:bg-primary selection:text-white">
            {/* Ambient Background Lights */}
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/10 blur-[150px] rounded-full" />
            <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-violet-600/10 blur-[150px] rounded-full" />

            <div className="relative z-10 max-w-7xl mx-auto w-full">
                <div className="space-y-4 mb-16">
                     <span className="text-primary text-[10px] font-black uppercase tracking-[0.4em] font-mono">PROTOCOL // INTERFACE</span>
                     <h2 className="text-4xl md:text-7xl font-black uppercase text-white tracking-tighter font-heading italic">
                        Simulation <span className="text-zinc-800">Center</span>
                    </h2>
                </div>

                {/* Simulated Workspace */}
                <div className="relative bg-zinc-950/50 backdrop-blur-3xl border border-white/5 rounded-[3rem] overflow-hidden shadow-2xl">
                    {/* Header */}
                    <div className="flex items-center gap-6 px-10 py-6 border-b border-white/5 bg-black/40">
                        <div className="flex items-center gap-2">
                             <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                             <span className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-widest">Live_Inference_Stream</span>
                        </div>
                        <div className="h-4 w-px bg-white/10 mx-2" />
                        <div className="flex gap-6">
                            <Play className="w-4 h-4 text-primary fill-current cursor-pointer hover:scale-110 transition-transform" />
                            <Database className="floating-tool w-4 h-4 text-zinc-600 hover:text-white transition-colors cursor-pointer" />
                            <Layers className="floating-tool w-4 h-4 text-zinc-600 hover:text-white transition-colors cursor-pointer" />
                            <BarChart3 className="floating-tool w-4 h-4 text-zinc-600 hover:text-white transition-colors cursor-pointer" />
                            <Globe className="floating-tool w-4 h-4 text-zinc-600 hover:text-white transition-colors cursor-pointer" />
                        </div>
                        <div className="ml-auto flex items-center gap-4">
                             <Terminal className="w-4 h-4 text-zinc-700" />
                             <span className="text-[11px] font-mono font-bold text-primary">00:24:12:15_LATENCY</span>
                        </div>
                    </div>

                    {/* Timeline Tracks */}
                    <div ref={timelineRef} className="p-12 space-y-6 relative min-h-[300px]">
                        {/* Playhead */}
                        <div ref={playheadRef} className="absolute top-0 bottom-0 w-px bg-primary z-20 left-0 shadow-[0_0_20px_rgba(99,102,241,1)]">
                            <div className="absolute -top-1 -left-1.5 w-4 h-4 bg-primary rotate-45" />
                        </div>

                        {/* Track 1 (Direct Video) */}
                        <div className="h-20 bg-white/[0.02] rounded-2xl relative overflow-hidden border border-white/5">
                            <div className="absolute left-[10%] w-[35%] h-full bg-primary/10 border-x border-primary/20 timeline-clip flex items-center px-6">
                                <span className="text-[9px] font-black text-primary uppercase tracking-[0.2em] font-mono italic">Demographic_Vectors</span>
                            </div>
                            <div className="absolute left-[46%] w-[20%] h-full bg-primary/40 border-x border-primary/60 timeline-clip flex items-center px-6 backdrop-blur-md">
                                <span className="text-[9px] font-black text-white uppercase tracking-[0.2em] font-mono">Sentiment_Pulse</span>
                            </div>
                            <div className="absolute left-[67%] w-[25%] h-full bg-primary/10 border-x border-primary/20 timeline-clip flex items-center px-6">
                                <span className="text-[9px] font-black text-primary uppercase tracking-[0.2em] font-mono italic">Outreach_Model</span>
                            </div>
                        </div>

                        {/* Track 2 (FX/Overlay) */}
                        <div className="h-10 bg-white/[0.02] rounded-xl relative overflow-hidden border border-white/5">
                            <div className="absolute left-[15%] w-[12%] h-full bg-violet-500/10 border-x border-violet-500/30 timeline-clip" />
                            <div className="absolute left-[50%] w-[15%] h-full bg-violet-500/10 border-x border-violet-500/30 timeline-clip" />
                        </div>

                        {/* Track 3 (Spectrum) */}
                        <div className="h-16 bg-white/[0.02] rounded-xl relative overflow-hidden border border-white/5">
                            <div className="absolute inset-0 px-4 flex items-center gap-1 opacity-5">
                                {[40, 70, 45, 90, 65, 30, 85, 50, 75, 40, 95, 60, 35, 80, 55, 90, 45, 0, 30, 85, 60, 40, 95, 50, 75, 35, 80, 45, 90, 60, 70, 30, 80, 40, 90].map((height, i) => (
                                    <div key={i} className="flex-1 bg-white" style={{ height: `${height}%` }} />
                                ))}
                            </div>
                            <div className="absolute left-[0%] w-[45%] h-full bg-blue-500/5 border-x border-blue-500/20 timeline-clip" />
                            <div className="absolute left-[50%] w-[50%] h-full bg-blue-500/5 border-x border-blue-500/20 timeline-clip" />
                        </div>
                    </div>
                </div>

                {/* Narrative Text */}
                <div className="mt-16 max-w-2xl">
                    <p className="text-zinc-500 text-lg leading-relaxed font-mono text-sm uppercase tracking-wide">
                        <span className="text-primary mr-3">{">>"}</span> We don't just analyze past data. We architect predictive scenarios state-by-state, processing millions of variables to ensure every projection is backed by robust AI inference.
                    </p>
                </div>
            </div>
        </section>
    );
}
