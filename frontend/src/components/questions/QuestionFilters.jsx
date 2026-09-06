import { Search, RotateCcw } from 'lucide-react';

export const QuestionFilters = ({
  search,
  setSearch,
  topic,
  setTopic,
  difficulty,
  setDifficulty,
  company,
  setCompany,
  status,
  setStatus,
  topics = [],
  companies = [],
  onReset,
}) => {
  return (
    <div className="bg-zinc-900 border border-zinc-800/80 rounded-xl p-4 space-y-3 mb-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {/* Search Input */}
        <div className="relative lg:col-span-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Search problems, topics, companies..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-emerald-500/50"
          />
        </div>

        {/* Topic Filter */}
        <div>
          <select
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-zinc-300 focus:outline-none focus:border-emerald-500/50"
          >
            <option value="All">All Topics</option>
            {topics.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        {/* Difficulty Filter */}
        <div>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-zinc-300 focus:outline-none focus:border-emerald-500/50"
          >
            <option value="All">All Difficulties</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>

        {/* Status Filter */}
        <div>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-zinc-300 focus:outline-none focus:border-emerald-500/50"
          >
            <option value="All">All Statuses</option>
            <option value="Completed">Solved</option>
            <option value="In Progress">In Progress</option>
            <option value="Not Started">Not Started</option>
          </select>
        </div>
      </div>

      {/* Secondary filter row for company tags & reset */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-zinc-800/60">
        <div className="flex items-center gap-2 overflow-x-auto py-1">
          <span className="text-xs font-medium text-zinc-400 shrink-0">Company:</span>
          <button
            onClick={() => setCompany('All')}
            className={`px-2.5 py-1 text-xs rounded-md border transition-colors cursor-pointer shrink-0 ${
              company === 'All'
                ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400 font-semibold'
                : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:text-zinc-200'
            }`}
          >
            All
          </button>
          {companies.map((c) => (
            <button
              key={c}
              onClick={() => setCompany(c)}
              className={`px-2.5 py-1 text-xs rounded-md border transition-colors cursor-pointer shrink-0 ${
                company === c
                  ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400 font-semibold'
                  : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <button
          onClick={onReset}
          className="text-xs text-zinc-400 hover:text-zinc-200 flex items-center gap-1 px-2 py-1 rounded hover:bg-zinc-800 transition-colors cursor-pointer shrink-0"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset Filters</span>
        </button>
      </div>
    </div>
  );
};
