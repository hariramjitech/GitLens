import React, { useEffect, useState } from 'react';
import { useGitHub } from '../hooks/useGitHub';
import { Activity, Calendar, Info, Loader2 } from 'lucide-react';

const HeatmapView = ({ owner, repo, commits: initialCommits = [] }) => {
  const { fetchCommits } = useGitHub();
  const [commits, setCommits] = useState(initialCommits);
  const [loading, setLoading] = useState(initialCommits.length === 0);

  useEffect(() => {
    if (initialCommits.length > 0) {
      setCommits(initialCommits);
      setLoading(false);
      return;
    }
    
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
  }, [owner, repo, fetchCommits, initialCommits]);

  // Data processing for real heatmap
  const { commitMap, contributorStats, totalYearCommits } = React.useMemo(() => {
    const map = {};
    const contribs = {};
    let total = 0;
    
    // Calculate one year ago
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

    commits.forEach(commit => {
      const date = new Date(commit.commit.author.date);
      const dateStr = date.toDateString();
      
      // Map for grid
      map[dateStr] = (map[dateStr] || 0) + 1;
      
      // Contributor stats
      if (date >= oneYearAgo) {
        total++;
        const login = commit.author?.login || commit.commit.author.name;
        const avatar = commit.author?.avatar_url;
        if (!contribs[login]) {
          contribs[login] = { login, avatar, count: 0 };
        }
        contribs[login].count++;
      }
    });

    return { 
      commitMap: map, 
      contributorStats: Object.values(contribs).sort((a, b) => b.count - a.count),
      totalYearCommits: total 
    };
  }, [commits]);

  const stats = React.useMemo(() => {
    if (commits.length === 0) return { streak: 0, hours: 'N/A', risk: 'Low' };

    let maxStreak = 0;
    let currentStreak = 0;
    const sortedDates = Object.keys(commitMap)
      .map(d => new Date(d))
      .sort((a, b) => b - a);

    if (sortedDates.length > 0) {
      let tempStreak = 1;
      for (let i = 0; i < sortedDates.length - 1; i++) {
        const diff = Math.round((sortedDates[i] - sortedDates[i+1]) / (1000 * 60 * 60 * 24));
        if (diff === 1) {
          tempStreak++;
        } else {
          maxStreak = Math.max(maxStreak, tempStreak);
          tempStreak = 1;
        }
      }
      maxStreak = Math.max(maxStreak, tempStreak);
    }

    const hours = commits.map(c => new Date(c.commit.author.date).getHours());
    const minHour = Math.min(...hours);
    const maxHour = Math.max(...hours);
    const formatHour = (h) => h === 0 ? '12 AM' : h < 12 ? `${h} AM` : h === 12 ? '12 PM' : `${h-12} PM`;
    
    return { 
      streak: maxStreak, 
      hours: `${formatHour(minHour)} - ${formatHour(maxHour)}`, 
      risk: commits.length > 80 ? 'Low (0.1)' : commits.length > 30 ? 'Med (0.4)' : 'High (0.7)' 
    };
  }, [commits, commitMap]);

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const weeks = Array.from({ length: 53 }, (_, i) => i);
  
  const today = new Date();
  const startDate = new Date(today);
  startDate.setDate(today.getDate() - (52 * 7) - today.getDay());
  
  const monthLabels = React.useMemo(() => {
    const labels = [];
    let lastMonth = -1;
    for (let w = 0; w < 53; w++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + (w * 7));
      const month = date.getMonth();
      if (month !== lastMonth) {
        labels.push({ label: date.toLocaleDateString(undefined, { month: 'short' }), week: w });
        lastMonth = month;
      }
    }
    return labels;
  }, [startDate]);

  const getIntensity = (week, day) => {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + (week * 7) + day);
    const count = commitMap[date.toDateString()] || 0;
    
    if (count === 0) return 'bg-zinc-900/40 border border-white/[0.02]';
    if (count < 2) return 'bg-emerald-900/40 border border-emerald-800/30 hover:bg-emerald-800/50 shadow-[inset_0_0_8px_rgba(16,185,129,0.05)]';
    if (count < 4) return 'bg-emerald-700/60 border border-emerald-600/40 hover:bg-emerald-600/70 shadow-[inset_0_0_10px_rgba(16,185,129,0.1)]';
    if (count < 7) return 'bg-emerald-500 border border-emerald-400/50 hover:bg-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.2)]';
    return 'bg-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.5)] hover:scale-110 border border-emerald-300/60';
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-black">
        <Loader2 className="w-8 h-8 text-zinc-800 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto bg-black custom-scrollbar">
      <div className="max-w-6xl mx-auto p-12 space-y-12 animate-in fade-in duration-700">
        
        {/* Header Section */}
        <div className="flex items-end justify-between border-b border-zinc-900 pb-8">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-white tracking-tight">Development Velocity</h2>
            <p className="text-sm text-zinc-500 font-medium tracking-[0.2em] uppercase">Chronological commit density mapping • {totalYearCommits} contributions in the last year</p>
          </div>
          <div className="flex items-center space-x-6">
             <div className="text-right">
                <div className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest leading-none mb-1">Status</div>
                <div className="flex items-center space-x-2">
                   <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                   <span className="text-xs font-bold text-emerald-500 uppercase tracking-widest">Active Stream</span>
                </div>
             </div>
          </div>
        </div>

        {/* Heatmap Grid Section */}
        <div className="glass-card p-10 relative group">
           <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
           
           <div className="relative">
              {/* Month Labels */}
              <div className="flex mb-3 text-[9px] font-bold text-zinc-600 uppercase tracking-widest pl-12">
                 {monthLabels.map((m, i) => (
                    <span key={i} style={{ marginLeft: i === 0 ? '0' : `${(m.week - monthLabels[i-1].week) * 1.5}rem` }} className="flex-none">
                       {m.label}
                    </span>
                 ))}
              </div>

              <div className="flex">
                 {/* Day labels */}
                 <div className="flex flex-col justify-between pr-6 pb-2 text-[9px] font-bold text-zinc-700 uppercase h-32 w-12 text-right">
                   {days.map((d, i) => (
                     <span key={d} className={i % 2 === 0 ? 'invisible' : ''}>{d}</span>
                   ))}
                 </div>

                 {/* The Grid */}
                 <div className="flex-1 grid gap-1 h-32" style={{ gridTemplateColumns: 'repeat(53, minmax(0, 1fr))' }}>
                    {weeks.map(w => (
                      <div key={w} className="flex flex-col gap-1">
                         {Array.from({ length: 7 }).map((_, d) => {
                           const date = new Date(startDate);
                           date.setDate(startDate.getDate() + (w * 7) + d);
                           const count = commitMap[date.toDateString()] || 0;
                           return (
                             <div 
                               key={d} 
                               className={`flex-1 rounded-[2px] transition-all duration-300 cursor-pointer ${getIntensity(w, d)}`}
                               title={`${count} commits • ${date.toDateString()}`}
                             />
                           );
                         })}
                      </div>
                    ))}
                 </div>
              </div>

              <div className="mt-8 flex items-center justify-between text-[10px] font-medium text-zinc-600 uppercase tracking-[0.2em]">
                 <span>1 Year Activity Stream</span>
                 <div className="flex items-center space-x-3">
                    <span>Low</span>
                    <div className="flex gap-1">
                       {[0, 2, 4, 7, 10].map(v => (
                          <div key={v} className={`w-2.5 h-2.5 rounded-[1px] border ${v === 0 ? 'bg-zinc-900 border-white/[0.02]' : v < 3 ? 'bg-emerald-900/40 border-emerald-800/30' : v < 5 ? 'bg-emerald-700/60 border-emerald-600/40' : v < 8 ? 'bg-emerald-500 border-emerald-400/50' : 'bg-emerald-400 border-emerald-300/60 shadow-[0_0_8px_rgba(52,211,153,0.4)]'}`} />
                       ))}
                    </div>
                    <span>High</span>
                 </div>
              </div>
           </div>
        </div>

        {/* Stats & Activity Breakdown */}
        <div className="grid grid-cols-3 gap-8">
           <div className="col-span-1 space-y-6">
              {[
                { label: 'Longest Streak', value: `${stats.streak} Days`, icon: Calendar },
                { label: 'Active Hours', value: stats.hours, icon: Activity },
                { label: 'Risk Factor', value: stats.risk, icon: Info },
              ].map((stat, i) => (
                <div key={i} className="bg-zinc-950/50 border border-zinc-900 p-8 rounded-3xl hover:border-emerald-500/30 transition-all duration-500 group relative overflow-hidden">
                   <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                      <stat.icon className="w-12 h-12 text-white" />
                   </div>
                   <stat.icon className="w-4 h-4 text-zinc-600 mb-4 group-hover:text-emerald-500 transition-colors" />
                   <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">{stat.label}</div>
                   <div className="text-xl font-bold text-zinc-100">{stat.value}</div>
                </div>
              ))}
           </div>

           <div className="col-span-2 bg-zinc-950/50 border border-zinc-900 rounded-[2.5rem] p-10 relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />
              <div className="flex items-center justify-between mb-8">
                 <h3 className="text-sm font-bold text-zinc-200 uppercase tracking-[0.3em]">Collaborative Activity</h3>
                 <span className="text-[10px] font-bold text-zinc-500 uppercase">{contributorStats.length} Core Contributors</span>
              </div>
              <div className="space-y-4">
                 {contributorStats.slice(0, 5).map((c, i) => (
                    <div key={c.login} className="flex items-center justify-between p-4 bg-zinc-900/30 rounded-2xl border border-zinc-900 hover:border-emerald-500/20 transition-all hover:bg-zinc-900/50 group/item">
                       <div className="flex items-center space-x-4">
                          <img src={c.avatar} alt={c.login} className="w-10 h-10 rounded-xl border border-zinc-800 group-hover/item:border-emerald-500/50 transition-colors" />
                          <div>
                             <div className="text-sm font-bold text-zinc-300 group-hover/item:text-white transition-colors">{c.login}</div>
                             <div className="text-[10px] font-medium text-zinc-600 uppercase tracking-tighter">Contribution Tier {i === 0 ? 'Alpha' : 'Beta'}</div>
                          </div>
                       </div>
                       <div className="text-right">
                          <div className="text-lg font-bold text-emerald-500">{c.count}</div>
                          <div className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">Commits</div>
                       </div>
                    </div>
                 ))}
                 {contributorStats.length === 0 && (
                    <div className="text-center py-12 text-zinc-600 font-bold uppercase text-xs tracking-widest">
                       No contribution data available
                    </div>
                 )}
              </div>
           </div>
        </div>

      </div>
    </div>
  );
};

export default HeatmapView;
