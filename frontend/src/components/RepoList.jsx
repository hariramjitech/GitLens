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
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-400 text-sm bg-red-900/20 m-4 rounded-md border border-red-800">
        {error}
      </div>
    );
  }

  if (repos.length === 0) {
    return (
      <div className="p-4 text-gray-500 text-sm text-center">
        No repositories found.
      </div>
    );
  }

  return (
    <ul className="divide-y divide-gray-800">
      {repos.map((repo) => (
        <li
          key={repo.id}
          onClick={() => onSelectRepo(repo)}
          className={`cursor-pointer transition-colors duration-150 ease-in-out p-4 hover:bg-gray-800 ${
            selectedRepo?.id === repo.id ? "bg-gray-800 border-l-4 border-blue-500" : "border-l-4 border-transparent"
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3">
              <Book className="w-5 h-5 text-gray-400 mt-0.5 shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-gray-200 truncate">
                  {repo.name}
                </p>
                <div className="flex items-center mt-1 text-xs text-gray-500 space-x-2">
                  {repo.private ? (
                    <span className="flex items-center text-yellow-500">
                      <Lock className="w-3 h-3 mr-1" /> Private
                    </span>
                  ) : (
                    <span className="flex items-center text-green-500">
                      <Globe className="w-3 h-3 mr-1" /> Public
                    </span>
                  )}
                  <span>•</span>
                  <span>{new Date(repo.updated_at).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
