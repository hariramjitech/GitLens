import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut } from 'lucide-react';
import GithubIcon from './GithubIcon';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="h-14 bg-black/80 backdrop-blur-xl border-b border-zinc-900 sticky top-0 z-50 px-6 flex items-center justify-between">
      <Link to="/dashboard" className="flex items-center space-x-3 group">
        <div className="bg-zinc-950 p-1.5 rounded-lg border border-zinc-900 group-hover:border-zinc-800 transition-colors">
          <div className="bg-zinc-100 p-1 rounded">
            <GithubIcon className="w-4 h-4 text-zinc-950" />
          </div>
        </div>
        <h1 className="text-lg font-semibold tracking-tight text-zinc-100">
          GitLens<span className="text-zinc-600">Visual</span>
        </h1>
      </Link>

      {user && (
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2.5 bg-zinc-900/50 rounded-full pl-1 pr-3 py-1 border border-zinc-800 hover:border-zinc-700 transition-colors cursor-default">
            <div className="relative">
              <img
                src={user.avatar_url}
                alt={user.login}
                className="w-6 h-6 rounded-full border border-zinc-800"
              />
              <div className="absolute top-0 right-0 w-1.5 h-1.5 bg-emerald-500 rounded-full" />
            </div>
            <span className="text-xs font-medium text-zinc-400 tracking-tight">{user.login}</span>
          </div>
          <button
            onClick={logout}
            className="p-2 text-zinc-600 hover:text-zinc-100 hover:bg-zinc-900 rounded-lg transition-colors"
            title="Disconnect"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
