import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { profileAPI } from '../services/api';
import { User, Mail, Calendar, Loader2, Award, Terminal, FileCheck, Shield } from 'lucide-react';

const ProfilePage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await profileAPI.getStats();
        setStats(data);
      } catch (err) {
        setError('Failed to load profile details.');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="min-h-screen bg-dark-950 text-slate-100 pl-64">
      <Sidebar />

      <div className="flex flex-col min-h-screen">
        <Navbar />

        <main className="flex-1 p-8 overflow-y-auto space-y-8">
          
          {loading ? (
            <div className="flex h-64 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
            </div>
          ) : error ? (
            <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-4 text-sm text-red-400 max-w-4xl mx-auto">
              {error}
            </div>
          ) : (
            <div className="max-w-4xl mx-auto grid gap-8 md:grid-cols-3">
              
              {/* Left Profile details block */}
              <div className="md:col-span-1 space-y-6">
                <div className="glass-panel p-6 rounded-xl border border-white/5 text-center flex flex-col items-center">
                  <div className="h-20 w-20 rounded-full bg-indigo-500/10 text-indigo-400 border-2 border-indigo-500/20 flex items-center justify-center text-2xl font-bold mb-4 glow-indigo">
                    {getInitials(stats?.name)}
                  </div>
                  <h3 className="text-base font-bold text-white">{stats?.name}</h3>
                  <span className="text-xs text-slate-500 mt-1">Platform Member</span>
                </div>

                <div className="glass-panel p-5 rounded-xl border border-white/5 space-y-4 text-xs">
                  <h4 className="font-bold uppercase tracking-wider text-slate-400 mb-2">Member Metadata</h4>
                  
                  <div className="flex items-center gap-3">
                    <User className="h-4 w-4 text-indigo-400 shrink-0" />
                    <div className="overflow-hidden">
                      <p className="text-[10px] text-slate-500">Full Name</p>
                      <p className="text-slate-300 font-semibold truncate">{stats?.name}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-indigo-400 shrink-0" />
                    <div className="overflow-hidden">
                      <p className="text-[10px] text-slate-500">Email Address</p>
                      <p className="text-slate-300 font-semibold truncate">{stats?.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-indigo-400 shrink-0" />
                    <div className="overflow-hidden">
                      <p className="text-[10px] text-slate-500">Date Joined</p>
                      <p className="text-slate-300 font-semibold">
                        {stats?.joinedDate ? new Date(stats.joinedDate).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) : '-'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Performance Stats block */}
              <div className="md:col-span-2 space-y-6">
                <div className="glass-panel p-6 rounded-xl border border-white/5 space-y-6">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Aggregated Performance Statistics</h3>
                  
                  <div className="grid gap-4 sm:grid-cols-2">
                    {/* Stat Card 1 */}
                    <div className="bg-white/[0.01] border border-white/5 rounded-lg p-4 flex items-start gap-3">
                      <Terminal className="h-5 w-5 text-indigo-400 mt-0.5 shrink-0" />
                      <div>
                        <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Interviews Conducted</span>
                        <p className="text-2xl font-bold text-white mt-1">{stats?.totalInterviews || 0}</p>
                        <p className="text-[9px] text-slate-500 mt-1">{stats?.totalQuestionsAnswered || 0} questions graded</p>
                      </div>
                    </div>

                    {/* Stat Card 2 */}
                    <div className="bg-white/[0.01] border border-white/5 rounded-lg p-4 flex items-start gap-3">
                      <Award className="h-5 w-5 text-indigo-400 mt-0.5 shrink-0" />
                      <div>
                        <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Average Interview Rating</span>
                        <p className="text-2xl font-bold text-white mt-1">
                          {stats?.averageInterviewScore ? `${stats.averageInterviewScore.toFixed(0)}%` : '0%'}
                        </p>
                        <p className="text-[9px] text-slate-500 mt-1">Goal target of 85%+</p>
                      </div>
                    </div>

                    {/* Stat Card 3 */}
                    <div className="bg-white/[0.01] border border-white/5 rounded-lg p-4 flex items-start gap-3">
                      <FileCheck className="h-5 w-5 text-indigo-400 mt-0.5 shrink-0" />
                      <div>
                        <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Resumes Analyzed</span>
                        <p className="text-2xl font-bold text-white mt-1">{stats?.resumesAnalyzed || 0}</p>
                        <p className="text-[9px] text-slate-500 mt-1">Historical files stored</p>
                      </div>
                    </div>

                    {/* Stat Card 4 */}
                    <div className="bg-white/[0.01] border border-white/5 rounded-lg p-4 flex items-start gap-3">
                      <Shield className="h-5 w-5 text-indigo-400 mt-0.5 shrink-0" />
                      <div>
                        <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Average ATS Score</span>
                        <p className="text-2xl font-bold text-white mt-1">
                          {stats?.averageAtsScore ? `${stats.averageAtsScore.toFixed(0)}%` : '0%'}
                        </p>
                        <p className="text-[9px] text-slate-500 mt-1">Target threshold is 70%+</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="glass-panel p-5 rounded-xl border border-white/5 text-xs flex items-center gap-3 text-slate-400 leading-relaxed">
                  <Shield className="h-5 w-5 shrink-0 text-indigo-400" />
                  <span>
                    <strong>Secured Account:</strong> Your password credentials are encrypted locally on database persistence using BCrypt (Salted-hashing processes). JWT tokens enforce session routes.
                  </span>
                </div>
              </div>

            </div>
          )}

        </main>
      </div>
    </div>
  );
};

export default ProfilePage;
