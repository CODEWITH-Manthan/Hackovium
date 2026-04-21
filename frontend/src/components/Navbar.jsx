/**
 * Navbar (v4 - Pink Glow)
 * Redesigned with Rose Quartz aesthetics and bold typography.
 */

import { Link, useNavigate } from "react-router-dom";
import { logout, isAuthenticated, getCurrentUser } from "../services/authService";

export default function Navbar() {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const isAuth = isAuthenticated();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="sticky top-0 z-50 px-6 py-4">
      <div className="max-w-7xl mx-auto glass-card px-8 py-3 flex justify-between items-center border-amber-100/30">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-amber-500/20 group-hover:rotate-12 transition-transform">
            <span className="text-xl font-bold">S</span>
          </div>
          <span className="text-xl font-extrabold tracking-tight text-[#2D241E]">
            Sol<span className="text-orange-600">Sense</span>
            <span className="ml-1 text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full uppercase">V5 Amber</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-10 text-base font-bold">
          <Link to="/" className="nav-link text-[#6B5E54] hover:text-orange-500">Home</Link>
          <Link to="/dashboard" className="nav-link text-[#6B5E54] hover:text-orange-500">Dashboard</Link>
          <Link to="/profiles" className="nav-link text-[#6B5E54] hover:text-orange-500">System Profiles</Link>
        </div>

        <div className="flex items-center gap-6">
          {isAuth ? (
            <div className="flex items-center gap-6 border-l border-amber-100 pl-6">
              <span className="text-base font-black text-[#6B5E54]">Hi, {user?.username}</span>
              <button onClick={handleLogout} className="text-base font-black text-orange-500 hover:text-orange-600 transition-colors">
                Sign Out
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn-primary py-3 px-8 text-base">
              Connect
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
