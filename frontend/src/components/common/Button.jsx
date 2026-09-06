
export const Button = ({
  children,
  type = 'button',
  variant = 'primary', // primary, secondary, outline, danger, ghost
  size = 'md', // sm, md, lg
  disabled = false,
  loading = false,
  onClick,
  className = '',
  id,
  icon: Icon,
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-950 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap cursor-pointer';

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-5 py-2.5 text-base gap-2.5',
  };

  const variantStyles = {
    primary: 'bg-emerald-500 hover:bg-emerald-600 text-zinc-950 font-semibold focus:ring-emerald-500',
    secondary: 'bg-zinc-800 hover:bg-zinc-700 text-zinc-100 border border-zinc-700/60 focus:ring-zinc-600',
    outline: 'border border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100 focus:ring-zinc-600',
    danger: 'bg-rose-500/15 border border-rose-500/30 text-rose-400 hover:bg-rose-500/25 focus:ring-rose-500',
    ghost: 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/60 focus:ring-zinc-600',
  };

  return (
    <button
      id={id}
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
    >
      {loading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
      ) : Icon ? (
        <Icon className="w-4 h-4 shrink-0" />
      ) : null}
      {children}
    </button>
  );
};
