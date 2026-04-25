"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Navigation, AlertCircle, Loader2, ArrowRight, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Place {
  displayName?: { text: string };
  formattedAddress?: string;
  location?: { latitude: number; longitude: number };
}

export function PollingBoothFinder() {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [places, setPlaces] = useState<Place[]>([]);
  const [fetchingPlaces, setFetchingPlaces] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);

  const API_KEY = "AIzaSyAmvz5aTQ25Tf4_wYP1jdT55MSrPbaFkx8";

  const handleLocate = () => {
    setLoading(true);
    setError(null);
    setSelectedPlace(null);

    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setLocation({ lat, lng });
        setLoading(false);

        // Fetch nearby places via API route
        setFetchingPlaces(true);
        try {
          const res = await fetch("/api/places", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ lat, lng }),
          });
          const data = await res.json();
          if (data.places) {
            setPlaces(data.places);
          }
        } catch (err) {
          console.error("Failed to fetch places", err);
        } finally {
          setFetchingPlaces(false);
        }
      },
      (err) => {
        setError("Unable to retrieve your location. Please ensure location permissions are granted.");
        setLoading(false);
      }
    );
  };

  const mapSrc = selectedPlace && selectedPlace.location
    ? `https://www.google.com/maps/embed/v1/place?key=${API_KEY}&q=${selectedPlace.location.latitude},${selectedPlace.location.longitude}&zoom=17`
    : location 
      ? `https://www.google.com/maps/embed/v1/search?key=${API_KEY}&q=government+school+OR+gram+panchayat+OR+municipal+office&center=${location.lat},${location.lng}&zoom=14`
      : "";

  return (
    <section id="polling-booth" className="py-24 relative overflow-hidden bg-black">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="inline-block px-6 py-2 rounded-full border border-white/10 bg-zinc-900/50 backdrop-blur-xl text-primary text-xs font-black uppercase tracking-[0.4em] mb-6"
          >
            Location Intelligence
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-black tracking-tighter mb-6 text-white uppercase"
          >
            FIND YOUR <span className="text-primary">POLLING BOOTH</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-zinc-400 text-lg max-w-2xl mx-auto font-medium"
          >
            Access your location to securely find the nearest election polling station in your constituency based on your registered address.
          </motion.p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-zinc-900/40 border border-white/5 p-8 md:p-12 rounded-[3rem] relative overflow-hidden shadow-2xl backdrop-blur-xl"
        >
          {!location ? (
            <div className="flex flex-col items-center justify-center py-16 text-center relative z-10">
              <div className="w-32 h-32 bg-primary/5 rounded-full flex items-center justify-center mb-8 border border-primary/20 relative group">
                <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping opacity-20" />
                <MapPin className="w-12 h-12 text-primary group-hover:scale-110 transition-transform" />
              </div>
              
              <h3 className="text-3xl font-black text-white mb-4 uppercase tracking-tight">Locate Nearest Booth</h3>
              <p className="text-zinc-500 mb-12 max-w-md text-lg">
                We need temporary access to your location to accurately find active polling booths around you.
              </p>

              {error && (
                <div className="flex items-center gap-3 text-rose-400 bg-rose-500/10 px-6 py-4 rounded-2xl mb-8 border border-rose-500/20">
                  <AlertCircle className="w-5 h-5" />
                  <p className="text-sm font-medium">{error}</p>
                </div>
              )}

              <button
                onClick={handleLocate}
                disabled={loading}
                className="group relative px-10 py-5 bg-white text-black font-black text-lg uppercase tracking-widest rounded-full overflow-hidden hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:hover:scale-100 shadow-[0_0_40px_rgba(255,255,255,0.1)] hover:shadow-[0_0_60px_rgba(255,255,255,0.2)]"
              >
                <div className="absolute inset-0 bg-primary translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300 ease-in-out" />
                <span className="relative z-10 flex items-center gap-3">
                  {loading ? (
                    <>
                      <Loader2 className="w-6 h-6 animate-spin" />
                      Locating...
                    </>
                  ) : (
                    <>
                      <Navigation className="w-6 h-6" />
                      Grant Location Access
                    </>
                  )}
                </span>
              </button>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* List of Places */}
                <div className="lg:col-span-1 bg-black/40 border border-white/5 rounded-3xl p-6 h-[500px] md:h-[600px] overflow-y-auto">
                  <h4 className="text-xl font-bold text-white mb-6 uppercase tracking-wider flex items-center gap-3">
                    <Building2 className="w-5 h-5 text-primary" />
                    Nearby Booths
                  </h4>
                  
                  {fetchingPlaces ? (
                    <div className="flex flex-col items-center justify-center h-40 gap-4 text-zinc-500">
                      <Loader2 className="w-8 h-8 animate-spin text-primary" />
                      <p>Discovering locations...</p>
                    </div>
                  ) : places.length > 0 ? (
                    <div className="space-y-4">
                      {places.map((place, idx) => {
                        const isSelected = selectedPlace === place;
                        return (
                          <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            key={idx} 
                            onClick={() => setSelectedPlace(place)}
                            className={`p-5 rounded-2xl border transition-colors group cursor-pointer ${isSelected ? 'bg-primary/10 border-primary' : 'bg-zinc-900/50 border-white/5 hover:border-primary/30'}`}
                          >
                            <h5 className={`font-bold transition-colors text-lg mb-2 ${isSelected ? 'text-primary' : 'text-white group-hover:text-primary'}`}>
                              {place.displayName?.text || 'Polling Station'}
                            </h5>
                            <p className="text-sm text-zinc-400 line-clamp-2">
                              {place.formattedAddress}
                            </p>
                          </motion.div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-40 gap-4 text-zinc-500">
                      <AlertCircle className="w-8 h-8 opacity-50" />
                      <p>No nearby locations found.</p>
                    </div>
                  )}
                </div>

                {/* Map */}
                <div className="lg:col-span-2 w-full h-[500px] md:h-[600px] rounded-3xl overflow-hidden relative border border-white/10 shadow-2xl bg-zinc-900/50">
                  <div className="absolute top-6 left-6 z-10 bg-black/80 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/10 flex items-center gap-3 shadow-2xl pointer-events-none">
                    <div className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                    </div>
                    <span className="text-sm font-bold text-white uppercase tracking-widest">
                      {selectedPlace ? 'Selected Booth' : 'Active Zones'}
                    </span>
                  </div>
                  {mapSrc && (
                    <iframe
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      loading="lazy"
                      allowFullScreen
                      referrerPolicy="no-referrer-when-downgrade"
                      src={mapSrc}
                    ></iframe>
                  )}
                </div>
              </div>
              
              <div className="flex justify-center mt-8">
                <Button 
                  onClick={() => document.getElementById('evm-interface')?.scrollIntoView({ behavior: 'smooth' })} 
                  className="px-10 py-8 rounded-full text-base font-black uppercase tracking-widest bg-primary text-black hover:bg-primary/90 shadow-[0_10px_30px_rgba(var(--primary),0.3)] hover:scale-105 transition-all group"
                >
                  <span className="flex items-center gap-3">
                    Proceed to Digital EVM
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}

