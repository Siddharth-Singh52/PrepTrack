import { useState, useEffect } from 'react';
import { goalService } from '../services/goalService.js';
import { GoalModal } from '../components/goals/GoalModal.jsx';
import { Card } from '../components/common/Card.jsx';
import { Button } from '../components/common/Button.jsx';
import { ProgressBar } from '../components/common/ProgressBar.jsx';
import { LoadingSpinner } from '../components/common/LoadingSpinner.jsx';
import { EmptyState } from '../components/common/EmptyState.jsx';
import {
  Target,
  Plus,
  CheckCircle2,
  Calendar,
  Trash2,
  Edit2,
  Sparkles,
} from 'lucide-react';

export const Goals = () => {
  const [goals, setGoals] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState('All');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);

  const fetchGoals = async () => {
    try {
      setLoading(true);
      const res = await goalService.getGoals();
      if (res.success) {
        setGoals(res.goals);
        setStats(res.stats);
      }
    } catch (err) {
      console.error('Failed to load goals:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const handleSaveGoal = async (formData) => {
    if (editingGoal) {
      await goalService.updateGoal(editingGoal._id, formData);
    } else {
      await goalService.createGoal(formData);
    }
    fetchGoals();
  };

  const handleDeleteGoal = async (e, id) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this preparation goal?')) {
      try {
        await goalService.deleteGoal(id);
        fetchGoals();
      } catch (err) {
        console.error('Failed to delete goal:', err);
      }
    }
  };

  const filteredGoals =
    filterCategory === 'All' ? goals : goals.filter((g) => g.category === filterCategory);

  const categories = ['All', 'DSA', 'Company', 'Revision', 'Applications', 'Resume'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-zinc-100 tracking-tight">Preparation Goals</h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Set and track milestone targets with automatic progress syncing
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => {
            setEditingGoal(null);
            setIsModalOpen(true);
          }}
          icon={Plus}
        >
          Create Goal
        </Button>
      </div>

      {/* Goal Statistics Overview */}
      {stats && (
        <Card className="p-5 bg-linear-to-r from-zinc-900 via-zinc-900 to-zinc-950 border-zinc-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-400 mb-1 tracking-wide uppercase">
                <Sparkles className="w-4 h-4" />
                <span>Goal Velocity</span>
              </div>
              <h3 className="text-lg font-bold text-zinc-100">
                {stats.completedCount} of {stats.total} Milestones Achieved
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                Keep hitting your weekly milestones to maintain competitive interview shape.
              </p>
            </div>

            <div className="w-full sm:w-52 text-right">
              <div className="text-2xl font-bold font-mono text-emerald-400 mb-1">
                {stats.completionRate}%
              </div>
              <ProgressBar
                value={stats.completedCount}
                max={stats.total || 1}
                color="emerald"
                height="h-2"
              />
            </div>
          </div>
        </Card>
      )}

      {/* Category Filter Pills */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`px-3 py-1.5 text-xs rounded-lg border font-medium transition-colors cursor-pointer shrink-0 ${
              filterCategory === cat
                ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Goals Grid */}
      {loading ? (
        <LoadingSpinner text="Synchronizing goal metrics..." />
      ) : filteredGoals.length === 0 ? (
        <EmptyState
          icon={Target}
          title="No goals found"
          description="Create customized preparation targets to keep yourself motivated and structured."
          actionLabel="Create Goal"
          onAction={() => {
            setEditingGoal(null);
            setIsModalOpen(true);
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredGoals.map((g) => {
            const isDone = g.completed || g.currentValue >= g.targetValue;
            return (
              <Card
                key={g._id}
                className={`p-5 transition-all relative ${
                  isDone ? 'border-emerald-500/30 bg-emerald-500/5' : 'bg-zinc-900'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <span className="text-xs font-semibold text-zinc-400 bg-zinc-800/80 px-2 py-0.5 rounded border border-zinc-700/50">
                      {g.category}
                    </span>
                    <h4 className="text-base font-bold text-zinc-100 mt-2">{g.title}</h4>
                    {g.description && (
                      <p className="text-xs text-zinc-400 mt-1 leading-relaxed">{g.description}</p>
                    )}
                  </div>

                  <div className="flex items-center space-x-1 shrink-0">
                    <button
                      onClick={() => {
                        setEditingGoal(g);
                        setIsModalOpen(true);
                      }}
                      className="p-1.5 text-zinc-400 hover:text-zinc-200 rounded-lg hover:bg-zinc-800 transition-colors"
                      title="Edit Goal"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={(e) => handleDeleteGoal(e, g._id)}
                      className="p-1.5 text-rose-400 hover:text-rose-300 rounded-lg hover:bg-rose-500/10 transition-colors"
                      title="Delete Goal"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="space-y-1.5 my-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-mono text-zinc-300 font-semibold">
                      {g.currentValue} / {g.targetValue}
                    </span>
                    <span className="font-mono text-emerald-400 font-bold">{g.percentage}%</span>
                  </div>
                  <ProgressBar
                    value={g.currentValue}
                    max={g.targetValue}
                    color={isDone ? 'emerald' : 'sky'}
                    height="h-2"
                  />
                </div>

                {/* Footer status */}
                <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between text-xs text-zinc-400">
                  {g.deadline ? (
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                      Target: {new Date(g.deadline).toLocaleDateString()}
                    </span>
                  ) : (
                    <span>Ongoing Target</span>
                  )}

                  {isDone ? (
                    <span className="text-emerald-400 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Completed
                    </span>
                  ) : (
                    <span className="text-zinc-400">In Progress</span>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Goal Modal */}
      <GoalModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveGoal}
        initialData={editingGoal}
      />
    </div>
  );
};
