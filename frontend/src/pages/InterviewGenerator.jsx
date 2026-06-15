import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { interviewAPI } from '../services/api';
import { Terminal, Brain, ArrowRight, Loader2, Sparkles } from 'lucide-react';

const InterviewGenerator = () => {
  const [jobRole, setJobRole] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!jobRole.trim()) {
      setError('Please specify a target job role.');
      return;
    }

    setLoading(true);
    try {
      const session = await interviewAPI.generateSession(jobRole);
      navigate(`/interviews/${session.id}`);
    } catch (err) {
      setError('Failed to generate mock interview session. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-950 text-slate-100 pl-64">
      <Sidebar />

      <div className="flex flex-col min-h-screen">
        <Navbar />

        <main className="flex-1 p-8 flex items-center justify-center">
          <div className="w-full max-w-xl">
            {/* Header description */}
            <div className="text-center mb-8">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 mb-4 glow-indigo">
                <Sparkles className="h-6 w-6" />
              </div>
              <h2 className="text-2xl font-bold text-white">Initialize AI Mock Interview</h2>
              <p className="mt-2 text-sm text-slate-400 leading-relaxed">
                Specify your target position (e.g., frontend engineer, database admin). Our AI engine compiles 10 distinct questions measuring syntax, frameworks, and architecture.
              </p>
            </div>

            {/* Panel */}
            <div className="glass-panel border border-white/5 rounded-2xl p-8 shadow-xl">
              {error && (
                <div className="mb-6 rounded-lg border border-red-500/20 bg-red-500/5 p-4 text-sm text-red-400">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="jobRole" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
                    Target Job Role or Position
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-500">
                      <Terminal className="h-4 w-4" />
                    </div>
                    <input
                      id="jobRole"
                      type="text"
                      required
                      placeholder="e.g. Senior Java Developer, QA Automation Specialist"
                      value={jobRole}
                      onChange={(e) => setJobRole(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 rounded-lg border border-white/5 bg-white/5 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm transition-all"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 px-4 py-3 text-sm font-semibold text-white transition-all duration-200 shadow-md shadow-indigo-600/20"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Compiling 10 AI Questions...
                    </>
                  ) : (
                    <>
                      Generate Interview
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Tips Card */}
            <div className="mt-6 flex items-start gap-3 rounded-lg border border-white/5 bg-white/[0.01] p-4 text-xs text-slate-500 leading-relaxed">
              <Brain className="h-4 w-4 shrink-0 text-indigo-400" />
              <span>
                <strong>How it works:</strong> Type your answers inside the questionnaire layout. You can submit answers one by one to receive immediate scores, strength descriptions, and template improvement guides.
              </span>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default InterviewGenerator;
