/**
 * WeatherCard (v5 - Amber Glow)
 * Standardized with Amber highlights and boxed details.
 */

export default function WeatherCard({ weather }) {
  if (!weather) return null;

  const {
    city,
    temperature,
    feelsLike,
    humidity,
    clouds,
    windSpeed,
    description,
    icon,
  } = weather;

  return (
    <div className="glass-card p-8 animate-fade-in border-amber-50 relative overflow-hidden h-full flex flex-col justify-center">
      <div className="absolute -top-10 -left-10 w-40 h-40 bg-amber-100/20 blur-[60px] rounded-full pointer-events-none"></div>
      
      <div className="flex justify-between items-center mb-8">
        <div>
          <h3 className="text-[10px] font-bold text-amber-500 uppercase tracking-widest mb-2">
            Local Conditions
          </h3>
          <h2 className="text-4xl font-black text-[#2D241E] tracking-tight">{city}</h2>
        </div>
        <div className="flex flex-col items-center">
          <img
            src={`https://openweathermap.org/img/wn/${icon}@4x.png`}
            alt={description}
            className="w-20 h-20 -my-4 drop-shadow-xl"
          />
          <span className="text-[10px] font-bold text-amber-600/70 uppercase tracking-widest mt-1">{description}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="flex flex-col">
          <div className="text-6xl font-black text-[#2D241E] tracking-tighter">{Math.round(temperature)}°</div>
          <div className="text-sm font-bold text-amber-500/80 mt-1">Real Feel <span className="text-[#2D241E]">{feelsLike}°C</span></div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <DetailItem label="Humidity" value={`${humidity}%`} icon="💧" />
          <DetailItem label="Clouds" value={`${clouds}%`} icon="☁️" />
          <DetailItem label="Wind" value={`${windSpeed}m/s`} icon="💨" />
          <DetailItem label="Efficiency" value={`${Math.round(100 - clouds * 0.5)}%`} icon="✨" />
        </div>
      </div>
    </div>
  );
}

function DetailItem({ label, value, icon }) {
  return (
    <div className="flex flex-col bg-white/40 p-3 rounded-2xl border border-amber-50/50">
      <span className="text-[9px] font-bold text-gray-400 uppercase mb-1 flex items-center gap-1">
        <span>{icon}</span> {label}
      </span>
      <span className="text-sm font-black text-[#2D241E]">{value}</span>
    </div>
  );
}
