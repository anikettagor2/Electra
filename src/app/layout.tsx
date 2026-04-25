import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Electra | AI-Powered Election Simulation & Journey",
  description: "Experience the Indian electoral process through a high-fidelity immersive journey. Predict outcomes using Google Gemini 1.5 Pro with demographic modeling and real-time strategy analysis.",
  keywords: ["Election Simulation", "Indian Elections", "EVM Simulator", "Voter Journey", "Gemini AI", "Predictive Analytics", "Democracy Tech"],
  authors: [{ name: "Aniket Tagor" }],
  creator: "Aniket Tagor",
  publisher: "Electra Sim Engine",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "Electra | The Future of Election Simulation",
    description: "Immersive 10-stage election journey & predictive simulation engine powered by Google Gemini.",
    url: "https://electra-254006836219.us-central1.run.app",
    siteName: "Electra Sim Engine",
    images: [
      {
        url: "https://electra-254006836219.us-central1.run.app/og-image.png",
        width: 1200,
        height: 630,
        alt: "Electra Election Simulation Dashboard",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Electra | AI-Powered Election Simulation",
    description: "Experience the Indian electoral process with high-fidelity simulations powered by Gemini 1.5 Pro.",
    images: ["https://electra-254006836219.us-central1.run.app/og-image.png"],
    creator: "@anikettagor",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

import { SmoothScroll } from "@/components/smooth-scroll";
import { ContactProvider } from "@/providers/contact-provider";
import { ContactModal } from "@/components/contact-modal";
import { Providers } from "./providers";
import { Toaster } from "sonner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={cn(
          jakarta.variable,
          spaceGrotesk.variable,
          jetbrainsMono.variable,
          "antialiased bg-black text-white min-h-screen selection:bg-primary/20 selection:text-primary font-sans"
        )}
      >
        <a 
          href="#main-content" 
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:px-6 focus:py-3 focus:bg-primary focus:text-white focus:rounded-full focus:font-bold focus:shadow-2xl transition-all"
        >
          Skip to main content
        </a>
        <Providers>
          <ContactProvider>
             <SmoothScroll />
             <ContactModal />
             <Toaster position="top-center" richColors />
             {children}
          </ContactProvider>
        </Providers>
      </body>
    </html>
  );
}
