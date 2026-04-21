/**
 * HomePage (v3 - Ultra Light)
 */

import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div className="page-container flex flex-col items-center justify-center pt-8">
      {/* Hero Section */}
      <div className="text-center max-w-4xl animate-fade-in mb-16">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100 text-amber-700 text-xs font-bold uppercase tracking-widest border border-amber-200 mb-8">
          <span>✨</span> Powered by Advanced Solar AI Copyrighted by Team FaloodaCoders
        </div>
        <h1 className="text-7xl font-extrabold text-[#2D241E] leading-[1.1] tracking-tight mb-8">
          The future of <span className="text-amber-500">Solar Intelligence</span> is here.
        </h1>
        <p className="text-xl text-[#6B5E54] font-medium leading-relaxed mb-10 mx-auto max-w-2xl">
          SolSense Ultra uses physics-informed machine learning to predict energy generation, optimize panel angles, and schedule your home's power consumption.
        </p>
        <div className="flex items-center justify-center gap-6">
          <Link to="/dashboard" className="btn-primary py-4 px-10 text-lg shadow-2xl shadow-orange-500/30">
            Launch Ultra Dashboard
          </Link>
          <Link to="/profiles" className="bg-white px-8 py-4 rounded-2xl font-bold text-[#6B5E54] border border-[#E5E0DA] hover:bg-[#FDFCFB] hover:border-amber-200 transition-all">
            Manage Systems
          </Link>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl animate-fade-in delay-200">
        <FeatureCard
          icon="📐"
          title="AI Tilt Optimizer"
          desc="Dynamic recommendations for the perfect panel angle based on current solar altitude."
        />
        <FeatureCard
          icon="📅"
          title="Smart Weekly Scheduler"
          desc="AI-driven appliance timing to maximize gains and minimize grid reliance."
        />
        <FeatureCard
          icon="🛰️"
          title="Real-Time Precision ML"
ush          desc="V3 model with latitude and atmospheric humidity data for ultra-accurate predictions."
        />
      </div>

      {/* Stats */}
      <div className="mt-20 flex flex-wrap justify-center gap-16 animate-fade-in delay-500 bg-white/40 p-10 rounded-[3rem] border border-white/50 backdrop-blur-xl">
        <StatItem value="91.8%" label="Prediction Accuracy" />
        <StatItem value="14+" label="Global City Profiles" />
        <StatItem value="24/7" label="System Monitoring" />
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, desc }) {
  return (
    <div className="glass-card p-10 border-amber-50">
      <div className="text-5xl mb-6">{icon}</div>
      <h3 className="text-2xl font-bold text-[#2D241E] mb-3">{title}</h3>
      <p className="text-[#6B5E54] font-medium leading-relaxed">{desc}</p>
    </div>
  );
}

function StatItem({ value, label }) {
  return (
    <div className="text-center">
      <div className="text-5xl font-extrabold text-[#2D241E] mb-2">{value}</div>
      <div className="text-xs font-bold text-amber-600 uppercase tracking-widest">{label}</div>
    </div>
  );
}
