import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { profileAPI } from '../services/api';
import { 
  Terminal, 
  FileText, 
  Map, 
  Award, 
  TrendingUp, 
  FileCheck, 
  History, 
  Loader2 
} from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await profileAPI.getStats();
        setStats(data);
      } catch (err) {
        setError('Failed to load dashboard statistics.');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-dark-950 text-slate-100 pl-64">
      {/* Navigation sidebar */}
      <Sidebar />

      <div className="flex flex-col min-h-screen">
        {/* Navigation topbar */}
        <Navbar />

        {/* Content container */}
        <main className="flex-1 p-8 overflow-y-auto">
          {loading ? (
            <div className="flex h-64 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
            </div>
          ) : error ? (
            <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-4 text-sm text-red-400">
              {error}
            </div>
          ) : (
            <div className="space-y-8">
              {/* Welcome Banner */}
              <div className="relative overflow-hidden rounded-2xl border border-indigo-500/10 bg-indigo-600/5 p-8 glow-indigo">
                <div className="relative z-10 max-w-2xl">
                  <h2 className="text-2xl font-bold text-white">Elevate Your Career Path</h2>
                  <p className="mt-2 text-sm text-slate-400 leading-relaxed">
                    Welcome back to HireMate AI. Practice customized coding & system design interviews, scan your PDF resume to fix ATS gaps, or outline a targeted roadmap.
                  </p>
                </div>
                {/* Decorative mesh */}
                <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-indigo-500/10 to-transparent pointer-events-none"></div>
              </div>

              {/* Grid of Metric Cards */}
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {/* Card 1 */}
                <div className="glass-card p-6 rounded-xl flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Mock Interviews</span>
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                      <Terminal className="h-4 w-4" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <span className="text-3xl font-bold text-white">{stats?.totalInterviews || 0}</span>
                    <p className="text-[10px] text-slate-500 mt-1">Conducted sessions</p>
                  </div>
                </div>

                {/* Card 2 */}
                <div className="glass-card p-6 rounded-xl flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Interview Rating</span>
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                      <Award className="h-4 w-4" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <span className="text-3xl font-bold text-white">
                      {stats?.averageInterviewScore ? `${stats.averageInterviewScore.toFixed(0)}%` : '0%'}
                    </span>
                    <p className="text-[10px] text-slate-500 mt-1">Across all evaluations</p>
                  </div>
                </div>

                {/* Card 3 */}
                <div className="glass-card p-6 rounded-xl flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Resumes Audited</span>
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                      <FileCheck className="h-4 w-4" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <span className="text-3xl font-bold text-white">{stats?.resumesAnalyzed || 0}</span>
                    <p className="text-[10px] text-slate-500 mt-1">Uploaded PDF files</p>
                  </div>
                </div>

                {/* Card 4 */}
                <div className="glass-card p-6 rounded-xl flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Avg ATS Score</span>
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                      <TrendingUp className="h-4 w-4" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <span className="text-3xl font-bold text-white">
                      {stats?.averageAtsScore ? `${stats.averageAtsScore.toFixed(0)}%` : '0%'}
                    </span>
                    <p className="text-[10px] text-slate-500 mt-1">ATS resume compliance</p>
                  </div>
                </div>
              </div>

              {/* Action Blocks */}
              <div>
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-6">Quick Actions</h3>
                <div className="grid gap-6 md:grid-cols-3">
                  {/* Action 1 */}
                  <Link
                    to="/interviews"
                    className="glass-card p-6 rounded-xl text-left block hover:border-indigo-500/30"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 mb-4">
                      <Terminal className="h-5 w-5" />
                    </div>
                    <h4 className="text-base font-bold text-white">Practice Mock Interviews</h4>
                    <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                      Generate 10 job-specific questions, submit your responses, and receive a detailed evaluation.
                    </p>
                  </Link>

                  {/* Action 2 */}
                  <Link
                    to="/resumes"
                    className="glass-card p-6 rounded-xl text-left block hover:border-indigo-500/30"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 mb-4">
                      <FileText className="h-5 w-5" />
                    </div>
                    <h4 className="text-base font-bold text-white">ATS Resume Audit</h4>
                    <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                      Scan your PDF resume to extract key metric details, find missing technical skills, and optimize keywords.
                    </p>
                  </Link>

                  {/* Action 3 */}
                  <Link
                    to="/roadmap"
                    className="glass-card p-6 rounded-xl text-left block hover:border-indigo-500/30"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 mb-4">
                      <Map className="h-5 w-5" />
                    </div>
                    <h4 className="text-base font-bold text-white">Weekly Learning Path</h4>
                    <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                      Input your career goal and compile a step-by-step roadmap to track your technical development.
                    </p>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
