import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { resumeAPI } from '../services/api';
import { 
  Upload, 
  FileText, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Loader2,
  Calendar,
  Sparkles,
  TrendingUp
} from 'lucide-react';

const ResumeAnalyzer = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(true);
  
  const [analysisResult, setAnalysisResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [error, setError] = useState('');

  const fetchHistory = async () => {
    try {
      const data = await resumeAPI.getHistory();
      setHistory(data);
    } catch (err) {
      console.error('Failed to load resume history');
    } finally {
      setHistoryLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleFileChange = (e) => {
    setError('');
    const selected = e.target.files[0];
    if (!selected) return;

    if (selected.type !== 'application/pdf') {
      setError('Only PDF documents are supported.');
      setFile(null);
      return;
    }

    if (selected.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB.');
      setFile(null);
      return;
    }

    setFile(selected);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setAnalysisResult(null);

    if (!file) {
      setError('Please select a PDF file first.');
      return;
    }

    setLoading(true);
    try {
      const data = await resumeAPI.analyzeResume(file);
      setAnalysisResult(data);
      setFile(null);
      // Reload history list
      fetchHistory();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to analyze resume. Verify the PDF format.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectHistory = (item) => {
    setAnalysisResult(item);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-dark-950 text-slate-100 pl-64">
      <Sidebar />

      <div className="flex flex-col min-h-screen">
        <Navbar />

        <main className="flex-1 p-8 overflow-y-auto space-y-8">
          
          <div className="grid gap-8 lg:grid-cols-3 items-start">
            
            {/* Left Upload Form / History Grid */}
            <div className="lg:col-span-1 space-y-6">
              {/* Uploader Card */}
              <div className="glass-panel p-6 rounded-xl border border-white/5">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">ATS Optimizer</h3>
                
                {error && (
                  <div className="mb-4 rounded-lg border border-red-500/20 bg-red-500/5 p-3.5 text-xs text-red-400 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="border-2 border-dashed border-white/10 hover:border-indigo-500/30 bg-white/[0.01] rounded-lg p-6 text-center transition-all relative">
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={handleFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <Upload className="h-8 w-8 text-slate-500 mx-auto mb-2" />
                    <p className="text-xs text-slate-400 font-medium">
                      {file ? file.name : 'Select or drag PDF Resume'}
                    </p>
                    <p className="text-[10px] text-slate-500 mt-1">PDF only, max 5MB</p>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || !file}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 px-4 py-2.5 text-sm font-semibold text-white transition-all duration-200"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Running ATS Check...
                      </>
                    ) : (
                      'Analyze Resume'
                    )}
                  </button>
                </form>
              </div>

              {/* History Table Column */}
              <div className="glass-panel p-6 rounded-xl border border-white/5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
                  <span>Audit History</span>
                  {historyLoading && <Loader2 className="h-3 w-3 animate-spin text-slate-500" />}
                </h3>

                {history.length === 0 && !historyLoading ? (
                  <p className="text-xs text-slate-500 italic">No resumes analyzed yet.</p>
                ) : (
                  <div className="space-y-3">
                    {history.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => handleSelectHistory(item)}
                        className="w-full text-left p-3 rounded-lg border border-white/5 bg-white/[0.01] hover:bg-white/5 transition-all text-xs flex items-center justify-between"
                      >
                        <div className="overflow-hidden mr-2">
                          <p className="font-semibold text-slate-300 truncate">{item.filename}</p>
                          <div className="flex items-center gap-1.5 text-[10px] text-slate-500 mt-1">
                            <Calendar className="h-3 w-3" />
                            <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="shrink-0 flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-bold">
                          {item.atsScore}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right scorecard analysis workspace */}
            <div className="lg:col-span-2">
              {analysisResult ? (
                <div className="space-y-6 animate-fade-in">
                  
                  {/* Summary row */}
                  <div className="glass-panel p-6 rounded-xl border border-white/5 flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">ATS Score Report</h4>
                      <p className="text-sm font-semibold text-white mt-1.5 truncate max-w-sm">{analysisResult.filename}</p>
                    </div>
                    <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-indigo-600/10 border border-indigo-500/20 text-xl font-bold text-indigo-400">
                      {analysisResult.atsScore}%
                    </div>
                  </div>

                  <div className="grid gap-6 md:grid-cols-2 items-start">
                    {/* Missing Skills */}
                    <div className="glass-panel p-6 rounded-xl border border-white/5">
                      <div className="flex items-center gap-2 text-indigo-400 mb-4">
                        <AlertCircle className="h-4.5 w-4.5" />
                        <span className="text-xs font-bold uppercase tracking-wider">Missing Skills / Keywords</span>
                      </div>
                      
                      {analysisResult.missingSkills?.length === 0 ? (
                        <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-500/5 border border-emerald-500/20 p-3 rounded-lg">
                          <CheckCircle className="h-4 w-4 shrink-0" />
                          <span>No critical technical keywords missing.</span>
                        </div>
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          {analysisResult.missingSkills?.map((skill, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center gap-1.5 rounded-full border border-red-500/15 bg-red-500/5 px-3 py-1 text-xs font-medium text-red-400"
                            >
                              <XCircle className="h-3 w-3 shrink-0" />
                              {skill}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Suggestions */}
                    <div className="glass-panel p-6 rounded-xl border border-white/5">
                      <div className="flex items-center gap-2 text-indigo-400 mb-4">
                        <Sparkles className="h-4.5 w-4.5" />
                        <span className="text-xs font-bold uppercase tracking-wider">Formatting & Content Suggestions</span>
                      </div>
                      
                      <ul className="space-y-3">
                        {analysisResult.suggestions?.map((tip, idx) => (
                          <li
                            key={idx}
                            className="text-xs text-slate-300 leading-relaxed bg-white/[0.01] p-3 rounded-lg border border-white/5 flex items-start gap-2.5"
                          >
                            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-indigo-500/10 text-[10px] font-bold text-indigo-400">
                              {idx + 1}
                            </span>
                            <span>{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                </div>
              ) : (
                <div className="glass-panel border border-white/5 rounded-xl p-12 text-center text-slate-500 flex flex-col items-center justify-center h-96">
                  <FileText className="h-10 w-10 text-slate-600 mb-4" />
                  <h4 className="font-semibold text-slate-400 text-sm">No Resume Scored Yet</h4>
                  <p className="text-xs text-slate-500 max-w-sm mt-2 leading-relaxed">
                    Upload a PDF resume on the left or select a previous run from the history log to check keyword compliance.
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

export default ResumeAnalyzer;
