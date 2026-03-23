import React, { useState } from 'react';
import { UserPlus, X, Send, AlertCircle, CheckCircle, Info } from 'lucide-react';

const AddCollaboratorDialog = ({ isOpen, onClose, owner, repo, onInvite }) => {
  const [username, setUsername] = useState('');
  const [status, setStatus] = useState('idle'); // 'idle', 'inviting', 'success', 'error'
  const [errorMessage, setErrorMessage] = useState('');

  const handleInvite = async () => {
    if (!username) return;
    setStatus('inviting');
    try {
      await onInvite(username);
      setStatus('success');
      setTimeout(() => {
        onClose();
        setUsername('');
        setStatus('idle');
      }, 2000);
    } catch (err) {
      setStatus('error');
      setErrorMessage(err.response?.data?.error || 'Failed to invite collaborator');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/10 backdrop-blur-md">
      <div className="bg-white border border-slate-200/60 w-full max-w-lg rounded-[2.5rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.1)] overflow-hidden animate-in zoom-in duration-300 skeuo-raised">
        <div className="p-10 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-indigo-50 rounded-2xl shadow-inner">
              <UserPlus className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Add Contributor</h2>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">Expand Team</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors group">
            <X className="w-5 h-5 text-slate-400 group-hover:text-slate-900" />
          </button>
        </div>

        <div className="p-10 space-y-8">
          <div className="bg-indigo-50/30 border border-indigo-100/40 p-6 rounded-3xl flex items-start space-x-4 skeuo-pressed">
            <Info className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
            <p className="text-xs text-indigo-900 leading-relaxed font-bold">
              Invite a developer to collaborate. They will receive an invitation email from GitHub to join this repository.
            </p>
          </div>

          <div className="space-y-3">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest pl-1">GitHub Username</label>
            <input
              type="text"
              placeholder="octocat"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all font-bold text-slate-700 skeuo-pressed placeholder:text-slate-300"
              autoFocus
            />
          </div>

          {status === 'success' && (
            <div className="bg-emerald-50 border border-emerald-100/50 p-5 rounded-2xl flex items-center space-x-4 animate-in fade-in duration-500">
              <div className="p-2 bg-emerald-500 rounded-xl shadow-lg shadow-emerald-500/20">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <span className="text-sm font-black text-emerald-800">Invitation dispatched!</span>
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
            onClick={handleInvite}
            disabled={!username || status === 'inviting'}
            className="px-8 py-4 bg-indigo-600 text-white font-black rounded-2xl shadow-xl shadow-indigo-500/20 hover:bg-indigo-700 hover:shadow-indigo-500/40 hover:-translate-y-1 active:scale-95 disabled:opacity-50 transition-all duration-300 text-sm tracking-tight flex items-center space-x-3"
          >
            {status === 'inviting' ? 'Dispatching...' : (
              <>
                <Send className="w-5 h-5" />
                <span>Invite Contributor</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddCollaboratorDialog;
