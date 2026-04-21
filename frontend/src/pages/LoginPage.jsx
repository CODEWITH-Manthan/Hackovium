/**
 * LoginPage (v5 - Amber Glow)
 * Standardized with Amber highlights and professional grid background.
 */

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../services/authService";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.error || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md animate-fade-in group">
        <div className="glass-card p-10 relative overflow-hidden border-amber-50">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-100/10 blur-[60px] pointer-events-none rounded-full"></div>
          
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-600 rounded-2xl mx-auto flex items-center justify-center text-white text-3xl font-black shadow-xl shadow-amber-500/20 mb-6 group-hover:rotate-6 transition-transform">
              S
            </div>
            <h1 className="section-title text-4xl mb-2">Welcome Back</h1>
            <p className="text-gray-400 font-bold text-xs uppercase tracking-widest">Access your solar intelligence</p>
          </div>

          {error && (
            <div className="bg-orange-50 border border-orange-100 text-orange-600 p-4 rounded-2xl mb-8 text-sm font-bold animate-shake">
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full mt-4"
            >
              {loading ? "Authenticating..." : "Sign In to SolSense"}
            </button>
          </form>

          <div className="mt-10 text-center">
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">
              New to the platform?{" "}
              <Link to="/register" className="text-orange-600 hover:text-orange-700 transition-colors">
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
