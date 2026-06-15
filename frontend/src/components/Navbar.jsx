import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useLocation } from 'react-router-dom';
import { Calendar } from 'lucide-react';

const Navbar = () => {
  const { user } = useAuth();
  const location = useLocation();

  const getPageTitle = () => {
    const path = location.pathname;
    if (path.startsWith('/dashboard')) return 'Dashboard Overview';
    if (path.startsWith('/interviews')) return 'AI Mock Interviews';
    if (path.startsWith('/resumes')) return 'ATS Resume Analyzer';
    if (path.startsWith('/roadmap')) return 'Career Roadmap Plan';
    if (path.startsWith('/history')) return 'Activity History';
    if (path.startsWith('/profile')) return 'User Profile Settings';
    return 'HireMate AI';
  };

  const getFormattedDate = () => {
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    return new Date().toLocaleDateString('en-US', options);
  };

  return (
    <header className="sticky top-0 z-10 flex h-16 w-full items-center justify-between border-b border-white/5 bg-dark-950/40 px-8 backdrop-blur-md">
      {/* Title */}
      <h1 className="text-base font-semibold text-slate-100">{getPageTitle()}</h1>

      {/* Date & User Actions */}
      <div className="flex items-center gap-4">
        <div className="hidden items-center gap-2 rounded-lg bg-white/5 border border-white/5 px-3 py-1.5 text-xs text-slate-400 sm:flex">
          <Calendar className="h-3.5 w-3.5 text-indigo-400" />
          <span>{getFormattedDate()}</span>
        </div>

        {user && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Welcome, <strong className="text-slate-200">{user.name.split(' ')[0]}</strong></span>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
