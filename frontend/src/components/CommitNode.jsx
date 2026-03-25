import React, { memo } from "react";
import { Handle, Position } from "@xyflow/react";
import { Calendar, User, GitCommit } from "lucide-react";

const CommitNode = ({ data }) => {
  return (
    <div className="group relative">
      {/* Precision Frame */}
      <div className={`w-[320px] bg-[#050505] border-[1px] transition-all duration-500 rounded-xl overflow-hidden shadow-2xl ${data.isHead ? 'border-white/20 ring-1 ring-white/10' : 'border-white/5 group-hover:border-white/20'}`}>
        
        {/* Connection Points */}
        <Handle type="target" position={Position.Top} className="!w-1.5 !h-1.5 !bg-white/10 !border-none" />
        <Handle type="source" position={Position.Bottom} className="!w-1.5 !h-1.5 !bg-white/10 !border-none" />

        <div className="p-4 space-y-3">
          {/* Metadata Bar */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
               <div className={`w-1.5 h-1.5 rounded-full ${data.isHead ? 'bg-emerald-500' : 'bg-white/10'}`} />
               <span className="text-[10px] font-bold text-white/80 uppercase tracking-widest tabular-nums">{data.sha}</span>
            </div>
            <span className="text-[9px] font-semibold text-white/20 uppercase tracking-widest italic">{new Date(data.date).toLocaleDateString()}</span>
          </div>

          {/* Main Message */}
          <p className={`text-[11px] font-medium leading-relaxed tracking-tight ${data.isHead ? 'text-white' : 'text-white/60 group-hover:text-white/90'} transition-colors line-clamp-2`}>
            {data.message}
          </p>

          {/* Author Pod */}
          <div className="pt-3 border-t border-white/5 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <img src={data.avatarUrl} className="w-5 h-5 rounded-md border border-white/10 grayscale group-hover:grayscale-0 transition-all" alt={data.author} />
              <span className="text-[10px] font-semibold text-white/30 group-hover:text-white/60 transition-colors tracking-tight">{data.author}</span>
            </div>
            {data.isHead && (
               <div className="px-1.5 py-0.5 rounded-md bg-white/5 border border-white/10">
                  <span className="text-[8px] font-bold text-white/40 uppercase tracking-tighter">Current Node</span>
               </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Glow Effect */}
      {data.isHead && (
         <div className="absolute -inset-4 bg-white/[0.02] blur-3xl -z-10 rounded-full" />
      )}
    </div>
  );
};

export default memo(CommitNode);
