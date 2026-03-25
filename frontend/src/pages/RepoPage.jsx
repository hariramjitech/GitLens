import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import CommitGraph from '../components/CommitGraph';
import CommitDetails from '../components/CommitDetails';
import MergeDialog from '../components/MergeDialog';
import CreateBranchDialog from '../components/CreateBranchDialog';
import AddCollaboratorDialog from '../components/AddCollaboratorDialog';
import PullRequestsView from '../components/PullRequestsView';
import FileExplorerView from '../components/FileExplorerView';
import TimelineView from '../components/TimelineView';
import HeatmapView from '../components/HeatmapView';
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
  const [activeTab, setActiveTab] = useState('commits');
  const [viewMode, setViewMode] = useState('graph'); // 'graph', 'timeline', or 'heatmap'

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
      <header className="h-14 border-b border-zinc-900 flex items-center justify-between px-6 bg-black z-50">
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => navigate('/dashboard')}
            className="flex items-center space-x-2 text-zinc-500 hover:text-zinc-100 transition-colors group"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="text-xs font-medium">Back</span>
          </button>
          
          <div className="h-4 w-px bg-zinc-800"></div>

          <div className="flex items-center space-x-2">
             <div className="flex items-center space-x-1.5 text-sm font-medium">
                <span className="text-zinc-500">{owner}</span>
                <span className="text-zinc-800">/</span>
                <span className="text-zinc-100">{repo}</span>
             </div>
             {/* Conflict Alert Pod */}
             <div className="flex items-center space-x-1.5 bg-red-500/10 px-2 py-0.5 rounded-full border border-red-500/20">
                <div className="w-1 h-1 rounded-full bg-red-500 animate-pulse" />
                <span className="text-[10px] font-medium text-red-500 uppercase tracking-tight">Conflicts detected</span>
             </div>
          </div>
        </div>

        {/* View Toggle Tabs */}
        <div className="absolute left-1/2 -translate-x-1/2 flex items-center bg-zinc-900/50 p-1 rounded-full border border-zinc-800 hidden md:flex">
           <button 
             onClick={() => setActiveTab('commits')}
             className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-colors ${activeTab === 'commits' ? 'bg-zinc-800 text-zinc-100 shadow-sm ring-1 ring-zinc-700' : 'text-zinc-500 hover:text-zinc-300'}`}
           >
             Graph Atlas
           </button>
           <button 
             onClick={() => setActiveTab('prs')}
             className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-colors ${activeTab === 'prs' ? 'bg-zinc-800 text-zinc-100 shadow-sm ring-1 ring-zinc-700' : 'text-zinc-500 hover:text-zinc-300'}`}
           >
             Pull Requests
           </button>
           <button 
             onClick={() => setActiveTab('files')}
             className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-colors ${activeTab === 'files' ? 'bg-zinc-800 text-zinc-100 shadow-sm ring-1 ring-zinc-700' : 'text-zinc-500 hover:text-zinc-300'}`}
           >
             Files
           </button>
        </div>

         <div className="flex items-center space-x-3">
            {activeTab === 'commits' && (
              <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-lg p-0.5">
                <button 
                  onClick={() => setViewMode('graph')}
                  className={`p-1.5 rounded-md transition-all ${viewMode === 'graph' ? 'bg-zinc-800 text-zinc-100' : 'text-zinc-500 hover:text-zinc-300'}`}
                  title="Graph Atlas"
                >
                  <Layers className="w-3.5 h-3.5" />
                </button>
                <button 
                  onClick={() => setViewMode('timeline')}
                  className={`p-1.5 rounded-md transition-all ${viewMode === 'timeline' ? 'bg-zinc-800 text-zinc-100' : 'text-zinc-500 hover:text-zinc-300'}`}
                  title="Temporal Stream"
                >
                  <History className="w-3.5 h-3.5" />
                </button>
                <button 
                  onClick={() => setViewMode('heatmap')}
                  className={`p-1.5 rounded-md transition-all ${viewMode === 'heatmap' ? 'bg-zinc-800 text-zinc-100' : 'text-zinc-500 hover:text-zinc-300'}`}
                  title="Intensity Heatmap"
                >
                  <Activity className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
            <div className="flex items-center space-x-2 bg-zinc-900/50 px-3 py-1 rounded-full border border-zinc-800">
               <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
               <span className="text-[10px] font-medium text-zinc-400 uppercase tracking-wider">Main Stream Active</span>
            </div>
            <button 
              onClick={() => setIsMergeOpen(true)}
              className="px-3 py-1 bg-zinc-100 hover:bg-zinc-200 text-zinc-950 rounded-full text-[10px] font-bold uppercase tracking-wider transition-colors"
            >
              Merge Master
            </button>
         </div>
      </header>

      <main className="flex-1 flex overflow-hidden">
        {activeTab === 'commits' && (
          <>
            {/* Spacious Sidebar */}
            <aside className="w-[280px] border-r border-zinc-900 bg-black flex flex-col shrink-0">
              <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8">
                {/* Project Intelligence */}
                <div className="space-y-4">
                   <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Project Insights</span>
                      <Activity className="w-3.5 h-3.5 text-zinc-600" />
                   </div>
                   
                   <div className="space-y-4">
                      <div className="space-y-2">
                         <div className="text-[11px] font-medium text-zinc-400 flex items-center justify-between">
                            <span>Stack Composition</span>
                            <Code2 className="w-3 h-3 text-zinc-600" />
                         </div>
                         <div className="h-1 w-full bg-zinc-900 rounded-full overflow-hidden flex gap-0.5">
                            {Object.entries(languages).map(([name, lines], i) => (
                               <div key={name} style={{ width: `${(lines/totalLines)*100}%`, backgroundColor: i === 0 ? '#fafafa' : i === 1 ? '#a1a1aa' : '#3f3f46' }} className="h-full rounded-full" />
                            ))}
                         </div>
                         <div className="grid grid-cols-2 gap-1.5">
                            {Object.entries(languages).slice(0, 4).map(([name, lines]) => (
                               <div key={name} className="flex items-center justify-between px-2.5 py-1.5 bg-zinc-900/30 border border-zinc-900 rounded-lg">
                                  <span className="text-[10px] font-medium text-zinc-500 truncate mr-2">{name}</span>
                                  <span className="text-[10px] font-bold text-zinc-400">{Math.round((lines/totalLines)*100)}%</span>
                               </div>
                            ))}
                         </div>
                      </div>
                   </div>
                </div>

                {/* Development Stream (Branches) */}
                <div className="space-y-4">
                   <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Active Streams</span>
                      <GitBranch className="w-3.5 h-3.5 text-zinc-600" />
                   </div>
                   <div className="space-y-1">
                      {branches.slice(0, 5).map(b => (
                         <div key={b.name} className="flex items-center justify-between p-2 rounded-lg hover:bg-zinc-900 transition-colors group cursor-pointer">
                            <div className="flex items-center space-x-2.5">
                               <div className="w-1 h-1 rounded-full bg-zinc-700 group-hover:bg-zinc-400 transition-colors" />
                               <span className="text-[11px] font-medium text-zinc-500 group-hover:text-zinc-200 transition-colors truncate max-w-[140px]">{b.name}</span>
                            </div>
                            <ArrowUpRight className="w-3 h-3 text-zinc-700 group-hover:text-zinc-500" />
                         </div>
                      ))}
                      <button onClick={() => setIsBranchOpen(true)} className="w-full mt-2 py-2 border border-dashed border-zinc-800 rounded-lg text-[10px] font-bold uppercase tracking-wider text-zinc-600 hover:text-zinc-400 hover:border-zinc-700 transition-all flex items-center justify-center space-x-2">
                         <Plus className="w-3 h-3" />
                         <span>Forge New Stream</span>
                      </button>
                   </div>
                </div>

                {/* Core Contributors */}
                <div className="space-y-4">
                   <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Contributors</span>
                      <Users className="w-3.5 h-3.5 text-zinc-600" />
                   </div>
                   <div className="flex flex-wrap gap-2">
                      {collaborators.slice(0, 6).map(c => (
                         <img key={c.id} src={c.avatar_url} className="w-8 h-8 rounded-lg border border-zinc-900 grayscale hover:grayscale-0 transition-all hover:scale-105 cursor-help" title={c.login} alt={c.login} />
                      ))}
                      <button onClick={() => setIsCollabOpen(true)} className="w-8 h-8 flex items-center justify-center rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-600 hover:text-zinc-400 transition-colors">
                         <Plus className="w-3.5 h-3.5" />
                      </button>
                   </div>
                </div>
              </div>

              <div className="p-4 border-t border-zinc-900 bg-black">
                 <div className="flex items-center justify-center space-x-2 text-zinc-700">
                    <Sparkles className="w-3 h-3" />
                    <span className="text-[9px] font-bold tracking-widest uppercase">Intelligence Active</span>
                 </div>
              </div>
            </aside>

            {/* Hero Canvas (Large Graph Area) */}
            <section className="flex-1 bg-black relative flex flex-col overflow-hidden">
               <div className="flex-1 relative z-0 flex flex-col min-h-0">
                  {viewMode === 'graph' ? (
                    <CommitGraph 
                      owner={owner} 
                      repo={repo} 
                      onSelectCommit={(commit) => setSelectedCommit(commit)} 
                    />
                  ) : viewMode === 'timeline' ? (
                    <TimelineView 
                      owner={owner} 
                      repo={repo} 
                      onSelectCommit={(commit) => setSelectedCommit({ ...commit, sha: commit.sha })}
                    />
                  ) : (
                    <HeatmapView 
                      owner={owner} 
                      repo={repo} 
                    />
                  )}
               </div>

               {/* Floating Status HUD */}
               <div className="absolute bottom-6 left-6 z-10">
                  <div className="bg-zinc-950/80 backdrop-blur-xl px-4 py-2 rounded-full border border-zinc-800 shadow-2xl flex items-center space-x-4 animate-in slide-in-from-bottom duration-500">
                     <div className="flex items-center space-x-2">
                        <Terminal className="w-3.5 h-3.5 text-zinc-500" />
                        <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Live Atlas</span>
                     </div>
                     <div className="h-3 w-px bg-zinc-800"></div>
                     <div className="flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                        <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-500">Sync Status: Optimal</span>
                     </div>
                  </div>
               </div>
            </section>

            {/* Slide-over Inspector (Dynamic Detail Pane) */}
            {selectedCommit && (
              <aside className="w-[440px] border-l border-zinc-900 bg-black flex flex-col shrink-0 animate-in slide-in-from-right duration-300 shadow-2xl z-40">
                <div className="h-14 border-b border-zinc-900 flex items-center justify-between px-6 bg-black">
                   <div className="flex items-center space-x-2">
                      <Layers className="w-4 h-4 text-zinc-500" />
                      <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-100">Node Inspector</span>
                   </div>
                   <button 
                     onClick={() => setSelectedCommit(null)}
                     className="p-1.5 hover:bg-zinc-900 rounded-lg transition-colors text-zinc-500 hover:text-zinc-100"
                   >
                     <X className="w-4 h-4" />
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
          </>
        )}

        {activeTab === 'prs' && (
          <PullRequestsView owner={owner} repo={repo} branches={branches} />
        )}

        {activeTab === 'files' && (
          <FileExplorerView owner={owner} repo={repo} />
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
