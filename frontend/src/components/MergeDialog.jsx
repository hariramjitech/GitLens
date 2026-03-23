import React, { useState, useEffect } from 'react';
import { GitMerge, AlertTriangle, CheckCircle, X, ChevronRight, Info } from 'lucide-react';

const MergeDialog = ({ isOpen, onClose, owner, repo, branches, onMergeSuccess, compareBranches, mergeBranches }) => {
  const [baseBranch, setBaseBranch] = useState('');
  const [headBranch, setHeadBranch] = useState('');
  const [comparison, setComparison] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mergeStatus, setMergeStatus] = useState(null); // 'idle', 'merging', 'success', 'conflict', 'error'

  useEffect(() => {
    if (branches && branches.length > 0) {
      const main = branches.find(b => b.name === 'main' || b.name === 'master');
      if (main) setBaseBranch(main.name);
      else setBaseBranch(branches[0].name);
    }
  }, [branches, isOpen]);

  useEffect(() => {
    if (baseBranch && headBranch && baseBranch !== headBranch) {
      handleCompare();
    } else {
      setComparison(null);
    }
  }, [baseBranch, headBranch]);

  const handleCompare = async () => {
    try {
      const data = await compareBranches(owner, repo, baseBranch, headBranch);
      setComparison(data);
    } catch (err) {
      console.error('Comparison failed', err);
    }
  };

  const handleMerge = async () => {
    setMergeStatus('merging');
    try {
      const result = await mergeBranches(
        owner, 
        repo, 
        baseBranch, 
        headBranch, 
        `Merge branch '${headBranch}' into ${baseBranch}`
      );
      
      if (result.conflict) {
        setMergeStatus('conflict');
      } else {
        setMergeStatus('success');
        setTimeout(() => {
          onMergeSuccess();
          onClose();
        }, 2000);
      }
    } catch (err) {
      setMergeStatus('error');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/10 backdrop-blur-md">
      <div className="bg-white border border-slate-200/60 w-full max-w-xl rounded-[2rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.1)] overflow-hidden animate-in zoom-in duration-300">
        <div className="p-10 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-indigo-50 rounded-2xl">
              <GitMerge className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Merge Center</h2>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Review & Unified Flow</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors group">
            <X className="w-5 h-5 text-slate-400 group-hover:text-slate-900" />
          </button>
        </div>

        <div className="p-10 space-y-10">
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest pl-1">Base Branch</label>
              <div className="relative">
                <select
                  value={baseBranch}
                  onChange={(e) => setBaseBranch(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all font-bold appearance-none cursor-pointer text-slate-700"
                >
                  {branches.map(b => (
                    <option key={b.name} value={b.name}>{b.name}</option>
                  ))}
                </select>
                <ChevronRight className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 rotate-90 pointer-events-none" />
              </div>
            </div>
            <div className="space-y-3">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest pl-1">Head Branch</label>
              <div className="relative">
                <select
                  value={headBranch}
                  onChange={(e) => setHeadBranch(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all font-bold appearance-none cursor-pointer text-slate-700"
                >
                  <option value="" disabled>Select branch</option>
                  {branches.filter(b => b.name !== baseBranch).map(b => (
                    <option key={b.name} value={b.name}>{b.name}</option>
                  ))}
                </select>
                <ChevronRight className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 rotate-90 pointer-events-none" />
              </div>
            </div>
          </div>

          {comparison && (
            <div className="bg-slate-50/50 rounded-3xl p-8 border border-slate-100 space-y-8 animate-in slide-in-from-top-4 duration-500 shadow-inner">
              <div className="flex items-center justify-between">
                <div className="text-center group">
                  <div className="text-4xl font-black text-indigo-600 group-hover:scale-110 transition-transform">{comparison.ahead_by}</div>
                  <div className="text-[10px] text-slate-400 uppercase font-black tracking-widest mt-2">Ahead</div>
                </div>
                <div className="h-12 w-px bg-slate-200/60"></div>
                <div className="text-center group">
                  <div className="text-4xl font-black text-purple-600 group-hover:scale-110 transition-transform">{comparison.behind_by}</div>
                  <div className="text-[10px] text-slate-400 uppercase font-black tracking-widest mt-2">Behind</div>
                </div>
                <div className="h-12 w-px bg-slate-200/60"></div>
                <div className="text-center group">
                  <div className="text-4xl font-black text-emerald-600 group-hover:scale-110 transition-transform">{comparison.total_commits}</div>
                  <div className="text-[10px] text-slate-400 uppercase font-black tracking-widest mt-2">Commits</div>
                </div>
              </div>

              {comparison.status === 'diverged' && (
                <div className="flex items-start space-x-4 bg-amber-50 border border-amber-100/50 p-5 rounded-2xl">
                  <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-800 leading-relaxed font-bold">
                    Branches have diverged. A standard merge may create a merge commit to reconcile differences.
                  </p>
                </div>
              )}

              {comparison.status === 'identical' && (
                <div className="flex items-center justify-center space-x-3 py-2 bg-emerald-50 border border-emerald-100/50 rounded-2xl p-4">
                  <CheckCircle className="w-5 h-5 text-emerald-500" />
                  <span className="text-sm font-black text-emerald-700">Everything is fully up to date</span>
                </div>
              )}
            </div>
          )}

          {mergeStatus === 'success' && (
            <div className="bg-emerald-50 border border-emerald-100/50 p-6 rounded-3xl flex items-center space-x-5 animate-in fade-in duration-500">
              <div className="p-3 bg-emerald-500 rounded-2xl shadow-lg shadow-emerald-500/20">
                <CheckCircle className="w-7 h-7 text-white" />
              </div>
              <div>
                <div className="font-black text-emerald-900 text-lg">Successfully Merged!</div>
                <div className="text-[11px] text-emerald-700 font-bold uppercase tracking-widest mt-0.5">The branches have been unified</div>
              </div>
            </div>
          )}

          {mergeStatus === 'conflict' && (
            <div className="bg-red-50 border border-red-100/50 p-6 rounded-3xl flex items-center space-x-5 animate-in shake">
              <div className="p-3 bg-red-500 rounded-2xl shadow-lg shadow-red-500/20">
                <X className="w-7 h-7 text-white" />
              </div>
              <div>
                <div className="font-black text-red-900 text-lg">Merge Conflict Reserved</div>
                <div className="text-[11px] text-red-700 font-bold uppercase tracking-widest mt-0.5">Resolve conflicts on GitHub or via CLI</div>
              </div>
            </div>
          )}
        </div>

        <div className="p-8 bg-slate-50/50 border-t border-slate-100 flex items-center justify-end space-x-6">
          <button
            onClick={onClose}
            className="px-8 py-3 font-black text-slate-400 hover:text-slate-900 tracking-widest uppercase text-[11px] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleMerge}
            disabled={!headBranch || mergeStatus === 'merging' || comparison?.status === 'identical'}
            className="px-8 py-4 bg-indigo-600 text-white font-black rounded-2xl shadow-xl shadow-indigo-500/20 hover:bg-indigo-700 hover:shadow-indigo-500/40 hover:-translate-y-1 active:scale-95 disabled:opacity-50 disabled:translate-y-0 disabled:shadow-none transition-all duration-300 text-sm tracking-tight"
          >
            {mergeStatus === 'merging' ? 'Merging...' : 'Confirm Union'}
          </button>
        </div>

      </div>
    </div>
  );
};

export default MergeDialog;
