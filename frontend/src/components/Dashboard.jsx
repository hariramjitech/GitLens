import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../utils/api";
import { LogOut, PanelBottomClose, PanelBottomOpen, X, Sparkles } from "lucide-react";
import GithubIcon from "./GithubIcon";
import RepoList from "./RepoList";
import CommitGraph from "./CommitGraph";
import CommitDetails from "./CommitDetails";

export default function Dashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [selectedRepo, setSelectedRepo] = useState(null);
  const [selectedCommit, setSelectedCommit] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(true);

  useEffect(() => {
    // 1. Check for token in URL (from GitHub callback)
    const params = new URLSearchParams(location.search);
    const tokenFromUrl = params.get("token");

    if (tokenFromUrl) {
      localStorage.setItem("github_token", tokenFromUrl);
      // Clean up the URL securely without triggering a full React Router re-render loop
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    // 2. Fetch user profile
    const token = localStorage.getItem("github_token");
    if (!token) {
      // Not authenticated, send back
      navigate("/");
      return;
    }

    const fetchUser = async () => {
      try {
        const { data } = await api.get("/github/user");
        setUser(data);
      } catch (error) {
        console.error("Failed to fetch user:", error);
      }
    };

    fetchUser();
  }, [location, navigate]);

  const handleLogout = () => {
    localStorage.removeItem("github_token");
    setUser(null);
    navigate("/");
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-black flex justify-center items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white/20"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col text-white h-screen overflow-hidden font-inter">
      {/* Top Header */}
      <header className="h-14 bg-[#0a0a0a]/80 backdrop-blur-2xl border-b border-white/5 flex items-center justify-between px-6 shrink-0 relative z-10 shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="bg-white/5 p-1.5 rounded-lg border border-white/5">
            <GithubIcon className="w-5 h-5 text-white/80" />
          </div>
          <h1 className="text-sm font-semibold tracking-wide text-white/50">
            Explorer <span className="text-white/20 ml-2">/</span> <span className="text-white ml-2">{selectedRepo ? selectedRepo.name : 'Select Repository'}</span>
          </h1>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3 bg-white/5 rounded-full pl-1.5 pr-4 py-1.5 border border-white/5 shadow-inner cursor-default hover:bg-white/10 transition-colors">
            <img src={user?.avatar_url} className="w-5 h-5 rounded-full border border-white/10 shadow-sm" alt="User Profile" />
            <div className="flex flex-col">
              <span className="text-[10px] font-semibold uppercase tracking-widest text-white/80 leading-none">{user?.login}</span>
              <div className="flex items-center space-x-1.5 mt-0.5">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_5px_rgba(34,197,94,0.5)]"></div>
                <span className="text-[8.5px] font-semibold uppercase tracking-widest text-white/40">Synchronized</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar: RepoList */}
        <div className="w-80 bg-[#000000] border-r border-white/5 flex flex-col shrink-0 z-10 shadow-2xl relative">
          <div className="p-5 border-b border-white/5 flex items-center justify-between bg-[#0a0a0a]/50">
            <h2 className="text-[11px] font-semibold text-white/50 uppercase tracking-[0.2em]">
              Your Repositories
            </h2>
            <span className="bg-white/10 text-white/80 text-[9px] font-semibold px-2 py-0.5 rounded-full border border-white/5">GITHUB</span>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <RepoList onSelectRepo={(repo) => {
               setSelectedRepo(repo);
               setSelectedCommit(null);
            }} selectedRepo={selectedRepo} />
          </div>
        </div>

        {/* Main Viewing Area */}
        <div className="flex-1 flex flex-col bg-[#050505] relative">
          {/* Main Content (Graph) */}
          <div className="flex-1 relative overflow-hidden">
            {!selectedRepo ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex flex-col items-center space-y-6 opacity-30">
                  <div className="p-8 bg-[#0a0a0a] rounded-full border border-white/5 shadow-inner">
                    <Sparkles className="w-12 h-12 text-white/50" />
                  </div>
                  <div className="text-center space-y-2">
                    <p className="text-xl font-semibold text-white tracking-tight">Workspace Idle</p>
                    <p className="text-sm font-medium text-white/50">Select a repository from the left panel to begin.</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="absolute inset-0 pl-1 pt-1">
                {/* Visual wrapper for map feeling */}
                <div className="absolute inset-0 bg-[#0a0a0a] rounded-tl-2xl border-t border-l border-white/5 overflow-hidden shadow-[-10px_-10px_30px_rgba(0,0,0,0.5)]">
                   <CommitGraph selectedRepo={selectedRepo} onSelectCommit={(commit) => {
                     setSelectedCommit(commit);
                     setIsDetailsOpen(true);
                   }} />
                </div>
              </div>
            )}
          </div>

          {/* Bottom Panel (Commit Details) */}
          {selectedCommit && (
            <div className={`transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] bg-[#0a0a0a]/95 backdrop-blur-2xl border-t border-white/5 shrink-0 shadow-[0_-20px_50px_rgba(0,0,0,0.8)] z-20 relative flex flex-col ${isDetailsOpen ? 'h-[450px]' : 'h-14'}`}>
               <div className="h-14 flex items-center justify-between px-6 border-b border-white/5 shrink-0 bg-[#050505]/50">
                 <div className="flex items-center space-x-4">
                   <div className="bg-white/10 p-1.5 rounded-lg">
                     <PanelBottomOpen className="w-4 h-4 text-white" />
                   </div>
                   <h3 className="font-semibold text-white/90 tracking-widest text-[10px] uppercase">Commit Analysis</h3>
                   <span className="font-mono text-white/70 text-[10px] font-semibold py-1 inset-y-0 px-3 bg-white/5 rounded-full border border-white/10">{selectedCommit.sha}</span>
                 </div>
                 <div className="flex items-center space-x-2">
                   <button 
                    onClick={() => setIsDetailsOpen(!isDetailsOpen)}
                    className="p-2 text-white/40 hover:text-white hover:bg-white/10 rounded-lg transition-all active:scale-95"
                    title={isDetailsOpen ? "Collapse" : "Expand"}
                   >
                     {isDetailsOpen ? <PanelBottomClose className="w-5 h-5"/> : <PanelBottomOpen className="w-5 h-5"/>}
                   </button>
                   <button 
                    onClick={() => setSelectedCommit(null)}
                    className="p-2 text-white/40 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all active:scale-95"
                    title="Close Details"
                   >
                     <X className="w-5 h-5"/>
                   </button>
                 </div>
               </div>
               
               {isDetailsOpen && (
                 <div className="flex-1 overflow-hidden">
                    <CommitDetails repo={selectedRepo} commitSha={selectedCommit.fullSha} />
                 </div>
               )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
