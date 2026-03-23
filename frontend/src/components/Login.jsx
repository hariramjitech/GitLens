import React from "react";
import { Zap, Eye, BarChart3 } from "lucide-react";
import GithubIcon from "./GithubIcon";

export default function Login() {
  const handleLogin = () => {
    window.location.href = "http://localhost:5000/auth/github";
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 overflow-hidden relative selection:bg-indigo-100 selection:text-indigo-900 font-inter">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-indigo-500/5 rounded-full blur-[160px] pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-purple-500/5 rounded-full blur-[160px] pointer-events-none animate-pulse delay-700"></div>

      <div className="max-w-7xl mx-auto px-10 pt-40 pb-20 relative z-10">
        <div className="flex flex-col items-center text-center space-y-12">
          <div className="inline-flex items-center space-x-3 bg-white border border-slate-100 px-6 py-2.5 rounded-full skeuo-raised group cursor-default">
            <Zap className="w-4 h-4 text-indigo-500 group-hover:scale-125 transition-transform" />
            <span className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 group-hover:text-indigo-900 transition-colors">Streamlined Intelligence</span>
          </div>

          <div className="space-y-6">
            <h1 className="text-7xl md:text-[9rem] font-black tracking-tighter text-slate-900 leading-[0.85] font-outfit">
              GitLens<br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 animate-gradient-x">Visual</span>
            </h1>

            <p className="max-w-3xl text-lg md:text-2xl text-slate-500 font-bold leading-relaxed tracking-tight">
              The architecture of your codebase, <span className="text-slate-900"> reimagined.</span><br />
              Explore history, branches, and flows through tactile interaction.
            </p>
          </div>

          <div className="pt-12">
            <button
              onClick={handleLogin}
              className="px-12 py-6 bg-indigo-600 text-white font-black rounded-3xl shadow-[0_32px_64px_-12px_rgba(79,70,229,0.3)] hover:shadow-[0_48px_80px_-16px_rgba(79,70,229,0.4)] hover:-translate-y-2 active:scale-95 transition-all duration-500 text-xl tracking-tight flex items-center space-x-5 group"
            >
              <div className="bg-white/20 p-2 rounded-xl group-hover:rotate-12 transition-transform">
                <GithubIcon className="w-8 h-8 text-white" />
              </div>
              <span>Establish Connection</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 pt-32 w-full max-w-6xl">
            <div className="bg-white p-10 rounded-[2.5rem] text-left space-y-6 group skeuo-raised hover:-translate-y-3 transition-all duration-500">
              <div className="bg-indigo-50/50 w-16 h-16 rounded-2xl flex items-center justify-center border border-indigo-100 shadow-inner group-hover:scale-110 transition-transform">
                <BarChart3 className="w-8 h-8 text-indigo-600 shadow-sm" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">Kinetic Flows</h3>
              <p className="text-slate-500 text-sm leading-relaxed font-bold tracking-tight">Visualize commit depth and branch divergence through physical-feeling nodes and edges.</p>
            </div>

            <div className="bg-white p-10 rounded-[2.5rem] text-left space-y-6 group skeuo-raised hover:-translate-y-3 transition-all duration-500">
              <div className="bg-purple-50/50 w-16 h-16 rounded-2xl flex items-center justify-center border border-purple-100 shadow-inner group-hover:scale-110 transition-transform">
                <Eye className="w-8 h-8 text-purple-600 shadow-sm" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">Surgical Review</h3>
              <p className="text-slate-500 text-sm leading-relaxed font-bold tracking-tight">Examine surgical file changes with a clean, high-fidelity diff viewer designed for absolute clarity.</p>
            </div>

            <div className="bg-white p-10 rounded-[2.5rem] text-left space-y-6 group skeuo-raised hover:-translate-y-3 transition-all duration-500">
              <div className="bg-emerald-50/50 w-16 h-16 rounded-2xl flex items-center justify-center border border-emerald-100 shadow-inner group-hover:scale-110 transition-transform">
                <Zap className="w-8 h-8 text-emerald-600 shadow-sm" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">Unified Pulse</h3>
              <p className="text-slate-500 text-sm leading-relaxed font-bold tracking-tight">Real-time sync with GitHub Hub, ensuring you're always aligned with the latest core modifications.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
