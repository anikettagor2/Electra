"use client";

import { LenisProvider } from "@/components/home/lenis-provider";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { AboutContent } from "@/components/about-content";

export default function AboutPage() {
  return (
    <LenisProvider>
      <main className="overflow-x-hidden">
        <Navbar />
        <AboutContent />
        <Footer />
      </main>
    </LenisProvider>
  );
}
