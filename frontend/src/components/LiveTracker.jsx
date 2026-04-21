import { useState, useEffect } from "react";
import api from "../services/api";

export default function LiveTracker({ predictedOutput, estimatedTarget, onDataUpdate }) {
  const [actualData, setActualData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchLiveInverterData = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/enode/inverter-data?predictedOutput=${predictedOutput}`);
      setActualData(res.data);
      if (onDataUpdate) onDataUpdate(res.data);
    } catch (err) {
      setError("Failed to reach inverter.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (predictedOutput > 0) {
      fetchLiveInverterData();
      const interval = setInterval(fetchLiveInverterData, 8000); // Poll every 8s (Optimized)
      return () => clearInterval(interval);
    }
  }, [predictedOutput]);

  if (!predictedOutput || predictedOutput === 0) return null;

  return (
    <div className="glass-card p-8 border-emerald-100 bg-gradient-to-br from-white to-emerald-50/20 shadow-xl overflow-hidden relative">
      <div className="absolute top-0 right-0 p-4">
        <span className="flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
        </span>
      </div>

      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
        <div className="flex-1 w-full">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-xl">🛰️</div>
            <div>
              <h3 className="text-xl font-black text-[#2D241E]">Live Ground Truth</h3>
              <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Enode Real-time Inverter Link</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
            <div className="bg-white/60 p-4 rounded-2xl border border-emerald-50">
              <span className="block text-[9px] font-black text-gray-400 uppercase mb-1">AI Prediction</span>
              <span className="text-2xl font-black text-[#2D241E]">{predictedOutput} kW</span>
            </div>
            <div className="bg-white/60 p-4 rounded-2xl border border-emerald-50">
              <span className="block text-[9px] font-black text-emerald-600 uppercase mb-1">Actual (Inverter)</span>
              <span className="text-2xl font-black text-emerald-700">
                {loading ? "..." : actualData ? `${actualData.actualOutput} kW` : "N/A"}
              </span>
            </div>
            <div className="bg-white/60 p-4 rounded-2xl border border-emerald-50">
              <span className="block text-[9px] font-black text-emerald-600 uppercase mb-1">Target Baseline</span>
              <span className="text-2xl font-black text-[#2D241E]">
                {estimatedTarget ? `${estimatedTarget} kW` : "N/A"}
              </span>
            </div>
          </div>
        </div>

        <div className="w-full md:w-48">
          <div className="flex justify-between text-[10px] font-black text-gray-400 mb-2 uppercase">
            <span>Accuracy Gap</span>
            <span>{actualData ? Math.abs((1 - (actualData.actualOutput / predictedOutput)) * 100).toFixed(1) : 0}%</span>
          </div>
          <div className="h-4 w-full bg-gray-100 rounded-full overflow-hidden border border-white">
             {actualData && (
                <div 
                  className="h-full bg-emerald-500 transition-all duration-1000"
                  style={{ width: `${Math.min(100, (actualData.actualOutput / predictedOutput) * 100)}%` }}
                ></div>
             )}
          </div>
          <p className="text-[9px] text-gray-400 font-bold mt-4 italic leading-tight text-center">
            {actualData?.isDemo ? "✨ Running on Synthetic Ground Level Data" : "✅ Verified hardware feedback via Enode v2"}
          </p>
        </div>
      </div>
      
      {error && <p className="text-xs text-rose-500 mt-4 font-bold">{error}</p>}
    </div>
  );
}
