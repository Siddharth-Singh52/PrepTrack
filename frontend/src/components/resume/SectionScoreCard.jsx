import { ProgressBar } from '../common/ProgressBar.jsx';

export const SectionScoreCard = ({ title, score = 0, feedback }) => {
  const getColor = (s) => {
    if (s >= 80) return 'emerald';
    if (s >= 60) return 'amber';
    return 'rose';
  };

  return (
    <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-xl p-4 space-y-2">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-zinc-200">{title}</h4>
        <span className="text-sm font-bold font-mono text-zinc-100">{score}/100</span>
      </div>
      <ProgressBar value={score} max={100} color={getColor(score)} height="h-1.5" />
      {feedback && <p className="text-xs text-zinc-400 mt-1 leading-relaxed">{feedback}</p>}
    </div>
  );
};
