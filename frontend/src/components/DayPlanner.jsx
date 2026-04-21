/**
 * DayPlanner (v5 - Amber Glow)
 * Interactive hourly solar yield visualization with Amber theme.
 */

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function DayPlanner({ hourlyData }) {
  if (!hourlyData || hourlyData.length === 0) return null;

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/95 backdrop-blur-xl border border-amber-100 p-4 rounded-2xl shadow-2xl">
          <p className="text-amber-500 font-bold text-[10px] uppercase tracking-widest mb-1">{label}</p>
          <p className="text-xl font-black text-[#2D241E]">{payload[0].value} <span className="text-xs font-normal text-gray-400">kW</span></p>
          <div className="mt-2 pt-2 border-t border-amber-50 text-[10px] font-bold text-gray-500">
             AI Advise: <span className="text-amber-600 lowercase normal-case">{payload[0].payload.recommendation}</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="glass-card p-10 animate-fade-in border-amber-50">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-black text-[#2D241E] flex items-center gap-2">
            <span className="text-3xl">🗓️</span> Daily Planner
          </h2>
          <p className="text-gray-400 text-sm font-medium">Hourly yield optimization and device scheduling.</p>
        </div>
        <div className="bg-amber-50 px-4 py-1.5 rounded-xl border border-amber-100 text-amber-600 text-[10px] font-black uppercase tracking-widest">
          AI Modulated
        </div>
      </div>

      <div className="h-[300px] w-full mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={hourlyData}>
            <defs>
              <linearGradient id="colorYield" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#FFB300" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#FB8C00" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#F0EDE8" vertical={false} />
            <XAxis 
              dataKey="hour" 
              axisLine={false} 
              tickLine={false} 
              tick={{fill: '#6B5E54', fontSize: 10, fontWeight: 700}}
              interval={2}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{fill: '#A08085', fontSize: 10, fontWeight: 700}}
              unit="kW"
            />
            <Tooltip content={<CustomTooltip />} />
            <Area 
              type="monotone" 
              dataKey="yield" 
              stroke="#FFB300" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorYield)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
        <StatusBox label="Morning Peak" value="9 AM - 11 AM" />
        <StatusBox label="Solar Noon" value="12 PM - 1 PM" />
        <StatusBox label="Heavy Load" value="11 AM - 3 PM" />
        <StatusBox label="Storage Opt" value="After 2 PM" />
      </div>
    </div>
  );
}

function StatusBox({ label, value }) {
  return (
    <div className="bg-white/40 p-4 rounded-2xl border border-amber-50">
      <span className="block text-[9px] font-bold text-gray-400 uppercase mb-1 tracking-widest">{label}</span>
      <span className="text-[#2D241E] font-bold text-xs">{value}</span>
    </div>
  );
}
