/**
 * RegisterPage (v5 - Amber Glow)
 * Standardized with Amber highlights and professional grid background.
 */

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register, login } from "../services/authService";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      // Pass email as username, password as password
      await register(formData.email, formData.password);
      // Automatically log the user in to get the JWT token
      await login(formData.email, formData.password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-lg animate-fade-in group">
        <div className="glass-card p-10 relative overflow-hidden border-amber-50">
          <div className="absolute top-0 left-0 w-32 h-32 bg-amber-100/10 blur-[60px] pointer-events-none rounded-full"></div>
          
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-600 rounded-2xl mx-auto flex items-center justify-center text-white text-3xl font-black shadow-xl shadow-amber-500/20 mb-6 group-hover:rotate-6 transition-transform">
              S
            </div>
            <h1 className="section-title text-4xl mb-2">Join SolSense</h1>
            <p className="text-gray-400 font-bold text-xs uppercase tracking-widest">Professional Solar Energy Analytics</p>
          </div>

          {error && (
            <div className="bg-orange-50 border border-orange-100 text-orange-600 p-4 rounded-2xl mb-8 text-sm font-bold animate-shake">
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Full Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Email Address</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Password</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="input-field"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full mt-4"
            >
              {loading ? "Creating Profile..." : "Initialize Free Account"}
            </button>
          </form>

          <div className="mt-10 text-center">
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">
              Already have an account?{" "}
              <Link to="/login" className="text-orange-600 hover:text-orange-700 transition-colors">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
