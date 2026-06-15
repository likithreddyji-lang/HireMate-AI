import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  Terminal, 
  FileText, 
  Map, 
  History, 
  User, 
  LogOut, 
  BrainCircuit 
} from 'lucide-react';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Interview Prep', path: '/interviews', icon: Terminal },
    { name: 'Resume Analyzer', path: '/resumes', icon: FileText },
    { name: 'Career Roadmap', path: '/roadmap', icon: Map },
    { name: 'History', path: '/history', icon: History },
    { name: 'Profile', path: '/profile', icon: User },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <aside className="fixed inset-y-0 left-0 z-20 flex w-64 flex-col border-r border-white/5 bg-dark-950/80 backdrop-blur-xl">
      {/* Brand Header */}
      <div className="flex h-16 items-center px-6 gap-2 border-b border-white/5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600/10 text-indigo-400 border border-indigo-500/20">
          <BrainCircuit className="h-5 w-5" />
        </div>
        <span className="text-lg font-bold tracking-tight text-white">
          HireMate <span className="text-indigo-400">AI</span>
        </span>
      </div>

      {/* Nav Menu */}
      <nav className="flex-1 space-y-1 px-4 py-6">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path || (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-indigo-600/10 text-indigo-400 border-l-2 border-indigo-500 font-semibold'
                  : 'text-slate-400 hover:bg-white/5 hover:text-slate-100'
              }`}
            >
              <Icon className={`h-4 w-4 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* User Footer Profile */}
      {user && (
        <div className="border-t border-white/5 p-4 flex flex-col gap-3 bg-white/[0.01]">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-500/20 border border-indigo-500/30 text-xs font-bold text-indigo-400">
              {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
            </div>
            <div className="flex-1 overflow-hidden">
              <h4 className="truncate text-sm font-medium text-slate-200">{user.name}</h4>
              <p className="truncate text-xs text-slate-500">{user.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-white/5 bg-white/5 hover:bg-red-500/10 hover:border-red-500/20 px-3 py-2 text-xs font-medium text-slate-300 hover:text-red-400 transition-all duration-200"
          >
            <LogOut className="h-3.5 w-3.5" />
            Sign Out
          </button>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
