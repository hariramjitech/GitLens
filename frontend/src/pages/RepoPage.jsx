import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import CommitGraph from '../components/CommitGraph';
import CommitDetails from '../components/CommitDetails';
import MergeDialog from '../components/MergeDialog';
import CreateBranchDialog from '../components/CreateBranchDialog';
import AddCollaboratorDialog from '../components/AddCollaboratorDialog';
import { useGitHub } from '../hooks/useGitHub';
import { ChevronLeft, X, GitCommit, Users, Code2, Globe, Sparkles, Plus, UserPlus, GitBranch, History } from 'lucide-react';

const RepoPage = () => {
  const { owner, repo } = useParams();
  const navigate = useNavigate();
  const { fetchLanguages, fetchCollaborators, fetchBranches, compareBranches, mergeBranches, createBranch, inviteCollaborator } = useGitHub();
  const [selectedCommit, setSelectedCommit] = useState(null);
  const [languages, setLanguages] = useState({});
  const [collaborators, setCollaborators] = useState([]);
  const [branches, setBranches] = useState([]);
  const [isInsightsOpen, setIsInsightsOpen] = useState(true);
  const [isMergeOpen, setIsMergeOpen] = useState(false);
  const [isBranchOpen, setIsBranchOpen] = useState(false);
  const [isCollabOpen, setIsCollabOpen] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      const [langData, collData, branchData] = await Promise.all([
        fetchLanguages(owner, repo),
        fetchCollaborators(owner, repo),
        fetchBranches(owner, repo)
      ]);
      setLanguages(langData);
      setCollaborators(collData);
      setBranches(branchData);
    };
    loadData();
  }, [owner, repo, fetchLanguages, fetchCollaborators, fetchBranches]);

  const totalLines = Object.values(languages).reduce((a, b) => a + b, 0);

  return (
    <div className="h-screen flex flex-col bg-slate-50 overflow-hidden text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
      <Navbar />

      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Sidebar: Project Insights */}
        <div className={`transition-all duration-500 ease-in-out border-r border-slate-200/60 bg-white/50 backdrop-blur-3xl flex flex-col shrink-0 ${isInsightsOpen ? 'w-96' : 'w-0 overflow-hidden border-0'}`}>
          <div className="p-10 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
            <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400 flex items-center">
              <Sparkles className="w-4 h-4 mr-2.5 text-indigo-500" />
              Project Insights
            </h3>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar p-10 space-y-12">
            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-6">
               <button 
                 onClick={() => setIsBranchOpen(true)}
                 className="flex flex-col items-center justify-center p-6 bg-white border border-slate-100 rounded-3xl transition-all group skeuo-raised active:skeuo-pressed hover:-translate-y-1.5 duration-300"
               >
                 <div className="p-3 bg-indigo-50 rounded-2xl mb-4 group-hover:bg-indigo-600 transition-colors shadow-inner">
                   <GitBranch className="w-6 h-6 text-indigo-600 group-hover:text-white transition-colors" />
                 </div>
                 <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 group-hover:text-indigo-900 transition-colors">New Branch</span>
               </button>
               <button 
                 onClick={() => setIsCollabOpen(true)}
                 className="flex flex-col items-center justify-center p-6 bg-white border border-slate-100 rounded-3xl transition-all group skeuo-raised active:skeuo-pressed hover:-translate-y-1.5 duration-300"
               >
                 <div className="p-3 bg-emerald-50 rounded-2xl mb-4 group-hover:bg-emerald-600 transition-colors shadow-inner">
                   <UserPlus className="w-6 h-6 text-emerald-600 group-hover:text-white transition-colors" />
                 </div>
                 <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 group-hover:text-emerald-900 transition-colors">Add Contrib</span>
               </button>
            </div>

            {/* Languages Section */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.25em] flex items-center">
                  <Code2 className="w-4 h-4 mr-3 text-indigo-500" /> Stack Authority
                </h4>
              </div>
              <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden flex skeuo-pressed p-1">
                {Object.entries(languages).map(([name, lines], i) => (
                  <div 
                    key={name}
                    style={{ 
                      width: `${(lines / totalLines) * 100}%`,
                      backgroundColor: i === 0 ? '#4f46e5' : i === 1 ? '#7c3aed' : '#9333ea'
                    }}
                    title={`${name}: ${Math.round((lines/totalLines)*100)}%`}
                    className="hover:brightness-110 transition-all cursor-help rounded-full"
                  />
                ))}
              </div>
              <ul className="space-y-4">
                {Object.entries(languages).slice(0, 4).map(([name, lines], i) => (
                  <li key={name} className="flex items-center justify-between text-xs px-2 py-3 bg-white border border-slate-100/50 rounded-2xl skeuo-raised hover:scale-105 transition-transform cursor-default">
                    <span className="text-slate-600 font-bold flex items-center">
                      <div className="w-2.5 h-2.5 rounded-full mr-3 shadow-sm" style={{ backgroundColor: i === 0 ? '#4f46e5' : i === 1 ? '#7c3aed' : '#9333ea' }} />
                      {name}
                    </span>
                    <span className="text-slate-900 font-black">{Math.round((lines/totalLines)*100)}%</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Collaborators Section */}
            <div className="space-y-6">
              <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.25em] flex items-center">
                <Users className="w-4 h-4 mr-3 text-indigo-500" /> Core Team
              </h4>
              <div className="grid grid-cols-1 gap-5">
                {collaborators.map(c => (
                  <div key={c.id} className="flex items-center space-x-4 group bg-white p-5 rounded-3xl border border-slate-100 skeuo-raised hover:-translate-y-1 transition-all">
                    <div className="relative">
                      <img src={c.avatar_url} className="w-12 h-12 rounded-2xl border-2 border-white shadow-xl group-hover:rotate-6 transition-transform z-10 relative" alt={c.login} />
                      <div className="absolute inset-0 bg-indigo-500/20 blur-xl rounded-full -z-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[15px] font-black text-slate-900 truncate tracking-tight">{c.login}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">{c.contributions ? `${c.contributions} commits` : 'Contributor'}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Flow Section */}
            <div className="space-y-6">
               <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.25em] flex items-center">
                <History className="w-4 h-4 mr-3 text-emerald-600" /> Activity Stream
              </h4>
              <div className="bg-slate-50/50 border border-slate-200 rounded-[2rem] p-8 space-y-5 skeuo-pressed">
                 <div className="space-y-4">
                    {branches.slice(0, 3).map(b => (
                      <div key={b.name} className="flex items-center space-x-4 text-sm font-bold text-slate-600 bg-white/80 p-3 rounded-2xl border border-slate-100 skeuo-raised">
                         <div className="p-2 bg-emerald-50 rounded-xl">
                            <GitBranch className="w-4 h-4 text-emerald-500" />
                         </div>
                         <span className="truncate flex-1 font-black text-slate-700 tracking-tight">{b.name}</span>
                         <span className="text-[9px] font-black bg-indigo-600 text-white px-3 py-1 rounded-full uppercase tracking-widest shadow-lg shadow-indigo-500/20 scale-75">Active</span>
                      </div>
                    ))}
                 </div>
              </div>
            </div>
          </div>
        </div>

        {/* Toggle Button for Insights */}
        <button 
          onClick={() => setIsInsightsOpen(!isInsightsOpen)}
          className={`absolute bottom-10 left-10 z-30 p-4 bg-white border border-slate-100 rounded-3xl skeuo-raised hover:bg-slate-50 transition-all duration-500 ${isInsightsOpen ? 'translate-x-[22rem]' : 'translate-x-0'}`}
        >
          <ChevronLeft className={`w-5 h-5 text-slate-400 transition-transform duration-500 ${isInsightsOpen ? '' : 'rotate-180'}`} />
        </button>

        {/* Main Graph Area */}
        <div className="flex-1 flex flex-col relative overflow-hidden bg-slate-50">
          <div className="absolute top-10 right-10 z-10 flex items-center space-x-6">
             <button
               onClick={() => setIsMergeOpen(true)}
               className="bg-white border border-slate-100 px-8 py-4 rounded-2xl flex items-center space-x-4 text-slate-900 font-black transition-all skeuo-raised hover:-translate-y-2 active:skeuo-pressed group shadow-2xl"
             >
               <div className="p-2 bg-indigo-50 rounded-xl group-hover:bg-indigo-600 transition-colors shadow-inner">
                <GitCommit className="w-5 h-5 text-indigo-600 group-hover:text-white transition-colors" />
               </div>
               <span className="text-sm tracking-tight">Merge Center</span>
             </button>

             <button
               onClick={() => navigate('/dashboard')}
               className="bg-white border border-slate-100 px-8 py-4 rounded-2xl flex items-center space-x-4 hover:bg-slate-50 transition-all skeuo-raised hover:-translate-y-2 active:skeuo-pressed group shadow-xl"
             >
               <div className="p-2 bg-slate-50 rounded-xl group-hover:bg-slate-900 transition-colors shadow-inner">
                 <ChevronLeft className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
               </div>
               <span className="text-sm font-black text-slate-400 group-hover:text-slate-900 transition-colors">Explorer</span>
             </button>
          </div>

          <div className="flex-1">
            <CommitGraph 
              owner={owner} 
              repo={repo} 
              onSelectCommit={(commit) => setSelectedCommit(commit)} 
            />
          </div>
        </div>

        {/* Side Panel for Commit Details */}
        <div className={`fixed top-18 right-0 bottom-0 w-[600px] bg-white border-l border-slate-200 transition-transform duration-500 ease-in-out z-40 transform shadow-2xl ${selectedCommit ? 'translate-x-0' : 'translate-x-full shadow-none'}`}>
          {selectedCommit && (
            <div className="h-full flex flex-col">
              <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center space-x-4">
                  <div className="bg-blue-600 p-3 rounded-2xl shadow-lg shadow-blue-500/20">
                    <GitCommit className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-black text-2xl tracking-tighter text-slate-900">Commit Inspector</h3>
                </div>
                <button 
                  onClick={() => setSelectedCommit(null)}
                  className="p-3 hover:bg-slate-100 rounded-full transition-all text-slate-400 hover:text-slate-900"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex-1 overflow-hidden">
                <CommitDetails 
                  repo={{ full_name: `${owner}/${repo}` }} 
                  commitSha={selectedCommit.fullSha} 
                />
              </div>
            </div>
          )}
        </div>

        <MergeDialog 
          isOpen={isMergeOpen}
          onClose={() => setIsMergeOpen(false)}
          owner={owner}
          repo={repo}
          branches={branches}
          compareBranches={compareBranches}
          mergeBranches={mergeBranches}
          onMergeSuccess={() => {
            window.location.reload(); 
          }}
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
          onInvite={async (username) => {
            await inviteCollaborator(owner, repo, username);
          }}
        />
      </div>
    </div>
  );
};

export default RepoPage;
