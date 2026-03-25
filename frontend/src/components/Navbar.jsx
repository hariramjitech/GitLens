import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut } from 'lucide-react';
import GithubIcon from './GithubIcon';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="h-16 bg-[#000000]/80 backdrop-blur-2xl border-b border-white/5 sticky top-0 z-50 px-8 flex items-center justify-between shadow-2xl">
      <Link to="/dashboard" className="flex items-center space-x-3 group">
        <div className="bg-[#0a0a0a] p-2 rounded-xl border border-white/5 group-hover:scale-105 transition-all duration-500 shadow-[0_4px_20px_rgba(255,255,255,0.05)]">
          <div className="bg-white p-1.5 rounded-lg shadow-inner">
            <GithubIcon className="w-5 h-5 text-black" />
          </div>
        </div>
        <h1 className="text-xl font-semibold tracking-tight text-white">
          GitLens<span className="text-white/40">Visual</span>
        </h1>
      </Link>

      {user && (
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-3 bg-white/5 backdrop-blur-sm rounded-xl pl-1.5 pr-4 py-1.5 border border-white/5 group cursor-default hover:bg-white/10 transition-all">
            <div className="relative">
              <img
                src={user.avatar_url}
                alt={user.login}
                className="w-7 h-7 rounded-lg border border-white/10 shadow-lg group-hover:scale-105 transition-transform"
              />
              <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-green-500 border-2 border-black rounded-full" />
            </div>
            <span className="text-xs font-semibold text-white/80 tracking-tight">{user.login}</span>
          </div>
          <button
            onClick={logout}
            className="p-2.5 bg-transparent border border-white/5 rounded-xl text-white/50 hover:text-red-400 hover:bg-red-500/10 hover:border-red-500/20 active:scale-95 transition-all duration-300"
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
