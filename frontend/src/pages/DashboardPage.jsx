/**
 * DashboardPage (v5.1 - Precision Refinement)
 * Modularized for clean navigation and high-precision reporting.
 */

import { useState, useEffect } from "react";
import { listCities } from "../services/weatherService";
import { getPrediction } from "../services/predictService";
import { listProfiles } from "../services/profileService";
import WeatherCard from "../components/WeatherCard";
import PredictionCard from "../components/PredictionCard";
import SolarChart from "../components/SolarChart";
import DayPlanner from "../components/DayPlanner";
import WeeklyChart from "../components/WeeklyChart";
import WeeklyPlanner from "../components/WeeklyPlanner";
import LiveTracker from "../components/LiveTracker";
import SeasonalTiltCards from "../components/SeasonalTiltCards";
import api from "../services/api";

export default function DashboardPage() {
  const [profiles, setProfiles] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedProfileId, setSelectedProfileId] = useState("");

  const [city, setCity] = useState("Mumbai");
  const [panelCapacity, setPanelCapacity] = useState("5");
  const [panelEfficiency, setPanelEfficiency] = useState("18");
  const [estimatedGeneration, setEstimatedGeneration] = useState("");
  const [tiltAngle, setTiltAngle] = useState("");
  
  const [prediction, setPrediction] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeView, setActiveView] = useState("summary"); 
  const [currentActual, setCurrentActual] = useState(null);
  useEffect(() => {
    const initPage = async () => {
      // 1. Fetch Cities (Public)
      try {
        const cityData = await listCities();
        setCities(cityData);
      } catch (err) {
        console.error("City load failed:", err);
      }

      // 2. Fetch Profiles (Authenticated - may fail if not logged in)
      try {
        const profData = await listProfiles();
        setProfiles(profData);
      } catch (err) {
        // Silently fail if 401, as user might just be browsing manually
        if (err.response?.status !== 401) {
          console.error("Profile load failed:", err);
        }
      }
    };
    initPage();
  }, []);

  // Real-time Intelligence Sync Loop
  // When currentActual changes, we silently refresh the intelligence engine 
  // to align predictions with ground truth.
  useEffect(() => {
    if (currentActual && prediction && !loading) {
        // Trigger a silent sync analyze
        const syncAnalyze = async () => {
             try {
                const predData = await getPrediction({
                    city,
                    panelCapacity: Number(panelCapacity),
                    panelEfficiency: Number(panelEfficiency),
                    tiltAngle: tiltAngle ? Number(tiltAngle) : undefined,
                    currentActual: currentActual
                });
                setPrediction(predData);
             } catch (err) {
                 console.warn("[Sync] Silent calibration failed:", err.message);
             }
        };
        syncAnalyze();
    }
  }, [currentActual]);

  const handleProfileSelect = (id) => {
    setSelectedProfileId(id);
    if (!id) return;

    const profile = profiles.find(p => String(p.id) === String(id));
    if (profile) {
      setCity(profile.locationCity || "Mumbai");
      setPanelCapacity(String(profile.panelCapacity || "5"));
      setPanelEfficiency(String(profile.panelEfficiency || "18"));
      setEstimatedGeneration(profile.estimatedGeneration ? String(profile.estimatedGeneration) : "");
      setTiltAngle(profile.tiltAngle ? String(profile.tiltAngle) : "");
    }
  };

  const handleAnalyze = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const predData = await getPrediction({
        city,
        panelCapacity: Number(panelCapacity),
        panelEfficiency: Number(panelEfficiency),
        estimatedGeneration: estimatedGeneration ? Number(estimatedGeneration) : undefined,
        tiltAngle: tiltAngle ? Number(tiltAngle) : undefined,
        currentActual: currentActual
      });
      
      setPrediction(predData);
      setActiveView("summary");

      const profileName = profiles.find(p => p.id === selectedProfileId)?.profileName || city;
      setHistory((prev) => [
        ...prev,
        {
          label: `${profileName} (${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })})`,
          output: predData.predictedSolarOutput,
        },
      ].slice(-10));

    } catch (err) {
      setError(err.response?.data?.error || "Analysis failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      {/* Print-Only Professional Header */}
      <div className="hidden print:block mb-12 border-b-4 border-amber-500 pb-8">
         <div className="flex justify-between items-start">
            <div>
               <h1 className="text-4xl font-black text-[#2D241E] uppercase tracking-tighter mb-2">SolSense Intelligence Report</h1>
               <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Precision Solar Yield Analysis & Optimization v5.2</p>
            </div>
            <div className="text-right">
               <p className="text-xs font-black text-[#2D241E] uppercase">Generated: {new Date().toLocaleString()}</p>
               <p className="text-xs font-bold text-amber-600 mt-1 uppercase">Location: {prediction?.city || city}</p>
            </div>
         </div>
      </div>

      <div className="flex flex-col lg:flex-row justify-between items-end mb-12 gap-8 print:hidden">
        <div>
          <h1 className="section-title">Solar IQ Ultra</h1>
          <p className="text-gray-400 font-bold text-lg mt-1 lowercase italic">Advanced energy intelligence & monitoring.</p>
        </div>
        
        <div className="flex gap-4">
          <div className="bg-white/50 p-4 rounded-2xl border border-amber-50">
            <label className="block text-[9px] font-black text-amber-500 uppercase mb-2 ml-1">System Profile</label>
            <select 
              value={selectedProfileId}
              onChange={(e) => handleProfileSelect(e.target.value)}
              className="bg-white border-amber-100 rounded-xl px-4 py-2 text-sm font-bold text-[#2D241E]"
            >
              <option value="">-- Manual Configuration --</option>
              {profiles.map(p => (
                <option key={p.id} value={p.id}>{p.profileName}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <form onSubmit={handleAnalyze} className="glass-card p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 items-end mb-12 border-amber-50 shadow-sm">
        <div>
          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">City</label>
          <select value={city} onChange={(e) => {setCity(e.target.value); setSelectedProfileId("");}} className="input-field">
            {cities.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Capacity (kW)</label>
          <input type="number" step="0.1" value={panelCapacity} onChange={(e) => {setPanelCapacity(e.target.value); setSelectedProfileId("");}} className="input-field" />
        </div>
        <div className="relative group">
          <label className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">
            Efficiency (%)
            <span className="cursor-help text-amber-500 opacity-60 hover:opacity-100 transition-opacity">ⓘ</span>
            <div className="absolute bottom-full left-0 mb-2 w-48 p-3 bg-[#2D241E] text-white text-[9px] font-medium leading-relaxed rounded-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 z-50 shadow-2xl">
              Check the label on the back of your panel or its datasheet. Standard panels range from 15% to 22%.
            </div>
          </label>
          <input type="number" step="0.1" value={panelEfficiency} onChange={(e) => {setPanelEfficiency(e.target.value); setSelectedProfileId("");}} className="input-field" />
        </div>
        <div>
          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Tilt Angle (°)</label>
          <input type="number" step="1" value={tiltAngle} onChange={(e) => {setTiltAngle(e.target.value); setSelectedProfileId("");}} placeholder="Auto" className="input-field" />
        </div>
        <div>
          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Est. Generation (kW)</label>
          <input type="number" step="0.1" value={estimatedGeneration} onChange={(e) => {setEstimatedGeneration(e.target.value); setSelectedProfileId("");}} placeholder="Optional" className="input-field" />
        </div>
        <button type="submit" className="btn-primary h-[54px]" disabled={loading}>
          {loading ? "Analyzing..." : "Run AI Analysis"}
        </button>
      </form>

      {error && <div className="glass-card p-6 mb-12 border-orange-100 bg-orange-50 text-orange-600 text-sm font-bold">⚠️ {error}</div>}

      {prediction && (
        <div className="space-y-12 mb-12 animate-fade-in print:block">
          {/* Intelligence Metrics Grid */}
          <LiveTracker 
             predictedOutput={prediction.predictedSolarOutput} 
             estimatedTarget={prediction.estimatedPower}
             onDataUpdate={(data) => setCurrentActual(data.actualOutput)} 
          />
          
          <SeasonalTiltCards data={prediction.seasonalOptimization} />

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 print:grid-cols-2">
            <div className="glass-card p-6 border-amber-100 bg-gradient-to-br from-white to-amber-50/30 shadow-sm">
              <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-1">Weekly Savings</p>
              <h4 className="text-3xl font-black text-[#2D241E]">₹{prediction.metrics.savings.weekly}</h4>
              <p className="text-[10px] text-gray-400 font-bold mt-1">Based on local avg rates</p>
            </div>
            <div className="glass-card p-6 border-orange-100 bg-gradient-to-br from-white to-orange-50/30 shadow-sm">
              <p className="text-[10px] font-black text-orange-600 uppercase tracking-widest mb-1">Monthly Projected</p>
              <h4 className="text-3xl font-black text-[#2D241E]">₹{prediction.metrics.savings.monthly}</h4>
              <p className="text-[10px] text-gray-400 font-bold mt-1">Estimated total offset</p>
            </div>
            <div className="glass-card p-6 border-amber-100 shadow-sm">
              <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-1">Regional Potential</p>
              <h4 className="text-3xl font-black text-[#2D241E]">{prediction.metrics.areaAvgOutput} kWh</h4>
              <p className="text-[10px] text-gray-400 font-bold mt-1">Optimized daily baseline</p>
            </div>
            <div className="glass-card p-6 border-amber-100 md:hidden lg:block shadow-sm">
              <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-1">System Health</p>
              <h4 className="text-3xl font-black text-[#2D241E]">{prediction.v5Stats.performanceRatio}</h4>
              <p className="text-[10px] text-gray-400 font-bold mt-1">Model reliability: High</p>
            </div>
          </div>

          {/* View Selection Tabs (Hidden on print) */}
          <div className="flex flex-wrap gap-2 p-2 bg-white/40 rounded-3xl border border-amber-50 w-full lg:w-fit mx-auto shadow-sm print:hidden">
            <TabButton label="Snapshot" view="summary" active={activeView} onClick={setActiveView} icon="📊" />
            <TabButton label="7-Day Forecast" view="forecast" active={activeView} onClick={setActiveView} icon="📅" />
            <TabButton label="Smart Planner" view="planner" active={activeView} onClick={setActiveView} icon="🕒" />
            <TabButton label="History" view="history" active={activeView} onClick={setActiveView} icon="📜" />
          </div>

          <div className="min-h-[500px]">
            {(activeView === "summary" || window.isPrinting) && (
              <div className={`grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in ${activeView !== "summary" && "print:grid"}`}>
                <div className="lg:col-span-4">
                  <WeatherCard weather={prediction.weather} />
                </div>
                <div className="lg:col-span-8">
                  <PredictionCard prediction={prediction} />
                </div>
              </div>
            )}

            {activeView === "forecast" && (
              <div className="animate-fade-in space-y-6">
                <WeeklyChart data={prediction.weeklyForecast} />
                <div className="glass-card p-8 border-amber-50 bg-white/50">
                   <h5 className="text-sm font-black text-[#2D241E] mb-4">Metrological Trends (7-Day)</h5>
                   <p className="text-xs text-gray-500 leading-relaxed italic">The chart above displays the predicted power yield based on humidity ({prediction.weather.humidity}%), clouds ({prediction.weather.clouds}%), and irradiance factors.</p>
                </div>
              </div>
            )}
            
            {activeView === "planner" && (
              <div className="animate-fade-in print:block">
                <WeeklyPlanner planner={prediction.weeklyPlanner} />
              </div>
            )}

            {activeView === "history" && (
              <div className="animate-fade-in space-y-8">
                <div className="glass-card p-8 border-white bg-white/40">
                  <SolarChart history={history} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   {history.map((h, i) => (
                      <div key={i} className="flex justify-between items-center p-5 bg-white/60 rounded-3xl border border-gray-50 shadow-sm">
                         <div>
                            <span className="block text-[9px] font-black text-gray-400 uppercase">Analysis Entry</span>
                            <span className="text-sm font-bold text-[#2D241E]">{h.label}</span>
                         </div>
                         <span className="text-lg font-black text-amber-600">{h.output} kW</span>
                      </div>
                   ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Detailed Export Options (Hidden on print) */}
          <div className="glass-card p-10 border-amber-100 bg-gradient-to-r from-amber-50/50 to-orange-50/50 flex flex-col items-center text-center print:hidden border-dashed">
            <h4 className="text-2xl font-black text-[#2D241E] mb-2 uppercase tracking-tighter">Export Intelligence Report</h4>
            <p className="text-xs text-gray-500 mb-8 max-w-sm font-bold opacity-80 uppercase tracking-widest">Download your precise 168-hour analysis in professional formats.</p>
            <div className="flex flex-wrap justify-center gap-4">
               <DownloadButton label="Excel (XLSX)" format="csv" prediction={prediction} icon="📗" color="bg-emerald-600" />
               <DownloadButton label="Download PDF" format="pdf" prediction={prediction} icon="📕" color="bg-rose-600" />
               <DownloadButton label="Word Document" format="doc" prediction={prediction} icon="📘" color="bg-blue-600" />
            </div>
          </div>
        </div>
      )}

      {(activeView === "summary" || activeView === "history") && history.length > 0 && (
        <div className="mb-20">
          <SolarChart history={history} />
        </div>
      )}
    </div>
  );
}

function TabButton({ label, view, active, onClick, icon }) {
  const isActive = active === view;
  return (
    <button 
      onClick={() => onClick(view)}
      className={`flex items-center gap-3 px-8 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all duration-500 ${
        isActive 
          ? 'bg-[#2D241E] text-white shadow-2xl scale-110 z-10' 
          : 'text-gray-400 hover:bg-amber-100/50 hover:text-amber-700'
      }`}
    >
      <span className="text-base">{icon}</span>
      <span>{label}</span>
    </button>
  );
}

function DownloadButton({ label, format, prediction, icon, color }) {
  const handleDownload = async () => {
    if (format === 'pdf') {
       window.print();
       return;
    }
    
    try {
      const res = await api.post("/predict/export-csv", { data: prediction }, { responseType: 'blob' });
      const blob = new Blob([res.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const dateStr = new Date().toISOString().split('T')[0];
      const cityName = (prediction.city || "Mumbai").replace(/\s+/g, '_');
      a.download = `solsense_report_${cityName}_${dateStr}.${format === 'csv' ? 'csv' : 'doc'}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Export System Error:", err);
      const errorMsg = err.response?.data ? (await err.response.data.text()) : err.message;
      alert(`Export failed: ${errorMsg}\n\nPlease try running the analysis again or check your system connection.`);
    }
  };

  return (
    <button onClick={handleDownload} className={`flex items-center gap-3 px-6 py-4 rounded-2xl text-white text-[10px] font-black uppercase tracking-widest transition-all hover:scale-105 active:scale-95 ${color} shadow-lg`}>
      <span className="text-lg">{icon}</span>
      {label}
    </button>
  );
}
