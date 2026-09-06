import { useNavigate } from 'react-router-dom';
import { Button } from '../components/common/Button.jsx';
import { ArrowLeft, Sparkles } from 'lucide-react';

export const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-4 text-center">
      <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4">
        <Sparkles className="w-7 h-7" />
      </div>
      <h1 className="text-4xl font-extrabold text-zinc-100 font-mono tracking-tight">404</h1>
      <h2 className="text-lg font-semibold text-zinc-200 mt-2">Page Not Found</h2>
      <p className="text-sm text-zinc-400 mt-1 max-w-sm">
        The interview preparation resource or page you are looking for does not exist.
      </p>
      <div className="mt-6">
        <Button variant="primary" onClick={() => navigate('/dashboard')} icon={ArrowLeft}>
          Return to Dashboard
        </Button>
      </div>
    </div>
  );
};
