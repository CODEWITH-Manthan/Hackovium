/**
 * ProfileForm (v5 - Amber Glow)
 * Redesigned with Amber aesthetics and boxed layout.
 */

import { useState, useEffect } from "react";
import { createProfile, updateProfile } from "../services/profileService";
import { listCities } from "../services/weatherService";

export default function ProfileForm({ onProfileCreated, initialData, onCancel }) {
  const [formData, setFormData] = useState({
    profileName: "",
    locationCity: "Mumbai",
    panelCapacity: "5",
    panelEfficiency: "18",
    tiltAngle: "",
    estimatedGeneration: ""
  });
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (initialData) {
      setFormData({
        profileName: initialData.profileName || "",
        locationCity: initialData.locationCity || "Mumbai",
        panelCapacity: String(initialData.panelCapacity || "5"),
        panelEfficiency: String(initialData.panelEfficiency || "18"),
        tiltAngle: initialData.tiltAngle ? String(initialData.tiltAngle) : "",
        estimatedGeneration: initialData.estimatedGeneration ? String(initialData.estimatedGeneration) : ""
      });
    }
  }, [initialData]);

  useEffect(() => {
    const loadCities = async () => {
      try {
        const data = await listCities();
        setCities(data);
      } catch (err) {
        console.error("Failed to load cities:", err);
      }
    };
    loadCities();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const payload = {
        ...formData,
        panelCapacity: Number(formData.panelCapacity),
        panelEfficiency: Number(formData.panelEfficiency),
        tiltAngle: formData.tiltAngle ? Number(formData.tiltAngle) : undefined,
        estimatedGeneration: formData.estimatedGeneration ? Number(formData.estimatedGeneration) : undefined
      };

      if (initialData?.id) {
        await updateProfile(initialData.id, payload);
      } else {
        await createProfile(payload);
        setFormData({
          profileName: "",
          locationCity: "Mumbai",
          panelCapacity: "5",
          panelEfficiency: "18",
          tiltAngle: "",
          estimatedGeneration: ""
        });
      }
      if (onProfileCreated) onProfileCreated();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to save profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card p-10 animate-fade-in border-amber-50 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-32 h-32 bg-amber-100/10 blur-[60px] pointer-events-none rounded-full"></div>
      
      <h2 className="text-2xl font-black text-[#2D241E] mb-8 flex items-center gap-2">
        <span className="p-2 bg-amber-100 rounded-xl text-xl">✨</span> {initialData ? "Edit System Profile" : "New System Profile"}
      </h2>

      {error && (
        <div className="bg-orange-50 border border-orange-100 text-orange-600 p-4 rounded-2xl mb-6 text-sm font-bold">
          ⚠️ {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Profile Name</label>
          <input
            name="profileName"
            value={formData.profileName}
            onChange={handleChange}
            className="input-field"
            placeholder="e.g. Home Solar Array"
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Location City</label>
            <select
              name="locationCity"
              value={formData.locationCity}
              onChange={handleChange}
              className="input-field appearance-none cursor-pointer"
              required
            >
              {cities.map(c => (
                <option key={c.name} value={c.name}>{c.name}, {c.country}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Capacity (kW)</label>
            <input
              name="panelCapacity"
              type="number"
              step="0.1"
              value={formData.panelCapacity}
              onChange={handleChange}
              className="input-field"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Efficiency (%)</label>
            <input
              name="panelEfficiency"
              type="number"
              step="0.1"
              value={formData.panelEfficiency}
              onChange={handleChange}
              className="input-field"
              required
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Tilt Angle (°)</label>
            <input
              name="tiltAngle"
              type="number"
              step="1"
              value={formData.tiltAngle}
              onChange={handleChange}
              placeholder="Auto"
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Est. Generation (kW)</label>
            <input
              name="estimatedGeneration"
              type="number"
              step="0.1"
              value={formData.estimatedGeneration}
              onChange={handleChange}
              placeholder="0.0"
              className="input-field"
            />
          </div>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="btn-primary flex-1"
          >
            {loading ? "Saving..." : initialData ? "Update Profile" : "Initialize Profile"}
          </button>
          
          {initialData && (
             <button
               type="button"
               onClick={onCancel}
               className="px-8 py-4 bg-gray-100 text-[#2D241E] font-bold rounded-2xl hover:bg-gray-200 transition-all font-['Outfit']"
             >
               Cancel
             </button>
          )}
        </div>
      </form>
    </div>
  );
}
