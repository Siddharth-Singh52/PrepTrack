
export const LoadingSpinner = ({ text = 'Loading...', size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-7 h-7 border-2',
    lg: 'w-10 h-10 border-3',
  };

  return (
    <div className="flex flex-col items-center justify-center p-12 space-y-3">
      <div
        className={`${sizeClasses[size]} border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin`}
      />
      {text && <p className="text-sm font-medium text-zinc-400">{text}</p>}
    </div>
  );
};
