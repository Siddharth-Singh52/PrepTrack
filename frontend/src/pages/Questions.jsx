import { useState, useEffect } from 'react';
import { questionService } from '../services/questionService.js';
import { QuestionCard } from '../components/questions/QuestionCard.jsx';
import { QuestionFilters } from '../components/questions/QuestionFilters.jsx';
import { LoadingSpinner } from '../components/common/LoadingSpinner.jsx';
import { EmptyState } from '../components/common/EmptyState.jsx';
import { Button } from '../components/common/Button.jsx';
import { Modal } from '../components/common/Modal.jsx';
import { Code2, Plus, CheckCircle, Clock, CircleDot } from 'lucide-react';

export const Questions = () => {
  const [questions, setQuestions] = useState([]);
  const [stats, setStats] = useState({ total: 0, completed: 0, inProgress: 0, notStarted: 0 });
  const [loading, setLoading] = useState(true);

  // Filters state
  const [search, setSearch] = useState('');
  const [topic, setTopic] = useState('All');
  const [difficulty, setDifficulty] = useState('All');
  const [company, setCompany] = useState('All');
  const [status, setStatus] = useState('All');
  const [sort, setSort] = useState('title');

  // Add question modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newQuestion, setNewQuestion] = useState({
    title: '',
    topic: 'Arrays',
    difficulty: 'Medium',
    platform: 'LeetCode',
    link: '',
    companyTags: '',
    description: '',
  });
  const [addLoading, setAddLoading] = useState(false);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const res = await questionService.getQuestions({
        search,
        topic,
        difficulty,
        company,
        status,
        sort,
      });
      if (res.success) {
        setQuestions(res.questions);
        if (res.stats) setStats(res.stats);
      }
    } catch (err) {
      console.error('Failed to fetch questions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [search, topic, difficulty, company, status, sort]);

  const handleStatusChange = async (questionId, newStatus) => {
    try {
      // Optimistic update
      setQuestions((prev) =>
        prev.map((q) => (q._id === questionId ? { ...q, status: newStatus } : q))
      );
      await questionService.updateProgress(questionId, newStatus);
      fetchQuestions();
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const handleFavoriteToggle = async (questionId) => {
    try {
      setQuestions((prev) =>
        prev.map((q) => (q._id === questionId ? { ...q, favorite: !q.favorite } : q))
      );
      await questionService.toggleFavorite(questionId);
    } catch (err) {
      console.error('Failed to toggle favorite:', err);
    }
  };

  const handleResetFilters = () => {
    setSearch('');
    setTopic('All');
    setDifficulty('All');
    setCompany('All');
    setStatus('All');
    setSort('title');
  };

  const handleAddQuestionSubmit = async (e) => {
    e.preventDefault();
    if (!newQuestion.title.trim()) return;

    setAddLoading(true);
    try {
      await questionService.createQuestion(newQuestion);
      setIsAddModalOpen(false);
      setNewQuestion({
        title: '',
        topic: 'Arrays',
        difficulty: 'Medium',
        platform: 'LeetCode',
        link: '',
        companyTags: '',
        description: '',
      });
      fetchQuestions();
    } catch (err) {
      console.error('Failed to add question:', err);
    } finally {
      setAddLoading(false);
    }
  };

  const availableTopics = [
    'Arrays',
    'Strings',
    'Two Pointers',
    'Sliding Window',
    'Linked List',
    'Trees',
    'Graphs',
    'Dynamic Programming',
    'Backtracking',
    'Heap',
    'Stack & Queue',
    'Binary Search',
    'Trie',
  ];

  const availableCompanies = ['Google', 'Amazon', 'Microsoft', 'Meta', 'Uber', 'Apple', 'Netflix'];

  return (
    <div className="space-y-6">
      {/* Header & Stats Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-zinc-100 tracking-tight">DSA Problem Bank</h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Curated list of standard and company-specific coding interview questions
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => setIsAddModalOpen(true)}
          icon={Plus}
        >
          Add Custom Problem
        </Button>
      </div>

      {/* Progress pill bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-zinc-900 border border-zinc-800/80 p-3 rounded-xl">
        <div className="flex items-center space-x-2.5 px-2">
          <CircleDot className="w-4 h-4 text-zinc-400" />
          <div>
            <span className="text-xs text-zinc-400">Total</span>
            <p className="text-base font-bold text-zinc-100 font-mono">{stats.total}</p>
          </div>
        </div>

        <div className="flex items-center space-x-2.5 px-2 border-l border-zinc-800">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <div>
            <span className="text-xs text-zinc-400">Solved</span>
            <p className="text-base font-bold text-emerald-400 font-mono">{stats.completed}</p>
          </div>
        </div>

        <div className="flex items-center space-x-2.5 px-2 border-l border-zinc-800">
          <Clock className="w-4 h-4 text-amber-400" />
          <div>
            <span className="text-xs text-zinc-400">In Progress</span>
            <p className="text-base font-bold text-amber-400 font-mono">{stats.inProgress}</p>
          </div>
        </div>

        <div className="flex items-center space-x-2.5 px-2 border-l border-zinc-800">
          <CircleDot className="w-4 h-4 text-zinc-500" />
          <div>
            <span className="text-xs text-zinc-400">Not Started</span>
            <p className="text-base font-bold text-zinc-400 font-mono">{stats.notStarted}</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <QuestionFilters
        search={search}
        setSearch={setSearch}
        topic={topic}
        setTopic={setTopic}
        difficulty={difficulty}
        setDifficulty={setDifficulty}
        company={company}
        setCompany={setCompany}
        status={status}
        setStatus={setStatus}
        topics={availableTopics}
        companies={availableCompanies}
        onReset={handleResetFilters}
      />

      {/* Questions List */}
      {loading ? (
        <LoadingSpinner text="Filtering questions..." />
      ) : questions.length === 0 ? (
        <EmptyState
          icon={Code2}
          title="No questions match your filters"
          description="Try relaxing your search query or reset filters to see all available DSA problems."
          actionLabel="Reset Filters"
          onAction={handleResetFilters}
        />
      ) : (
        <div className="space-y-2.5">
          {questions.map((q) => (
            <QuestionCard
              key={q._id}
              question={q}
              onStatusChange={handleStatusChange}
              onFavoriteToggle={handleFavoriteToggle}
            />
          ))}
        </div>
      )}

      {/* Add Custom Question Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add Custom DSA Problem"
      >
        <form onSubmit={handleAddQuestionSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1">Problem Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. Trapping Rain Water"
              value={newQuestion.title}
              onChange={(e) => setNewQuestion({ ...newQuestion, title: e.target.value })}
              className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-emerald-500/50"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">Topic</label>
              <select
                value={newQuestion.topic}
                onChange={(e) => setNewQuestion({ ...newQuestion, topic: e.target.value })}
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-zinc-200 focus:outline-none focus:border-emerald-500/50"
              >
                {availableTopics.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">Difficulty</label>
              <select
                value={newQuestion.difficulty}
                onChange={(e) => setNewQuestion({ ...newQuestion, difficulty: e.target.value })}
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-zinc-200 focus:outline-none focus:border-emerald-500/50"
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">Platform</label>
              <select
                value={newQuestion.platform}
                onChange={(e) => setNewQuestion({ ...newQuestion, platform: e.target.value })}
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-zinc-200 focus:outline-none focus:border-emerald-500/50"
              >
                <option value="LeetCode">LeetCode</option>
                <option value="HackerRank">HackerRank</option>
                <option value="GeeksforGeeks">GeeksforGeeks</option>
                <option value="Codeforces">Codeforces</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1">Problem URL / Link</label>
            <input
              type="url"
              placeholder="https://leetcode.com/problems/..."
              value={newQuestion.link}
              onChange={(e) => setNewQuestion({ ...newQuestion, link: e.target.value })}
              className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-emerald-500/50"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1">Company Tags (comma separated)</label>
            <input
              type="text"
              placeholder="Google, Amazon, Meta"
              value={newQuestion.companyTags}
              onChange={(e) => setNewQuestion({ ...newQuestion, companyTags: e.target.value })}
              className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-emerald-500/50"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1">Description / Key Notes</label>
            <textarea
              rows="3"
              placeholder="Summary of problem statement or approach hints..."
              value={newQuestion.description}
              onChange={(e) => setNewQuestion({ ...newQuestion, description: e.target.value })}
              className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-emerald-500/50 resize-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-zinc-800">
            <Button variant="secondary" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={addLoading}>
              Save Problem
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
