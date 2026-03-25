import React, { useEffect, useState } from "react";
import { Book, Lock, Globe } from "lucide-react";
import api from "../utils/api";

export default function RepoList({ onSelectRepo, selectedRepo }) {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRepos = async () => {
      try {
        setLoading(true);
        const { data } = await api.get("/github/repos");
        setRepos(data);
        setError(null);
      } catch (err) {
        setError("Failed to load repositories");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRepos();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white/20"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-400 text-sm bg-red-900/10 m-4 rounded-xl border border-red-900/30">
        {error}
      </div>
    );
  }

  if (repos.length === 0) {
    return (
      <div className="p-8 text-white/40 text-sm text-center">
        No repositories found.
      </div>
    );
  }

  return (
    <ul className="divide-y divide-white/5 bg-[#000000]">
      {repos.map((repo) => (
        <li
          key={repo.id}
          onClick={() => onSelectRepo(repo)}
          className={`cursor-pointer transition-all duration-300 p-5 hover:bg-white/5 group relative ${
            selectedRepo?.id === repo.id ? "bg-white/5" : ""
          }`}
        >
          {selectedRepo?.id === repo.id && (
            <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-white rounded-r-full shadow-[0_0_10px_rgba(255,255,255,0.5)]"></div>
          )}
          <div className="flex items-start justify-between pl-2">
            <div className="flex items-start space-x-4">
              <div className={`p-2 rounded-xl transition-colors border ${selectedRepo?.id === repo.id ? 'bg-white/10 border-white/10' : 'bg-[#0a0a0a] border-white/5 group-hover:bg-white/5'}`}>
                <Book className={`w-4 h-4 shrink-0 transition-colors ${selectedRepo?.id === repo.id ? 'text-white' : 'text-white/40 group-hover:text-white/70'}`} />
              </div>
              <div className="min-w-0 flex-1 pt-0.5">
                <p className={`text-sm font-medium truncate transition-colors tracking-tight ${selectedRepo?.id === repo.id ? 'text-white' : 'text-white/70 group-hover:text-white'}`}>
                  {repo.name}
                </p>
                <div className="flex items-center mt-1.5 text-[10px] font-medium tracking-wide text-white/30 space-x-3">
                  {repo.private ? (
                    <span className="flex items-center">
                      <Lock className="w-3 h-3 mr-1 opacity-70" /> Private
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <Globe className="w-3 h-3 mr-1 opacity-70" /> Public
                    </span>
                  )}
                  <span className="text-white/10">•</span>
                  <span>{new Date(repo.updated_at).toLocaleDateString([], { month: 'short', day: 'numeric' })}</span>
                </div>
              </div>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
