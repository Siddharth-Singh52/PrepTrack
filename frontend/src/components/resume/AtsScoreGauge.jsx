
export const AtsScoreGauge = ({ score = 0, size = 180 }) => {
  const normalizedScore = Math.min(100, Math.max(0, Math.round(score)));
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (normalizedScore / 100) * circumference;

  let color = '#10b981'; // emerald-500
  let gradeText = 'Excellent ATS Match';
  let badgeColor = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';

  if (normalizedScore < 50) {
    color = '#f43f5e'; // rose-500
    gradeText = 'Needs Major Optimization';
    badgeColor = 'bg-rose-500/10 text-rose-400 border-rose-500/30';
  } else if (normalizedScore < 75) {
    color = '#f59e0b'; // amber-500
    gradeText = 'Good Foundation, Some Gaps';
    badgeColor = 'bg-amber-500/10 text-amber-400 border-amber-500/30';
  }

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="w-full h-full -rotate-90" viewBox={`0 0 ${size} ${size}`}>
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="transparent"
            className="text-zinc-800"
          />
          {/* Active progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-4xl font-extrabold tracking-tight text-zinc-100 font-mono">
            {normalizedScore}
          </span>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
            ATS Score
          </span>
        </div>
      </div>

      <div className={`mt-3 px-3 py-1 rounded-full text-xs font-semibold border ${badgeColor}`}>
        {gradeText}
      </div>
    </div>
  );
};
