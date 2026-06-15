import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  BrainCircuit, 
  Terminal, 
  FileText, 
  Map, 
  CheckCircle, 
  ArrowRight,
  TrendingUp,
  Cpu,
  ShieldCheck
} from 'lucide-react';

const Landing = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="relative min-h-screen overflow-hidden bg-dark-950 text-slate-200">
      {/* Decorative Glow Elements */}
      <div className="absolute top-0 left-1/4 h-[500px] w-[500px] rounded-full bg-indigo-500/10 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-10 right-1/4 h-[400px] w-[400px] rounded-full bg-violet-500/10 blur-[100px] pointer-events-none"></div>

      {/* Header / Nav */}
      <header className="relative z-10 flex h-20 items-center justify-between px-8 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600/10 text-indigo-400 border border-indigo-500/20">
            <BrainCircuit className="h-5.5 w-5.5" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">
            HireMate <span className="text-indigo-400">AI</span>
          </span>
        </div>
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <Link
              to="/dashboard"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 transition-all duration-200 shadow-lg shadow-indigo-600/20"
            >
              Go to Dashboard
              <ArrowRight className="h-4 w-4" />
            </Link>
          ) : (
            <>
              <Link to="/login" className="text-sm font-medium text-slate-400 hover:text-white transition-all">
                Sign In
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 transition-all duration-200 shadow-md shadow-indigo-600/20"
              >
                Register Free
              </Link>
            </>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 px-8 py-20 max-w-6xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-xs font-medium text-indigo-300 mb-8 animate-pulse">
          <Cpu className="h-3 w-3" />
          <span>Next-Gen Career Assistant Powered by OpenAI</span>
        </div>
        
        <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-6xl max-w-4xl mx-auto leading-tight">
          Ace Your Technical Interviews. <br />
          <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-indigo-400 bg-clip-text text-transparent">
            Accelerate Your Career.
          </span>
        </h1>
        
        <p className="mt-6 text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Unlock your true professional potential. Practice tailored mock interviews, optimize your resume ATS score, and follow structured custom roadmaps to land your dream role.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to={isAuthenticated ? "/dashboard" : "/register"}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 px-6 py-3.5 text-base font-semibold text-white transition-all duration-200 shadow-lg shadow-indigo-600/30 glow-indigo"
          >
            Start Preparing Now
            <ArrowRight className="h-5 w-5" />
          </Link>
          <a
            href="#features"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 px-6 py-3.5 text-base font-semibold text-slate-300 transition-all duration-200"
          >
            Explore Features
          </a>
        </div>

        {/* Highlight Stats */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-white/5 pt-12 max-w-4xl mx-auto">
          <div>
            <h3 className="text-3xl font-extrabold text-white">94%</h3>
            <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider font-semibold">ATS Optimization</p>
          </div>
          <div>
            <h3 className="text-3xl font-extrabold text-indigo-400">10K+</h3>
            <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider font-semibold">Questions Scored</p>
          </div>
          <div>
            <h3 className="text-3xl font-extrabold text-white">100%</h3>
            <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider font-semibold">Custom Roadmaps</p>
          </div>
          <div>
            <h3 className="text-3xl font-extrabold text-indigo-400">2.5x</h3>
            <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider font-semibold">Offer Velocity</p>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="relative z-10 px-8 py-24 border-t border-white/5 bg-white/[0.005]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-white">Built for High-Growth Professionals</h2>
            <p className="text-slate-400 mt-4 leading-relaxed">
              Skip standard study logs. Use tailored AI templates built to evaluate, score, and guide you directly toward top-tier tech standards.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="glass-card p-8 rounded-2xl flex flex-col items-start text-left">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 mb-6">
                <Terminal className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">AI Interview Suite</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-4">
                Input any target job role. Instantly generate 10 industry-grade technical and behavioral interview questions and get scored on your answers.
              </p>
              <ul className="space-y-2 mt-auto text-xs text-slate-500 font-medium">
                <li className="flex items-center gap-2"><CheckCircle className="h-3.5 w-3.5 text-indigo-400" /> Detail Strengths & Weaknesses</li>
                <li className="flex items-center gap-2"><CheckCircle className="h-3.5 w-3.5 text-indigo-400" /> Live Response Grading (0-100)</li>
              </ul>
            </div>

            {/* Feature 2 */}
            <div className="glass-card p-8 rounded-2xl flex flex-col items-start text-left">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 mb-6">
                <FileText className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">ATS Resume Optimizer</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-4">
                Upload your PDF resume. Our parser highlights missing keyword tags, detects template formatting blocks, and scores ATS compatibility.
              </p>
              <ul className="space-y-2 mt-auto text-xs text-slate-500 font-medium">
                <li className="flex items-center gap-2"><CheckCircle className="h-3.5 w-3.5 text-indigo-400" /> Missing Skills Breakdown</li>
                <li className="flex items-center gap-2"><CheckCircle className="h-3.5 w-3.5 text-indigo-400" /> Readability improvement tips</li>
              </ul>
            </div>

            {/* Feature 3 */}
            <div className="glass-card p-8 rounded-2xl flex flex-col items-start text-left">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 mb-6">
                <Map className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Custom Career Roadmap</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-4">
                Enter your target career goal. Instantly map a weekly learning syllabus complete with reading materials, topics, and practical test exercises.
              </p>
              <ul className="space-y-2 mt-auto text-xs text-slate-500 font-medium">
                <li className="flex items-center gap-2"><CheckCircle className="h-3.5 w-3.5 text-indigo-400" /> Weekly Learning Objectives</li>
                <li className="flex items-center gap-2"><CheckCircle className="h-3.5 w-3.5 text-indigo-400" /> Hands-on Practical Projects</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <footer className="relative z-10 border-t border-white/5 py-12 px-8 text-center bg-dark-950">
        <p className="text-sm text-slate-500">&copy; {new Date().getFullYear()} HireMate AI. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Landing;
