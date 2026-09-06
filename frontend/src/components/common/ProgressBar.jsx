
export const ProgressBar = ({
  value = 0,
  max = 100,
  color = 'emerald', // emerald, amber, rose, sky, purple
  showLabel = false,
  height = 'h-2',
  className = '',
}) => {
  const percentage = Math.min(100, Math.max(0, max > 0 ? Math.round((value / max) * 100) : 0));

  const colorMap = {
    emerald: 'bg-emerald-500',
    amber: 'bg-amber-500',
    rose: 'bg-rose-500',
    sky: 'bg-sky-500',
    purple: 'bg-indigo-500',
  };

  const barColor = colorMap[color] || colorMap.emerald;

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between items-center text-xs text-zinc-400 mb-1.5 font-medium">
          <span>{value} / {max}</span>
          <span>{percentage}%</span>
        </div>
      )}
      <div className={`w-full bg-zinc-800 rounded-full overflow-hidden ${height}`}>
        <div
          className={`${barColor} ${height} rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
