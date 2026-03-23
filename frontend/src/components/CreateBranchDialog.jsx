import React, { useState } from 'react';
import { GitBranch, X, Plus, AlertCircle, CheckCircle } from 'lucide-react';

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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/10 backdrop-blur-md">
      <div className="bg-white border border-slate-200/60 w-full max-w-lg rounded-[2.5rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.1)] overflow-hidden animate-in zoom-in duration-300 skeuo-raised">
        <div className="p-10 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-indigo-50 rounded-2xl shadow-inner">
              <GitBranch className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">New Branch</h2>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">Initialize Stream</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors group">
            <X className="w-5 h-5 text-slate-400 group-hover:text-slate-900" />
          </button>
        </div>

        <div className="p-10 space-y-8">
          <div className="space-y-3">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest pl-1">Branch Identity</label>
            <input
              type="text"
              placeholder="feature/stunning-ui"
              value={newBranchName}
              onChange={(e) => setNewBranchName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all font-bold text-slate-700 skeuo-pressed placeholder:text-slate-300"
            />
          </div>

          <div className="space-y-3">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest pl-1">Origin Point</label>
            <div className="relative">
              <select
                value={sourceBranch}
                onChange={(e) => setSourceBranch(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all font-bold appearance-none cursor-pointer text-slate-700 skeuo-pressed"
              >
                {branches.map(b => (
                  <option key={b.name} value={b.name}>{b.name}</option>
                ))}
              </select>
              <ChevronRight className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 rotate-90 pointer-events-none" />
            </div>
          </div>

          {status === 'success' && (
            <div className="bg-emerald-50 border border-emerald-100/50 p-5 rounded-2xl flex items-center space-x-4 animate-in fade-in duration-500">
              <div className="p-2 bg-emerald-500 rounded-xl shadow-lg shadow-emerald-500/20">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <span className="text-sm font-black text-emerald-800">Branch established successfully!</span>
            </div>
          )}

          {status === 'error' && (
            <div className="bg-red-50 border border-red-100/50 p-5 rounded-2xl flex items-center space-x-4 animate-in shake">
              <div className="p-2 bg-red-500 rounded-xl shadow-lg shadow-red-500/20">
                <AlertCircle className="w-6 h-6 text-white" />
              </div>
              <span className="text-sm font-black text-red-800">{errorMessage}</span>
            </div>
          )}
        </div>

        <div className="p-8 bg-slate-50/50 border-t border-slate-100 flex items-center justify-end space-x-6">
          <button onClick={onClose} className="px-8 py-3 font-black text-slate-400 hover:text-slate-900 tracking-widest uppercase text-[11px] transition-colors">
            Cancel
          </button>
          <button
            onClick={handleCreate}
            disabled={!newBranchName || status === 'creating'}
            className="px-8 py-4 bg-indigo-600 text-white font-black rounded-2xl shadow-xl shadow-indigo-500/20 hover:bg-indigo-700 hover:shadow-indigo-500/40 hover:-translate-y-1 active:scale-95 disabled:opacity-50 transition-all duration-300 text-sm tracking-tight flex items-center space-x-3"
          >
            {status === 'creating' ? 'Initializing...' : (
              <>
                <Plus className="w-5 h-5" />
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
