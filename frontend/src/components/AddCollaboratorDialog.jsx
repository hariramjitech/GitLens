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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-xl animate-in fade-in duration-500">
      <div className="bg-[#050505] border border-white/10 w-full max-w-lg rounded-[2.5rem] shadow-[0_0_100px_rgba(0,0,0,1)] overflow-hidden animate-in zoom-in duration-300">
        <div className="p-10 border-b border-white/5 flex items-center justify-between bg-[#0a0a0a]/50">
          <div className="flex items-center space-x-5">
            <div className="p-3 bg-white/5 rounded-2xl border border-white/10 shadow-inner">
              <UserPlus className="w-6 h-6 text-white/70" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-white tracking-tight">Add Contributor</h2>
              <p className="text-[10px] font-semibold text-white/30 uppercase tracking-[0.2em] mt-1">Expand Team</p>
            </div>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-white/5 rounded-2xl transition-all text-white/20 hover:text-white/60 group border border-transparent hover:border-white/5">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-10 space-y-8 bg-black">
          <div className="bg-white/5 border border-white/10 p-6 rounded-3xl flex items-start space-x-4 shadow-inner">
            <Info className="w-5 h-5 text-white/30 shrink-0 mt-0.5" />
            <p className="text-[11px] text-white/40 leading-relaxed font-medium">
              Invite a developer to collaborate. They will receive an invitation email from GitHub to join this repository.
            </p>
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-semibold text-white/40 uppercase tracking-widest pl-1 flex items-center">
               <div className="w-1 h-1 bg-white/40 rounded-full mr-2" />
               GitHub Username
            </label>
            <input
              type="text"
              placeholder="octocat"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-[#0a0a0a] border border-white/10 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:ring-1 focus:ring-white/20 transition-all font-semibold text-white/80 placeholder:text-white/10 shadow-inner"
              autoFocus
            />
          </div>

          {status === 'success' && (
            <div className="bg-white/5 border border-white/10 p-6 rounded-[2rem] flex items-center space-x-4 animate-in fade-in duration-500">
              <div className="p-2 bg-white/10 rounded-xl border border-white/20">
                <CheckCircle className="w-6 h-6 text-white/80" />
              </div>
              <span className="text-sm font-semibold text-white/60">Invitation dispatched successfully</span>
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
            onClick={handleInvite}
            disabled={!username || status === 'inviting'}
            className="px-10 py-4 bg-white/80 text-black font-semibold rounded-2xl shadow-2xl hover:bg-white transition-all duration-300 text-sm tracking-tight flex items-center space-x-3 disabled:opacity-20 disabled:grayscale"
          >
            {status === 'inviting' ? 'Dispatching...' : (
              <>
                <Send className="w-4 h-4" />
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
