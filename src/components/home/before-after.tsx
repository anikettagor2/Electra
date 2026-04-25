"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import Image from "next/image";

export function BeforeAfter() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const revealRef = useRef<HTMLDivElement>(null);
    const barRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);

        const ctx = gsap.context(() => {
            gsap.to(revealRef.current, {
                width: "100%",
                ease: "none",
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top top",
                    end: "+=150%",
                    scrub: true,
                    pin: true,
                }
            });

            gsap.to(barRef.current, {
                left: "100%",
                ease: "none",
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top top",
                    end: "+=150%",
                    scrub: true,
                }
            });
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} className="relative h-screen bg-black overflow-hidden selection:bg-primary">
            {/* Background Narrative */}
            <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
                <h2 className="text-[20vw] font-black uppercase text-white leading-none tracking-tighter italic font-heading">FORESIGHT</h2>
            </div>

            <div className="relative w-full h-full flex flex-col items-center justify-center px-4 sm:px-10 z-10">
                <div className="max-w-6xl w-full mb-12">
                     <span className="text-primary text-[10px] font-black uppercase tracking-[0.4em] mb-4 block font-mono">PREDICTION // PROTOCOL</span>
                     <h2 className="text-3xl sm:text-5xl font-black text-white uppercase font-heading tracking-tighter">Outcome Shift</h2>
                </div>

                <div ref={containerRef} className="relative aspect-video w-full max-w-6xl rounded-3xl sm:rounded-[3rem] overflow-hidden border border-white/5 shadow-2xl">
                    
                    {/* Before Image (Bottom Layer) */}
                    <div className="absolute inset-0 grayscale brightness-50 contrast-125">
                        <Image 
                            src="https://images.unsplash.com/photo-1540910419892-f7ef7173fdd4?q=80&w=2000" 
                            alt="Legacy Polling" 
                            fill 
                            className="object-cover"
                        />
                        <div className="absolute top-10 left-10 p-4 rounded-2xl bg-black/60 backdrop-blur-md border border-white/10">
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 font-mono italic">CURRENT_POLLING</span>
                        </div>
                    </div>

                    {/* After Image (Top Layer) */}
                    <div ref={revealRef} className="absolute inset-0 z-10 w-0 overflow-hidden border-r border-primary/50 shadow-[15px_0_50px_rgba(99,102,241,0.3)]">
                        <div className="absolute inset-0 w-screen max-w-6xl aspect-video">
                            <Image 
                                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2000" 
                                alt="Digital Prediction" 
                                fill 
                                className="object-cover"
                            />
                            <div className="absolute bottom-10 right-10 p-4 rounded-2xl bg-primary/20 backdrop-blur-md border border-primary/30 shadow-2xl">
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white font-mono italic">PREDICTED_RESULT</span>
                            </div>
                        </div>
                    </div>

                    {/* Progress Marker */}
                    <div ref={barRef} className="absolute top-0 bottom-0 left-0 w-px bg-primary z-20 pointer-events-none shadow-[0_0_20px_rgba(99,102,241,1)]">
                        <div className="absolute top-1/2 -translate-y-1/2 -left-6 w-12 h-12 rounded-full bg-black border border-primary/50 flex items-center justify-center shadow-2xl backdrop-blur-xl">
                            <div className="flex gap-1">
                                <div className="w-1 h-4 bg-primary rounded-full animate-pulse" />
                                <div className="w-1 h-2 bg-primary/50 rounded-full" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
