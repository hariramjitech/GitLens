import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { GitCommit, User, Calendar } from 'lucide-react';

export default memo(function CommitNode({ data }) {
  const { sha, message, author, date, isHead, avatarUrl } = data;

  return (
    <div className={`group relative px-6 py-8 rounded-[2rem] border transition-all duration-500 w-85 ${
      isHead 
      ? 'bg-white border-indigo-200 skeuo-raised shadow-indigo-500/5 hover:-translate-y-2' 
      : 'bg-white border-slate-100 skeuo-raised hover:-translate-y-2 hover:border-indigo-200/50'
    }`}>
      <Handle type="target" position={Position.Top} className="!w-2.5 !h-2.5 !bg-indigo-300 !border-white !border-2 !shadow-sm transition-all group-hover:!bg-indigo-500 group-hover:!scale-125" />
      
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2 bg-slate-50/80 rounded-full px-4 py-1.5 border border-slate-200/40 skeuo-pressed scale-90">
          <GitCommit className={`w-4 h-4 ${isHead ? 'text-indigo-600' : 'text-slate-300'}`} />
          <span className="font-mono text-[10px] font-black text-slate-400 tracking-tighter uppercase">{sha}</span>
        </div>
        {isHead && (
           <span className="text-[10px] font-black bg-indigo-600 text-white px-4 py-1.5 rounded-full uppercase tracking-widest shadow-xl shadow-indigo-500/30 scale-90 origin-right transition-transform group-hover:scale-100">
             Latest
           </span>
        )}
      </div>

      <div className="text-[15px] font-bold text-slate-900 mb-8 line-clamp-2 leading-relaxed tracking-tight min-h-[3rem] px-1">
        {message}
      </div>

      <div className="flex items-center justify-between pt-6 border-t border-slate-50">
        <div className="flex items-center space-x-4 px-1">
          <div className="relative">
            {avatarUrl ? (
              <img src={avatarUrl} alt={author} className="w-10 h-10 rounded-2xl border-2 border-white shadow-xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-6" />
            ) : (
              <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center border border-slate-100 skeuo-raised">
                <User className="w-5 h-5 text-slate-300" />
              </div>
            )}
            <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full shadow-sm" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-black text-slate-800 truncate max-w-[140px] leading-none mb-1.5">{author}</span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center">
               <Calendar className="w-3 h-3 mr-2 opacity-60" />
               {new Date(date).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          </div>
        </div>
      </div>

      <Handle type="source" position={Position.Bottom} className="!w-2.5 !h-2.5 !bg-indigo-500 !border-white !border-2 !shadow-sm transition-all group-hover:!scale-150" />
    </div>
  );
});
