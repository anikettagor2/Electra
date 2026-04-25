"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const data = [
  { name: "BJP", expenditure: 1264, workDone: 88, color: "#FF9933" },
  { name: "INC", expenditure: 456, workDone: 62, color: "#19AAED" },
  { name: "AAP", expenditure: 182, workDone: 78, color: "#00ADEF" },
  { name: "TMC", expenditure: 215, workDone: 72, color: "#20C646" },
  { name: "BSP", expenditure: 95, workDone: 45, color: "#0000FF" },
  { name: "CPIM", expenditure: 110, workDone: 68, color: "#DE0000" },
];

export function ExpenditureStats() {
  return (
    <Card className="w-full bg-zinc-900/50 border-zinc-800 backdrop-blur-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-orange-500">
          Historical Expenditure vs Performance Ratio
        </CardTitle>
        <p className="text-xs text-zinc-500">Expenditure in Crores ₹ | Work Done Ratio in %</p>
      </CardHeader>
      <CardContent>
        <div 
          className="h-[300px] w-full mt-4"
          role="img" 
          aria-label="Bar chart showing historical election expenditure versus work done ratio for major Indian political parties."
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
              <XAxis 
                dataKey="name" 
                stroke="#888" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false} 
              />
              <YAxis 
                stroke="#888" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false} 
                tickFormatter={(value) => `₹${value}`}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: "#18181b", border: "1px solid #333", borderRadius: "8px" }}
                itemStyle={{ fontSize: "12px" }}
                cursor={{ fill: "rgba(255,255,255,0.05)" }}
              />
              <Legend verticalAlign="top" height={36}/>
              <Bar 
                dataKey="expenditure" 
                name="Expenditure (Cr)" 
                radius={[4, 4, 0, 0]}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} fillOpacity={0.8} />
                ))}
              </Bar>
              <Bar 
                dataKey="workDone" 
                name="Work Done Ratio (%)" 
                fill="#4ade80" 
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className="p-3 rounded-lg bg-zinc-950/50 border border-zinc-800">
            <p className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold">Highest Spender</p>
            <p className="text-lg font-bold text-orange-500">BJP (₹1,264 Cr)</p>
          </div>
          <div className="p-3 rounded-lg bg-zinc-950/50 border border-zinc-800">
            <p className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold">Best ROI (Work/Spend)</p>
            <p className="text-lg font-bold text-green-400">AAP (78%)</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
