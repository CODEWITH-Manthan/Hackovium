/**
 * WeeklyChart (v5 - Amber Glow)
 * 7-day visualization for solar output trends.
 */

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function WeeklyChart({ data }) {
  if (!data || data.length === 0) return null;

  return (
    <div className="glass-card p-8 animate-fade-in border-amber-50">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h3 className="text-2xl font-black text-[#2D241E] tracking-tight">
            7-Day Forecast
          </h3>
          <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-1">Solar Production Projection</p>
        </div>
        <div className="bg-orange-50 px-4 py-1.5 rounded-xl border border-orange-100">
          <span className="text-[10px] font-black text-orange-600 uppercase tracking-widest">Weekly Outlook</span>
        </div>
      </div>

      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="weeklyGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#FF8C00" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#FF8C00" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0EDE8" />
            <XAxis 
              dataKey="dayName" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: "#6B5E54", fontSize: 11, fontWeight: 700 }}
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: "#6B5E54", fontSize: 11, fontWeight: 700 }}
              unit="kW"
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(255, 255, 255, 0.95)",
                borderRadius: "16px",
                border: "1px solid #F0EDE8",
                boxShadow: "0 10px 30px -5px rgba(255, 140, 0, 0.1)",
              }}
              itemStyle={{ color: "#2D241E", fontWeight: "800" }}
            />
            <Area 
              type="monotone" 
              dataKey="predictedSolarOutput" 
              stroke="#FF8C00" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#weeklyGradient)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
