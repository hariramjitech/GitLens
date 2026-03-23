import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut } from 'lucide-react';
import GithubIcon from './GithubIcon';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="h-20 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 sticky top-0 z-50 px-10 flex items-center justify-between shadow-[0_4px_24px_rgba(0,0,0,0.03)]">
      <Link to="/dashboard" className="flex items-center space-x-4 group">
        <div className="bg-white p-2.5 rounded-2xl skeuo-raised group-hover:scale-110 transition-all duration-500 shadow-indigo-500/10">
          <div className="bg-indigo-600 p-2 rounded-xl shadow-inner">
            <GithubIcon className="w-6 h-6 text-white" />
          </div>
        </div>
        <h1 className="text-2xl font-black tracking-tight text-slate-900">
          GitLens<span className="text-indigo-600">Visual</span>
        </h1>
      </Link>

      {user && (
        <div className="flex items-center space-x-8">
          <div className="flex items-center space-x-4 bg-white/50 backdrop-blur-sm rounded-2xl pl-1.5 pr-5 py-1.5 border border-slate-200 skeuo-raised group cursor-pointer hover:bg-white transition-all">
            <div className="relative">
              <img
                src={user.avatar_url}
                alt={user.login}
                className="w-10 h-10 rounded-xl border-2 border-white shadow-lg group-hover:rotate-3 transition-transform"
              />
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
            </div>
            <span className="text-sm font-black text-slate-700 tracking-tight">{user.login}</span>
          </div>
          <button
            onClick={logout}
            className="p-3 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-red-500 hover:bg-red-50 skeuo-raised active:skeuo-pressed transition-all duration-300"
            title="Logout"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
