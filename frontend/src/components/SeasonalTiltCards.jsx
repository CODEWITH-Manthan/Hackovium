/**
 * SeasonalTiltCards (v1)
 * High-precision seasonal AI optimization display.
 */

export default function SeasonalTiltCards({ data }) {
  console.log("[SeasonalTiltCards] Data received:", data);
  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <div className="p-4 border border-dashed border-amber-200 rounded-2xl text-center text-[10px] text-gray-400 uppercase font-black">
        Waiting for seasonal AI optimization data...
      </div>
    );
  }

  const iconMap = {
    Summer: "☀️",
    Winter: "❄️",
    Monsoon: "🌧️"
  };

  const colorMap = {
    Summer: "from-amber-400 to-orange-500 text-amber-600 bg-amber-50",
    Winter: "from-blue-400 to-cyan-500 text-blue-600 bg-blue-50",
    Monsoon: "from-emerald-400 to-teal-500 text-emerald-600 bg-emerald-50"
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 px-2">
         <h3 className="text-[10px] font-black text-amber-500 uppercase tracking-widest">Seasonal AI Optimization</h3>
         <div className="h-px bg-amber-100 flex-1 opacity-50"></div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {data.map((item) => (
          <div key={item.season} className="glass-card p-6 border-white/40 bg-white/40 hover:scale-[1.02] transition-all">
            <div className="flex justify-between items-start mb-6">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-sm ${colorMap[item.season].split(' ').slice(2).join(' ')}`}>
                {iconMap[item.season]}
              </div>
              <span className={`text-[9px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest border ${colorMap[item.season].split(' ').slice(2).join(' ')}`}>
                {item.season}
              </span>
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Target Angle</label>
              <h4 className="text-3xl font-black text-[#2D241E]">{item.optimalTilt}°</h4>
            </div>

            <div className="mt-6 p-4 bg-white/50 rounded-2xl border border-white/80">
              <div className="flex justify-between items-center text-[10px] font-bold">
                <span className="text-gray-400 uppercase">Est. Peak Yield</span>
                <span className="text-amber-600">{item.potentialYield} kW</span>
              </div>
              <div className="mt-2 h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className={`h-full bg-gradient-to-r ${colorMap[item.season].split(' ').slice(0, 2).join(' ')} rounded-full`}
                  style={{ width: '85%' }}
                ></div>
              </div>
            </div>
            
            <p className="text-[9px] text-gray-400 font-medium mt-4 italic">
              AI recommendation for {item.season} solstice conditions.
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
