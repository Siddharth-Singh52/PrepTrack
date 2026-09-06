import { useState, useEffect } from 'react';
import { placementService } from '../services/placementService.js';
import { PlacementModal } from '../components/placement/PlacementModal.jsx';
import { LoadingSpinner } from '../components/common/LoadingSpinner.jsx';
import { EmptyState } from '../components/common/EmptyState.jsx';
import { Button } from '../components/common/Button.jsx';
import { Card } from '../components/common/Card.jsx';
import { Badge } from '../components/common/Badge.jsx';
import {
  Briefcase,
  Plus,
  Search,
  ExternalLink,
  Calendar,
  DollarSign,
  Edit2,
  Trash2,
  LayoutGrid,
  List,
} from 'lucide-react';

export const PlacementTracker = () => {
  const [placements, setPlacements] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('list'); // list or kanban

  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [jobTypeFilter, setJobTypeFilter] = useState('All');

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlacement, setEditingPlacement] = useState(null);

  const fetchPlacements = async () => {
    try {
      setLoading(true);
      const res = await placementService.getPlacements({
        search,
        status: statusFilter,
        jobType: jobTypeFilter,
      });
      if (res.success) {
        setPlacements(res.placements);
        setAnalytics(res.analytics);
      }
    } catch (err) {
      console.error('Failed to fetch placements:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlacements();
  }, [search, statusFilter, jobTypeFilter]);

  const handleSavePlacement = async (formData) => {
    if (editingPlacement) {
      await placementService.updatePlacement(editingPlacement._id, formData);
    } else {
      await placementService.createPlacement(formData);
    }
    fetchPlacements();
  };

  const handleDeletePlacement = async (e, id) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this job application?')) {
      try {
        await placementService.deletePlacement(id);
        fetchPlacements();
      } catch (err) {
        console.error('Failed to delete placement:', err);
      }
    }
  };

  const handleQuickStatusUpdate = async (e, id, nextStatus) => {
    e.stopPropagation();
    try {
      await placementService.updatePlacement(id, { status: nextStatus });
      fetchPlacements();
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'Offer':
        return 'success';
      case 'Interview Scheduled':
      case 'Technical Interview':
      case 'HR Interview':
        return 'warning';
      case 'Online Assessment':
      case 'Applied':
        return 'info';
      case 'Rejected':
      case 'Withdrawn':
        return 'danger';
      default:
        return 'default';
    }
  };

  const kanbanColumns = [
    { title: 'Applied', status: 'Applied' },
    { title: 'Online Assessment', status: 'Online Assessment' },
    { title: 'Technical Interview', status: 'Technical Interview' },
    { title: 'HR Interview', status: 'HR Interview' },
    { title: 'Offer', status: 'Offer' },
    { title: 'Rejected', status: 'Rejected' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-zinc-100 tracking-tight">Placement & Job Tracker</h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Organize recruitment pipelines, interview dates, and offer letters
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => {
            setEditingPlacement(null);
            setIsModalOpen(true);
          }}
          icon={Plus}
        >
          Add Job Application
        </Button>
      </div>

      {/* Analytics Summary Bar */}
      {analytics && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="p-3.5 bg-zinc-900 border border-zinc-800 rounded-xl">
            <span className="text-xs text-zinc-400">Total Applied</span>
            <p className="text-xl font-bold text-zinc-100 font-mono mt-0.5">{analytics.total}</p>
          </div>
          <div className="p-3.5 bg-zinc-900 border border-zinc-800 rounded-xl">
            <span className="text-xs text-zinc-400">Active Pipelines</span>
            <p className="text-xl font-bold text-sky-400 font-mono mt-0.5">{analytics.active}</p>
          </div>
          <div className="p-3.5 bg-zinc-900 border border-zinc-800 rounded-xl">
            <span className="text-xs text-zinc-400">Interviews</span>
            <p className="text-xl font-bold text-amber-400 font-mono mt-0.5">{analytics.interviews}</p>
          </div>
          <div className="p-3.5 bg-zinc-900 border border-zinc-800 rounded-xl">
            <span className="text-xs text-zinc-400">Offers</span>
            <p className="text-xl font-bold text-emerald-400 font-mono mt-0.5">{analytics.offers}</p>
          </div>
          <div className="p-3.5 bg-zinc-900 border border-zinc-800 rounded-xl">
            <span className="text-xs text-zinc-400">Rejections</span>
            <p className="text-xl font-bold text-rose-400 font-mono mt-0.5">{analytics.rejections}</p>
          </div>
          <div className="p-3.5 bg-zinc-900 border border-zinc-800 rounded-xl">
            <span className="text-xs text-zinc-400">Success Rate</span>
            <p className="text-xl font-bold text-emerald-400 font-mono mt-0.5">
              {analytics.successRate}%
            </p>
          </div>
        </div>
      )}

      {/* Filter and View Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-zinc-900 border border-zinc-800/80 p-3 rounded-xl">
        <div className="flex flex-1 items-center gap-3 max-w-lg">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              placeholder="Search companies, roles, locations..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-emerald-500/50"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-300 focus:outline-none focus:border-emerald-500/50"
          >
            <option value="All">All Status</option>
            <option value="Applied">Applied</option>
            <option value="Online Assessment">Online Assessment</option>
            <option value="Technical Interview">Technical Interview</option>
            <option value="HR Interview">HR Interview</option>
            <option value="Offer">Offer</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

        {/* List / Kanban toggle */}
        <div className="flex items-center space-x-1 bg-zinc-950 p-1 rounded-lg border border-zinc-800 shrink-0">
          <button
            onClick={() => setViewMode('list')}
            className={`p-1.5 rounded text-xs font-medium flex items-center gap-1.5 cursor-pointer ${
              viewMode === 'list'
                ? 'bg-zinc-800 text-zinc-100'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <List className="w-4 h-4" />
            <span>List</span>
          </button>
          <button
            onClick={() => setViewMode('kanban')}
            className={`p-1.5 rounded text-xs font-medium flex items-center gap-1.5 cursor-pointer ${
              viewMode === 'kanban'
                ? 'bg-zinc-800 text-zinc-100'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
            <span>Kanban</span>
          </button>
        </div>
      </div>

      {/* Main Content View */}
      {loading ? (
        <LoadingSpinner text="Loading placement tracker..." />
      ) : placements.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title="No job applications logged yet"
          description="Start tracking your job search applications to organize your hiring stages and interviews."
          actionLabel="Add First Application"
          onAction={() => {
            setEditingPlacement(null);
            setIsModalOpen(true);
          }}
        />
      ) : viewMode === 'list' ? (
        /* List View */
        <div className="space-y-3">
          {placements.map((p) => (
            <div
              key={p._id}
              onClick={() => {
                setEditingPlacement(p);
                setIsModalOpen(true);
              }}
              className="bg-zinc-900 border border-zinc-800/80 hover:border-zinc-700/80 rounded-xl p-4 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer"
            >
              <div className="space-y-1 min-w-0 flex-1">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h4 className="text-base font-semibold text-zinc-100">{p.company}</h4>
                  <Badge variant={getStatusBadgeVariant(p.status)} size="sm">
                    {p.status}
                  </Badge>
                  <span className="text-xs text-zinc-400 bg-zinc-800/80 px-2 py-0.5 rounded border border-zinc-700/50">
                    {p.jobType}
                  </span>
                </div>

                <p className="text-sm text-zinc-300 font-medium">{p.role}</p>

                <div className="flex items-center gap-3 text-xs text-zinc-400 flex-wrap">
                  {p.location && <span>{p.location}</span>}
                  {p.salary && (
                    <span className="text-emerald-400 font-mono flex items-center gap-0.5">
                      <DollarSign className="w-3 h-3" />
                      {p.salary}
                    </span>
                  )}
                  {p.interviewDate && (
                    <span className="text-amber-400 flex items-center gap-1 font-medium">
                      <Calendar className="w-3 h-3" />
                      Interview:{' '}
                      {new Date(p.interviewDate).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  )}
                </div>

                {p.notes && (
                  <p className="text-xs text-zinc-500 line-clamp-1 italic mt-1">{p.notes}</p>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 shrink-0">
                {p.applicationLink && (
                  <a
                    href={p.applicationLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="p-1.5 text-zinc-400 hover:text-zinc-200 bg-zinc-800/60 hover:bg-zinc-800 border border-zinc-700/50 rounded-lg transition-colors"
                    title="Open Job URL"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingPlacement(p);
                    setIsModalOpen(true);
                  }}
                  className="p-1.5 text-zinc-400 hover:text-zinc-200 bg-zinc-800/60 hover:bg-zinc-800 border border-zinc-700/50 rounded-lg transition-colors cursor-pointer"
                  title="Edit Application"
                >
                  <Edit2 className="w-4 h-4" />
                </button>

                <button
                  onClick={(e) => handleDeletePlacement(e, p._id)}
                  className="p-1.5 text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 rounded-lg transition-colors cursor-pointer"
                  title="Delete Application"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Kanban View */
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3 overflow-x-auto pb-4">
          {kanbanColumns.map((col) => {
            const items = placements.filter((p) => p.status === col.status);
            return (
              <div
                key={col.status}
                className="bg-zinc-950 border border-zinc-800 rounded-xl p-3 flex flex-col min-w-55"
              >
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-zinc-800">
                  <span className="text-xs font-semibold text-zinc-300">{col.title}</span>
                  <span className="text-xs font-mono bg-zinc-800 px-1.5 py-0.2 rounded text-zinc-400">
                    {items.length}
                  </span>
                </div>

                <div className="space-y-2.5 flex-1">
                  {items.map((p) => (
                    <div
                      key={p._id}
                      onClick={() => {
                        setEditingPlacement(p);
                        setIsModalOpen(true);
                      }}
                      className="bg-zinc-900 border border-zinc-800 hover:border-zinc-700 p-3 rounded-lg cursor-pointer transition-all space-y-1.5 shadow-xs"
                    >
                      <h5 className="text-xs font-bold text-zinc-100">{p.company}</h5>
                      <p className="text-xs text-zinc-300 truncate">{p.role}</p>
                      {p.interviewDate && (
                        <div className="text-[11px] text-amber-400 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>{new Date(p.interviewDate).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Placement Modal */}
      <PlacementModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSavePlacement}
        initialData={editingPlacement}
      />
    </div>
  );
};
