import React from "react";
import { Zap, Eye, GitBranch, Sparkles } from "lucide-react";
import GithubIcon from "./GithubIcon";
import CityScene from "./CityScene";

export default function Login() {
  const handleLogin = () => {
    window.location.href = "http://localhost:5000/auth/github";
  };

  return (
    <div className="min-h-screen bg-black text-white relative selection:bg-white/20 selection:text-white font-inter flex flex-col overflow-hidden">
      {/* 3D Cinematic City Background - Interactive */}
      <div className="absolute inset-0 z-10">
        <CityScene />
      </div>
      
      {/* Overlay for better readability */}
      <div className="absolute inset-0 bg-black/60 pointer-events-none z-15"></div>

      {/* Header */}
      <nav className="relative w-full p-8 flex justify-between items-center z-20 shrink-0 pointer-events-none">
        <div className="flex items-center space-x-3 group cursor-pointer pointer-events-auto">
           <Zap className="w-5 h-5 text-white/80 group-hover:scale-110 transition-transform" />
           <span className="font-semibold tracking-tighter text-xl text-white/90 uppercase tracking-widest">GitLens</span>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 relative z-10 py-20 pointer-events-none">
        <div className="w-full max-w-4xl text-center flex flex-col items-center">
            <div className="inline-flex items-center space-x-3 bg-white/5 hover:bg-white/10 transition-all backdrop-blur-3xl border border-white/10 px-5 py-2 rounded-full mb-12 cursor-default group border-glow pointer-events-auto">
              <Sparkles className="w-3.5 h-3.5 text-white/40 group-hover:text-white transition-colors" />
              <span className="text-[12px] font-bold tracking-[0.15em] text-white/50 uppercase">GitLens Visual Beta</span>
            </div>

            <h1 className="text-6xl md:text-8xl lg:text-[7.5rem] font-semibold tracking-tighter text-white leading-[0.85] mb-10 font-inter animate-in fade-in slide-in-from-bottom-5 duration-1000">
              Your codebase,<br /> <span className="text-white/30 italic">visualized.</span>
            </h1>

            <p className="max-w-xl text-[18px] md:text-xl text-white/50 font-medium leading-relaxed tracking-tight mb-16 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-200">
              Interactive 3D architecture for your production-grade work. Explore history and flows in a living city of code.
            </p>

            <div className="flex items-center justify-center animate-in fade-in zoom-in duration-1000 delay-500 pointer-events-auto">
              <button
                onClick={handleLogin}
                className="bg-white text-black px-10 py-5 rounded-full flex items-center space-x-4 hover:scale-105 active:scale-95 transition-all shadow-[0_0_40px_rgba(255,255,255,0.15)] group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                <GithubIcon className="w-6 h-6" />
                <span className="font-bold tracking-tight text-[16px]">Continue with GitHub</span>
              </button>
            </div>
        </div>
      </main>

      {/* Feature Section (Footer-style cards) */}
      <div className="w-full max-w-6xl mx-auto px-6 pb-12 grid grid-cols-1 md:grid-cols-3 gap-6 z-10 relative">
          <div className="p-8 rounded-[2.5rem] border border-white/5 bg-[#030303]/40 backdrop-blur-3xl hover:border-white/20 transition-all group overflow-hidden relative">
             <div className="mb-6 text-white/20 group-hover:text-white transition-colors"><GitBranch className="w-6 h-6" /></div>
             <h3 className="text-sm font-bold tracking-widest uppercase mb-3 text-white/90">Kinetic Flows</h3>
             <p className="text-white/40 text-sm leading-relaxed font-medium">Visualize commit depth and branch divergence instantly with an interactive canvas.</p>
             <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-white/[0.02] rounded-full blur-2xl group-hover:bg-white/[0.05] transition-all"></div>
          </div>
          <div className="p-8 rounded-[2.5rem] border border-white/5 bg-[#030303]/40 backdrop-blur-3xl hover:border-white/20 transition-all group overflow-hidden relative">
             <div className="mb-6 text-white/20 group-hover:text-white transition-colors"><Eye className="w-6 h-6" /></div>
             <h3 className="text-sm font-bold tracking-widest uppercase mb-3 text-white/90">Surgical Review</h3>
             <p className="text-white/40 text-sm leading-relaxed font-medium">High-fidelity diff viewer designed for absolute clarity across thousands of lines.</p>
             <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-white/[0.02] rounded-full blur-2xl group-hover:bg-white/[0.05] transition-all"></div>
          </div>
          <div className="p-8 rounded-[2.5rem] border border-white/5 bg-[#030303]/40 backdrop-blur-3xl hover:border-white/20 transition-all group overflow-hidden relative">
             <div className="mb-6 text-white/20 group-hover:text-white transition-colors"><Zap className="w-6 h-6" /></div>
             <h3 className="text-sm font-bold tracking-widest uppercase mb-3 text-white/90">Unified Pulse</h3>
             <p className="text-white/40 text-sm leading-relaxed font-medium">Real-time sync with GitHub, ensuring your visualization is always perfectly aligned.</p>
             <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-white/[0.02] rounded-full blur-2xl group-hover:bg-white/[0.05] transition-all"></div>
          </div>
      </div>

      {/* Contextual Badge */}
      <div className="relative z-20 w-full px-8 pb-8 flex justify-center md:justify-end items-center pointer-events-none">
        <div className="flex items-center space-x-2 bg-white/5 border border-white/10 px-4 py-1.5 rounded-full backdrop-blur-md">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
          <span className="text-[10px] uppercase tracking-widest font-bold text-white/40">Visualizing:</span>
          <span className="text-[10px] uppercase tracking-widest font-bold text-white/60">microsoft / vscode</span>
        </div>
      </div>
    </div>
  );
}
