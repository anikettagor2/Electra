import { useResultStore } from '@/stores/useResultStore';
import { useUIStore } from '@/stores/useUIStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { motion, AnimatePresence } from 'framer-motion';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis } from 'recharts';
import { Activity, Brain, Target, TrendingUp, RotateCcw } from 'lucide-react';

export const ResultDashboard = () => {
  const { data, status, error, reset: resetResult } = useResultStore();
  const { setStep } = useUIStore();

  if (status === 'idle') return null;

  if (status === 'error') {
    return (
      <div className="w-full max-w-4xl mx-auto p-12 text-center bg-red-500/5 backdrop-blur-xl rounded-2xl border border-red-500/20 shadow-2xl">
        <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <Activity className="w-8 h-8 text-red-500" />
        </div>
        <h2 className="text-3xl font-bold text-red-500 mb-4">Simulation Disrupted</h2>
        <p className="text-zinc-400 mb-8 max-w-md mx-auto">{error}</p>
        <Button onClick={() => { resetResult(); setStep(1); }} variant="outline" className="px-8 py-6 rounded-xl border-red-500/50 hover:bg-red-500/10">
          <RotateCcw className="w-4 h-4 mr-2" />
          Re-initialize Simulation
        </Button>
      </div>
    );
  }

  const isLoading = status === 'loading';
  
  const chartData = data?.result?.voteShare
    ? Object.entries(data.result.voteShare).map(([name, value]) => ({ name, value }))
    : [];
  
  const COLORS = ['#6366f1', '#f59e0b', '#ef4444', '#10b981', '#a855f7'];

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 pb-20">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-end gap-4 border-b border-white/10 pb-8"
      >
        <div>
          <div className="flex items-center gap-2 text-indigo-400 mb-2">
            <Brain className="w-5 h-5" />
            <span className="text-sm font-semibold tracking-widest uppercase">AI Strategic Analysis</span>
          </div>
          <h2 className="text-4xl font-bold tracking-tight">
            Simulation <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-amber-400">Intelligence Report</span>
          </h2>
        </div>
        {!isLoading && (
          <Button 
            variant="ghost" 
            className="text-zinc-400 hover:text-white hover:bg-white/5 transition-all"
            onClick={() => { resetResult(); setStep(1); }}
            aria-label="Run a new simulation scenario"
          >
            <RotateCcw className="w-4 h-4 mr-2" aria-hidden="true" />
            Run New Scenario
          </Button>
        )}
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Projection Panel */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2 space-y-8"
        >
          <Card className="border-white/5 bg-zinc-900/40 backdrop-blur-3xl shadow-2xl overflow-hidden relative group">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
              <TrendingUp className="w-32 h-32 text-indigo-500" />
            </div>
            <CardHeader>
              <CardTitle className="text-xl font-medium text-zinc-300">Projected Voter Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="h-[300px] w-full relative">
                  {isLoading && !chartData.length ? (
                    <div className="flex flex-col items-center justify-center h-full space-y-4">
                      <div className="w-48 h-48 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin" />
                      <p className="text-indigo-400 font-mono animate-pulse">STREAMING DATA...</p>
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%" aria-label="Pie chart showing projected voter distribution">
                      <PieChart>
                        <Pie
                          data={chartData}
                          innerRadius={80}
                          outerRadius={110}
                          paddingAngle={8}
                          dataKey="value"
                          stroke="none"
                        >
                          {chartData.map((entry, index) => (
                            <Cell 
                              key={`cell-${index}`} 
                              fill={COLORS[index % COLORS.length]}
                              className="filter drop-shadow-[0_0_8px_rgba(99,102,241,0.5)]"
                            />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'rgba(9,9,11,0.95)', 
                            border: '1px solid rgba(255,255,255,0.1)', 
                            borderRadius: '12px',
                            backdropFilter: 'blur(10px)'
                          }}
                          itemStyle={{ color: '#fff' }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                  {data?.result?.winner && !isLoading && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <span className="text-zinc-500 text-xs uppercase tracking-tighter">Winner</span>
                      <span className="text-2xl font-bold text-white text-center px-4 leading-tight">{data.result.winner}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  {chartData.map((entry, index) => (
                    <div key={entry.name} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full shadow-[0_0_10px]" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                        <span className="font-medium text-zinc-300">{entry.name}</span>
                      </div>
                      <span className="text-xl font-bold tabular-nums">{entry.value}%</span>
                    </div>
                  ))}
                  {isLoading && chartData.length === 0 && (
                    Array(3).fill(0).map((_, i) => <Skeleton key={i} className="h-14 w-full rounded-xl bg-white/5" />)
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-zinc-900/40 border-white/5 backdrop-blur-2xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-zinc-400">Key Victory Factor</CardTitle>
                <Target className="h-4 w-4 text-emerald-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-emerald-400">
                  {data?.result?.swingFactor || (isLoading ? <Skeleton className="h-8 w-24" /> : "TBD")}
                </div>
                <p className="text-xs text-zinc-500 mt-2">Critical segment influencing the outcome</p>
              </CardContent>
            </Card>
            <Card className="bg-zinc-900/40 border-white/5 backdrop-blur-2xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-zinc-400">Voter Turnout</CardTitle>
                <Activity className="h-4 w-4 text-indigo-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-indigo-400">
                  {data?.result?.turnout ? `${data.result.turnout}%` : (isLoading ? <Skeleton className="h-8 w-16" /> : "0%")}
                </div>
                <div className="w-full bg-white/5 h-1.5 rounded-full mt-3 overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${data?.result?.turnout || 0}%` }}
                    className="h-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-zinc-900/40 border-white/5 backdrop-blur-2xl">
            <CardHeader>
              <CardTitle className="text-xl font-medium text-zinc-300">Strategic Impact Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                {[
                  { label: "Optimal Logic", data: data?.impact?.worked, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
                  { label: "Strategic Fails", data: data?.impact?.failed, color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/20" },
                  { label: "Missed Potential", data: data?.impact?.missed, color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" }
                ].map((col, i) => (
                  <div key={i} className={`p-4 rounded-xl ${col.bg} border ${col.border} space-y-3`}>
                    <span className={`text-xs font-bold uppercase tracking-widest ${col.color}`}>{col.label}</span>
                    <ul className="space-y-2">
                      {col.data?.map((item, idx) => (
                        <li key={idx} className="text-sm text-zinc-300 flex items-start gap-2">
                          <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-current opacity-50 shrink-0" />
                          {item}
                        </li>
                      )) || Array(2).fill(0).map((_, idx) => <Skeleton key={idx} className="h-4 w-full bg-white/5" />)}
                    </ul>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* AI Insight Column */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-8"
        >
          <Card className="bg-gradient-to-br from-indigo-900/20 to-black border-white/5 h-full backdrop-blur-3xl shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,_var(--tw-gradient-stops))] from-indigo-500/5 via-transparent to-transparent pointer-events-none" />
            <CardHeader>
              <CardTitle className="text-xl font-medium flex items-center gap-2">
                <Brain className="w-5 h-5 text-indigo-400" />
                Executive Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="relative">
                {data?.aiInsight ? (
                  <div className="text-zinc-300 leading-relaxed space-y-4 whitespace-pre-wrap font-serif text-lg italic">
                    {data.aiInsight}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Skeleton className="h-4 w-full bg-white/5" />
                    <Skeleton className="h-4 w-[95%] bg-white/5" />
                    <Skeleton className="h-4 w-[98%] bg-white/5" />
                    <Skeleton className="h-4 w-[85%] bg-white/5" />
                  </div>
                )}
                {isLoading && (
                  <div className="mt-4 flex items-center gap-2 text-indigo-400 animate-pulse">
                    <span className="w-2 h-2 rounded-full bg-current" />
                    <span className="text-xs font-mono uppercase">Decoding AI stream...</span>
                  </div>
                )}
              </div>

              {data?.whatIf && data.whatIf.length > 0 && (
                <div className="pt-8 border-t border-white/5">
                  <h4 className="text-sm font-bold text-amber-500 uppercase tracking-widest mb-4">Strategic Counter-Moves</h4>
                  <div className="space-y-3">
                    {data.whatIf.map((item, i) => (
                      <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        key={i} 
                        className="group p-4 rounded-xl bg-amber-500/5 border border-amber-500/10 hover:border-amber-500/30 transition-all cursor-default"
                      >
                        <p className="text-sm text-amber-100/80 group-hover:text-amber-100">{item}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {!isLoading && (
                <Button 
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/25 py-6 rounded-xl transition-all font-bold"
                  onClick={() => { resetResult(); setStep(1); }}
                  aria-label="Synthesize new dataset and start new simulation"
                >
                  Synthesize New Dataset
                </Button>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};
