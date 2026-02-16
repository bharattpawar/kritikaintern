import { useState } from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { FiCopy, FiCheck, FiExternalLink } from 'react-icons/fi'
import { getLanguageFromFilePath, copyToClipboard } from '../utils/helpers'

function CodeSnippet({ reference }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    const success = await copyToClipboard(reference.code)
    if (success) {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="border border-gh-border rounded-md overflow-hidden bg-gh-canvas">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 bg-gh-bg border-b border-gh-border">
        <div className="flex items-center gap-2 text-xs font-mono text-gh-muted">
          <span>{reference.filePath}</span>
          {reference.lineStart && reference.lineEnd && (
            <span className="px-2 py-0.5 bg-gh-canvas rounded text-[11px]">
              L{reference.lineStart}–L{reference.lineEnd}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="p-1.5 hover:bg-gh-canvas rounded transition-colors"
            title="Copy code"
          >
            {copied ? (
              <FiCheck className="text-green-600 text-sm" />
            ) : (
              <FiCopy className="text-gh-muted text-sm" />
            )}
          </button>
          {reference.fullFileUrl && (
            <a
              href={reference.fullFileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 hover:bg-gh-canvas rounded transition-colors"
              title="View full file"
            >
              <FiExternalLink className="text-gh-muted text-sm" />
            </a>
          )}
        </div>
      </div>

      {/* Code */}
      <div className="code-editor">
        <SyntaxHighlighter
          language={getLanguageFromFilePath(reference.filePath)}
          style={vscDarkPlus}
          showLineNumbers={true}
          startingLineNumber={reference.lineStart || 1}
          customStyle={{
            margin: 0,
            borderRadius: 0,
            fontSize: '13px',
            padding: '12px',
          }}
          lineNumberStyle={{
            minWidth: '2.5em',
            paddingRight: '1em',
            color: '#6e7681',
            userSelect: 'none',
          }}
        >
          {reference.code}
        </SyntaxHighlighter>
      </div>
    </div>
  )
}

export default CodeSnippet