import { useSimulationStore } from '@/stores/useSimulationStore';
import { useUIStore } from '@/stores/useUIStore';
import { useGeminiStream } from '@/hooks/useGeminiStream';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { motion, AnimatePresence } from 'framer-motion';
export const SimulationPanel = () => {
  const { currentStep, nextStep, prevStep } = useUIStore();
  const simulationState = useSimulationStore();
  const { runSimulation } = useGeminiStream();

  const handleRun = () => {
    nextStep();
    runSimulation({
      country: simulationState.country,
      electionType: simulationState.electionType,
      role: simulationState.role,
      budgetSplit: simulationState.budgetSplit,
      keyDecisions: simulationState.keyDecisions,
    });
  };

  return (
    <Card className="w-full max-w-3xl mx-auto shadow-2xl backdrop-blur-xl bg-card/90">
      <CardContent className="p-6">
        <AnimatePresence mode="wait">
          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <CardHeader className="px-0 pt-0">
                <CardTitle className="text-2xl text-indigo-500">Setup Election Scenario</CardTitle>
                <p className="text-muted-foreground">Select the context for your simulation.</p>
              </CardHeader>
              
              <div className="grid gap-6">
                <div>
                  <label htmlFor="country-select" className="text-sm font-medium mb-2 block text-zinc-300">Country</label>
                  <select
                    id="country-select"
                    className="w-full p-2.5 rounded-lg border border-zinc-800 bg-zinc-950 text-white focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all"
                    value={simulationState.country}
                    onChange={(e) => simulationState.setCountry(e.target.value)}
                  >
                    <option value="India">India</option>
                    <option value="USA">USA</option>
                    <option value="UK">UK</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="election-type-select" className="text-sm font-medium mb-2 block text-zinc-300">Election Type</label>
                  <select
                    id="election-type-select"
                    className="w-full p-2.5 rounded-lg border border-zinc-800 bg-zinc-950 text-white focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all"
                    value={simulationState.electionType}
                    onChange={(e) => simulationState.setElectionType(e.target.value)}
                  >
                    <option value="General">General / National</option>
                    <option value="State">State / Provincial</option>
                    <option value="Local">Local / Municipal</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}

          {currentStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <CardHeader className="px-0 pt-0">
                <CardTitle className="text-2xl text-indigo-500">Budget Allocation</CardTitle>
                <p className="text-muted-foreground">Distribute your campaign funds (Must sum to 100%).</p>
              </CardHeader>
              <div className="space-y-8">
                <div>
                  <div className="flex justify-between mb-2 text-sm">
                    <label>Digital & Social Media</label>
                    <span>{simulationState.budgetSplit.digital}%</span>
                  </div>
                  <Slider
                    value={[simulationState.budgetSplit.digital]}
                    onValueChange={([val]) => simulationState.setBudgetSplit({ ...simulationState.budgetSplit, digital: val })}
                    max={100}
                    aria-label="Digital Budget"
                  />
                </div>
                <div>
                  <div className="flex justify-between mb-2 text-sm">
                    <label>Ground Mobilization</label>
                    <span>{simulationState.budgetSplit.ground}%</span>
                  </div>
                  <Slider
                    value={[simulationState.budgetSplit.ground]}
                    onValueChange={([val]) => simulationState.setBudgetSplit({ ...simulationState.budgetSplit, ground: val })}
                    max={100}
                    aria-label="Ground Budget"
                  />
                </div>
                <div>
                  <div className="flex justify-between mb-2 text-sm">
                    <label>Traditional Media (TV/Print)</label>
                    <span>{simulationState.budgetSplit.traditional}%</span>
                  </div>
                  <Slider
                    value={[simulationState.budgetSplit.traditional]}
                    onValueChange={([val]) => simulationState.setBudgetSplit({ ...simulationState.budgetSplit, traditional: val })}
                    max={100}
                    aria-label="Traditional Budget"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {currentStep === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <CardHeader className="px-0 pt-0">
                <CardTitle className="text-2xl text-indigo-500">Key Strategies</CardTitle>
                <p className="text-muted-foreground">Select defining actions for your campaign.</p>
              </CardHeader>
              <ToggleGroup
                type="multiple"
                className="grid grid-cols-2 gap-4 justify-start"
                value={simulationState.keyDecisions}
                onValueChange={(val) => {
                  // We manually handle this if using controlled Radix toggle group
                }}
              >
                {['Aggressive Youth Outreach', 'Welfare Promises', 'Polarizing Narrative', 'Anti-Incumbency Focus'].map((decision) => (
                  <ToggleGroupItem
                    key={decision}
                    value={decision}
                    onClick={() => simulationState.toggleDecision(decision)}
                    className="h-auto p-4 flex-col items-start border-2 border-transparent data-[state=on]:border-indigo-500 bg-muted"
                  >
                    <span className="font-semibold">{decision}</span>
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </motion.div>
          )}

          {currentStep === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6 text-center py-8"
            >
              <h2 className="text-3xl font-bold text-indigo-500 mb-4">Ready to Simulate?</h2>
              <p className="text-muted-foreground mb-8">
                Your parameters will be processed by our AI engine to generate realistic, cause-and-effect outcomes.
              </p>
              <Button size="lg" onClick={handleRun} className="w-full text-lg h-14 bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-500/25">
                Run AI Simulation
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {currentStep < 4 && (
          <div className="flex justify-between mt-8 pt-6 border-t border-border">
            <Button variant="outline" onClick={prevStep} disabled={currentStep === 1} aria-label="Go to previous step">
              Previous
            </Button>
            <Button onClick={nextStep} aria-label="Go to next step">
              Next Step
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
