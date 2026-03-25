import React, { useEffect, useState } from 'react';
import { useGitHub } from '../hooks/useGitHub';
import { Clock, User, MessageSquare, GitCommit, ChevronRight, Sparkles, Filter } from 'lucide-react';

const TimelineView = ({ owner, repo, onSelectCommit }) => {
  const { fetchCommits } = useGitHub();
  const [commits, setCommits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCommits = async () => {
      setLoading(true);
      try {
        const data = await fetchCommits(owner, repo);
        setCommits(data);
      } catch (err) {
        console.error("Failed to load timeline", err);
      } finally {
        setLoading(false);
      }
    };
    loadCommits();
  }, [owner, repo, fetchCommits]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-black min-h-0">
        <div className="w-8 h-8 border-2 border-zinc-900 border-t-zinc-400 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex-1 h-full flex flex-col bg-black overflow-hidden relative min-h-0">
      {/* Timeline Header */}
      <div className="h-14 border-b border-zinc-900 bg-black/50 backdrop-blur-xl flex items-center justify-between px-8 z-10 shrink-0">
        <div className="flex items-center space-x-3">
          <Clock className="w-4 h-4 text-zinc-500" />
          <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">Temporal Stream</h2>
        </div>
        <div className="flex items-center space-x-4">
           <button className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-zinc-900/50 border border-zinc-800 text-zinc-500 hover:text-zinc-300 transition-all text-[10px] font-bold uppercase tracking-wider">
              <Filter className="w-3 h-3" />
              <span>Filter Stream</span>
           </button>
        </div>
      </div>

      {/* Main Timeline Body */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-8 min-h-0">
        <div className="max-w-3xl mx-auto relative pb-20">
          {/* Vertical Line */}
          <div className="absolute left-[21px] top-4 bottom-4 w-px bg-gradient-to-b from-zinc-800 via-zinc-900 to-transparent" />

          <div className="space-y-12">
            {commits.map((commit, idx) => (
              <div 
                key={commit.sha} 
                onClick={() => onSelectCommit(commit)}
                className="group relative flex items-start space-x-8 cursor-pointer animate-in fade-in slide-in-from-bottom-4 duration-500"
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                {/* Node Symbol */}
                <div className="relative mt-1 z-10">
                  <div className="w-11 h-11 rounded-2xl bg-zinc-950 border border-zinc-900 flex items-center justify-center transition-all group-hover:scale-110 group-hover:bg-zinc-900 group-hover:border-zinc-700 shadow-xl overflow-hidden">
                    {commit.author?.avatar_url ? (
                      <img src={commit.author.avatar_url} className="w-full h-full object-cover opacity-50 group-hover:opacity-100 transition-opacity" alt="" />
                    ) : (
                      <User className="w-5 h-5 text-zinc-700" />
                    )}
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors" />
                    <GitCommit className="absolute w-4 h-4 text-zinc-100 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  {idx === 0 && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-black animate-pulse" />
                  )}
                </div>

                {/* Content Card */}
                <div className="flex-1 min-w-0 pt-0.5">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                      <span className="text-zinc-400 group-hover:text-zinc-200 transition-colors font-semibold">{commit.author?.login || commit.commit.author.name || 'Anonymous'}</span>
                      <span className="w-1 h-1 rounded-full bg-zinc-800" />
                      <span className="tabular-nums font-medium">{new Date(commit.commit.author.date).toLocaleDateString([], { month: 'short', day: 'numeric' })}</span>
                    </div>
                    <div className="flex items-center space-x-2 bg-zinc-950 px-2 py-0.5 rounded border border-zinc-900 group-hover:border-zinc-800 transition-colors">
                      <span className="text-[10px] font-mono text-zinc-600 uppercase tabular-nums">{commit.sha.substring(0, 7)}</span>
                    </div>
                  </div>
                  
                  <div className="glass-card p-5 group-hover:shadow-[0_0_30px_rgba(255,255,255,0.02)] relative overflow-hidden transition-all duration-300 border-zinc-900 group-hover:border-zinc-700">
                    <div className="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-500/50" />
                    </div>
                    <h3 className="text-zinc-300 font-medium text-[13px] leading-relaxed mb-4 group-hover:text-zinc-100 transition-colors">
                      {commit.commit.message}
                    </h3>
                    
                    <div className="flex items-center space-x-4 text-[11px] text-zinc-500 font-bold uppercase tracking-widest">
                       <div className="flex items-center space-x-1.5">
                          <MessageSquare className="w-3 h-3 text-zinc-600" />
                          <span>Status: OK</span>
                       </div>
                       <div className="flex items-center space-x-1.5 group-hover:text-zinc-400 transition-colors">
                          <ChevronRight className="w-3 h-3" />
                          <span>View Impact</span>
                       </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimelineView;
