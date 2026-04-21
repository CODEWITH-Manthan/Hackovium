/**
 * PredictionCard (v5 - Amber Glow)
 * Redesigned with a "Box Layout" for high information density.
 * Includes "Bar Effects" and advanced v5 technical stats.
 */

export default function PredictionCard({ prediction }) {
  if (!prediction) return null;

  const { predictedSolarOutput, recommendations, v4_stats, v5Stats } = prediction;
  const { tiltInsight, schedule, maintenance, ratio } = recommendations;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Hero Boxes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-card p-8 bg-gradient-to-br from-white to-amber-50/30 border-amber-100/50">
          <div className="flex justify-between items-start mb-4">
            <label className="text-[10px] font-bold text-amber-600 uppercase tracking-widest">Predicted Output</label>
            <span className="text-xs font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">Real-time</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-black text-[#2D241E]">{predictedSolarOutput}</span>
            <span className="text-xl font-bold text-amber-500">kW</span>
          </div>
          
          {/* Bar Effect: Capacity Utilization */}
          <div className="mt-6">
            <div className="flex justify-between text-[10px] font-bold text-gray-400 mb-2 uppercase">
              <span>System Efficiency</span>
              <span>{ratio}%</span>
            </div>
            <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full transition-all duration-1000"
                style={{ width: `${ratio}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="glass-card p-8 bg-gradient-to-br from-white to-orange-50/30 border-orange-100/50">
          <div className="flex justify-between items-start mb-4">
            <label className="text-[10px] font-bold text-orange-600 uppercase tracking-widest">AI Tilt Target</label>
            <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center text-lg">📐</div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-black text-orange-600">{tiltInsight.optimalTilt}°</span>
            <span className="text-sm font-bold text-orange-400">Optimal</span>
          </div>
          <p className="text-[#6B5E54] text-xs font-bold mt-4 leading-tight italic">{tiltInsight.advice}</p>
        </div>
      </div>

      {/* V5 Working Parameters (Data Boxes) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <DataBox label="Solar Intensity" value={v5Stats?.intensity || "--- W/m²"} icon="☀️" color="amber" />
        <DataBox label="Panel Temp" value={v5Stats?.surfaceTemp ? (v5Stats.surfaceTemp + "°C") : "---°C"} icon="🌡️" color="orange" />
        <DataBox label="Perf. Ratio" value={v5Stats?.performanceRatio || "---%"} icon="📈" color="emerald" />
        <DataBox label="Inv. Status" value={v5Stats?.inverterStatus || "Standby"} icon="🔌" color="blue" />
      </div>

      {/* Economic & Environmental Boxes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-card p-6 flex items-center gap-4 bg-white/50 border-amber-50">
          <div className="text-2xl">☀️</div>
          <div>
            <span className="block text-[9px] font-bold text-gray-400 uppercase tracking-widest">Peak Sun Hours</span>
            <span className="text-xl font-black text-[#2D241E]">{v4_stats?.peakSunHours || "0.0"} h</span>
          </div>
        </div>
        <div className="glass-card p-6 flex items-center gap-4 bg-white/50 border-amber-50">
          <div className="text-2xl">💰</div>
          <div>
            <span className="block text-[9px] font-bold text-gray-400 uppercase tracking-widest">Est. ROI Payback</span>
            <span className="text-xl font-black text-[#2D241E]">{v4_stats?.roiMonths || "---"} Mo</span>
          </div>
        </div>
        <div className="glass-card p-6 flex items-center gap-4 bg-white/50 border-amber-50">
          <div className="text-2xl">🌱</div>
          <div>
            <span className="block text-[9px] font-bold text-gray-400 uppercase tracking-widest">Annual Offset</span>
            <span className="text-xl font-black text-[#2D241E]">{v4_stats?.carbonOffset || "0.0"} kg</span>
          </div>
        </div>
      </div>

      {/* Status Grids */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-card p-8 border-amber-50">
          <h3 className="text-lg font-bold text-[#2D241E] mb-6 flex items-center gap-2">
            <span className="p-2 bg-amber-100 rounded-xl text-lg">✨</span> System Health
          </h3>
          <div className="space-y-3">
            {maintenance.map((m, i) => (
              <div key={i} className="p-4 bg-white/60 rounded-2xl border border-amber-50 shadow-sm text-sm font-medium text-[#6B5E54] flex items-start gap-3">
                <span className="mt-1">●</span>
                {m}
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card p-8 border-amber-50">
          <h3 className="text-lg font-bold text-[#2D241E] mb-6 flex items-center gap-2">
            <span className="p-2 bg-orange-100 rounded-xl text-lg">⚡</span> Load Scheduler
          </h3>
          <div className="space-y-3">
            {schedule.map((s, i) => (
              <div key={i} className="flex justify-between items-center p-4 bg-white/60 rounded-2xl border border-amber-50 shadow-sm">
                <div>
                  <span className="block text-[9px] font-bold text-orange-400 uppercase">{s.time}</span>
                  <span className="text-sm font-bold text-[#2D241E]">{s.activity}</span>
                </div>
                <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter ${
                  s.status === "Optimal" ? "bg-amber-100 text-amber-700" :
                  s.status === "Green" ? "bg-emerald-100 text-emerald-700" :
                  "bg-orange-100 text-orange-700"
                }`}>
                  {s.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function DataBox({ label, value, icon, color }) {
  const colorMap = {
    amber: "text-amber-500 bg-amber-50 border-amber-100",
    orange: "text-orange-500 bg-orange-50 border-orange-100",
    emerald: "text-emerald-500 bg-emerald-50 border-emerald-100",
    blue: "text-blue-500 bg-blue-50 border-blue-100"
  };

  return (
    <div className="glass-card p-5 bg-white/80 border-gray-50 text-center">
      <div className={`w-10 h-10 mx-auto mb-3 rounded-xl flex items-center justify-center text-xl ${colorMap[color] || colorMap.amber}`}>
        {icon}
      </div>
      <span className="block text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">{label}</span>
      <span className="text-base font-black text-[#2D241E]">{value}</span>
    </div>
  );
}
