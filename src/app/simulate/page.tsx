"use client";

import { useResultStore } from '@/stores/useResultStore';
import { StepFlow } from '@/features/simulation/StepFlow';
import { SimulationPanel } from '@/features/simulation/SimulationPanel';
import { ResultDashboard } from '@/features/results/ResultDashboard';
import { ExpenditureStats } from '@/features/simulation/ExpenditureStats';
import { Chatbot } from '@/features/simulation/Chatbot';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';

export default function SimulatePage() {
  const { status } = useResultStore();

  return (
    <div className="min-h-screen bg-black text-white selection:bg-primary/20 selection:text-primary font-sans relative overflow-hidden">
      <Navbar />
      
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-black to-black -z-10" />
      
      <main className="container mx-auto px-4 pt-32 pb-16 min-h-screen">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-amber-400">
            Electra Sim Engine
          </h1>
          <p className="mt-4 text-zinc-400 max-w-2xl mx-auto">
            Configure your parameters and run cause-and-effect scenarios powered by Gemini 1.5 Pro to predict electoral outcomes.
          </p>
        </div>

        {status === 'idle' ? (
          <div className="space-y-24">
            <div className="space-y-8">
              <StepFlow />
              <SimulationPanel />
            </div>
            
            <section className="relative py-12 px-6 rounded-3xl bg-zinc-900/50 border border-zinc-800 shadow-inner">
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-indigo-500 to-transparent rounded-l-3xl" />
              <div className="max-w-4xl mx-auto">
                <h2 className="text-2xl font-bold mb-8 text-zinc-200 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400 text-sm">
                    📊
                  </span>
                  Historical Expenditure vs Work Done
                </h2>
                <ExpenditureStats />
                <p className="mt-8 text-sm text-zinc-500 text-center italic">
                  * Based on historical data of major political parties in recent Indian elections.
                </p>
              </div>
            </section>
          </div>
        ) : (
          <ResultDashboard />
        )}
      </main>

      <Chatbot />
      <Footer />
    </div>
  );
}
