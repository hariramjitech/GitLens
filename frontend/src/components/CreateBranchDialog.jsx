import React, { useState } from 'react';
import { GitBranch, X, Plus, AlertCircle, CheckCircle, ChevronRight } from 'lucide-react';

const CreateBranchDialog = ({ isOpen, onClose, owner, repo, branches, onCreateBranch }) => {
  const [newBranchName, setNewBranchName] = useState('');
  const [sourceBranch, setSourceBranch] = useState('');
  const [status, setStatus] = useState('idle'); // 'idle', 'creating', 'success', 'error'
  const [errorMessage, setErrorMessage] = useState('');

  React.useEffect(() => {
    if (branches && branches.length > 0) {
      const main = branches.find(b => b.name === 'main' || b.name === 'master');
      setSourceBranch(main ? main.name : branches[0].name);
    }
  }, [branches, isOpen]);

  const handleCreate = async () => {
    if (!newBranchName) return;
    setStatus('creating');
    try {
      const source = branches.find(b => b.name === sourceBranch);
      await onCreateBranch(newBranchName, source.commit.sha);
      setStatus('success');
      setTimeout(() => {
        onClose();
        setNewBranchName('');
        setStatus('idle');
      }, 1500);
    } catch (err) {
      setStatus('error');
      setErrorMessage(err.response?.data?.error || 'Failed to create branch');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-xl animate-in fade-in duration-500">
      <div className="bg-[#050505] border border-white/10 w-full max-w-lg rounded-[2.5rem] shadow-[0_0_100px_rgba(0,0,0,1)] overflow-hidden animate-in zoom-in duration-300">
        <div className="p-10 border-b border-white/5 flex items-center justify-between bg-[#0a0a0a]/50">
          <div className="flex items-center space-x-5">
            <div className="p-3 bg-white/5 rounded-2xl border border-white/10 shadow-inner">
              <GitBranch className="w-6 h-6 text-white/70" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-white tracking-tight">New Branch</h2>
              <p className="text-[10px] font-semibold text-white/30 uppercase tracking-[0.2em] mt-1">Initialize Stream</p>
            </div>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-white/5 rounded-2xl transition-all text-white/20 hover:text-white/60 group border border-transparent hover:border-white/5">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-10 space-y-8 bg-black">
          <div className="space-y-4">
            <label className="text-[10px] font-semibold text-white/40 uppercase tracking-widest pl-1 flex items-center">
               <div className="w-1 h-1 bg-white/40 rounded-full mr-2" />
               Branch Identity
            </label>
            <input
              type="text"
              placeholder="feature/stunning-ui"
              value={newBranchName}
              onChange={(e) => setNewBranchName(e.target.value)}
              className="w-full bg-[#0a0a0a] border border-white/10 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:ring-1 focus:ring-white/20 transition-all font-semibold text-white/80 placeholder:text-white/10 shadow-inner"
            />
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-semibold text-white/40 uppercase tracking-widest pl-1 flex items-center">
               <div className="w-1 h-1 bg-white/40 rounded-full mr-2" />
               Origin Point
            </label>
            <div className="relative">
              <select
                value={sourceBranch}
                onChange={(e) => setSourceBranch(e.target.value)}
                className="w-full bg-[#0a0a0a] border border-white/10 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:ring-1 focus:ring-white/20 transition-all font-semibold appearance-none cursor-pointer text-white/80 shadow-inner"
              >
                {branches.map(b => (
                  <option key={b.name} value={b.name} className="bg-black">{b.name}</option>
                ))}
              </select>
              <ChevronRight className="w-4 h-4 text-white/20 absolute right-6 top-1/2 -translate-y-1/2 rotate-90 pointer-events-none" />
            </div>
          </div>

          {status === 'success' && (
            <div className="bg-white/5 border border-white/10 p-6 rounded-[2rem] flex items-center space-x-4 animate-in fade-in duration-500">
              <div className="p-2 bg-white/10 rounded-xl border border-white/20">
                <CheckCircle className="w-6 h-6 text-white/80" />
              </div>
              <span className="text-sm font-semibold text-white/60">Branch established successfully</span>
            </div>
          )}

          {status === 'error' && (
            <div className="bg-white/5 border border-white/10 p-6 rounded-[2rem] flex items-center space-x-4 animate-in shake">
              <div className="p-2 bg-white/5 rounded-xl border border-white/10">
                <AlertCircle className="w-6 h-6 text-white/40" />
              </div>
              <span className="text-sm font-semibold text-white/40">{errorMessage}</span>
            </div>
          )}
        </div>

        <div className="p-8 bg-[#0a0a0a]/80 border-t border-white/5 flex items-center justify-end space-x-6 backdrop-blur-3xl">
          <button onClick={onClose} className="px-6 py-2.5 font-semibold text-white/30 hover:text-white/80 tracking-widest uppercase text-[10px] transition-all">
            Cancel
          </button>
          <button
            onClick={handleCreate}
            disabled={!newBranchName || status === 'creating'}
            className="px-10 py-4 bg-white/80 text-black font-semibold rounded-2xl shadow-2xl hover:bg-white transition-all duration-300 text-sm tracking-tight flex items-center space-x-3 disabled:opacity-20 disabled:grayscale"
          >
            {status === 'creating' ? 'Initializing...' : (
              <>
                <Plus className="w-4 h-4" />
                <span>Create Stream</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateBranchDialog;
