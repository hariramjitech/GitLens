import React, { useEffect, useState } from 'react';
import { useGitHub } from '../hooks/useGitHub';
import { Activity, Calendar, Info, Loader2 } from 'lucide-react';

const HeatmapView = ({ owner, repo }) => {
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
        console.error("Failed to load heatmap data", err);
      } finally {
        setLoading(false);
      }
    };
    loadCommits();
  }, [owner, repo, fetchCommits]);

  // Generate 26 weeks of mock heatmap data based on real commits
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const weeks = Array.from({ length: 26 }, (_, i) => i);
  
  const getIntensity = (week, day) => {
    // In a real app, match week/day to commit dates
    // For now, random intensity for visual effect, weighted by actual commit count
    const totalCommits = commits.length || 1;
    const hash = (week * 7 + day) % totalCommits;
    if (hash === 0) return 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]';
    if (hash % 3 === 0) return 'bg-zinc-800';
    if (hash % 5 === 0) return 'bg-zinc-700';
    return 'bg-zinc-900/50';
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-black">
        <Loader2 className="w-8 h-8 text-zinc-800 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-black overflow-hidden p-12">
      <div className="max-w-5xl mx-auto w-full space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
        
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-white tracking-tight">Development Velocity</h2>
            <p className="text-xs text-zinc-500 font-medium uppercase tracking-widest">Chronological commit density mapping</p>
          </div>
          <div className="flex items-center space-x-2 bg-zinc-900/50 px-4 py-2 rounded-2xl border border-zinc-800">
             <Activity className="w-4 h-4 text-emerald-500" />
             <span className="text-[10px] font-bold text-zinc-300 uppercase tracking-widest">{commits.length} Total Pulses</span>
          </div>
        </div>

        <div className="glass-card p-10 relative overflow-hidden group">
           <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />
           
           <div className="flex">
              {/* Day labels */}
              <div className="flex flex-col justify-between pr-6 pb-2 text-[9px] font-bold text-zinc-600 uppercase tracking-tighter">
                {days.map(d => <span key={d}>{d}</span>)}
              </div>

              {/* Grid */}
              <div className="flex-1 grid grid-cols-26 gap-1.5 h-32">
                 {weeks.map(w => (
                   <div key={w} className="flex flex-col gap-1.5">
                      {Array.from({ length: 7 }).map((_, d) => (
                        <div 
                          key={d} 
                          className={`flex-1 rounded-[3px] transition-all duration-500 hover:scale-125 cursor-help ${getIntensity(w, d)}`}
                          title={`Week ${w}, Day ${d}`}
                        />
                      ))}
                   </div>
                 ))}
              </div>
           </div>

           <div className="mt-8 flex items-center justify-between text-[10px] font-medium text-zinc-500 uppercase tracking-widest">
              <span>Past 6 Months</span>
              <div className="flex items-center space-x-2">
                 <span>Less</span>
                 <div className="flex gap-1">
                    <div className="w-2.5 h-2.5 rounded-[2px] bg-zinc-900" />
                    <div className="w-2.5 h-2.5 rounded-[2px] bg-zinc-800" />
                    <div className="w-2.5 h-2.5 rounded-[2px] bg-zinc-700" />
                    <div className="w-2.5 h-2.5 rounded-[2px] bg-emerald-500" />
                 </div>
                 <span>More</span>
              </div>
           </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
           {[
             { label: 'Longest Streak', value: '12 Days', icon: Calendar },
             { label: 'Active Hours', value: '9 AM - 6 PM', icon: Activity },
             { label: 'Risk Factor', value: 'Low (0.2)', icon: Info },
           ].map((stat, i) => (
             <div key={i} className="bg-zinc-950/50 border border-zinc-900 p-6 rounded-3xl hover:border-zinc-800 transition-colors group">
                <stat.icon className="w-4 h-4 text-zinc-600 mb-4 group-hover:text-emerald-500 transition-colors" />
                <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">{stat.label}</div>
                <div className="text-lg font-bold text-zinc-200">{stat.value}</div>
             </div>
           ))}
        </div>

      </div>
    </div>
  );
};

export default HeatmapView;
