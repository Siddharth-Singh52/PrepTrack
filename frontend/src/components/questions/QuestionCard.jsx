import { ExternalLink, Star, CheckCircle, Clock, ArrowRight } from 'lucide-react';
import { Badge } from '../common/Badge.jsx';
import { useNavigate } from 'react-router-dom';

export const QuestionCard = ({
  question,
  onStatusChange,
  onFavoriteToggle,
}) => {
  const navigate = useNavigate();

  const handleStatusClick = (e, nextStatus) => {
    e.stopPropagation();
    onStatusChange(question._id, nextStatus);
  };

  const handleFavClick = (e) => {
    e.stopPropagation();
    onFavoriteToggle(question._id);
  };

  const handleExternalClick = (e) => {
    e.stopPropagation();
    if (question.link) {
      window.open(question.link, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div
      onClick={() => navigate(`/questions/${question._id}`)}
      className="bg-zinc-900 border border-zinc-800/80 hover:border-zinc-700/80 rounded-xl p-4 transition-all duration-150 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer group"
    >
      {/* Left side info */}
      <div className="flex items-start space-x-3.5 flex-1 min-w-0">
        <button
          onClick={handleFavClick}
          className={`p-1.5 rounded-lg border transition-colors cursor-pointer mt-0.5 shrink-0 ${
            question.favorite
              ? 'text-amber-400 border-amber-500/30 bg-amber-500/10'
              : 'text-zinc-500 border-zinc-800 hover:text-zinc-300 hover:bg-zinc-800'
          }`}
          title={question.favorite ? 'Favorited' : 'Add to Favorites'}
        >
          <Star className={`w-4 h-4 ${question.favorite ? 'fill-amber-400' : ''}`} />
        </button>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h4 className="text-sm font-semibold text-zinc-100 group-hover:text-emerald-400 transition-colors truncate">
              {question.title}
            </h4>

            {question.link && (
              <button
                onClick={handleExternalClick}
                className="text-zinc-500 hover:text-zinc-300 p-0.5 transition-colors cursor-pointer"
                title="Open LeetCode problem"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 flex-wrap text-xs text-zinc-400">
            <span className="font-medium text-zinc-300 bg-zinc-800/80 px-2 py-0.5 rounded border border-zinc-700/50">
              {question.topic}
            </span>
            <Badge variant={question.difficulty} size="sm">
              {question.difficulty}
            </Badge>

            {question.companyTags && question.companyTags.length > 0 && (
              <span className="text-[11px] text-zinc-500 truncate max-w-xs">
                {question.companyTags.slice(0, 3).join(', ')}
                {question.companyTags.length > 3 ? ` +${question.companyTags.length - 3}` : ''}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Right side actions & status */}
      <div className="flex items-center justify-between sm:justify-end gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-zinc-800/50">
        <div className="flex items-center gap-1.5">
          <button
            onClick={(e) => handleStatusClick(e, question.status === 'Completed' ? 'Not Started' : 'Completed')}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border flex items-center gap-1.5 transition-colors cursor-pointer ${
              question.status === 'Completed'
                ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                : 'bg-zinc-800/60 border-zinc-700/50 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
            }`}
          >
            <CheckCircle className="w-3.5 h-3.5" />
            <span>{question.status === 'Completed' ? 'Solved' : 'Mark Solved'}</span>
          </button>

          <button
            onClick={(e) => handleStatusClick(e, question.status === 'In Progress' ? 'Not Started' : 'In Progress')}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border flex items-center gap-1.5 transition-colors cursor-pointer ${
              question.status === 'In Progress'
                ? 'bg-amber-500/15 border-amber-500/30 text-amber-400'
                : 'bg-zinc-800/60 border-zinc-700/50 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>{question.status === 'In Progress' ? 'In Progress' : 'In Progress'}</span>
          </button>
        </div>

        <button className="text-zinc-500 group-hover:text-zinc-300 p-1 pl-2">
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
