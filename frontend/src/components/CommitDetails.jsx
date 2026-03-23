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

  if (loading) return <div className="h-full flex items-center justify-center"><LoadingSpinner message="Fetching diffs..." /></div>;
  if (error) return <div className="p-8 text-center text-red-400 bg-red-500/5 rounded-3xl border border-red-500/10 m-6">{error}</div>;
  if (!details) return null;

  const { commit, files = [], stats } = details;

  return (
    <div className="h-full flex flex-col bg-white overflow-hidden">
      {/* Header Info */}
      <div className="p-10 pb-8 space-y-8 shrink-0 bg-slate-50/50 border-b border-slate-100">
        <div className="space-y-3">
          <div className="flex items-center space-x-2 text-[10px] font-black text-blue-600 uppercase tracking-[0.2em]">
            <Hash className="w-3.5 h-3.5" />
            <span>Commit Manifest</span>
          </div>
          <h2 className="text-3xl font-black text-slate-900 leading-tight tracking-tighter">{commit.message}</h2>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="bg-white border border-slate-200 p-4 rounded-3xl flex items-center space-x-4 shadow-sm">
            <div className="bg-blue-50 p-3 rounded-2xl">
              <User className="w-5 h-5 text-blue-600" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Author</p>
              <p className="text-sm font-bold text-slate-800 truncate">{commit.author.name}</p>
            </div>
          </div>
          <div className="bg-white border border-slate-200 p-4 rounded-3xl flex items-center space-x-4 shadow-sm">
            <div className="bg-indigo-50 p-3 rounded-2xl">
              <Calendar className="w-5 h-5 text-indigo-600" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Timeline</p>
              <p className="text-sm font-bold text-slate-800 truncate">{new Date(commit.author.date).toLocaleDateString([], { month: 'long', day: 'numeric', year: 'numeric' })}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between p-5 bg-white border border-slate-200 rounded-3xl shadow-sm">
          <div className="flex items-center space-x-6">
            <div className="flex items-center text-emerald-600 space-x-2 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-100">
              <PlusCircle className="w-4 h-4" />
              <span className="text-sm font-black">+{stats?.additions || 0}</span>
            </div>
            <div className="flex items-center text-red-600 space-x-2 bg-red-50 px-3 py-1.5 rounded-xl border border-red-100">
              <MinusCircle className="w-4 h-4" />
              <span className="text-sm font-black">-{stats?.deletions || 0}</span>
            </div>
          </div>
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em]">
            {files.length} Files Impacted
          </div>
        </div>
      </div>

      {/* Diffs List */}
      <div className="flex-1 overflow-y-auto px-10 py-10 space-y-8 custom-scrollbar bg-slate-50/20">
        {files.map((file, idx) => (
          <div key={idx} className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all group">
            <div className="px-6 py-5 bg-slate-50/50 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center space-x-3 min-w-0">
                <FileCode className="w-4 h-4 text-blue-600 shrink-0" />
                <span className="text-xs font-mono font-black text-slate-700 truncate">{file.filename}</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600 transition-colors" />
            </div>
            
            <div className="bg-slate-900 p-6 overflow-x-auto custom-scrollbar">
              <pre className="text-[12px] font-mono leading-relaxed">
                {file.patch ? (
                  file.patch.split("\n").map((line, i) => {
                    let lineStyle = "text-slate-400";
                    let bgStyle = "";
                    if (line.startsWith("+")) {
                      lineStyle = "text-emerald-400";
                      bgStyle = "bg-emerald-400/10";
                    } else if (line.startsWith("-")) {
                      lineStyle = "text-red-400";
                      bgStyle = "bg-red-400/10";
                    } else if (line.startsWith("@@")) {
                      lineStyle = "text-blue-400/80";
                      bgStyle = "bg-blue-400/5";
                    }
                    return (
                      <div key={i} className={`flex ${bgStyle} min-w-fit px-2 -mx-2`}>
                        <span className="w-10 shrink-0 text-slate-700 text-right mr-6 select-none font-bold">{i + 1}</span>
                        <span className={lineStyle}>{line}</span>
                      </div>
                    );
                  })
                ) : (
                  <span className="text-slate-600 italic">No diff available (possibly binary or too large)</span>
                )}
              </pre>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
