import { Card } from '../common/Card.jsx';
import { ProgressBar } from '../common/ProgressBar.jsx';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export const TopicMastery = ({ topics = [] }) => {
  const navigate = useNavigate();

  return (
    <Card className="h-full flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-semibold text-zinc-100">Topic Mastery</h3>
            <p className="text-xs text-zinc-400">DSA problem solving breakdown</p>
          </div>
          <button
            onClick={() => navigate('/questions')}
            className="text-xs text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1 cursor-pointer"
          >
            <span>All Topics</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-3.5">
          {topics.map((t) => (
            <div key={t.name} className="space-y-1">
              <div className="flex justify-between items-center text-xs">
                <span className="font-medium text-zinc-200">{t.name}</span>
                <span className="text-zinc-400">
                  {t.completed}/{t.total} ({t.percentage}%)
                </span>
              </div>
              <ProgressBar
                value={t.completed}
                max={t.total}
                color={t.percentage >= 70 ? 'emerald' : t.percentage >= 35 ? 'amber' : 'sky'}
                height="h-1.5"
              />
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};
