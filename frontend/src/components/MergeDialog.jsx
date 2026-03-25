import React, { useState, useEffect } from 'react';
import { GitMerge, AlertTriangle, CheckCircle, X, ChevronRight, Info, Activity } from 'lucide-react';

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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-xl transition-opacity animate-in fade-in duration-500">
      <div className="bg-[#050505] border border-white/10 w-full max-w-xl rounded-[2.5rem] shadow-[0_0_100px_rgba(0,0,0,1)] overflow-hidden animate-in zoom-in duration-300">
        <div className="p-10 border-b border-white/5 flex items-center justify-between bg-[#0a0a0a]/50">
          <div className="flex items-center space-x-5">
            <div className="p-3 bg-white/5 rounded-2xl border border-white/10 shadow-inner">
              <GitMerge className="w-6 h-6 text-white/70" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-white tracking-tight">Merge Center</h2>
              <p className="text-[10px] font-semibold text-white/30 uppercase tracking-[0.2em] mt-1">Unified Stream Flow</p>
            </div>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-white/5 rounded-2xl transition-all text-white/20 hover:text-white/60 group border border-transparent hover:border-white/5">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-10 space-y-10 bg-black">
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-[10px] font-semibold text-white/40 uppercase tracking-widest pl-1 flex items-center">
                 <div className="w-1 h-1 bg-white/40 rounded-full mr-2" />
                 Base Branch
              </label>
              <div className="relative">
                <select
                  value={baseBranch}
                  onChange={(e) => setBaseBranch(e.target.value)}
                  className="w-full bg-[#0a0a0a] border border-white/10 hover:border-white/20 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:ring-1 focus:ring-white/20 transition-all font-semibold appearance-none cursor-pointer text-white/80"
                >
                  {branches.map(b => (
                    <option key={b.name} value={b.name}>{b.name}</option>
                  ))}
                </select>
                <ChevronRight className="w-4 h-4 text-white/20 absolute right-4 top-1/2 -translate-y-1/2 rotate-90 pointer-events-none" />
              </div>
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-semibold text-white/40 uppercase tracking-widest pl-1 flex items-center">
                 <div className="w-1 h-1 bg-white/40 rounded-full mr-2" />
                 Head Branch
              </label>
              <div className="relative">
                <select
                  value={headBranch}
                  onChange={(e) => setHeadBranch(e.target.value)}
                  className="w-full bg-[#0a0a0a] border border-white/10 hover:border-white/20 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:ring-1 focus:ring-white/20 transition-all font-semibold appearance-none cursor-pointer text-white/80"
                >
                  <option value="" disabled className="bg-black">Select branch</option>
                  {branches.filter(b => b.name !== baseBranch).map(b => (
                    <option key={b.name} value={b.name} className="bg-black">{b.name}</option>
                  ))}
                </select>
                <ChevronRight className="w-4 h-4 text-white/20 absolute right-4 top-1/2 -translate-y-1/2 rotate-90 pointer-events-none" />
              </div>
            </div>
          </div>

          {comparison && (
            <div className="bg-[#0a0a0a] rounded-[2rem] p-10 border border-white/5 space-y-10 animate-in slide-in-from-top-4 duration-500 shadow-inner">
              <div className="flex items-center justify-between">
                <div className="text-center group">
                  <div className="text-4xl font-semibold text-white group-hover:scale-110 transition-transform">{comparison.ahead_by}</div>
                  <div className="text-[9px] text-white/30 uppercase font-semibold tracking-widest mt-2 px-1">Ahead</div>
                </div>
                <div className="h-10 w-px bg-white/5"></div>
                <div className="text-center group">
                  <div className="text-4xl font-semibold text-white/60 group-hover:scale-110 transition-transform">{comparison.behind_by}</div>
                  <div className="text-[9px] text-white/30 uppercase font-semibold tracking-widest mt-2 px-1">Behind</div>
                </div>
                <div className="h-10 w-px bg-white/5"></div>
                <div className="text-center group">
                  <div className="text-4xl font-semibold text-white/80 group-hover:scale-110 transition-transform">{comparison.total_commits}</div>
                  <div className="text-[9px] text-white/30 uppercase font-semibold tracking-widest mt-2 px-1">Commits</div>
                </div>
              </div>

              {comparison.files && comparison.files.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between px-1">
                    <label className="text-[10px] font-semibold text-white/30 uppercase tracking-[0.2em]">Modified Streams ({comparison.files.length})</label>
                  </div>
                  <div className="max-h-48 overflow-y-auto pr-2 custom-scrollbar space-y-2">
                    {comparison.files.map((file, idx) => (
                      <div key={idx} className="flex items-center justify-between p-4 bg-white/[0.02] rounded-2xl border border-white/5 shadow-sm text-xs group hover:bg-white/[0.04] transition-colors">
                        <span className="font-semibold text-white/50 truncate max-w-[70%]" title={file.filename}>{file.filename}</span>
                        <span className={`px-2 py-0.5 rounded-lg text-[8px] font-semibold uppercase tracking-widest border border-white/10 ${
                          file.status === 'added' ? 'text-white/80 bg-white/10' :
                          file.status === 'removed' ? 'text-white/40 bg-white/5' :
                          'text-white/60 bg-white/5'
                        }`}>
                          {file.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {comparison.status === 'diverged' && (
                <div className="flex items-start space-x-4 bg-white/5 border border-white/10 p-6 rounded-3xl">
                  <AlertTriangle className="w-5 h-5 text-white/40 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-[10px] font-semibold text-white/60 uppercase tracking-widest mb-1">Divergence Detected</h4>
                    <p className="text-[11px] text-white/40 leading-relaxed font-medium">
                      Both branches have unique progress. Merging will create a "Union Node" to bring them back into alignment.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {mergeStatus === 'success' && (
            <div className="bg-white/5 border border-white/10 p-8 rounded-[2rem] flex items-center space-x-6 animate-in fade-in duration-500">
              <div className="p-3 bg-white/10 rounded-2xl border border-white/20">
                <CheckCircle className="w-8 h-8 text-white/80" />
              </div>
              <div>
                <div className="font-semibold text-white text-lg">Successfully Merged</div>
                <div className="text-[10px] text-white/30 font-semibold uppercase tracking-widest mt-0.5">The branches have been unified</div>
              </div>
            </div>
          )}

          {mergeStatus === 'conflict' && (
            <div className="bg-white/5 border border-white/10 p-8 rounded-[2rem] flex items-center space-x-6 animate-in shake">
              <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
                <X className="w-8 h-8 text-white/40" />
              </div>
              <div>
                <div className="font-semibold text-white text-lg opacity-80">Merge Conflict Reserved</div>
                <div className="text-[10px] text-white/30 font-semibold uppercase tracking-widest mt-0.5">Resolve conflicts on GitHub or via CLI</div>
              </div>
            </div>
          )}
        </div>

        <div className="p-8 bg-[#0a0a0a]/80 border-t border-white/5 flex items-center justify-end space-x-6 backdrop-blur-3xl">
          <button
            onClick={onClose}
            className="px-6 py-2.5 font-semibold text-white/30 hover:text-white/80 tracking-widest uppercase text-[10px] transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleMerge}
            disabled={!headBranch || mergeStatus === 'merging' || comparison?.status === 'identical'}
            className="px-8 py-4 bg-white/80 text-black font-semibold rounded-2xl shadow-2xl hover:bg-white transition-all duration-300 text-sm tracking-tight disabled:opacity-20 disabled:grayscale"
          >
            {mergeStatus === 'merging' ? 'Merging System...' : 'Confirm Union'}
          </button>
        </div>

      </div>
    </div>
  );
};

export default MergeDialog;
