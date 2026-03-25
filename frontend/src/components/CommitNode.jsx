import React, { memo } from "react";
import { Handle, Position } from "@xyflow/react";
import { Calendar, User, GitCommit } from "lucide-react";

const CommitNode = ({ data }) => {
  return (
    <div className="group relative">
      <div className={`w-[320px] bg-zinc-950 border transition-all duration-300 rounded-xl overflow-hidden ${data.isHead ? 'border-zinc-500 ring-1 ring-zinc-500/20' : 'border-zinc-800 group-hover:border-zinc-700'}`}>
        
        <Handle type="target" position={Position.Top} className="!w-1.5 !h-1.5 !bg-zinc-700 !border-none" />
        <Handle type="source" position={Position.Bottom} className="!w-1.5 !h-1.5 !bg-zinc-700 !border-none" />

        <div className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
               <div className={`w-1.5 h-1.5 rounded-full ${data.isHead ? 'bg-emerald-500' : 'bg-zinc-800'}`} />
               <span className="text-[10px] font-bold text-zinc-400 font-mono tracking-tight">{data.sha}</span>
            </div>
            <span className="text-[9px] font-medium text-zinc-600 uppercase tracking-wider">{new Date(data.date).toLocaleDateString()}</span>
          </div>

          <p className={`text-[11px] font-medium leading-relaxed tracking-tight ${data.isHead ? 'text-zinc-100' : 'text-zinc-400 group-hover:text-zinc-200'} transition-colors line-clamp-2`}>
            {data.message}
          </p>

          <div className="pt-3 border-t border-zinc-900 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <img src={data.avatarUrl} className="w-5 h-5 rounded-md border border-zinc-900 group-hover:border-zinc-800 transition-colors" alt={data.author} />
              <span className="text-[10px] font-medium text-zinc-500 group-hover:text-zinc-300 transition-colors">{data.author}</span>
            </div>
            {data.isHead && (
               <div className="px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800">
                  <span className="text-[8px] font-bold text-zinc-500 uppercase tracking-wider">HEAD</span>
               </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(CommitNode);
