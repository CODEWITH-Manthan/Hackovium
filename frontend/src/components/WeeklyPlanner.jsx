/**
 * WeeklyPlanner (v5 - Amber Glow)
 */

import { useState } from "react";

export default function WeeklyPlanner({ planner }) {
  const [activeIdx, setActiveIdx] = useState(0);

  if (!planner || planner.length === 0) return null;

  return (
    <div className="glass-card p-10 border-amber-50">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h3 className="text-3xl font-black text-[#2D241E] tracking-tighter">
            Smart Weekly Schedule
          </h3>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">7-Day Multi-Output Optimization</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 rounded-2xl border border-amber-100">
          <span className="text-lg">🕒</span>
          <span className="text-[10px] font-black text-amber-700 uppercase tracking-tighter">Hourly Depth: Enabled</span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-10 print:grid-cols-1 print:gap-8">
        {planner.map((day, idx) => (
          <div key={idx} className="print:block">
            <button 
              onClick={() => setActiveIdx(idx)}
              className={`p-5 rounded-3xl border transition-all duration-300 text-left relative overflow-hidden w-full ${
                activeIdx === idx 
                  ? 'bg-[#2D241E] border-black text-white shadow-2xl scale-105 z-10 print:bg-white print:text-black print:border-gray-200' 
                  : 'bg-white/40 border-white hover:border-amber-200 text-[#2D241E] print:bg-white print:border-gray-100'
              }`}
            >
              {activeIdx === idx && <div className="absolute top-0 right-0 w-12 h-12 bg-amber-400 rotate-45 translate-x-6 -translate-y-6 opacity-20 print:hidden"></div>}
              <p className={`text-[10px] font-black uppercase mb-1 ${activeIdx === idx ? 'text-amber-400 print:text-amber-600' : 'text-gray-400'}`}>
                {day.dayName}
              </p>
              <p className="text-xl font-black mb-2">{day.peakOutput.toFixed(1)} <span className="text-[10px]">kW</span></p>
              <div className={`text-xs font-bold truncate opacity-80 ${activeIdx === idx ? 'text-white print:text-gray-600' : 'text-gray-600'}`}>
                {day.weather}
              </div>
              <div className={`mt-4 h-1 w-8 rounded-full ${activeIdx === idx ? 'bg-amber-400 print:bg-amber-600' : 'bg-gray-100'}`}></div>
            </button>
            
            {/* Print-only expanded view for all days */}
            <div className="hidden print:block mt-6 mb-10 pl-4 border-l-2 border-amber-100">
               <p className="text-[10px] font-black text-amber-600 uppercase mb-4 tracking-widest">Hourly Optimization Analysis — {day.dayName}</p>
               <div className="grid grid-cols-3 gap-2">
                  {day.hourlySchedule.map((h, i) => (
                    <div key={i} className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex flex-col justify-center">
                       <span className="text-[8px] font-black text-amber-500 uppercase">{h.hour}</span>
                       <span className="text-[10px] font-bold text-[#2D241E] leading-tight">{h.recommendation}</span>
                       <span className="text-[8px] font-medium text-gray-400">{h.yield} kW</span>
                    </div>
                  ))}
               </div>
            </div>
          </div>
        ))}
      </div>

      {planner[activeIdx] && (
        <div className="animate-fade-in print:hidden">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center text-2xl">⚡</div>
            <div>
              <h4 className="text-lg font-black text-[#2D241E]">Precision Hourly Breakdown</h4>
              <p className="text-xs font-bold text-gray-400 italic">Target activities for {planner[activeIdx].dayName}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {planner[activeIdx].hourlySchedule.map((h, i) => (
               <div key={i} className="flex justify-between items-center p-5 bg-white/60 rounded-3xl border border-amber-50 group hover:bg-white transition-all">
                  <div className="flex items-center gap-4">
                    <span className="text-[9px] font-black text-amber-500 bg-amber-50 px-2 py-1 rounded-lg w-16 text-center">{h.hour}</span>
                    <div>
                       <span className="text-xs font-black text-[#2D241E] line-clamp-1">{h.recommendation}</span>
                       <span className="block text-[10px] font-bold text-gray-400 mt-0.5">{h.yield} kW Generative</span>
                    </div>
                  </div>
               </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
