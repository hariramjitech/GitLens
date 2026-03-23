import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../utils/api";
import { LogOut, PanelBottomClose, PanelBottomOpen } from "lucide-react";
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
    navigate("/");
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-950 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col text-gray-100 h-screen overflow-hidden">
      {/* Top Navbar */}
      <header className="h-16 bg-gray-900 border-b border-gray-800 flex items-center justify-between px-6 shrink-0 relative z-10">
        <div className="flex items-center space-x-3">
          <GithubIcon className="w-7 h-7 text-white" />
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500 tracking-tight">
            GitLens<span className="font-light text-gray-400">Visual</span>
          </h1>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3 bg-gray-800 rounded-full px-3 py-1.5 border border-gray-700 shadow-sm">
            <img
              src={user.avatar_url}
              alt="Avatar"
              className="w-7 h-7 rounded-full border border-gray-600"
            />
            <span className="text-sm font-medium pr-2 text-gray-200">{user.login}</span>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-full transition-colors"
            title="Logout"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Content Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar: RepoList */}
        <div className="w-80 bg-gray-900 border-r border-gray-800 flex flex-col shrink-0 z-10 shadow-xl">
          <div className="p-4 border-b border-gray-800">
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              Repositories
            </h2>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <RepoList onSelectRepo={(repo) => {
               setSelectedRepo(repo);
               setSelectedCommit(null);
            }} selectedRepo={selectedRepo} />
          </div>
        </div>

        {/* Main Viewing Area */}
        <div className="flex-1 flex flex-col bg-gray-950 relative">
          {/* Main Content (Graph) */}
          <div className="flex-1 relative overflow-hidden">
            {!selectedRepo ? (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="flex flex-col items-center space-y-4 opacity-40">
                  <GithubIcon className="w-20 h-20 text-gray-600" />
                  <p className="text-xl font-medium text-gray-500">Select a repository to view its commit graph</p>
                </div>
              </div>
            ) : (
              <div className="absolute inset-0">
                <CommitGraph selectedRepo={selectedRepo} onSelectCommit={(commit) => {
                  setSelectedCommit(commit);
                  setIsDetailsOpen(true);
                }} />
              </div>
            )}
          </div>

          {/* Bottom Panel (Commit Details) */}
          {selectedCommit && (
            <div className={`transition-all duration-300 ease-in-out bg-gray-900 border-t border-gray-800 shrink-0 shadow-2xl z-20 relative flex flex-col ${isDetailsOpen ? 'h-96' : 'h-14'}`}>
               <div className="h-14 flex items-center justify-between px-6 border-b border-gray-800 shrink-0 bg-gray-800">
                 <div className="flex items-center space-x-3">
                   <h3 className="font-semibold text-gray-200 tracking-wide text-sm">Commit Info</h3>
                   <span className="font-mono text-blue-400 text-xs py-1 px-2 bg-blue-500/10 rounded">{selectedCommit.fullSha}</span>
                 </div>
                 <button 
                  onClick={() => setIsDetailsOpen(!isDetailsOpen)}
                  className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors"
                 >
                   {isDetailsOpen ? <PanelBottomClose className="w-5 h-5"/> : <PanelBottomOpen className="w-5 h-5"/>}
                 </button>
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
