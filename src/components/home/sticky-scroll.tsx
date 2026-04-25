"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import Image from "next/image";

const PROCESS_STEPS = [
    {
        step: "01",
        title: "Demographic Ingest",
        description: "Input localized voter profiles, historical turnouts, and budget constraints into our secure simulation engine.",
        image: "https://images.unsplash.com/photo-1540910419316-ce0173bc6ec1?q=80&w=2000&auto=format&fit=crop"
    },
    {
        step: "02",
        title: "Strategy Calibration",
        description: "Adjust your campaign variables. Target specific states, optimize budget allocation, and see projected shifts in sentiment.",
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2000&auto=format&fit=crop"
    },
    {
        step: "03",
        title: "Outcome Projection",
        description: "Receive high-fidelity Gemini 1.5 Pro analysis detailing win probability, vote share margins, and strategic vulnerabilities.",
        image: "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?q=80&w=2000&auto=format&fit=crop"
    }
];

export function StickyScroll() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const pinRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);

        const ctx = gsap.context(() => {
            const items = gsap.utils.toArray<HTMLElement>(".sticky-content-item");
            const images = gsap.utils.toArray<HTMLElement>(".sticky-image-item");

            ScrollTrigger.create({
                trigger: sectionRef.current,
                start: "top top",
                end: "bottom bottom",
                pin: pinRef.current,
                pinSpacing: false,
            });

            items.forEach((item, i) => {
                const img = images[i];
                
                ScrollTrigger.create({
                    trigger: item,
                    start: "top 40%",
                    end: "bottom 40%",
                    onToggle: (self) => {
                        if (self.isActive) {
                            gsap.to(img, { opacity: 1, scale: 1, zIndex: 10, duration: 0.6, ease: "power2.out", overwrite: "auto" });
                            gsap.to(item, { opacity: 1, x: 20, duration: 0.4 });
                        } else {
                            gsap.to(img, { opacity: 0, scale: 1.05, zIndex: 0, duration: 0.6, ease: "power2.out", overwrite: "auto" });
                            gsap.to(item, { opacity: 0.3, x: 0, duration: 0.4 });
                        }
                    }
                });
            });

            gsap.set(items.slice(1), { opacity: 0.3 });
            gsap.set(images.slice(1), { opacity: 0, scale: 1.05 });
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} className="relative bg-black py-24 sm:py-40 px-6 overflow-hidden">
            <div className="max-w-7xl mx-auto mb-24">
                <span className="text-primary text-[10px] font-black uppercase tracking-[0.4em] mb-4 block font-mono">PROTOCOL // SIMULATION</span>
                <h2 className="text-4xl sm:text-6xl md:text-8xl font-black text-white mb-8 font-heading tracking-tighter uppercase leading-[0.85]">
                    The Predictive <br />
                    <span className="text-zinc-800 italic">Methodology</span>
                </h2>
                <p className="text-lg text-zinc-500 max-w-2xl font-jakarta">
                    Surgical precision in data modeling. We've optimized the forecasting process to deliver political intelligence at the speed of strategy.
                </p>
            </div>

            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start gap-20">
                <div className="w-full md:w-1/2 space-y-32 sm:space-y-[45vh] py-[10vh]">
                    {PROCESS_STEPS.map((item, i) => (
                        <div key={i} className="sticky-content-item transition-all duration-500">
                            <div className="flex items-center gap-4 mb-8">
                                <span className="text-7xl font-black text-white/5 font-heading italic">{item.step}</span>
                            </div>
                            <h3 className="text-2xl sm:text-4xl font-black text-white mb-6 uppercase tracking-tighter font-heading">
                                {item.title}
                            </h3>
                            <p className="text-zinc-500 text-lg max-w-lg leading-relaxed font-mono text-sm leading-[1.8]">
                                <span className="text-primary mr-2">{">"}</span> {item.description}
                            </p>
                            <div className="block md:hidden mt-8 relative w-full aspect-video rounded-3xl overflow-hidden border border-white/5 shadow-2xl">
                                <Image src={item.image} alt={item.title} fill className="object-cover opacity-60" />
                            </div>
                        </div>
                    ))}
                </div>

                <div className="hidden md:block w-1/2 h-screen">
                    <div ref={pinRef} className="relative w-full aspect-square max-h-[70vh] rounded-[3rem] overflow-hidden border border-white/5 bg-zinc-900/50 backdrop-blur-3xl shadow-2xl">
                        {PROCESS_STEPS.map((item, i) => (
                            <div key={i} className="sticky-image-item absolute inset-0 w-full h-full p-4">
                                <div className="relative w-full h-full rounded-[2.5rem] overflow-hidden">
                                     <Image src={item.image} alt={item.title} fill priority={i === 0} className="object-cover opacity-60 group-hover:opacity-80 transition-opacity" />
                                     <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                                </div>
                            </div>
                        ))}
                        
                        <div className="absolute top-8 right-8 z-30 flex gap-1">
                            {PROCESS_STEPS.map((_, i) => (
                                <div key={i} className="w-4 h-1 rounded-full bg-white/10" />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
