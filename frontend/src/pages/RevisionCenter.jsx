import { useState, useEffect } from 'react';
import { revisionService } from '../services/revisionService.js';
import { LoadingSpinner } from '../components/common/LoadingSpinner.jsx';
import { EmptyState } from '../components/common/EmptyState.jsx';
import { Card } from '../components/common/Card.jsx';
import { Badge } from '../components/common/Badge.jsx';
import { Button } from '../components/common/Button.jsx';
import { useNavigate } from 'react-router-dom';
import {
  Clock,
  CheckCircle2,
  AlertTriangle,
  RotateCw,
  Calendar,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

export const RevisionCenter = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('due'); // due, overdue, upcoming, history
  const [completingId, setCompletingId] = useState(null);
  const navigate = useNavigate();

  const fetchRevisions = async () => {
    try {
      setLoading(true);
      const res = await revisionService.getRevisions();
      if (res.success) {
        setData(res);
      }
    } catch (err) {
      console.error('Failed to load revisions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRevisions();
  }, []);

  const handleCompleteRevision = async (e, questionId) => {
    e.stopPropagation();
    try {
      setCompletingId(questionId);
      await revisionService.completeRevision(questionId);
      await fetchRevisions();
    } catch (err) {
      console.error('Failed to complete revision:', err);
    } finally {
      setCompletingId(null);
    }
  };

  if (loading) return <LoadingSpinner text="Calculating spaced repetition schedules..." />;

  const { stats, revisions } = data || {};
  const { dueToday = [], overdue = [], upcoming = [], recentlyRevised = [] } = revisions || {};

  const currentList =
    activeTab === 'due'
      ? dueToday
      : activeTab === 'overdue'
      ? overdue
      : activeTab === 'upcoming'
      ? upcoming
      : recentlyRevised;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-zinc-100 tracking-tight">Revision Center</h2>
        <p className="text-xs text-zinc-400 mt-0.5">
          Spaced repetition engine designed to move algorithm intuition into long-term memory
        </p>
      </div>

      {/* Spaced Intervals Guide Banner */}
      <Card className="p-4 bg-zinc-900/60 border-zinc-800">
        <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-400 mb-2">
          <Sparkles className="w-4 h-4" />
          <span>Ebbinghaus Spaced Repetition Cadence</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs text-zinc-300">
          <div className="p-2.5 bg-zinc-950/80 rounded-lg border border-zinc-800/80">
            <span className="font-semibold text-emerald-400 block mb-0.5">Stage 1</span>
            <span className="text-zinc-400">1 Day after solving</span>
          </div>
          <div className="p-2.5 bg-zinc-950/80 rounded-lg border border-zinc-800/80">
            <span className="font-semibold text-emerald-400 block mb-0.5">Stage 2</span>
            <span className="text-zinc-400">3 Days interval</span>
          </div>
          <div className="p-2.5 bg-zinc-950/80 rounded-lg border border-zinc-800/80">
            <span className="font-semibold text-emerald-400 block mb-0.5">Stage 3</span>
            <span className="text-zinc-400">7 Days interval</span>
          </div>
          <div className="p-2.5 bg-zinc-950/80 rounded-lg border border-zinc-800/80">
            <span className="font-semibold text-emerald-400 block mb-0.5">Stage 4</span>
            <span className="text-zinc-400">14 Days interval</span>
          </div>
          <div className="p-2.5 bg-zinc-950/80 rounded-lg border border-zinc-800/80 col-span-2 sm:col-span-1">
            <span className="font-semibold text-emerald-400 block mb-0.5">Stage 5</span>
            <span className="text-zinc-400">30 Days (Mastered)</span>
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <div className="flex border-b border-zinc-800 space-x-4">
        <button
          onClick={() => setActiveTab('due')}
          className={`pb-3 text-sm font-medium border-b-2 flex items-center gap-2 transition-colors cursor-pointer ${
            activeTab === 'due'
              ? 'border-emerald-500 text-emerald-400'
              : 'border-transparent text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Due Today</span>
          <span className="px-1.5 py-0.2 rounded-full text-xs font-bold bg-zinc-800 text-zinc-300">
            {dueToday.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('overdue')}
          className={`pb-3 text-sm font-medium border-b-2 flex items-center gap-2 transition-colors cursor-pointer ${
            activeTab === 'overdue'
              ? 'border-rose-500 text-rose-400'
              : 'border-transparent text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          <span>Overdue</span>
          <span className="px-1.5 py-0.2 rounded-full text-xs font-bold bg-rose-500/10 text-rose-400">
            {overdue.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('upcoming')}
          className={`pb-3 text-sm font-medium border-b-2 flex items-center gap-2 transition-colors cursor-pointer ${
            activeTab === 'upcoming'
              ? 'border-sky-500 text-sky-400'
              : 'border-transparent text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Upcoming</span>
          <span className="px-1.5 py-0.2 rounded-full text-xs font-bold bg-zinc-800 text-zinc-300">
            {upcoming.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`pb-3 text-sm font-medium border-b-2 flex items-center gap-2 transition-colors cursor-pointer ${
            activeTab === 'history'
              ? 'border-zinc-300 text-zinc-100'
              : 'border-transparent text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Recently Revised</span>
        </button>
      </div>

      {/* List */}
      {currentList.length === 0 ? (
        <EmptyState
          icon={Clock}
          title={
            activeTab === 'due'
              ? 'No revisions due today!'
              : activeTab === 'overdue'
              ? 'Zero overdue revisions!'
              : activeTab === 'upcoming'
              ? 'No upcoming revisions scheduled'
              : 'No revision history recorded yet'
          }
          description={
            activeTab === 'due'
              ? 'Great job keeping up with your scheduled problem reviews. Keep solving new problems to add them to your revision loop.'
              : 'Keep practicing DSA problems to activate automated retention stages.'
          }
          actionLabel="Solve More DSA"
          onAction={() => navigate('/questions')}
        />
      ) : (
        <div className="space-y-3">
          {currentList.map((item) => (
            <div
              key={item.questionId}
              onClick={() => navigate(`/questions/${item.questionId}`)}
              className="bg-zinc-900 border border-zinc-800/80 hover:border-zinc-700/80 rounded-xl p-4 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="text-sm font-semibold text-zinc-100">{item.title}</h4>
                  <Badge variant={item.difficulty} size="sm">
                    {item.difficulty}
                  </Badge>
                  <span className="text-xs bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20 font-medium">
                    {item.stageLabel}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-xs text-zinc-400">
                  <span className="text-zinc-300 font-medium">{item.topic}</span>
                  {item.nextRevisionDate && (
                    <span>
                      Target Date:{' '}
                      <strong className="text-zinc-200 font-mono">
                        {new Date(item.nextRevisionDate).toLocaleDateString()}
                      </strong>
                    </span>
                  )}
                  {item.companyTags && item.companyTags.length > 0 && (
                    <span className="text-zinc-500 truncate max-w-xs">
                      {item.companyTags.slice(0, 2).join(', ')}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Button
                  variant="primary"
                  size="sm"
                  loading={completingId === item.questionId}
                  onClick={(e) => handleCompleteRevision(e, item.questionId)}
                  icon={RotateCw}
                >
                  Mark Revised
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/questions/${item.questionId}`);
                  }}
                  icon={ArrowRight}
                >
                  Notes
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
