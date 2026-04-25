"use client";

import React, { createContext, useContext, useState } from "react";

interface BrandingContextType {
    logoUrl: string | null;
    isLoading: boolean;
}

const BrandingContext = createContext<BrandingContextType>({
    logoUrl: null,
    isLoading: false,
});

export function BrandingProvider({ children }: { children: React.ReactNode }) {
    const [logoUrl] = useState<string | null>(null);
    const [isLoading] = useState(false);

    return (
        <BrandingContext.Provider value={{ logoUrl, isLoading }}>
            {children}
        </BrandingContext.Provider>
    );
}

export const useBranding = () => useContext(BrandingContext);
