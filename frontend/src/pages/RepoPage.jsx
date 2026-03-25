import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import CommitGraph from '../components/CommitGraph';
import CommitDetails from '../components/CommitDetails';
import MergeDialog from '../components/MergeDialog';
import CreateBranchDialog from '../components/CreateBranchDialog';
import AddCollaboratorDialog from '../components/AddCollaboratorDialog';
import { useGitHub } from '../hooks/useGitHub';
import { 
  ChevronLeft, X, GitCommit, Users, Code2, Sparkles, UserPlus, 
  GitBranch, History, Info, Activity, Command, Search,
  ArrowUpRight, Plus, Terminal, Layout, Layers
} from 'lucide-react';

const RepoPage = () => {
  const { owner, repo } = useParams();
  const navigate = useNavigate();
  const { fetchLanguages, fetchCollaborators, fetchBranches, compareBranches, mergeBranches, createBranch, inviteCollaborator } = useGitHub();
  const [selectedCommit, setSelectedCommit] = useState(null);
  const [languages, setLanguages] = useState({});
  const [collaborators, setCollaborators] = useState([]);
  const [branches, setBranches] = useState([]);
  const [isMergeOpen, setIsMergeOpen] = useState(false);
  const [isBranchOpen, setIsBranchOpen] = useState(false);
  const [isCollabOpen, setIsCollabOpen] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [langData, collData, branchData] = await Promise.all([
          fetchLanguages(owner, repo),
          fetchCollaborators(owner, repo),
          fetchBranches(owner, repo)
        ]);
        setLanguages(langData || {});
        setCollaborators(collData || []);
        setBranches(branchData || []);
      } catch (err) {
        console.error("Error loading repo data:", err);
      }
    };
    loadData();
  }, [owner, repo, fetchLanguages, fetchCollaborators, fetchBranches]);

  const totalLines = Object.values(languages).reduce((a, b) => a + b, 0) || 1;

  return (
    <div className="h-screen flex flex-col bg-black overflow-hidden selection:bg-white/10 font-inter text-white">
      {/* Precision Navigation Bar */}
      <header className="h-16 border-b border-white/5 flex items-center justify-between px-6 bg-[#050505] z-50">
        <div className="flex items-center space-x-6">
          <button 
            onClick={() => navigate('/dashboard')}
            className="flex items-center space-x-2 text-white/40 hover:text-white transition-all group"
          >
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-xs font-bold uppercase tracking-widest">Back</span>
          </button>
          
          <div className="h-4 w-px bg-white/10"></div>

          <div className="flex items-center space-x-3">
             <div className="flex items-center space-x-2 text-sm font-semibold tracking-tight">
                <span className="text-white/30">{owner}</span>
                <span className="text-white/10">/</span>
                <span className="text-white">{repo}</span>
             </div>
             {/* Conflict Alert Pod (Integrated into Header) */}
             <div className="flex items-center space-x-2 bg-red-500/10 px-2.5 py-1 rounded-full border border-red-500/20 animate-in fade-in zoom-in duration-700">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                <span className="text-[9px] font-bold text-red-500 uppercase tracking-widest leading-none">Repo Blocking Conflicts detected</span>
             </div>
          </div>
        </div>

        <div className="flex items-center space-x-4">
           <div className="flex items-center space-x-3 bg-white/5 px-4 py-1.5 rounded-xl border border-white/10 group cursor-default">
              <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
              <span className="text-[10px] font-bold text-white/60 uppercase tracking-widest">Main Stream Active</span>
           </div>
           <div className="h-4 w-px bg-white/10"></div>
           <button 
             onClick={() => setIsMergeOpen(true)}
             className="px-4 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all"
           >
             Merge Master
           </button>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden">
        {/* Spacious Sidebar */}
        <aside className="w-[320px] border-r border-white/5 bg-[#050505] flex flex-col shrink-0">
          <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-10">
            {/* Project Intelligence */}
            <div className="space-y-6">
               <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">Project Insights</span>
                  <Activity className="w-4 h-4 text-white/20" />
               </div>
               
               <div className="space-y-4">
                  <div className="space-y-3">
                     <div className="text-[11px] font-semibold text-white/50 flex items-center justify-between">
                        <span>Stack Composition</span>
                        <Code2 className="w-3 h-3" />
                     </div>
                     <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden flex gap-0.5">
                        {Object.entries(languages).map(([name, lines], i) => (
                           <div key={name} style={{ width: `${(lines/totalLines)*100}%`, backgroundColor: `rgba(255,255,255,${0.8-(i*0.2)})` }} className="h-full rounded-full" />
                        ))}
                     </div>
                     <div className="grid grid-cols-2 gap-2">
                        {Object.entries(languages).slice(0, 4).map(([name, lines]) => (
                           <div key={name} className="flex items-center justify-between px-3 py-2 bg-white/[0.03] border border-white/5 rounded-xl">
                              <span className="text-[10px] font-medium text-white/40 truncate mr-2">{name}</span>
                              <span className="text-[10px] font-bold text-white/60">{Math.round((lines/totalLines)*100)}%</span>
                           </div>
                        ))}
                     </div>
                  </div>
               </div>
            </div>

            {/* Development Stream (Branches) */}
            <div className="space-y-6">
               <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">Active Streams</span>
                  <GitBranch className="w-4 h-4 text-white/20" />
               </div>
               <div className="space-y-2">
                  {branches.slice(0, 5).map(b => (
                     <div key={b.name} className="flex items-center justify-between p-3 rounded-xl hover:bg-white/[0.03] border border-transparent hover:border-white/5 transition-all group cursor-pointer">
                        <div className="flex items-center space-x-3">
                           <div className="w-1.5 h-1.5 rounded-full bg-white/10 group-hover:bg-white/40 transition-colors" />
                           <span className="text-[11px] font-medium text-white/40 group-hover:text-white/80 transition-colors truncate max-w-[140px]">{b.name}</span>
                        </div>
                        <ArrowUpRight className="w-3 h-3 text-white/10 group-hover:text-white/30" />
                     </div>
                  ))}
                  <button onClick={() => setIsBranchOpen(true)} className="w-full py-2.5 border border-dashed border-white/10 rounded-xl text-[10px] font-bold uppercase tracking-widest text-white/20 hover:text-white/40 hover:border-white/20 transition-all flex items-center justify-center space-x-2">
                     <Plus className="w-3 h-3" />
                     <span>Forge New Stream</span>
                  </button>
               </div>
            </div>

            {/* Core Contributors */}
            <div className="space-y-6">
               <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">Contributors</span>
                  <Users className="w-4 h-4 text-white/20" />
               </div>
               <div className="flex flex-wrap gap-3">
                  {collaborators.slice(0, 6).map(c => (
                     <img key={c.id} src={c.avatar_url} className="w-9 h-9 rounded-xl border border-white/10 grayscale hover:grayscale-0 transition-all hover:scale-110 cursor-help" title={c.login} alt={c.login} />
                  ))}
                  <button onClick={() => setIsCollabOpen(true)} className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-white/40 hover:text-white transition-colors">
                     <Plus className="w-4 h-4" />
                  </button>
               </div>
            </div>
          </div>

          <div className="p-6 border-t border-white/5 bg-[#030303] text-center">
             <div className="flex items-center justify-center space-x-2 text-white/20">
                <Sparkles className="w-3.5 h-3.5" />
                <span className="text-[9px] font-bold tracking-[0.3em] uppercase">Intelligence Node Active</span>
             </div>
          </div>
        </aside>

        {/* Hero Canvas (Large Graph Area) */}
        <section className="flex-1 bg-black relative flex flex-col overflow-hidden">
           <div className="flex-1 relative z-0">
              <CommitGraph 
                 owner={owner} 
                 repo={repo} 
                 onSelectCommit={(commit) => setSelectedCommit(commit)} 
               />
           </div>

           {/* Floating Status HUD */}
           <div className="absolute bottom-8 left-8 z-10">
              <div className="bg-[#050505]/80 backdrop-blur-3xl px-5 py-3 rounded-[2rem] border border-white/5 shadow-2xl flex items-center space-x-6 animate-in slide-in-from-bottom duration-700">
                 <div className="flex items-center space-x-3">
                    <Terminal className="w-4 h-4 text-white/40" />
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/60">Live Atlas</span>
                 </div>
                 <div className="h-4 w-px bg-white/10"></div>
                 <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                    <span className="text-[9px] font-bold uppercase tracking-widest text-white/30">Sync Status: Optimal</span>
                 </div>
              </div>
           </div>
        </section>

        {/* Slide-over Inspector (Dynamic Detail Pane) */}
        {selectedCommit && (
          <aside className="w-[480px] border-l border-white/5 bg-[#050505] flex flex-col shrink-0 animate-in slide-in-from-right duration-500 shadow-[-20px_0_50px_rgba(0,0,0,0.5)] z-40">
            <div className="h-16 border-b border-white/5 flex items-center justify-between px-8 bg-black">
               <div className="flex items-center space-x-3">
                  <Layers className="w-4 h-4 text-white/40" />
                  <span className="text-xs font-bold uppercase tracking-[0.2em]">Node Inspector</span>
               </div>
               <button 
                 onClick={() => setSelectedCommit(null)}
                 className="p-2 hover:bg-white/5 rounded-xl transition-all text-white/30 hover:text-white"
               >
                 <X className="w-5 h-5" />
               </button>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar">
               <CommitDetails 
                  repo={{ full_name: `${owner}/${repo}` }} 
                  commitSha={selectedCommit.fullId || selectedCommit.fullSha || selectedCommit.sha} 
               />
            </div>
          </aside>
        )}
      </main>

      {/* Popups & Dialogs */}
      <MergeDialog 
        isOpen={isMergeOpen}
        onClose={() => setIsMergeOpen(false)}
        owner={owner}
        repo={repo}
        branches={branches}
        compareBranches={compareBranches}
        mergeBranches={mergeBranches}
        onMergeSuccess={() => { window.location.reload(); }}
      />

      <CreateBranchDialog
        isOpen={isBranchOpen}
        onClose={() => setIsBranchOpen(false)}
        owner={owner}
        repo={repo}
        branches={branches}
        onCreateBranch={async (name, sha) => {
          await createBranch(owner, repo, name, sha);
          const updatedBranches = await fetchBranches(owner, repo);
          setBranches(updatedBranches);
        }}
      />

      <AddCollaboratorDialog
        isOpen={isCollabOpen}
        onClose={() => setIsCollabOpen(false)}
        owner={owner}
        repo={repo}
        onInvite={async (username) => { await inviteCollaborator(owner, repo, username); }}
      />
    </div>
  );
};

export default RepoPage;
