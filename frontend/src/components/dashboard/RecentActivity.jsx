import { Card } from '../common/Card.jsx';
import { CheckCircle2, Clock, Briefcase } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const RecentActivity = ({ activities = [] }) => {
  const navigate = useNavigate();

  const getIcon = (type) => {
    switch (type) {
      case 'dsa_solved':
        return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
      case 'revision':
        return <Clock className="w-4 h-4 text-amber-400" />;
      case 'placement':
        return <Briefcase className="w-4 h-4 text-sky-400" />;
      default:
        return <CheckCircle2 className="w-4 h-4 text-zinc-400" />;
    }
  };

  const formatTime = (ts) => {
    if (!ts) return 'Just now';
    const date = new Date(ts);
    const diffHours = Math.round((Date.now() - date.getTime()) / (1000 * 60 * 60));
    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    const days = Math.round(diffHours / 24);
    return `${days}d ago`;
  };

  return (
    <Card className="h-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-semibold text-zinc-100">Recent Activity</h3>
          <p className="text-xs text-zinc-400">Latest preparation milestones</p>
        </div>
      </div>

      {activities.length === 0 ? (
        <div className="text-center py-8 text-zinc-500 text-sm">
          No recent activity yet. Start solving problems or adding job applications!
        </div>
      ) : (
        <div className="divide-y divide-zinc-800/60">
          {activities.map((act, index) => (
            <div key={index} className="py-3 flex items-start justify-between group">
              <div className="flex items-start space-x-3">
                <div className="mt-0.5 w-7 h-7 rounded-lg bg-zinc-800/80 border border-zinc-700/50 flex items-center justify-center shrink-0">
                  {getIcon(act.type)}
                </div>
                <div>
                  <p className="text-sm font-medium text-zinc-200">{act.title}</p>
                  <p className="text-xs text-zinc-400">{act.detail}</p>
                </div>
              </div>
              <span className="text-[11px] text-zinc-500 font-mono whitespace-nowrap ml-2">
                {formatTime(act.timestamp)}
              </span>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};
