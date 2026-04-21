/**
 * SolarProfilePage (v5 - Amber Glow)
 * Standardized for the new theme and font scales.
 */

import { useState, useEffect } from "react";
import ProfileForm from "../components/ProfileForm";
import ProfileList from "../components/ProfileList";
import { listProfiles } from "../services/profileService";

export default function SolarProfilePage() {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProfile, setEditingProfile] = useState(null);

  const fetchProfiles = async () => {
    try {
      const data = await listProfiles();
      setProfiles(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  const handleEdit = (profile) => {
    setEditingProfile(profile);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSaved = () => {
    setEditingProfile(null);
    fetchProfiles();
  };

  return (
    <div className="page-container font-['Outfit']">
      <div className="mb-12">
        <h1 className="section-title">System Profiles</h1>
        <p className="text-gray-400 font-bold text-lg mt-1 lowercase italic tracking-tighter">Manage your global photovoltaic infrastructure.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        <div className="lg:col-span-5 lg:sticky top-28">
          <ProfileForm 
            onProfileCreated={handleSaved} 
            initialData={editingProfile} 
            onCancel={() => setEditingProfile(null)}
          />
        </div>
        
        <div className="lg:col-span-7">
          <div className="flex justify-between items-center mb-6 px-2">
            <h3 className="text-[10px] font-black text-amber-500 uppercase tracking-widest">Active Registrations ({profiles.length})</h3>
            <div className="h-px bg-amber-100 flex-1 mx-6 opacity-30"></div>
          </div>
          {loading ? (
            <div className="glass-card p-12 text-center text-gray-400 border-amber-50">
               <p className="animate-pulse font-bold tracking-widest uppercase text-xs text-amber-600">Syncing database...</p>
            </div>
          ) : (
            <ProfileList profiles={profiles} onProfileDeleted={fetchProfiles} onEdit={handleEdit} />
          )}
        </div>
      </div>
    </div>
  );
}
