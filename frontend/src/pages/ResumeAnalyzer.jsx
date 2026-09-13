import { useState, useEffect, useRef } from 'react';
import { resumeService } from '../services/resumeService.js';
import { AtsScoreGauge } from '../components/resume/AtsScoreGauge.jsx';
import { SectionScoreCard } from '../components/resume/SectionScoreCard.jsx';
import { Card } from '../components/common/Card.jsx';
import { Button } from '../components/common/Button.jsx';
import { LoadingSpinner } from '../components/common/LoadingSpinner.jsx';
import {
  UploadCloud,
  FileText,
  CheckCircle,
  AlertTriangle,
  Sparkles,
  Key,
  ShieldCheck,
} from 'lucide-react';

export const ResumeAnalyzer = () => {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  const fileInputRef = useRef(null);
  const fetchHistory = async () => {
    try {
      setLoadingHistory(true);
      const res = await resumeService.getHistory();
      if (res.success) {
        setHistory(res.history);
        if (res.history.length > 0 && !analysisResult) {
          setAnalysisResult(res.history[0]);
        }
      }
    } catch (err) {
      console.error('Failed to load resume history:', err);
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const selected = e.dataTransfer.files[0];
      validateAndSetFile(selected);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (f) => {
    setErrorMsg('');
    const ext = f.name.split('.').pop().toLowerCase();
    if (!['pdf', 'docx', 'doc', 'txt'].includes(ext)) {
      setErrorMsg('Please select a valid PDF or DOCX resume file.');
      return;
    }
    if (f.size > 10 * 1024 * 1024) {
      setErrorMsg('File size exceeds 10MB limit.');
      return;
    }
    setFile(f);
  };

  const handleAnalyze = async () => {
    if (!file) {
      setErrorMsg('Please select a resume file first.');
      return;
    }

    try {
      setAnalyzing(true);
      setErrorMsg('');
      const res = await resumeService.analyzeResume(file);
      if (res.success) {
        setAnalysisResult(res.analysis);
        fetchHistory();
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to analyze resume. Please try again.');
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-zinc-100 tracking-tight">AI ATS Resume Analyzer</h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Optimize your resume for Applicant Tracking Systems with Gemini AI scoring & keyword extraction
          </p>
        </div>

      </div>

      {/* Upload Box */}
      <Card className="p-6 border-zinc-800">
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
            isDragging
              ? 'border-emerald-500 bg-emerald-500/5'
              : 'border-zinc-800 hover:border-zinc-700 bg-zinc-950/60'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.docx,.doc,.txt"
            onChange={handleFileChange}
            className="hidden"
          />

          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto mb-3">
            <UploadCloud className="w-6 h-6" />
          </div>

          <h4 className="text-sm font-semibold text-zinc-200">
            {file ? file.name : 'Click or Drag & Drop your Resume document'}
          </h4>
          <p className="text-xs text-zinc-500 mt-1">
            Supports PDF and Word (.DOCX) formats up to 10MB
          </p>

          {file && (
            <div className="mt-3 inline-flex items-center space-x-2 text-xs text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30 font-medium">
              <FileText className="w-3.5 h-3.5" />
              <span>Ready for ATS screening</span>
            </div>
          )}
        </div>

        {errorMsg && (
          <div className="mt-4 p-3 bg-rose-500/15 border border-rose-500/30 text-rose-400 rounded-lg text-xs">
            {errorMsg}
          </div>
        )}

        <div className="mt-4 flex justify-end">
          <Button
            variant="primary"
            size="md"
            loading={analyzing}
            disabled={!file}
            onClick={handleAnalyze}
            icon={Sparkles}
          >
            {analyzing ? 'Scanning with Gemini AI...' : 'Run ATS Analysis'}
          </Button>
        </div>
      </Card>

      {/* Analysis Results Display */}
      {analysisResult && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Top Result Card: Overall Gauge & Highlights */}
          <Card className="p-6 bg-linear-to-r from-zinc-900 via-zinc-900 to-zinc-950 border-zinc-800">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="shrink-0">
                <AtsScoreGauge score={analysisResult.atsScore} />
              </div>

              <div className="flex-1 space-y-3 text-left">
                <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-400 uppercase tracking-wide">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Resume Screened: {analysisResult.filename}</span>
                </div>
                <h3 className="text-xl font-bold text-zinc-100">
                  ATS Readiness Score: {analysisResult.atsScore} / 100
                </h3>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  Your resume has been benchmarked against typical tier-1 technical engineering screening algorithms. Below is the detailed breakdown of section formatting, high-impact keywords, and recommended revisions.
                </p>
              </div>
            </div>
          </Card>

          {/* Section Scores Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <SectionScoreCard
              title="Contact Information"
              score={analysisResult.sectionScores?.contact ?? 0}
            />
            <SectionScoreCard
              title="Professional Summary"
              score={analysisResult.sectionScores?.summary ?? 0}
            />
            <SectionScoreCard
              title="Technical Skills"
              score={analysisResult.sectionScores?.skills ?? 0}
            />
            <SectionScoreCard
              title="Work Experience"
              score={analysisResult.sectionScores?.experience ?? 0}
            />
            <SectionScoreCard
              title="Education & Credentials"
              score={analysisResult.sectionScores?.education ?? 0}
            />
            <SectionScoreCard
              title="Projects"
              score={analysisResult.sectionScores?.projects ?? 0}
            />
          </div>

          {/* Strengths & Weaknesses Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Strengths */}
            <Card className="p-5 border-emerald-500/20 bg-emerald-500/5">
              <div className="flex items-center space-x-2 text-emerald-400 font-semibold text-sm mb-3">
                <CheckCircle className="w-4 h-4" />
                <span>Detected Strengths</span>
              </div>
              <ul className="space-y-2 text-xs text-zinc-300">
                {analysisResult.strengths?.map((str, idx) => (
                  <li key={idx} className="flex items-start space-x-2">
                    <span className="text-emerald-400 mt-0.5">•</span>
                    <span>{str}</span>
                  </li>
                ))}
              </ul>
            </Card>

            {/* Weaknesses */}
            <Card className="p-5 border-amber-500/20 bg-amber-500/5">
              <div className="flex items-center space-x-2 text-amber-400 font-semibold text-sm mb-3">
                <AlertTriangle className="w-4 h-4" />
                <span>Areas for Optimization</span>
              </div>
              <ul className="space-y-2 text-xs text-zinc-300">
                {analysisResult.weaknesses?.map((w, idx) => (
                  <li key={idx} className="flex items-start space-x-2">
                    <span className="text-amber-400 mt-0.5">•</span>
                    <span>{w}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>

          {/* Missing Keywords & Actionable Suggestions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Missing Keywords */}
            <Card className="p-5">
              <div className="flex items-center space-x-2 text-zinc-200 font-semibold text-sm mb-3">
                <Key className="w-4 h-4 text-emerald-400" />
                <span>Recommended Keywords to Add</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {analysisResult.missingKeywords?.map((kw, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 text-xs font-mono bg-zinc-800 text-zinc-200 rounded-md border border-zinc-700/60"
                  >
                    + {kw}
                  </span>
                ))}
              </div>
            </Card>

            {/* Suggestions */}
            <Card className="p-5">
              <div className="flex items-center space-x-2 text-zinc-200 font-semibold text-sm mb-3">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>Actionable Recommendations</span>
              </div>
              <ul className="space-y-2 text-xs text-zinc-300">
                {analysisResult.suggestions?.map((sug, idx) => (
                  <li key={idx} className="flex items-start space-x-2">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span>{sug}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </div>
      )}

      {/* History List */}
      {history.length > 1 && (
        <Card className="p-5">
          <h4 className="text-sm font-semibold text-zinc-200 mb-3">Past Resume Scans</h4>
          <div className="divide-y divide-zinc-800/60">
            {history.map((h) => (
              <div
                key={h._id}
                onClick={() => setAnalysisResult(h)}
                className="py-3 flex items-center justify-between cursor-pointer hover:bg-zinc-950/40 px-2 rounded-lg transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <FileText className="w-4 h-4 text-emerald-400" />
                  <div>
                    <p className="text-xs font-semibold text-zinc-200">{h.filename}</p>
                    <p className="text-[11px] text-zinc-500">
                      {new Date(h.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <span className="text-xs font-bold font-mono text-emerald-400">
                    ATS Score: {h.atsScore}/100
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};
