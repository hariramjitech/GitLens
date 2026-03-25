import React, { useState, useEffect } from 'react';
import { useGitHub } from '../hooks/useGitHub';
import { GitPullRequest, Search, CheckCircle2, XCircle, Clock, Plus, GitMerge, ArrowRight } from 'lucide-react';

const PullRequestsView = ({ owner, repo, branches }) => {
  const { fetchPullRequests, createPullRequest } = useGitHub();
  const [prs, setPrs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [newPrTitle, setNewPrTitle] = useState('');
  const [newPrBody, setNewPrBody] = useState('');
  const [newPrHead, setNewPrHead] = useState(branches[0]?.name || '');
  const [newPrBase, setNewPrBase] = useState(branches.find(b => b.name === 'main' || b.name === 'master')?.name || branches[0]?.name || '');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadPRs();
  }, [owner, repo]);

  const loadPRs = async () => {
    setLoading(true);
    try {
      const data = await fetchPullRequests(owner, repo, 'all');
      setPrs(data);
    } catch (err) {
      console.error("Failed to load PRs", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePR = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await createPullRequest(owner, repo, newPrTitle, newPrHead, newPrBase, newPrBody);
      setIsCreating(false);
      setNewPrTitle('');
      setNewPrBody('');
      await loadPRs();
    } catch (error) {
      console.error("Error creating PR:", error);
      alert("Failed to create PR. Ensure branches have differences and exist.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-black">
      {/* Header */}
      <div className="h-16 border-b border-zinc-900 flex items-center justify-between px-8 bg-black shrink-0">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center">
            <GitPullRequest className="w-4 h-4 text-emerald-500" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-zinc-100 uppercase tracking-widest">Pull Requests</h2>
            <p className="text-[10px] text-zinc-500 font-medium">Manage and review code contributions</p>
          </div>
        </div>
        
        <button 
          onClick={() => setIsCreating(true)}
          className="flex items-center space-x-2 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border border-emerald-500/20 px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-wider transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Pull Request</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
        <div className="max-w-4xl mx-auto">
          {isCreating ? (
            <div className="bg-zinc-950 border border-zinc-900 rounded-xl p-6 mb-8 animate-in slide-in-from-top-4">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-bold text-zinc-200">Create New Pull Request</h3>
                <button onClick={() => setIsCreating(false)} className="text-zinc-500 hover:text-zinc-300"><XCircle className="w-5 h-5"/></button>
              </div>
              <form onSubmit={handleCreatePR} className="space-y-4">
                <div className="flex items-center space-x-4 bg-black p-4 rounded-lg border border-zinc-900">
                  <div className="flex-1">
                    <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-2">Compare (Head)</label>
                    <select 
                      value={newPrHead} 
                      onChange={e => setNewPrHead(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-300 outline-none focus:border-emerald-500/50"
                    >
                      {branches.map(b => <option key={b.name} value={b.name}>{b.name}</option>)}
                    </select>
                  </div>
                  <ArrowRight className="w-4 h-4 text-zinc-600 mt-6" />
                  <div className="flex-1">
                    <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-2">Base</label>
                    <select 
                      value={newPrBase} 
                      onChange={e => setNewPrBase(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-300 outline-none focus:border-emerald-500/50"
                    >
                      {branches.map(b => <option key={b.name} value={b.name}>{b.name}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <input 
                    type="text" 
                    placeholder="Pull request title" 
                    required
                    value={newPrTitle}
                    onChange={e => setNewPrTitle(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-sm text-zinc-200 outline-none focus:border-emerald-500/50 placeholder-zinc-600"
                  />
                </div>
                <div>
                  <textarea 
                    placeholder="Describe your changes..." 
                    rows={4}
                    value={newPrBody}
                    onChange={e => setNewPrBody(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-sm text-zinc-200 outline-none focus:border-emerald-500/50 placeholder-zinc-600 resize-none"
                  />
                </div>
                <div className="flex justify-end">
                  <button 
                    type="submit" 
                    disabled={submitting}
                    className="bg-zinc-100 hover:bg-white text-black font-medium text-xs px-6 py-2 rounded-lg transition-colors disabled:opacity-50"
                  >
                    {submitting ? 'Creating...' : 'Create Pull Request'}
                  </button>
                </div>
              </form>
            </div>
          ) : null}

          {/* PR List */}
          <div className="space-y-3">
            {loading ? (
              <div className="flex justify-center p-12">
                <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : prs.length === 0 ? (
              <div className="text-center py-20 border border-dashed border-zinc-900 rounded-xl">
                <GitPullRequest className="w-12 h-12 text-zinc-800 mx-auto mb-4" />
                <h3 className="text-sm font-medium text-zinc-400">No pull requests found</h3>
                <p className="text-xs text-zinc-600 mt-1">Create a new pull request to merge changes.</p>
              </div>
            ) : (
              prs.map(pr => (
                <div key={pr.id} className="group bg-zinc-950/50 hover:bg-zinc-900 border border-zinc-900 hover:border-zinc-800 rounded-xl p-5 transition-all cursor-pointer flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="mt-1">
                      {pr.state === 'open' ? (
                        <GitPullRequest className="w-5 h-5 text-emerald-500" />
                      ) : pr.merged_at ? (
                        <GitMerge className="w-5 h-5 text-purple-500" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-500" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-zinc-200 font-medium text-sm group-hover:text-emerald-400 transition-colors">
                        {pr.title}
                      </h3>
                      <div className="flex items-center space-x-3 mt-2 text-[11px] text-zinc-500">
                        <span className="text-zinc-400">#{pr.number}</span>
                        <span>opened by <span className="text-zinc-300">{pr.user.login}</span></span>
                        <div className="w-1 h-1 rounded-full bg-zinc-800" />
                        <span>{pr.head.ref} &rarr; {pr.base.ref}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex -space-x-2">
                    <img src={pr.user.avatar_url} className="w-6 h-6 rounded-full border border-black grayscale group-hover:grayscale-0 transition-all" alt="author" />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PullRequestsView;
