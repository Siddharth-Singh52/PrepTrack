import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Code2,
  Clock,
  Briefcase,
  Target,
  BarChart3,
  FileText,
  User,
  LogOut,
  X,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';

export const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/questions', label: 'DSA Tracker', icon: Code2 },
    { to: '/revisions', label: 'Revision Center', icon: Clock },
    { to: '/placements', label: 'Placement Tracker', icon: Briefcase },
    { to: '/goals', label: 'Goals', icon: Target },
    { to: '/insights', label: 'Insights', icon: BarChart3 },
    { to: '/resume-analyzer', label: 'Resume Analyzer', icon: FileText },
    { to: '/profile', label: 'Profile', icon: User },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-xs lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        id="app-sidebar"
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-zinc-950 border-r border-zinc-800/80 flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between h-16 px-5 border-b border-zinc-800/80">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <img
                src="/logo.png"
                alt="PrepTrack logo"
                className="w-full h-full rounded-lg object-contain"
                onError={(event) => {
                  event.currentTarget.onerror = null;
                  event.currentTarget.src = '/logo.svg';
                }}
              />
            </div>
            <div>
              <span className="text-base font-bold text-zinc-100 tracking-tight">PrepTrack</span>
              <span className="block text-[10px] text-zinc-400 font-medium tracking-wide uppercase">Interview Suite</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 text-zinc-400 hover:text-zinc-100 lg:hidden rounded-lg hover:bg-zinc-900"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => {
                  if (window.innerWidth < 1024) onClose();
                }}
                className={({ isActive }) =>
                  `flex items-center px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold'
                      : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900'
                  }`
                }
              >
                <Icon className="w-4 h-4 mr-3 shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </div>

        {/* User Card & Logout */}
        <div className="p-3 border-t border-zinc-800/80">
          <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-zinc-900/60 border border-zinc-800/60 mb-2">
            <div className="flex items-center space-x-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-xs font-bold text-emerald-300 shrink-0">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-semibold text-zinc-200 truncate">{user?.name || 'Candidate'}</p>
                <p className="text-[11px] text-zinc-400 truncate">{user?.targetRole || 'Software Engineer'}</p>
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center px-3 py-2 rounded-lg text-xs font-medium text-rose-400 hover:bg-rose-500/10 hover:border-rose-500/20 border border-transparent transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5 mr-2" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};
