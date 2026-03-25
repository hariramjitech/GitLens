import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useGitHub } from '../hooks/useGitHub';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import RepoCard from '../components/RepoCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { Search, SlidersHorizontal, Sparkles } from 'lucide-react';

const DashboardPage = () => {
  const { login, user } = useAuth();
  const { fetchRepos, loading, error } = useGitHub();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [repos, setRepos] = useState([]);
  const [search, setSearch] = useState('');
  const [greeting, setGreeting] = useState('');

  // Handle token from URL if redirected from OAuth
  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      login(token);
      navigate('/dashboard', { replace: true });
    }
  }, [searchParams, login, navigate]);

  useEffect(() => {
    const loadRepos = async () => {
      try {
        const data = await fetchRepos();
        setRepos(data);
      } catch (err) {
        console.error(err);
      }
    };
    loadRepos();

    // Personal personalized greeting
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning,');
    else if (hour < 18) setGreeting('Good afternoon,');
    else setGreeting('Good evening,');
  }, [fetchRepos]);

  const filteredRepos = repos.filter(repo =>
    repo.name.toLowerCase().includes(search.toLowerCase()) ||
    (repo.description && repo.description.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-black flex flex-col font-inter selection:bg-white/20 text-white">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 space-y-8 md:space-y-0 relative z-10">
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-white/50 mb-2">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium tracking-wide">{greeting} welcome to your workspace.</span>
            </div>

            {/* Global Conflict Indicator */}
            <div className="flex items-center space-x-3 bg-red-500/5 border border-red-500/10 px-4 py-2 rounded-2xl w-fit mb-6 animate-pulse">
              <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
              <span className="text-[10px] font-bold text-red-500/80 uppercase tracking-widest leading-none">Unresolved Conflicts in 2 Streams</span>
            </div>

            <h2 className="text-5xl md:text-6xl font-semibold tracking-tighter text-white">Your Codebases</h2>
            <p className="text-white/40 text-sm font-medium tracking-tight">Select a repository to initiate visualization.</p>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 group-focus-within:text-white transition-colors" />
              <input
                type="text"
                placeholder="Search repositories..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-[#050505] border border-white/10 rounded-full pl-12 pr-6 py-3.5 text-[15px] focus:outline-none focus:ring-1 focus:ring-white/20 w-80 md:w-96 transition-all placeholder:text-white/30 font-medium text-white shadow-inner"
              />
            </div>
            <button className="p-3.5 bg-[#050505] border border-white/10 rounded-full hover:bg-white/5 text-white/40 hover:text-white transition-all duration-300 group shadow-lg">
              <SlidersHorizontal className="w-5 h-5" />
            </button>
          </div>
        </div>

        {loading ? (
          <div className="py-32 flex justify-center">
            <LoadingSpinner message="Fetching your repositories..." />
          </div>
        ) : error ? (
          <div className="glass-panel p-12 rounded-3xl border-red-500/20 text-center max-w-2xl mx-auto mt-20">
            <p className="text-red-400 font-semibold mb-2">Error Loading Repositories</p>
            <p className="text-white/50 text-sm">{error}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
            {filteredRepos.length > 0 ? (
              filteredRepos.map(repo => (
                <RepoCard key={repo.id} repo={repo} currentUser={user} />
              ))
            ) : (
              <div className="col-span-full py-32 text-center glass-panel rounded-3xl mt-10">
                <p className="text-white/50 font-medium text-[15px]">No repositories found matching your search.</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default DashboardPage;
