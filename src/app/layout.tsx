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
  title: "Electra | Premium Election Simulation AI",
  description: "Predict democratic outcomes with unprecedented accuracy. Advanced demographic analysis and real-time scenario simulation.",
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
