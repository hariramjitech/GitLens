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
    <div className="h-full flex flex-col bg-black overflow-hidden font-inter">
      {/* Header Info */}
      <div className="p-6 pb-8 space-y-6 shrink-0 bg-black border-b border-zinc-900 relative">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
             <div className="flex items-center space-x-2 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
               <Hash className="w-3.5 h-3.5" />
               <span>Impact Signature</span>
             </div>
             <span className={`px-3 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border ${
               stats?.total > 100 ? 'bg-zinc-100 text-zinc-950 border-zinc-200' :
               stats?.total > 30 ? 'bg-zinc-900 text-zinc-400 border-zinc-800' :
               'bg-transparent text-zinc-500 border-zinc-900'
             }`}>
               {stats?.total > 100 ? 'Structural' : stats?.total > 30 ? 'Logic' : 'Surgical'}
             </span>
          </div>
          <h2 className="text-xl font-semibold text-zinc-100 leading-tight tracking-tight">{commit.message}</h2>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-zinc-950/50 border border-zinc-900 p-3 rounded-xl flex items-center space-x-3">
            <div className="bg-zinc-900 p-1.5 rounded-lg border border-zinc-800">
              <User className="w-3.5 h-3.5 text-zinc-500" />
            </div>
            <div className="min-w-0">
              <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-wider mb-0.5">Architect</p>
              <p className="text-xs font-medium text-zinc-300 truncate">{commit.author.name}</p>
            </div>
          </div>
          <div className="bg-zinc-950/50 border border-zinc-900 p-3 rounded-xl flex items-center space-x-3">
            <div className="bg-zinc-900 p-1.5 rounded-lg border border-zinc-800">
              <Calendar className="w-3.5 h-3.5 text-zinc-500" />
            </div>
            <div className="min-w-0">
              <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-wider mb-0.5">Timeline</p>
              <p className="text-xs font-medium text-zinc-300 truncate">{new Date(commit.author.date).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}</p>
            </div>
          </div>
        </div>

        <div className="bg-zinc-950 border border-zinc-900 p-4 rounded-xl flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center text-emerald-500 space-x-1.5">
              <PlusCircle className="w-3.5 h-3.5" />
              <span className="text-xs font-bold tracking-tight">{stats?.additions || 0}</span>
            </div>
            <div className="h-3 w-px bg-zinc-800"></div>
            <div className="flex items-center text-rose-500 space-x-1.5">
              <MinusCircle className="w-3.5 h-3.5" />
              <span className="text-xs font-bold tracking-tight">{stats?.deletions || 0}</span>
            </div>
          </div>
          <div className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">
            {files.length} Modified Streams
          </div>
        </div>
      </div>

      {/* Diffs List */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6 custom-scrollbar bg-black">
        {files.map((file, idx) => (
          <div key={idx} className="bg-zinc-950 rounded-xl border border-zinc-900 overflow-hidden hover:border-zinc-800 transition-colors group">
            <div className="px-5 py-3 bg-zinc-950/50 border-b border-zinc-900 flex items-center justify-between">
              <div className="flex items-center space-x-2.5 min-w-0">
                <FileCode className="w-3.5 h-3.5 text-zinc-600 shrink-0" />
                <span className="text-[11px] font-mono font-medium text-zinc-400 truncate tracking-tight">{file.filename}</span>
              </div>
              <ChevronRight className="w-3 h-3 text-zinc-700 group-hover:text-zinc-500 transition-transform group-hover:translate-x-0.5" />
            </div>
            
            <div className="bg-black p-4 overflow-x-auto custom-scrollbar">
              <pre className="text-[11px] font-mono leading-relaxed">
                {file.patch ? (
                  file.patch.split("\n").map((line, i) => {
                    let lineStyle = "text-zinc-600";
                    let bgStyle = "";
                    if (line.startsWith("+")) {
                      lineStyle = "text-emerald-400";
                      bgStyle = "bg-emerald-400/5 -mx-4 px-4";
                    } else if (line.startsWith("-")) {
                      lineStyle = "text-rose-400";
                      bgStyle = "bg-rose-400/5 -mx-4 px-4";
                    } else if (line.startsWith("@@")) {
                      lineStyle = "text-zinc-500 font-bold";
                      bgStyle = "bg-zinc-900/50 -mx-4 px-4 border-y border-zinc-900/50 my-0.5";
                    }
                    return (
                      <div key={i} className={`flex ${bgStyle} min-w-fit hover:bg-zinc-900/30 transition-colors`}>
                        <span className="w-8 shrink-0 text-zinc-800 text-right mr-4 select-none tabular-nums">{i + 1}</span>
                        <span className={lineStyle}>{line}</span>
                      </div>
                    );
                  })
                ) : (
                  <div className="py-6 text-center">
                    <span className="text-zinc-700 font-medium text-[10px] uppercase tracking-widest">No Stream Data Available</span>
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
