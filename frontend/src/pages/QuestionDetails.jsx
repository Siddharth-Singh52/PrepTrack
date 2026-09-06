import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { questionService } from '../services/questionService.js';
import { revisionService } from '../services/revisionService.js';
import { LoadingSpinner } from '../components/common/LoadingSpinner.jsx';
import { Badge } from '../components/common/Badge.jsx';
import { Button } from '../components/common/Button.jsx';
import { Card } from '../components/common/Card.jsx';
import {
  ArrowLeft,
  ExternalLink,
  Star,
  Clock,
  Save,
  RotateCw,
  Building,
} from 'lucide-react';

export const QuestionDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [question, setQuestion] = useState(null);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(true);
  const [savingNotes, setSavingNotes] = useState(false);
  const [notesSavedNotice, setNotesSavedNotice] = useState(false);
  const [revising, setRevising] = useState(false);

  const fetchDetails = async () => {
    try {
      setLoading(true);
      const res = await questionService.getQuestionById(id);
      if (res.success) {
        setQuestion(res.question);
        setNotes(res.question.notes || '');
      }
    } catch (err) {
      console.error('Failed to load question details:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [id]);

  const handleStatusChange = async (newStatus) => {
    try {
      setQuestion((prev) => ({ ...prev, status: newStatus }));
      await questionService.updateProgress(id, newStatus);
      fetchDetails();
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const handleFavoriteToggle = async () => {
    try {
      setQuestion((prev) => ({ ...prev, favorite: !prev.favorite }));
      await questionService.toggleFavorite(id);
    } catch (err) {
      console.error('Failed to toggle favorite:', err);
    }
  };

  const handleSaveNotes = async () => {
    try {
      setSavingNotes(true);
      await questionService.updateNotes(id, notes);
      setNotesSavedNotice(true);
      setTimeout(() => setNotesSavedNotice(false), 3000);
    } catch (err) {
      console.error('Failed to save notes:', err);
    } finally {
      setSavingNotes(false);
    }
  };

  const handleCompleteRevision = async () => {
    try {
      setRevising(true);
      await revisionService.completeRevision(id);
      fetchDetails();
    } catch (err) {
      console.error('Failed to complete revision:', err);
    } finally {
      setRevising(false);
    }
  };

  if (loading) return <LoadingSpinner text="Loading problem details..." />;

  if (!question) {
    return (
      <div className="text-center py-12">
        <p className="text-zinc-400 mb-4">Question not found.</p>
        <Button variant="secondary" onClick={() => navigate('/questions')}>
          Back to Question Bank
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Back button */}
      <button
        onClick={() => navigate('/questions')}
        className="inline-flex items-center text-xs text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4 mr-1" />
        <span>Back to DSA Problem Bank</span>
      </button>

      {/* Main Header Card */}
      <Card className="p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <span className="font-semibold text-xs text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                {question.topic}
              </span>
              <Badge variant={question.difficulty} size="sm">
                {question.difficulty}
              </Badge>
              <span className="text-xs text-zinc-400">{question.platform || 'LeetCode'}</span>
            </div>

            <h2 className="text-2xl font-bold text-zinc-100 tracking-tight">{question.title}</h2>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleFavoriteToggle}
              className={`p-2 rounded-lg border transition-colors cursor-pointer ${
                question.favorite
                  ? 'text-amber-400 border-amber-500/30 bg-amber-500/10'
                  : 'text-zinc-400 border-zinc-700 hover:text-zinc-200 hover:bg-zinc-800'
              }`}
              title="Toggle Favorite"
            >
              <Star className={`w-5 h-5 ${question.favorite ? 'fill-amber-400' : ''}`} />
            </button>

            {question.link && (
              <a
                href={question.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg text-xs font-medium border border-zinc-700 transition-colors"
              >
                <span>Open Problem</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>

        {/* Status Selector & Tags */}
        <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <span className="text-xs text-zinc-400">Current Status:</span>
            {['Not Started', 'In Progress', 'Completed'].map((st) => (
              <button
                key={st}
                onClick={() => handleStatusChange(st)}
                className={`px-3 py-1 text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${
                  question.status === st
                    ? st === 'Completed'
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                      : st === 'In Progress'
                      ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                      : 'bg-zinc-800 text-zinc-200 border-zinc-700'
                    : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:text-zinc-200'
                }`}
              >
                {st === 'Completed' ? 'Solved' : st}
              </button>
            ))}
          </div>

          {question.companyTags && question.companyTags.length > 0 && (
            <div className="flex items-center gap-1.5 flex-wrap">
              <Building className="w-3.5 h-3.5 text-zinc-500" />
              {question.companyTags.map((comp) => (
                <span
                  key={comp}
                  className="text-xs bg-zinc-800/80 text-zinc-300 px-2 py-0.5 rounded border border-zinc-700/50"
                >
                  {comp}
                </span>
              ))}
            </div>
          )}
        </div>
      </Card>

      {/* Spaced Repetition Panel (If question is solved or in progress) */}
      {question.revisionStage > 0 && (
        <Card className="p-5 bg-linear-to-r from-zinc-900 to-zinc-900/60 border-zinc-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-400" />
                <h4 className="text-sm font-semibold text-zinc-100">
                  Spaced Repetition: Stage {question.revisionStage} of 5
                </h4>
              </div>
              <p className="text-xs text-zinc-400 mt-1">
                {question.nextRevisionDate ? (
                  <>
                    Next Scheduled Revision:{' '}
                    <span className="text-zinc-200 font-medium font-mono">
                      {new Date(question.nextRevisionDate).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </>
                ) : (
                  'Ready for periodic retention review'
                )}
              </p>
            </div>

            <Button
              variant="secondary"
              size="sm"
              loading={revising}
              onClick={handleCompleteRevision}
              icon={RotateCw}
            >
              Mark Revision Done
            </Button>
          </div>
        </Card>
      )}

      {/* Description & Approach */}
      {question.description && (
        <Card className="p-5">
          <h3 className="text-sm font-semibold text-zinc-200 mb-2">Problem Overview & Approach Hints</h3>
          <p className="text-sm text-zinc-400 leading-relaxed whitespace-pre-line">
            {question.description}
          </p>
        </Card>
      )}

      {/* Personal Notes & Solution Scratchpad */}
      <Card className="p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-zinc-200">Personal Notes & Solution Breakdown</h3>
            <p className="text-xs text-zinc-400">Save time/space complexities, edge cases, and code templates</p>
          </div>

          <div className="flex items-center gap-2">
            {notesSavedNotice && (
              <span className="text-xs text-emerald-400 font-medium animate-in fade-in">
                Saved!
              </span>
            )}
            <Button
              variant="primary"
              size="sm"
              loading={savingNotes}
              onClick={handleSaveNotes}
              icon={Save}
            >
              Save Notes
            </Button>
          </div>
        </div>

        <textarea
          rows="10"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder={`# Approach & Algorithm:
- 

# Time Complexity: O(...)
# Space Complexity: O(...)

# Edge Cases to remember:`}
          className="w-full p-4 bg-zinc-950 border border-zinc-800 rounded-xl text-sm font-mono text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-emerald-500/50 leading-relaxed"
        />
      </Card>
    </div>
  );
};
