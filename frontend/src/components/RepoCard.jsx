import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, GitFork, Eye, Calendar, Lock, Globe } from 'lucide-react';

const RepoCard = ({ repo }) => {
  const navigate = useNavigate();

  const handleVisualise = () => {
    navigate(`/repo/${repo.full_name}`);
  };

  return (
    <div className="card-premium flex flex-col h-full bg-white group hover:-translate-y-3 transition-all duration-500">
      <div className="flex justify-between items-start mb-8">
        <div className="flex items-center space-x-3">
          {repo.private ? (
            <div className="bg-amber-50 p-2 rounded-xl shadow-inner border border-amber-100/50">
              <Lock className="w-4 h-4 text-amber-600" />
            </div>
          ) : (
            <div className="bg-emerald-50 p-2 rounded-xl shadow-inner border border-emerald-100/50">
              <Globe className="w-4 h-4 text-emerald-600" />
            </div>
          )}
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
            {repo.private ? 'Secured' : 'Public Stream'}
          </span>
        </div>
        <div className="flex items-center space-x-2 bg-slate-50/80 px-4 py-1.5 rounded-full border border-slate-200/40 skeuo-pressed group-hover:bg-white transition-colors">
          <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
          <span className="text-xs font-black text-slate-600">{repo.stargazers_count}</span>
        </div>
      </div>

      <h3 className="text-2xl font-black text-slate-900 mb-4 line-clamp-1 group-hover:text-indigo-600 transition-colors tracking-tight">
        {repo.name}
      </h3>
      
      <p className="text-slate-500 text-[13px] mb-10 line-clamp-2 flex-grow leading-relaxed font-bold tracking-tight px-1">
        {repo.description || 'No description provided. A clean codebase waiting for exploration.'}
      </p>

      <div className="flex items-center justify-between mt-auto pt-8 border-t border-slate-50">
        <div className="flex items-center space-x-3 text-[10px] font-black uppercase tracking-widest text-slate-300 group-hover:text-slate-500 transition-colors">
          <Calendar className="w-4 h-4 opacity-50" />
          <span>Sync {new Date(repo.updated_at).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}</span>
        </div>
        <button
          onClick={handleVisualise}
          className="btn-primary"
        >
          Visualise
        </button>
      </div>
    </div>
  );
};

export default RepoCard;
