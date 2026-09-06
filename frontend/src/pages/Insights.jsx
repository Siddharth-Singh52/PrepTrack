import { useState, useEffect } from 'react';
import { insightService } from '../services/insightService.js';
import { LoadingSpinner } from '../components/common/LoadingSpinner.jsx';
import { Card } from '../components/common/Card.jsx';
import { ProgressBar } from '../components/common/ProgressBar.jsx';
import { useNavigate } from 'react-router-dom';
import {
  Award,
  AlertCircle,
  Briefcase,
  Lightbulb,
  ArrowRight,
  Flame,
} from 'lucide-react';

export const Insights = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchInsights = async () => {
    try {
      setLoading(true);
      const res = await insightService.getInsights();
      if (res.success) {
        setData(res.insights);
      }
    } catch (err) {
      console.error('Failed to load insights:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, []);

  if (loading) return <LoadingSpinner text="Computing data-driven interview readiness metrics..." />;

  const {
    overview = {},
    topicInsights = {},
    difficultyInsights = {},
    placementInsights = {},
    goalInsights = {},
    keyInsights = [],
  } = data || {};

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-zinc-100 tracking-tight">Preparation Insights & Analytics</h2>
        <p className="text-xs text-zinc-400 mt-0.5">
          Deterministic, data-driven analytics computed directly from your solved problems and job pipelines
        </p>
      </div>

      {/* Actionable Executive Summary */}
      <Card className="p-5 bg-linear-to-r from-zinc-900 via-zinc-900 to-zinc-950 border-zinc-800">
        <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-400 mb-3 uppercase tracking-wide">
          <Lightbulb className="w-4 h-4" />
          <span>Strategic Takeaways</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {keyInsights.map((insight, idx) => (
            <div
              key={idx}
              className="p-3 bg-zinc-950/80 border border-zinc-800/80 rounded-xl text-xs text-zinc-300 flex items-start space-x-2.5"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
              <p className="leading-relaxed font-medium">{insight}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Strongest vs Weakest Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Strongest Topic */}
        <Card className="p-4 bg-emerald-500/5 border-emerald-500/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wide">Strongest Topic</span>
            <Award className="w-4 h-4 text-emerald-400" />
          </div>
          <h4 className="text-xl font-bold text-zinc-100">{topicInsights.strongestTopic?.name || 'N/A'}</h4>
          <p className="text-xs text-zinc-400 mt-1">
            {topicInsights.strongestTopic?.completed || 0} solved ({topicInsights.strongestTopic?.percentage || 0}%)
          </p>
        </Card>

        {/* Weakest Topic */}
        <Card className="p-4 bg-amber-500/5 border-amber-500/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-amber-400 uppercase tracking-wide">Weakest Area</span>
            <AlertCircle className="w-4 h-4 text-amber-400" />
          </div>
          <h4 className="text-xl font-bold text-zinc-100">{topicInsights.weakestTopic?.name || 'N/A'}</h4>
          <p className="text-xs text-zinc-400 mt-1">
            {topicInsights.weakestTopic?.completed || 0} solved ({topicInsights.weakestTopic?.percentage || 0}%)
          </p>
        </Card>

        {/* Strongest Difficulty */}
        <Card className="p-4 bg-zinc-900 border-zinc-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wide">Difficulty Mastery</span>
            <Flame className="w-4 h-4 text-emerald-400" />
          </div>
          <h4 className="text-xl font-bold text-zinc-100">{difficultyInsights.strongestDifficulty?.difficulty || 'Easy'}</h4>
          <p className="text-xs text-zinc-400 mt-1">
            {difficultyInsights.strongestDifficulty?.completed || 0} problems completed ({difficultyInsights.strongestDifficulty?.percentage || 0}%)
          </p>
        </Card>

        {/* Application Success Rate */}
        <Card className="p-4 bg-zinc-900 border-zinc-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wide">Job Offer Rate</span>
            <Briefcase className="w-4 h-4 text-sky-400" />
          </div>
          <h4 className="text-xl font-bold text-emerald-400 font-mono">
            {placementInsights.applicationSuccessRate || 0}%
          </h4>
          <p className="text-xs text-zinc-400 mt-1">
            {placementInsights.offerCount || 0} Offers from {placementInsights.totalApplications || 0} Applications
          </p>
        </Card>
      </div>

      {/* Detailed Breakdown: Topics & Difficulties */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Topic Mastery Breakdown */}
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-semibold text-zinc-100">Topic-by-Topic Distribution</h3>
              <p className="text-xs text-zinc-400">Complete curriculum coverage</p>
            </div>
            <button
              onClick={() => navigate('/questions')}
              className="text-xs text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1"
            >
              <span>Practice DSA</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {topicInsights.topics?.map((t) => (
              <div key={t.name} className="space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-medium text-zinc-200">{t.name}</span>
                  <span className="text-zinc-400 font-mono">
                    {t.completed} / {t.total} ({t.percentage}%)
                  </span>
                </div>
                <ProgressBar
                  value={t.completed}
                  max={t.total}
                  color={t.percentage >= 70 ? 'emerald' : t.percentage >= 30 ? 'amber' : 'rose'}
                  height="h-1.5"
                />
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5 flex flex-col justify-between">
          {/* Retention & Goals Summary Box */}
          <div className="mt-6 pt-4 border-t border-zinc-800/80 grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-zinc-950 rounded-lg border border-zinc-800">
              <span className="text-zinc-400 block mb-1">Spaced Repetition</span>
              <span className="text-base font-bold text-zinc-100 font-mono">
                {overview.dueRevisionsCount || 0} Due
              </span>
              <p className="text-[11px] text-zinc-500 mt-0.5">
                {overview.overdueRevisionsCount || 0} overdue
              </p>
            </div>

            <div className="p-3 bg-zinc-950 rounded-lg border border-zinc-800">
              <span className="text-zinc-400 block mb-1">Goal Completion</span>
              <span className="text-base font-bold text-emerald-400 font-mono">
                {goalInsights.goalCompletionRate || 0}%
              </span>
              <p className="text-[11px] text-zinc-500 mt-0.5">
                {goalInsights.completedGoals || 0}/{goalInsights.totalGoals || 0} finished
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
