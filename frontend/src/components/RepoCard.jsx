import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, GitFork, Eye, Calendar, Lock, Globe, Users, ShieldAlert, Sparkles, UserCircle } from 'lucide-react';

const RepoCard = ({ repo, currentUser }) => {
  const navigate = useNavigate();

  const handleVisualise = () => {
    navigate(`/repo/${repo.full_name}`);
  };

  return (
    <div className="card-premium flex flex-col h-full bg-[#0a0a0a]/50 backdrop-blur-md border border-white/5 group hover:-translate-y-1 hover:bg-[#111111] hover:border-white/10 transition-all duration-500 rounded-3xl p-8 cursor-pointer" onClick={handleVisualise}>
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center space-x-3">
          <div className="bg-white/5 p-2 rounded-xl border border-white/5 group-hover:bg-white/10 transition-colors">
            {repo.private ? (
              <Lock className="w-4 h-4 text-white/70" />
            ) : (
              <Globe className="w-4 h-4 text-white/70" />
            )}
          </div>
          <span className="text-[10px] font-semibold uppercase tracking-widest text-white/40 group-hover:text-white/70 transition-colors">
            {repo.private ? 'Private' : 'Public'}
          </span>
          <div className="h-3 w-px bg-white/10" />
          {repo.fork ? (
            <div className="flex items-center space-x-1.5 px-2 py-0.5 rounded border border-purple-500/20 bg-purple-500/10 text-purple-400">
               <GitFork className="w-3 h-3" />
               <span className="text-[9px] font-bold uppercase tracking-wider">Forked</span>
            </div>
          ) : repo.owner?.login === currentUser?.login ? (
            <div className="flex items-center space-x-1.5 px-2 py-0.5 rounded border border-emerald-500/20 bg-emerald-500/10 text-emerald-400">
               <UserCircle className="w-3 h-3" />
               <span className="text-[9px] font-bold uppercase tracking-wider">Owner</span>
            </div>
          ) : (
            <div className="flex items-center space-x-1.5 px-2 py-0.5 rounded border border-blue-500/20 bg-blue-500/10 text-blue-400">
               <Users className="w-3 h-3" />
               <span className="text-[9px] font-bold uppercase tracking-wider">Collab</span>
            </div>
          )}
        </div>
        <div className="flex items-center space-x-1.5 bg-white/5 px-3 py-1.5 rounded-full border border-white/5 group-hover:bg-white/10 transition-colors relative">
          {repo.hasConflict && (
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-black animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.5)]" title="Pending merge conflicts detected" />
          )}
          <Star className="w-3.5 h-3.5 text-white/50" />
          <span className="text-[11px] font-medium text-white/70">{repo.stargazers_count}</span>
        </div>
      </div>

      <h3 className="text-xl font-semibold text-white/90 mb-3 line-clamp-1 group-hover:text-white transition-colors tracking-tight">
        {repo.name}
      </h3>

      <p className="text-white/40 text-[13px] mb-8 line-clamp-2 flex-grow leading-relaxed font-normal tracking-tight">
        {repo.description || 'No description provided. Click to explore the architecture.'}
      </p>

      <div className="flex items-center justify-between mt-auto pt-6 border-t border-white/5">
        <div className="flex items-center space-x-2 text-[10px] font-medium tracking-wide text-white/30 group-hover:text-white/50 transition-colors">
          <Calendar className="w-3.5 h-3.5" />
          <span>Updated {new Date(repo.updated_at).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}</span>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleVisualise();
          }}
          className="px-5 py-2 bg-white text-black text-xs font-semibold rounded-full hover:bg-gray-200 active:scale-95 transition-all duration-300 shadow-[0_0_15px_rgba(255,255,255,0.1)] group-hover:shadow-[0_0_20px_rgba(255,255,255,0.2)]"
        >
          Explore
        </button>
      </div>
    </div>
  );
};

export default RepoCard;
