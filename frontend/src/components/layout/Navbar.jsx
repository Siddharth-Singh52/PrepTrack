import { Menu, Code2, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { Button } from '../common/Button.jsx';

export const Navbar = ({ onOpenSidebar, title }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 md:px-6 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800/80">
      <div className="flex items-center space-x-3">
        <button
          onClick={onOpenSidebar}
          className="p-2 text-zinc-400 hover:text-zinc-100 lg:hidden rounded-lg hover:bg-zinc-900 focus:outline-none"
          aria-label="Toggle sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-lg font-semibold text-zinc-100 tracking-tight">{title || 'Dashboard'}</h1>
        </div>
      </div>

      <div className="flex items-center space-x-3">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => navigate('/questions')}
          icon={Code2}
          className="hidden sm:inline-flex"
        >
          Solve DSA
        </Button>

        <Button
          variant="primary"
          size="sm"
          onClick={() => navigate('/placements')}
          icon={Plus}
        >
          Add Job
        </Button>

        <div className="w-px h-5 bg-zinc-800 mx-1 hidden sm:block" />

        <div
          onClick={() => navigate('/profile')}
          className="flex items-center space-x-2 pl-1 cursor-pointer group"
          title="View Profile"
        >
          <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700/80 flex items-center justify-center text-xs font-semibold text-emerald-400 group-hover:border-emerald-500/50 transition-colors">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
        </div>
      </div>
    </header>
  );
};
