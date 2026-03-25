import React, { useEffect, useState } from "react";
import { useGitHub } from "../hooks/useGitHub";
import { User, Calendar, PlusCircle, MinusCircle, FileCode, ChevronRight, Hash } from "lucide-react";
import LoadingSpinner from "./LoadingSpinner";

export default function CommitDetails({ repo, commitSha }) {
  const [details, setDetails] = useState(null);
  const { fetchCommitDetail, loading, error } = useGitHub();

  useEffect(() => {
    if (!repo || !commitSha) return;

    const loadDetails = async () => {
      try {
        const [owner, name] = repo.full_name.split("/");
        const data = await fetchCommitDetail(owner, name, commitSha);
        setDetails(data);
      } catch (err) {
        console.error(err);
      }
    };

    loadDetails();
  }, [repo, commitSha, fetchCommitDetail]);

  if (loading) return <div className="h-full flex items-center justify-center"><div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-white/20"></div></div>;
  if (error) return <div className="p-8 text-center text-red-400 bg-red-500/5 rounded-3xl border border-red-500/10 m-6">{error}</div>;
  if (!details) return null;

  const { commit, files = [], stats } = details;

  return (
    <div className="h-full flex flex-col bg-black overflow-hidden selection:bg-white/20 font-inter">
      {/* Header Info */}
      <div className="p-8 pb-10 space-y-6 shrink-0 bg-[#050505] border-b border-white/5 shadow-2xl relative">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
             <div className="flex items-center space-x-2.5 text-[10px] font-semibold text-white/40 uppercase tracking-[0.2em]">
               <Hash className="w-3.5 h-3.5" />
               <span>Impact Signature</span>
             </div>
             <span className={`px-4 py-1 rounded-full text-[9px] font-semibold uppercase tracking-widest border ${
               stats?.total > 100 ? 'bg-white/10 text-white/90 border-white/20' :
               stats?.total > 30 ? 'bg-white/5 text-white/70 border-white/10' :
               'bg-transparent text-white/50 border-white/5'
             }`}>
               {stats?.total > 100 ? 'Structural' : stats?.total > 30 ? 'Logic' : 'Surgical'}
             </span>
          </div>
          <h2 className="text-2xl font-semibold text-white leading-tight tracking-tight">{commit.message}</h2>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-[#0a0a0a] border border-white/5 p-4 rounded-2xl flex items-center space-x-4 hover:bg-[#111] transition-all duration-300">
            <div className="bg-white/5 p-2 rounded-xl border border-white/5">
              <User className="w-4 h-4 text-white/60" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-semibold text-white/30 uppercase tracking-widest mb-0.5">Architect</p>
              <p className="text-sm font-medium text-white/90 truncate">{commit.author.name}</p>
            </div>
          </div>
          <div className="bg-[#0a0a0a] border border-white/5 p-4 rounded-2xl flex items-center space-x-4 hover:bg-[#111] transition-all duration-300">
            <div className="bg-white/5 p-2 rounded-xl border border-white/5">
              <Calendar className="w-4 h-4 text-white/60" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-semibold text-white/30 uppercase tracking-widest mb-0.5">Timeline</p>
              <p className="text-sm font-medium text-white/90 truncate">{new Date(commit.author.date).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}</p>
            </div>
          </div>
        </div>

        <div className="bg-[#0a0a0a] border border-white/5 p-5 rounded-2xl flex items-center justify-between shadow-inner">
          <div className="flex items-center space-x-6">
            <div className="flex items-center text-emerald-400 space-x-2">
              <PlusCircle className="w-4 h-4" />
              <span className="text-sm font-semibold tracking-tight">{stats?.additions || 0}</span>
            </div>
            <div className="h-5 w-px bg-white/10"></div>
            <div className="flex items-center text-rose-400 space-x-2">
              <MinusCircle className="w-4 h-4" />
              <span className="text-sm font-semibold tracking-tight">{stats?.deletions || 0}</span>
            </div>
          </div>
          <div className="text-[10px] font-semibold text-white/40 uppercase tracking-widest">
            {files.length} Modified Streams
          </div>
        </div>
      </div>

      {/* Diffs List */}
      <div className="flex-1 overflow-y-auto px-8 py-8 space-y-8 custom-scrollbar bg-black">
        {files.map((file, idx) => (
          <div key={idx} className="bg-[#050505] rounded-3xl border border-white/5 overflow-hidden hover:border-white/10 transition-all duration-500 group">
            <div className="px-6 py-4 bg-[#0a0a0a]/50 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center space-x-3 min-w-0">
                <div className="p-1.5 bg-white/5 rounded-lg border border-white/5">
                  <FileCode className="w-3.5 h-3.5 text-white/50 shrink-0" />
                </div>
                <span className="text-xs font-mono font-medium text-white/80 truncate max-w-[400px] tracking-tight">{file.filename}</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-white/30 group-hover:text-white/60 group-hover:translate-x-1 transition-all" />
            </div>
            
            <div className="bg-black p-6 lg:p-8 overflow-x-auto custom-scrollbar shadow-inner relative">
              <pre className="text-[12px] font-mono leading-relaxed relative z-10">
                {file.patch ? (
                  file.patch.split("\n").map((line, i) => {
                    let lineStyle = "text-white/50";
                    let bgStyle = "";
                    if (line.startsWith("+")) {
                      lineStyle = "text-emerald-400 font-medium";
                      bgStyle = "bg-emerald-400/5 -mx-8 px-8";
                    } else if (line.startsWith("-")) {
                      lineStyle = "text-rose-400 font-medium";
                      bgStyle = "bg-rose-400/5 -mx-8 px-8";
                    } else if (line.startsWith("@@")) {
                      lineStyle = "text-white/30 italic";
                      bgStyle = "bg-white/5 -mx-8 px-8 border-y border-white/5 my-1";
                    }
                    return (
                      <div key={i} className={`flex ${bgStyle} min-w-fit transition-colors hover:bg-white/[0.02]`}>
                        <span className="w-10 shrink-0 text-white/20 text-right mr-6 select-none font-medium tabular-nums">{i + 1}</span>
                        <span className={lineStyle}>{line}</span>
                      </div>
                    );
                  })
                ) : (
                  <div className="py-8 text-center">
                    <span className="text-white/30 italic font-medium text-xs uppercase tracking-widest">No Stream Data Available</span>
                  </div>
                )}
              </pre>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
