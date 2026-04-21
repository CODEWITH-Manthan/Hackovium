/**
 * SolarChart (v5 - Amber Glow)
 * Redesigned with Amber gradients and high-density trends.
 */

import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
} from "recharts";

export default function SolarChart({ history }) {
  if (!history || history.length === 0) {
    return (
      <div className="glass-card p-12 text-center text-gray-400 border-amber-50">
        <div className="text-5xl mb-4">📊</div>
        <p className="text-lg font-bold">No prediction history yet.</p>
      </div>
    );
  }

  return (
    <div className="glass-card p-8 animate-fade-in border-amber-50">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h3 className="text-2xl font-black text-[#2D241E] tracking-tight">
            Intelligence Trends
          </h3>
          <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-1">System Historical Analysis</p>
        </div>
        <div className="flex items-center gap-3 bg-amber-50 px-4 py-1.5 rounded-xl border border-amber-100">
          <div className="w-3 h-3 rounded-full bg-amber-500 shadow-md animate-pulse"></div>
          <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest">Active Monitoring</span>
        </div>
      </div>

      <div className="h-[350px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={history}>
            <defs>
              <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FFB300" stopOpacity={0.9} />
                <stop offset="100%" stopColor="#FF6F00" stopOpacity={0.7} />
              </linearGradient>
              <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FF8C00" stopOpacity={0.15} />
                <stop offset="100%" stopColor="#FF8C00" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0EDE8" />
            <XAxis 
              dataKey="label" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: "#6B5E54", fontSize: 10, fontWeight: 700 }}
              dy={15}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: "#6B5E54", fontSize: 10, fontWeight: 700 }}
              unit="kW"
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(255, 255, 255, 0.95)",
                borderRadius: "20px",
                border: "1px solid #F0EDE8",
                boxShadow: "0 10px 30px -5px rgba(255, 140, 0, 0.1)",
                padding: "12px 16px"
              }}
              itemStyle={{ color: "#2D241E", fontWeight: "900", fontSize: "14px" }}
              labelStyle={{ color: "#FF8C00", fontWeight: "900", fontSize: "10px", uppercase: true }}
            />
            <Area type="monotone" dataKey="output" fill="url(#areaGradient)" stroke="none" />
            <Bar
              dataKey="output"
              name="Generated kW"
              fill="url(#barGradient)"
              radius={[10, 10, 0, 0]}
              barSize={40}
            />
            <Line
              type="monotone"
              dataKey="output"
              stroke="#FF8C00"
              strokeWidth={4}
              dot={{ fill: "#FF8C00", r: 6, strokeWidth: 3, stroke: "#fff" }}
              activeDot={{ r: 8, strokeWidth: 0 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
