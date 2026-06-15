import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { interviewAPI } from '../services/api';
import { Terminal, Calendar, HelpCircle, ArrowRight, Loader2, Award } from 'lucide-react';

const HistoryPage = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await interviewAPI.getHistory();
        setSessions(data);
      } catch (err) {
        setError('Failed to load activity history logs.');
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  return (
    <div className="min-h-screen bg-dark-950 text-slate-100 pl-64">
      <Sidebar />

      <div className="flex flex-col min-h-screen">
        <Navbar />

        <main className="flex-1 p-8 overflow-y-auto space-y-6">
          <div className="max-w-4xl mx-auto space-y-6">
            
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">Mock Interview Logs</h2>
            </div>

            {loading ? (
              <div className="flex h-64 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
              </div>
            ) : error ? (
              <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-4 text-sm text-red-400">
                {error}
              </div>
            ) : sessions.length === 0 ? (
              <div className="glass-panel border border-white/5 rounded-xl p-12 text-center text-slate-500">
                <Terminal className="h-10 w-10 text-slate-600 mx-auto mb-4" />
                <h4 className="font-semibold text-slate-400 text-sm">No Interviews Recorded</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mt-2 leading-relaxed">
                  Start your first mock interview to compile performance score records.
                </p>
                <Link
                  to="/interviews"
                  className="mt-6 inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 px-4 py-2 text-xs font-semibold text-white transition-all"
                >
                  Generate Interview
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            ) : (
              <div className="glass-panel border border-white/5 rounded-xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-white/5 bg-white/[0.01] text-[10px] font-bold uppercase tracking-wider text-slate-500">
                        <th className="p-4">Target Job Role</th>
                        <th className="p-4">Date Completed</th>
                        <th className="p-4">Completion Stats</th>
                        <th className="p-4">Average Rating</th>
                        <th className="p-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-xs text-slate-300">
                      {sessions.map((session) => {
                        const totalQuestions = session.questions?.length || 0;
                        const answeredCount = session.questions?.filter(q => q.answered).length || 0;
                        const scoreSum = session.questions
                          ?.filter(q => q.answered && q.evaluation)
                          .reduce((sum, q) => sum + q.evaluation.score, 0) || 0;
                        
                        const averageScore = answeredCount > 0 ? (scoreSum / answeredCount).toFixed(0) : '-';

                        return (
                          <tr key={session.id} className="hover:bg-white/[0.005] transition-colors">
                            <td className="p-4 font-semibold text-white">{session.jobRole}</td>
                            <td className="p-4">
                              <div className="flex items-center gap-1.5 text-slate-400">
                                <Calendar className="h-3.5 w-3.5 text-indigo-400" />
                                <span>{new Date(session.createdAt).toLocaleDateString()}</span>
                              </div>
                            </td>
                            <td className="p-4">
                              <div className="flex items-center gap-1.5">
                                <HelpCircle className="h-3.5 w-3.5 text-indigo-400" />
                                <span>{answeredCount} / {totalQuestions} Answered</span>
                              </div>
                            </td>
                            <td className="p-4">
                              {averageScore !== '-' ? (
                                <span className="inline-flex items-center gap-1 font-semibold text-indigo-400">
                                  <Award className="h-3.5 w-3.5" />
                                  {averageScore}%
                                </span>
                              ) : (
                                <span className="text-slate-500 italic">No ratings</span>
                              )}
                            </td>
                            <td className="p-4 text-right">
                              <Link
                                to={`/interviews/${session.id}`}
                                className="inline-flex items-center justify-center gap-1.5 text-xs font-semibold text-indigo-400 hover:text-indigo-300 hover:underline"
                              >
                                View Review
                                <ArrowRight className="h-3.5 w-3.5" />
                              </Link>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

          </div>
        </main>
      </div>
    </div>
  );
};

export default HistoryPage;
