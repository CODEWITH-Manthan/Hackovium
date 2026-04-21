/**
 * ProfileList (v5 - Amber Glow)
 * Redesigned with "Bar Effects" for system parameters.
 */

import { deleteProfile } from "../services/profileService";

export default function ProfileList({ profiles, onProfileDeleted, onEdit }) {
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this profile?")) return;
    try {
      await deleteProfile(id);
      if (onProfileDeleted) onProfileDeleted();
    } catch (err) {
      alert("Failed to delete: " + err.message);
    }
  };

  if (!profiles || profiles.length === 0) {
    return (
      <div className="glass-card p-12 text-center text-gray-400 border-amber-50">
        <div className="text-4xl mb-4">📂</div>
        <p className="font-bold">No registered systems found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
      {profiles.map((profile) => (
        <div key={profile.id} className="glass-card p-6 flex flex-col border-amber-50 hover:border-amber-200">
          <div className="flex justify-between items-start mb-6">
            <div className={`w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center text-2xl shadow-sm`}>
              🏠
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => onEdit(profile)}
                className="w-8 h-8 bg-white border border-amber-100 text-amber-500 rounded-xl flex items-center justify-center hover:bg-amber-500 hover:text-white transition-all shadow-sm"
              >
                ✏️
              </button>
              <button 
                onClick={() => handleDelete(profile.id)}
                className="w-8 h-8 bg-white border border-orange-100 text-orange-500 rounded-xl flex items-center justify-center hover:bg-orange-500 hover:text-white transition-all shadow-sm"
              >
                🗑️
              </button>
            </div>
          </div>
          
          <h3 className="text-lg font-black text-[#2D241E] mb-1">{profile.profileName}</h3>
          <div className="flex justify-between items-center mb-6">
             <p className="text-[#6B5E54] text-xs font-bold italic">📍 {profile.locationCity}</p>
             {profile.estimatedGeneration > 0 && (
               <span className="text-[8px] font-black text-amber-600 bg-amber-50 px-2 py-1 rounded-md border border-amber-100 uppercase tracking-widest mt-0.5">
                 {profile.estimatedGeneration} kW Target
               </span>
             )}
          </div>

          <div className="space-y-4 mt-auto">
            <div className="bg-white/50 p-3 rounded-2xl border border-amber-50">
              <div className="flex justify-between text-[9px] font-black text-gray-400 mb-1 uppercase tracking-tighter">
                <span>Capacity</span>
                <span>{profile.panelCapacity} kW</span>
              </div>
              <div className="h-1.5 w-full bg-gray-100/50 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-amber-400 rounded-full"
                  style={{ width: `${Math.min(100, (profile.panelCapacity / 20) * 100)}%` }}
                ></div>
              </div>
            </div>
            <div className="bg-white/50 p-3 rounded-2xl border border-amber-50">
              <div className="flex justify-between text-[9px] font-black text-gray-400 mb-1 uppercase tracking-tighter">
                <span>Efficiency</span>
                <span>{profile.panelEfficiency || 18}%</span>
              </div>
              <div className="h-1.5 w-full bg-gray-100/50 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-orange-400 rounded-full"
                  style={{ width: `${profile.panelEfficiency || 18}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
