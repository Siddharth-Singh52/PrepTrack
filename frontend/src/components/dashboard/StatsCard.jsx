import { Card } from '../common/Card.jsx';

export const StatsCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  color = 'emerald',
  onClick,
}) => {
  const colorStyles = {
    emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    amber: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    rose: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    sky: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
    purple: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
  };

  return (
    <Card
      onClick={onClick}
      className={`relative overflow-hidden transition-all ${
        onClick ? 'cursor-pointer hover:border-zinc-700 hover:bg-zinc-900/80' : ''
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-zinc-400 tracking-wide">{title}</p>
          <h3 className="text-2xl font-bold text-zinc-100 mt-1 tracking-tight">{value}</h3>
          {subtitle && <p className="text-xs text-zinc-500 mt-1">{subtitle}</p>}
        </div>

        {Icon && (
          <div
            className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 ${
              colorStyles[color] || colorStyles.emerald
            }`}
          >
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      {trend && (
        <div className="mt-3 pt-3 border-t border-zinc-800/80 flex items-center text-xs text-zinc-400">
          {trend}
        </div>
      )}
    </Card>
  );
};
