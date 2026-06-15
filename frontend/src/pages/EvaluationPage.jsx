import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { interviewAPI } from '../services/api';
import { 
  Award, 
  BookOpen, 
  HelpCircle, 
  CheckCircle, 
  Loader2, 
  ArrowLeft, 
  Send,
  AlertCircle,
  ThumbsUp,
  ThumbsDown,
  Sparkles
} from 'lucide-react';

const EvaluationPage = () => {
  const { id } = useParams();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(0);
  const [answerText, setAnswerText] = useState('');
  const [evalError, setEvalError] = useState('');

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const data = await interviewAPI.getSession(id);
        setSession(data);
        // Find first unanswered question or default to first
        const firstUnanswered = data.questions.findIndex(q => !q.answered);
        if (firstUnanswered !== -1) {
          setSelectedQuestionIndex(firstUnanswered);
        }
      } catch (err) {
        setError('Failed to fetch interview session. Verify the URL or your permissions.');
      } finally {
        setLoading(false);
      }
    };
    fetchSession();
  }, [id]);

  const activeQuestion = session?.questions[selectedQuestionIndex];

  const handleAnswerSubmit = async (e) => {
    e.preventDefault();
    setEvalError('');

    if (!answerText.trim()) {
      setEvalError('Please type your response before submitting.');
      return;
    }

    setSubmitting(true);
    try {
      const evaluation = await interviewAPI.submitAnswer(activeQuestion.id, answerText);
      
      // Update session state locally
      setSession(prev => {
        const updatedQuestions = prev.questions.map((q, idx) => {
          if (idx === selectedQuestionIndex) {
            return {
              ...q,
              answered: true,
              evaluation: evaluation
            };
          }
          return q;
        });
        return { ...prev, questions: updatedQuestions };
      });
      
      setAnswerText('');
    } catch (err) {
      setEvalError('Evaluation submission failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-950 text-slate-100 pl-64">
      <Sidebar />

      <div className="flex flex-col min-h-screen">
        <Navbar />

        <main className="flex-1 p-8 overflow-y-auto">
          {loading ? (
            <div className="flex h-64 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
            </div>
          ) : error ? (
            <div className="space-y-4">
              <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-4 text-sm text-red-400">
                {error}
              </div>
              <Link to="/interviews" className="inline-flex items-center gap-2 text-sm text-indigo-400 hover:text-indigo-300">
                <ArrowLeft className="h-4 w-4" /> Back to Generator
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Back & Breadcrumb Header */}
              <div className="flex items-center justify-between">
                <Link to="/interviews" className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500 hover:text-slate-300">
                  <ArrowLeft className="h-3.5 w-3.5" /> Back to Prep
                </Link>
                <div className="rounded bg-indigo-500/10 px-2.5 py-1 text-[10px] font-bold text-indigo-400 border border-indigo-500/20">
                  Job Role: {session.jobRole}
                </div>
              </div>

              {/* Grid split: 1/3 questions list, 2/3 workspace */}
              <div className="grid gap-8 lg:grid-cols-3 items-start">
                
                {/* Left Side Question Queue */}
                <div className="lg:col-span-1 space-y-3">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Question Queue</h3>
                  <div className="space-y-2">
                    {session.questions.map((q, idx) => (
                      <button
                        key={q.id}
                        onClick={() => {
                          setSelectedQuestionIndex(idx);
                          setEvalError('');
                          setAnswerText('');
                        }}
                        className={`w-full text-left p-4 rounded-xl border transition-all ${
                          selectedQuestionIndex === idx
                            ? 'bg-indigo-600/10 border-indigo-500/50 text-indigo-300'
                            : 'bg-white/[0.01] border-white/5 text-slate-400 hover:bg-white/5 hover:text-slate-200'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] font-semibold tracking-wide uppercase">Question {idx + 1}</span>
                          {q.answered ? (
                            <CheckCircle className="h-4.5 w-4.5 text-emerald-500" />
                          ) : (
                            <div className="h-2 w-2 rounded-full bg-slate-600 animate-pulse" />
                          )}
                        </div>
                        <p className="line-clamp-2 text-xs font-medium">{q.questionText}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Right Side Work Panel */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Selected Question Header */}
                  <div className="glass-panel p-6 rounded-xl border border-white/5">
                    <div className="flex items-center gap-2 text-indigo-400 mb-2">
                      <HelpCircle className="h-5 w-5 shrink-0" />
                      <span className="text-xs font-bold uppercase tracking-wider">Active Prompt</span>
                    </div>
                    <p className="text-sm font-semibold text-white leading-relaxed">{activeQuestion?.questionText}</p>
                  </div>

                  {/* Submission and evaluation forms */}
                  {!activeQuestion?.answered ? (
                    /* Submission View */
                    <div className="glass-panel p-6 rounded-xl border border-white/5 space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Your Response</h4>
                        <span className="text-[10px] text-slate-500 font-medium">Type a technical answer</span>
                      </div>
                      
                      {evalError && (
                        <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-3.5 text-xs text-red-400 flex items-center gap-2">
                          <AlertCircle className="h-4 w-4 shrink-0" />
                          <span>{evalError}</span>
                        </div>
                      )}

                      <form onSubmit={handleAnswerSubmit} className="space-y-4">
                        <textarea
                          rows={6}
                          required
                          placeholder="Explain concepts, reference syntax, define code flows, or describe past projects..."
                          value={answerText}
                          onChange={(e) => setAnswerText(e.target.value)}
                          className="w-full p-4 rounded-lg border border-white/5 bg-white/5 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm transition-all"
                        />
                        <button
                          type="submit"
                          disabled={submitting}
                          className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 px-4 py-2.5 text-sm font-semibold text-white transition-all"
                        >
                          {submitting ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin" />
                              AI Grading...
                            </>
                          ) : (
                            <>
                              Submit Answer
                              <Send className="h-4 w-4" />
                            </>
                          )}
                        </button>
                      </form>
                    </div>
                  ) : (
                    /* Evaluation View */
                    <div className="space-y-6 animate-fade-in">
                      {/* Score block */}
                      <div className="glass-panel p-6 rounded-xl border border-white/5 flex items-center justify-between">
                        <div>
                          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">AI Scoring Metrics</h4>
                          <p className="text-[10px] text-slate-500 mt-1">Answer evaluated successfully</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-indigo-600/10 border border-indigo-500/20 text-xl font-bold text-indigo-400">
                            {activeQuestion.evaluation?.score}%
                          </div>
                        </div>
                      </div>

                      {/* Details analysis blocks */}
                      <div className="grid gap-6 md:grid-cols-2">
                        {/* Strengths */}
                        <div className="glass-panel p-6 rounded-xl border border-white/5">
                          <div className="flex items-center gap-2 text-emerald-400 mb-3">
                            <ThumbsUp className="h-4.5 w-4.5" />
                            <span className="text-xs font-bold uppercase tracking-wider">Key Strengths</span>
                          </div>
                          <p className="text-xs text-slate-300 leading-relaxed bg-white/[0.01] p-3 rounded-lg border border-white/5">
                            {activeQuestion.evaluation?.strengths}
                          </p>
                        </div>

                        {/* Weaknesses */}
                        <div className="glass-panel p-6 rounded-xl border border-white/5">
                          <div className="flex items-center gap-2 text-amber-400 mb-3">
                            <ThumbsDown className="h-4.5 w-4.5" />
                            <span className="text-xs font-bold uppercase tracking-wider">Detected Gaps</span>
                          </div>
                          <p className="text-xs text-slate-300 leading-relaxed bg-white/[0.01] p-3 rounded-lg border border-white/5">
                            {activeQuestion.evaluation?.weaknesses}
                          </p>
                        </div>
                      </div>

                      {/* Suggestions and Improvements */}
                      <div className="glass-panel p-6 rounded-xl border border-white/5">
                        <div className="flex items-center gap-2 text-indigo-400 mb-3">
                          <Sparkles className="h-4.5 w-4.5" />
                          <span className="text-xs font-bold uppercase tracking-wider">Actionable Recommendations</span>
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed bg-white/[0.01] p-3 rounded-lg border border-white/5">
                          {activeQuestion.evaluation?.suggestions}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default EvaluationPage;
