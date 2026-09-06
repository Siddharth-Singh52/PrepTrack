
export const Card = ({ children, className = '', id, onClick }) => {
  return (
    <div
      id={id}
      onClick={onClick}
      className={`bg-zinc-900 border border-zinc-800/80 rounded-xl p-5 shadow-sm text-zinc-100 ${className}`}
    >
      {children}
    </div>
  );
};
