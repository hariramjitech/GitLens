import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useGitHub } from '../hooks/useGitHub';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import RepoCard from '../components/RepoCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { Search, SlidersHorizontal } from 'lucide-react';

const DashboardPage = () => {
  const { user, login } = useAuth();
  const { fetchRepos, loading, error } = useGitHub();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [repos, setRepos] = useState([]);
  const [search, setSearch] = useState('');

  // Handle token from URL if redirected from OAuth
  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      login(token);
      // Remove token from URL for security and cleanliness
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
  }, [fetchRepos]);

  const filteredRepos = repos.filter(repo => 
    repo.name.toLowerCase().includes(search.toLowerCase()) ||
    (repo.description && repo.description.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-16 space-y-8 md:space-y-0">
          <div>
            <h2 className="text-4xl font-black text-slate-900 mb-3 tracking-tight">Your Codebases</h2>
            <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Select a stream to visualize history</p>
          </div>

          <div className="flex items-center space-x-6">
            <div className="relative group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
              <input
                type="text"
                placeholder="Search repositories..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-white border border-slate-100 rounded-2xl pl-14 pr-6 py-4 text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/10 w-85 transition-all skeuo-raised placeholder:text-slate-300 font-bold text-slate-700"
              />
            </div>
            <button className="p-4 bg-white border border-slate-100 rounded-2xl skeuo-raised hover:-translate-y-1 active:skeuo-pressed transition-all duration-300 group">
              <SlidersHorizontal className="w-5 h-5 text-slate-400 group-hover:text-slate-900 transition-colors" />
            </button>
          </div>
        </div>

        {loading ? (
          <div className="py-20">
            <LoadingSpinner message="Fetching your repositories..." />
          </div>
        ) : error ? (
          <div className="glass p-12 rounded-3xl border-red-500/20 text-center">
            <p className="text-red-400 font-bold mb-2">Error Loading Repositories</p>
            <p className="text-gray-400 text-sm">{error}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredRepos.length > 0 ? (
              filteredRepos.map(repo => (
                <RepoCard key={repo.id} repo={repo} />
              ))
            ) : (
              <div className="col-span-full py-20 text-center glass rounded-3xl">
                <p className="text-gray-400 font-medium text-lg">No repositories found matching your search.</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default DashboardPage;
