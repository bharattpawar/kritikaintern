import { FiClock, FiMessageSquare } from 'react-icons/fi'
import { formatTimestamp, truncate } from '../utils/helpers'

function QuestionHistory({ history, onQuestionClick }) {
  if (history.length === 0) {
    return (
      <div className="p-8 text-center">
        <FiMessageSquare className="text-4xl text-gh-muted mx-auto mb-3 opacity-40" />
        <p className="text-sm text-gh-muted">No questions yet</p>
      </div>
    )
  }

  return (
    <div className="divide-y divide-gh-border">
      {history.map((item, index) => (
        <button
          key={index}
          onClick={() => onQuestionClick(item.question)}
          className="w-full text-left px-4 py-3 hover:bg-gh-bg transition-colors"
        >
          <p className="text-sm text-gh-text mb-1.5 line-clamp-2">
            {truncate(item.question, 100)}
          </p>
          <div className="flex items-center gap-1.5 text-xs text-gh-muted">
            <FiClock className="text-[11px]" />
            <span>{formatTimestamp(item.timestamp)}</span>
          </div>
        </button>
      ))}
    </div>
  )
}

export default QuestionHistory