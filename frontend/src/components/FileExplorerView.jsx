import React, { useState, useEffect } from 'react';
import { useGitHub } from '../hooks/useGitHub';
import { Folder, File, ChevronRight, ChevronDown, Code, AlertCircle, Edit, Save, X, CheckCircle, Sparkles } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

const FileNode = ({ node, level = 0, onFileClick, onToggleFolder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const isFolder = node.type === 'dir';

  const handleClick = async () => {
    if (isFolder) {
      const nextState = !isOpen;
      setIsOpen(nextState);
      if (nextState) {
        await onToggleFolder(node);
      }
    } else {
      onFileClick(node);
    }
  };

  return (
    <div className="select-none">
      <div 
        className="flex items-center py-1.5 px-4 hover:bg-zinc-900 cursor-pointer transition-colors group"
        onClick={handleClick}
        style={{ paddingLeft: `${(level * 12) + 16}px` }}
      >
        <div className="w-4 flex items-center justify-center mr-1.5">
          {isFolder && (
            isOpen ? <ChevronDown className="w-3 h-3 text-zinc-500" /> : <ChevronRight className="w-3 h-3 text-zinc-500" />
          )}
        </div>
        {isFolder ? (
           <Folder className={`w-3.5 h-3.5 mr-2 ${isOpen ? 'text-blue-400' : 'text-zinc-500 group-hover:text-blue-400'}`} />
        ) : (
           <File className="w-3.5 h-3.5 text-zinc-500 mr-2 group-hover:text-zinc-300" />
        )}
        <span className={`text-[12px] transition-colors truncate ${isOpen ? 'text-zinc-100 font-medium' : 'text-zinc-400 group-hover:text-zinc-200'}`}>
          {node.name}
        </span>
      </div>
      {isFolder && isOpen && node.children && (
        <div className="animate-in slide-in-from-left-1 duration-200">
          {node.children.map(child => (
            <FileNode 
              key={child.path} 
              node={child} 
              level={level + 1} 
              onFileClick={onFileClick} 
              onToggleFolder={onToggleFolder} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

const FileExplorerView = ({ owner, repo }) => {
  const [fileTree, setFileTree] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileContent, setFileContent] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState('');
  const [saving, setSaving] = useState(false);
  const [commitMessage, setCommitMessage] = useState('');
  const [showCommitDialog, setShowCommitDialog] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  const { fetchRepoContents, updateFileContent, suggestCommitMessages } = useGitHub();
  const [loadingFile, setLoadingFile] = useState(false);
  const [rootLoading, setRootLoading] = useState(true);

  useEffect(() => {
    loadRootContents();
  }, [owner, repo]);

  const loadRootContents = async () => {
    setRootLoading(true);
    try {
      const data = await fetchRepoContents(owner, repo);
      const sorted = sortContents(data);
      setFileTree(sorted);
    } catch (err) {
      console.error("Failed to load root contents", err);
    } finally {
      setRootLoading(false);
    }
  };

  const sortContents = (contents) => {
    return contents.sort((a, b) => {
      if (a.type === b.type) return a.name.localeCompare(b.name);
      return a.type === 'dir' ? -1 : 1;
    });
  };

  const onToggleFolder = async (folderNode) => {
    if (folderNode.children) return; // Already loaded

    try {
      const data = await fetchRepoContents(owner, repo, folderNode.path);
      const sorted = sortContents(data);
      
      setFileTree(prevTree => {
        const updateNodeRecursive = (nodes) => {
          return nodes.map(node => {
            if (node.path === folderNode.path) {
              return { ...node, children: sorted };
            }
            if (node.children) {
              return { ...node, children: updateNodeRecursive(node.children) };
            }
            return node;
          });
        };
        return updateNodeRecursive(prevTree);
      });
    } catch (err) {
      console.error("Failed to load folder contents", err);
    }
  };

  const loadFileContent = async (fileNode) => {
    setSelectedFile(fileNode);
    setLoadingFile(true);
    setIsEditing(false);
    setSaveSuccess(false);
    try {
      const data = await fetchRepoContents(owner, repo, fileNode.path);
      // GitHub API returns content as base64 for files
      const decoded = atob(data.content.replace(/\n/g, ''));
      setFileContent(decoded);
      setEditedContent(decoded);
    } catch (err) {
      console.error("Failed to load file contents", err);
      setFileContent('// Error loading file content.\n// This might be a binary file or too large.');
    } finally {
      setLoadingFile(false);
    }
  };

  const handleSave = async () => {
    if (!selectedFile || !commitMessage) return;
    setSaving(true);
    try {
      const base64Content = btoa(editedContent);
      await updateFileContent(
        owner, 
        repo, 
        selectedFile.path, 
        base64Content, 
        commitMessage, 
        selectedFile.sha
      );
      setFileContent(editedContent);
      setIsEditing(false);
      setShowCommitDialog(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
      // Refresh tree to get new SHA
      loadRootContents();
    } catch (err) {
      console.error("Failed to save file", err);
      alert("Failed to save changes. There might be a conflict or permission issue.");
    } finally {
      setSaving(false);
    }
  };

  const handleSuggestMessage = async () => {
    if (saving) return;
    try {
      const suggestions = await suggestCommitMessages(editedContent);
      if (suggestions && suggestions.length > 0) {
        setCommitMessage(suggestions[0].replace(/^[0-9]\.\s*/, '').replace(/^- \s*/, ''));
      }
    } catch (err) {
      console.error("Failed to suggest message", err);
    }
  };

  const getLanguage = (filename) => {
    const ext = filename.split('.').pop().toLowerCase();
    const map = {
      'js': 'javascript', 'jsx': 'javascript', 'ts': 'typescript', 'tsx': 'typescript',
      'css': 'css', 'html': 'html', 'json': 'json', 'md': 'markdown', 'py': 'python',
      'rs': 'rust', 'go': 'go', 'cpp': 'cpp', 'c': 'c', 'sh': 'bash'
    };
    return map[ext] || 'text';
  };

  return (
    <div className="flex-1 flex bg-black overflow-hidden relative">
      {/* Sidebar Tree */}
      <div className="w-[300px] border-r border-zinc-900 flex flex-col shrink-0 bg-[#050505]">
        <div className="h-12 border-b border-zinc-900 flex items-center justify-between px-6">
          <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Repository Files</span>
          <div className="flex space-x-1">
             <div className="w-1.5 h-1.5 rounded-full bg-zinc-800" />
             <div className="w-1.5 h-1.5 rounded-full bg-zinc-800" />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar py-2">
          {rootLoading ? (
            <div className="px-6 py-4 flex flex-col space-y-4">
               {[1,2,3,4,5].map(i => (
                 <div key={i} className="flex items-center space-x-3">
                    <div className="w-3.5 h-3.5 bg-zinc-900 rounded animate-pulse" />
                    <div className="h-3 w-32 bg-zinc-900 rounded animate-pulse" />
                 </div>
               ))}
            </div>
          ) : (
            fileTree.map(node => (
              <FileNode 
                key={node.path} 
                node={node} 
                onFileClick={loadFileContent} 
                onToggleFolder={onToggleFolder} 
              />
            ))
          )}
        </div>
      </div>

      {/* Content Viewer/Editor */}
      <div className="flex-1 flex flex-col bg-[#050505] overflow-hidden relative">
        {selectedFile ? (
          <>
            <div className="h-12 border-b border-zinc-900 bg-zinc-950/80 flex items-center justify-between px-6">
              <div className="flex items-center space-x-3">
                <Code className="w-4 h-4 text-zinc-500" />
                <div className="flex items-center space-x-1.5">
                   <span className="text-[12px] font-medium text-zinc-400">repo</span>
                   <ChevronRight className="w-3 h-3 text-zinc-700" />
                   <span className="text-[12px] font-semibold text-zinc-100 tracking-tight">{selectedFile.path}</span>
                </div>
                {saveSuccess && (
                  <div className="flex items-center space-x-1.5 ml-4 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 animate-in fade-in zoom-in duration-300">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-500">Committed</span>
                  </div>
                )}
              </div>
              <div className="flex items-center space-x-2">
                {!isEditing ? (
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="flex items-center space-x-2 px-3.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-100 hover:border-zinc-600 transition-all text-[11px] font-bold uppercase tracking-wider"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span>Inscribe Changes</span>
                  </button>
                ) : (
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => setIsEditing(false)}
                      className="px-3.5 py-1.5 rounded-lg text-zinc-500 hover:text-zinc-300 transition-all text-[11px] font-bold uppercase tracking-wider"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Cancel</span>
                    </button>
                    <button 
                      onClick={() => setShowCommitDialog(true)}
                      className="flex items-center space-x-2 px-4 py-1.5 rounded-lg bg-white text-black hover:bg-zinc-200 transition-all text-[11px] font-bold uppercase tracking-wider"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Commit to Main</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div className="flex-1 overflow-auto custom-scrollbar relative bg-[#020202]">
              {loadingFile ? (
                <div className="absolute inset-0 flex items-center justify-center">
                   <div className="flex flex-col items-center space-y-4 text-zinc-500">
                      <div className="w-6 h-6 border-2 border-zinc-800 border-t-zinc-400 rounded-full animate-spin" />
                      <span className="text-[9px] font-bold uppercase tracking-[0.3em]">Decoding Flux...</span>
                   </div>
                </div>
              ) : isEditing ? (
                <div className="h-full w-full p-6 font-mono text-[13px]">
                  <textarea 
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                    className="w-full h-full bg-transparent text-zinc-300 outline-none resize-none custom-scrollbar leading-relaxed"
                    spellCheck={false}
                    placeholder="// Start typing your changes..."
                  />
                  
                  {/* Enhanced Commit Dialog Overlay */}
                  {showCommitDialog && (
                    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-6 animate-in fade-in duration-300">
                      <div className="w-full max-w-lg bg-black border border-zinc-800 rounded-3xl p-8 shadow-[0_0_50px_rgba(0,0,0,0.5)] relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8">
                           <Sparkles className="w-12 h-12 text-zinc-900 opacity-50" />
                        </div>
                        <h4 className="text-sm font-bold text-zinc-100 uppercase tracking-[0.2em] mb-6 flex items-center space-x-3">
                           <Save className="w-4 h-4 text-emerald-500" />
                           <span>Commit Transcription</span>
                        </h4>
                        <div className="space-y-6">
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                               <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Message Schema</label>
                               <button 
                                 onClick={handleSuggestMessage}
                                 className="flex items-center space-x-2 text-[10px] font-bold text-emerald-500 hover:text-emerald-400 uppercase tracking-tight transition-colors group"
                               >
                                 <Sparkles className="w-3.5 h-3.5 group-hover:animate-pulse" />
                                 <span>Intelligence Suggest</span>
                               </button>
                            </div>
                            <textarea 
                              placeholder="Describe your contribution to the stream..."
                              value={commitMessage}
                              onChange={(e) => setCommitMessage(e.target.value)}
                              autoFocus
                              rows={3}
                              className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-5 py-4 text-sm text-zinc-200 outline-none focus:border-emerald-500/50 transition-all resize-none shadow-inner"
                            />
                          </div>
                          <div className="flex items-center justify-end space-x-4">
                            <button 
                              onClick={() => setShowCommitDialog(false)}
                              className="px-6 py-2.5 text-[11px] font-bold uppercase tracking-widest text-zinc-500 hover:text-zinc-300 transition-colors"
                            >
                              Abort
                            </button>
                            <button 
                              onClick={handleSave}
                              disabled={saving || !commitMessage}
                              className="bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-[11px] uppercase tracking-[0.1em] px-8 py-3 rounded-2xl transition-all disabled:opacity-50 shadow-lg shadow-emerald-500/10"
                            >
                              {saving ? 'Transmitting Pulse...' : 'Finalize Commit'}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-6 text-sm font-mono h-full w-full">
                  <SyntaxHighlighter 
                    language={getLanguage(selectedFile.name)} 
                    style={vscDarkPlus}
                    customStyle={{ margin: 0, padding: 0, background: 'transparent', fontSize: '13px', lineHeight: '1.6' }}
                    showLineNumbers={true}
                    wrapLines={true}
                    lineNumberStyle={{ minWidth: '3.5em', paddingRight: '2em', color: '#3f3f46', textAlign: 'right' }}
                  >
                    {fileContent}
                  </SyntaxHighlighter>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center space-y-6 text-zinc-700 bg-[#020202]">
            <div className="p-6 rounded-[2.5rem] bg-zinc-900/10 border border-zinc-900/50 relative group">
               <div className="absolute inset-0 bg-emerald-500/5 rounded-[2.5rem] opacity-0 group-hover:opacity-100 transition-opacity blur-xl" />
               <AlertCircle className="w-16 h-16 text-zinc-800 group-hover:text-zinc-600 transition-colors" />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-[11px] font-bold uppercase tracking-[0.4em] text-zinc-500">No Stream Selected</h3>
              <p className="text-[12px] text-zinc-600 max-w-[200px] leading-relaxed">Select a logic flow from the index to begin deep inspection.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileExplorerView;
