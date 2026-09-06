
export const Badge = ({ children, variant = 'default', size = 'md', className = '', id }) => {
  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs font-medium',
    lg: 'px-3 py-1.5 text-sm font-medium',
  };

  const variantStyles = {
    default: 'bg-zinc-800 text-zinc-300 border border-zinc-700/60',
    success: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
    warning: 'bg-amber-500/15 text-amber-400 border border-amber-500/30',
    danger: 'bg-rose-500/15 text-rose-400 border border-rose-500/30',
    info: 'bg-sky-500/15 text-sky-400 border border-sky-500/30',
    purple: 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/30',
    // Difficulty specific
    Easy: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
    Medium: 'bg-amber-500/15 text-amber-400 border border-amber-500/30',
    Hard: 'bg-rose-500/15 text-rose-400 border border-rose-500/30',
    // Status specific
    Completed: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
    'In Progress': 'bg-amber-500/15 text-amber-400 border border-amber-500/30',
    'Not Started': 'bg-zinc-800 text-zinc-400 border border-zinc-700/60',
  };

  const chosenVariant = variantStyles[variant] || variantStyles.default;

  return (
    <span
      id={id}
      className={`inline-flex items-center rounded-md whitespace-nowrap ${sizeStyles[size]} ${chosenVariant} ${className}`}
    >
      {children}
    </span>
  );
};
