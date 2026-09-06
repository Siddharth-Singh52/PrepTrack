import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Code2,
  Clock,
  Briefcase,
  Target,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
} from 'lucide-react';
import { dashboardService } from '../services/dashboardService.js';
import { StatsCard } from '../components/dashboard/StatsCard.jsx';
import { TopicMastery } from '../components/dashboard/TopicMastery.jsx';
import { RecentActivity } from '../components/dashboard/RecentActivity.jsx';
import { Card } from '../components/common/Card.jsx';
import { Button } from '../components/common/Button.jsx';
import { ProgressBar } from '../components/common/ProgressBar.jsx';
import { LoadingSpinner } from '../components/common/LoadingSpinner.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const res = await dashboardService.getDashboardSummary();
      if (res.success) {
        setData(res.summary);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load dashboard.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) return <LoadingSpinner text="Loading your preparation dashboard..." />;

  if (error) {
    return (
      <div className="p-6 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-sm">
        {error}
      </div>
    );
  }

  const { dsa, placement, revision, goals, insightsPreview, topTopics, recentActivity } = data || {};

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-linear-to-r from-zinc-900 via-zinc-900 to-zinc-950 border border-zinc-800 rounded-2xl p-6 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-400 mb-1 tracking-wide uppercase">
              <Sparkles className="w-4 h-4" />
              <span>Interview Readiness Score</span>
            </div>
            <h2 className="text-2xl font-bold text-zinc-100 tracking-tight">
              Welcome back, {user?.name || 'Candidate'}
            </h2>
            <p className="text-sm text-zinc-400 mt-1 max-w-xl">
              Targeting software Engineer positions at top tech firms. Keep your spaced revisions on track!
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <span className="text-3xl font-extrabold text-emerald-400 font-mono">
                {dsa?.overallPercentage || 0}%
              </span>
              <span className="block text-[11px] text-zinc-400 font-medium">DSA Syllabus Done</span>
            </div>

            <Button
              variant="primary"
              size="md"
              onClick={() => navigate('/questions')}
              icon={ArrowRight}
            >
              Resume Practice
            </Button>
          </div>
        </div>
      </div>

      {/* High Level Key Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="DSA Questions Solved"
          value={`${dsa?.solved || 0} / ${dsa?.totalQuestions || 0}`}
          subtitle={`${dsa?.inProgress || 0} in progress`}
          icon={Code2}
          color="emerald"
          onClick={() => navigate('/questions')}
          trend={
            <div className="flex items-center justify-between w-full text-[11px]">
              <span className="text-emerald-400 font-medium">E: {dsa?.easy?.solved || 0}</span>
              <span className="text-amber-400 font-medium">M: {dsa?.medium?.solved || 0}</span>
              <span className="text-rose-400 font-medium">H: {dsa?.hard?.solved || 0}</span>
            </div>
          }
        />

        <StatsCard
          title="Due for Revision"
          value={revision?.dueCount || 0}
          subtitle={`${revision?.totalInRotation || 0} in spaced rotation`}
          icon={Clock}
          color={revision?.dueCount > 0 ? 'amber' : 'emerald'}
          onClick={() => navigate('/revisions')}
          trend={
            revision?.dueCount > 0 ? (
              <span className="text-amber-400 font-medium flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" /> Due today for retention
              </span>
            ) : (
              <span className="text-emerald-400 font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> All revisions up to date
              </span>
            )
          }
        />

        <StatsCard
          title="Active Applications"
          value={placement?.activeApplications || 0}
          subtitle={`${placement?.totalApplications || 0} total applied`}
          icon={Briefcase}
          color="sky"
          onClick={() => navigate('/placements')}
          trend={
            <div className="flex items-center justify-between w-full text-[11px]">
              <span className="text-sky-400">{placement?.interviews || 0} Interviews</span>
              <span className="text-emerald-400 font-semibold">{placement?.offers || 0} Offers</span>
            </div>
          }
        />

        <StatsCard
          title="Preparation Goals"
          value={`${goals?.completed || 0} / ${goals?.total || 0}`}
          subtitle={`${goals?.percentage || 0}% completed`}
          icon={Target}
          color="purple"
          onClick={() => navigate('/goals')}
          trend={
            <ProgressBar
              value={goals?.completed || 0}
              max={goals?.total || 1}
              color="purple"
              height="h-1.5"
            />
          }
        />
      </div>

      {/* Middle Section: Preparation Insights Teaser */}
      {insightsPreview && insightsPreview.length > 0 && (
        <Card className="bg-zinc-900/60 border-zinc-800">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Lightbulb className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-semibold text-zinc-100">Smart Preparation Analytics</h3>
            </div>
            <button
              onClick={() => navigate('/insights')}
              className="text-xs text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1 cursor-pointer"
            >
              <span>View Deep Insights</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {insightsPreview.map((insight, idx) => (
              <div
                key={idx}
                className="p-3 bg-zinc-950/80 border border-zinc-800/80 rounded-lg text-xs text-zinc-300 flex items-start space-x-2"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                <p className="leading-relaxed">{insight}</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Bottom Grid: Topic Mastery & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TopicMastery topics={topTopics || []} />
        <RecentActivity activities={recentActivity || []} />
      </div>
    </div>
  );
};
