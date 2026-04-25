"use client";

import { ThemeProvider } from "@/components/theme-provider";
import { BrandingProvider } from "@/lib/context/branding-context";

import { useEffect } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
        <BrandingProvider>
          {children}
        </BrandingProvider>
    </ThemeProvider>
  );
}
