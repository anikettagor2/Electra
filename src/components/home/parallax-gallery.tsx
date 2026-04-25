"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import Image from "next/image";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

const GALLERY_IMAGES = [
    { url: "https://images.unsplash.com/photo-1540910077472-7bc0272b5314?q=80&w=2000", size: "col-span-1 row-span-2", speed: 0.1 }, // Voting
    { url: "https://images.unsplash.com/photo-1575320181282-9afab399332c?q=80&w=2000", size: "col-span-1 row-span-1", speed: 0.2 }, // Parliament
    { url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2000", size: "col-span-2 row-span-1", speed: -0.15 }, // Dashboard
    { url: "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?q=80&w=2000", size: "col-span-1 row-span-1", speed: 0.3 }, // Gov building
    { url: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=2000", size: "col-span-1 row-span-2", speed: -0.25 }, // Data center
];

function TiltCard({ img, i }: { img: any, i: number }) {
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseXSpring = useSpring(x);
    const mouseYSpring = useSpring(y);

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        x.set(mouseX / width - 0.5);
        y.set(mouseY / height - 0.5);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className={`parallax-item relative overflow-hidden rounded-[2.5rem] border border-white/5 bg-zinc-950 ${img.size} min-h-[300px] md:min-h-[400px] group transition-all duration-500 hover:border-primary/40`}
        >
            <div style={{ transform: "translateZ(50px)" }} className="absolute inset-0">
                <Image 
                    src={img.url} 
                    alt={`Archive ${i}`} 
                    fill 
                    className="object-cover opacity-60 transition-transform duration-700 group-hover:scale-110 group-hover:opacity-80"
                    sizes="(max-width: 768px) 100vw, 33vw"
                />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80 z-10" />
            
            <div style={{ transform: "translateZ(100px)" }} className="absolute top-8 left-8 z-20">
                 <div className="px-3 py-1 bg-black/40 backdrop-blur-md border border-white/10 rounded-full">
                      <span className="text-[8px] font-black text-white/40 tracking-[0.3em] font-mono">0{i+1} // ARCHIVE</span>
                 </div>
            </div>

            <div style={{ transform: "translateZ(75px)" }} className="absolute bottom-8 left-8 z-20 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                <span className="text-white font-black uppercase text-2xl tracking-tighter font-heading italic">Modeled Outcomes</span>
            </div>
        </motion.div>
    );
}

export function ParallaxGallery() {
    const sectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);

        const ctx = gsap.context(() => {
            gsap.utils.toArray(".parallax-item").forEach((item: any) => {
                gsap.fromTo(item, 
                    { y: "50px" },
                    {
                        y: "-150px",
                        ease: "none",
                        scrollTrigger: {
                            trigger: item,
                            start: "top bottom",
                            end: "bottom top",
                            scrub: true
                        }
                    }
                );
            });
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} className="bg-black py-24 sm:py-40 px-6 overflow-hidden selection:bg-primary">
            <div className="max-w-7xl mx-auto space-y-24">
                <div className="flex flex-col md:flex-row items-end justify-between gap-8">
                    <div className="max-w-2xl">
                        <span className="text-primary text-[10px] font-black uppercase tracking-[0.5em] mb-4 block font-mono">SIMULATED // SCENARIOS</span>
                        <h2 className="text-5xl sm:text-7xl md:text-9xl font-black uppercase tracking-tighter text-white font-heading leading-none">
                            Strategic <br />
                            <span className="text-zinc-800 italic">Playbook</span>
                        </h2>
                    </div>
                    <p className="text-zinc-500 max-w-sm text-lg font-mono text-sm leading-relaxed mb-4">
                        A curated gallery of simulated election scenarios. Demographic models. Verified projections.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                    {GALLERY_IMAGES.map((img, i) => (
                        <TiltCard key={i} img={img} i={i} />
                    ))}
                </div>
            </div>
        </section>
    );
}
