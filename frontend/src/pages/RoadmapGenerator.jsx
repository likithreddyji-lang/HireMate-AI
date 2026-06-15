import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { roadmapAPI } from '../services/api';
import { 
  Compass, 
  MapPin, 
  CheckCircle, 
  BookOpen, 
  Terminal, 
  Loader2, 
  ArrowRight,
  Sparkles,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

const RoadmapGenerator = () => {
  const [careerGoal, setCareerGoal] = useState('');
  const [loading, setLoading] = useState(false);
  const [roadmap, setRoadmap] = useState(null);
  const [error, setError] = useState('');
  
  // Track open week indexes (all open by default)
  const [openWeeks, setOpenWeeks] = useState({ 0: true, 1: true, 2: true, 3: true });

  const toggleWeek = (idx) => {
    setOpenWeeks(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setRoadmap(null);

    if (!careerGoal.trim()) {
      setError('Please specify a career goal.');
      return;
    }

    setLoading(true);
    try {
      const data = await roadmapAPI.generateRoadmap(careerGoal);
      setRoadmap(data);
    } catch (err) {
      setError('Failed to compile your learning roadmap. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-950 text-slate-100 pl-64">
      <Sidebar />

      <div className="flex flex-col min-h-screen">
        <Navbar />

        <main className="flex-1 p-8 overflow-y-auto space-y-8">
          
          <div className="max-w-4xl mx-auto space-y-8">
            
            {/* Input Header Form */}
            <div className="glass-panel p-6 rounded-xl border border-white/5">
              <div className="flex items-center gap-2 text-indigo-400 mb-2">
                <Compass className="h-5 w-5" />
                <span className="text-xs font-bold uppercase tracking-wider">Career Roadmap Generator</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed mb-6">
                Specify your target position to compile a comprehensive 4-week structured syllabus covering objectives, subtopics, and exercises.
              </p>

              {error && (
                <div className="mb-4 rounded-lg border border-red-500/20 bg-red-500/5 p-4 text-sm text-red-400">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center gap-3">
                <input
                  type="text"
                  required
                  placeholder="e.g. Senior DevOps Specialist, Machine Learning Engineer"
                  value={careerGoal}
                  onChange={(e) => setCareerGoal(e.target.value)}
                  className="w-full sm:flex-1 px-4 py-2.5 rounded-lg border border-white/5 bg-white/5 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm transition-all"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 px-5 py-2.5 text-sm font-semibold text-white transition-all shrink-0"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Compiling...
                    </>
                  ) : (
                    <>
                      Generate Plan
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Generated roadmap representation workspace */}
            <div>
              {roadmap ? (
                <div className="space-y-6 animate-fade-in">
                  <div className="flex items-center justify-between border-b border-white/5 pb-4">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                      <Sparkles className="h-4.5 w-4.5 text-indigo-400" />
                      <span>Weekly Guide: {roadmap.careerGoal}</span>
                    </h3>
                  </div>

                  <div className="space-y-4">
                    {roadmap.weeks.map((week, idx) => {
                      const isOpen = !!openWeeks[idx];
                      return (
                        <div key={idx} className="glass-panel border border-white/5 rounded-xl overflow-hidden">
                          {/* Header toggle */}
                          <button
                            onClick={() => toggleWeek(idx)}
                            className="w-full px-6 py-4 flex items-center justify-between bg-white/[0.01] hover:bg-white/[0.02] text-left transition-all border-b border-white/5"
                          >
                            <div className="flex items-center gap-3">
                              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-500/10 text-xs font-bold text-indigo-400 border border-indigo-500/20">
                                W{week.weekNumber}
                              </span>
                              <div>
                                <h4 className="text-sm font-bold text-white">{week.topic}</h4>
                                <span className="text-[10px] text-indigo-400 font-semibold tracking-wider uppercase">Stage {idx + 1}</span>
                              </div>
                            </div>
                            {isOpen ? <ChevronUp className="h-4 w-4 text-slate-400" /> : <ChevronDown className="h-4 w-4 text-slate-400" />}
                          </button>

                          {/* Collapsible content */}
                          {isOpen && (
                            <div className="p-6 grid gap-6 md:grid-cols-2 bg-dark-950/20">
                              
                              {/* Learning subtopics list */}
                              <div className="space-y-4">
                                <div>
                                  <div className="flex items-center gap-1.5 text-indigo-400 mb-2">
                                    <BookOpen className="h-4 w-4" />
                                    <span className="text-[10px] font-bold uppercase tracking-wider">Objectives</span>
                                  </div>
                                  <ul className="space-y-2">
                                    {week.objectives.map((obj, i) => (
                                      <li key={i} className="text-xs text-slate-300 flex items-start gap-2 leading-relaxed">
                                        <CheckCircle className="h-4 w-4 text-indigo-400/80 shrink-0 mt-0.5" />
                                        <span>{obj}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>

                                <div>
                                  <div className="flex items-center gap-1.5 text-indigo-400 mb-2">
                                    <MapPin className="h-4 w-4" />
                                    <span className="text-[10px] font-bold uppercase tracking-wider">Syllabus Subtopics</span>
                                  </div>
                                  <div className="flex flex-wrap gap-1.5">
                                    {week.topicsToCover.map((topic, i) => (
                                      <span key={i} className="rounded bg-white/5 border border-white/5 px-2 py-0.5 text-[10px] font-medium text-slate-400">
                                        {topic}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              </div>

                              {/* Hands-on Exercise */}
                              <div className="glass-panel p-5 rounded-lg border border-white/5 bg-white/[0.005] h-full flex flex-col">
                                <div className="flex items-center gap-1.5 text-indigo-400 mb-3">
                                  <Terminal className="h-4 w-4" />
                                  <span className="text-[10px] font-bold uppercase tracking-wider">Weekly Practical Challenge</span>
                                </div>
                                <p className="text-xs text-slate-300 leading-relaxed bg-white/[0.01] p-3.5 rounded border border-white/5 flex-1">
                                  {week.practicalExercise}
                                </p>
                              </div>

                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="glass-panel border border-white/5 rounded-xl p-12 text-center text-slate-500 flex flex-col items-center justify-center h-80">
                  <Compass className="h-10 w-10 text-slate-600 mb-4" />
                  <h4 className="font-semibold text-slate-400 text-sm">No Roadmap Generated</h4>
                  <p className="text-xs text-slate-500 max-w-sm mt-2 leading-relaxed">
                    Input your target field goals (e.g. "Full Stack Developer") above to map your step-by-step developer syllabus.
                  </p>
                </div>
              )}
            </div>

          </div>

        </main>
      </div>
    </div>
  );
};

export default RoadmapGenerator;
