import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiSend, FiUpload, FiMenu, FiX } from 'react-icons/fi'
import { askQuestion, getQuestionHistory } from '../services/api'
import CodeSnippet from '../components/CodeSnippet'
import QuestionHistory from '../components/QuestionHistory'

function QAInterface() {
  const navigate = useNavigate()
  const [codebaseId, setCodebaseId] = useState(null)
  const [question, setQuestion] = useState('')
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [history, setHistory] = useState([])
  const [showSidebar, setShowSidebar] = useState(true)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    const storedId = localStorage.getItem('codebaseId')
    if (!storedId) {
      navigate('/')
      return
    }
    setCodebaseId(storedId)
    loadHistory(storedId)
  }, [navigate])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const loadHistory = async (id) => {
    try {
      const data = await getQuestionHistory(id)
      setHistory(data.history || [])
    } catch (error) {
      console.error('Failed to load history:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!question.trim() || loading) return

    const userQuestion = question.trim()
    setQuestion('')
    
    const userMessage = { role: 'user', content: userQuestion }
    setMessages(prev => [...prev, userMessage])
    
    setLoading(true)

    try {
      const data = await askQuestion(codebaseId, userQuestion)
      
      const aiMessage = {
        role: 'assistant',
        content: data.answer,
        references: data.references || [],
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, aiMessage])
      loadHistory(codebaseId)
      
    } catch (error) {
      const errorMessage = {
        role: 'error',
        content: error.message || 'Failed to get answer'
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  const handleNewUpload = () => {
    localStorage.removeItem('codebaseId')
    navigate('/')
  }

  const loadHistoryQuestion = (historicQuestion) => {
    const questionData = history.find(h => h.question === historicQuestion)
    if (questionData) {
      setMessages([
        { role: 'user', content: questionData.question },
        { 
          role: 'assistant', 
          content: questionData.answer,
          references: questionData.references || []
        }
      ])
    }
  }

  return (
    <div className="flex h-[calc(100vh-64px)]">
      {/* Sidebar */}
      {showSidebar && (
        <div className="w-72 bg-gh-canvas border-r border-gh-border flex flex-col">
          <div className="p-4 border-b border-gh-border flex items-center justify-between">
            <h2 className="text-sm font-semibold">History</h2>
            <button
              onClick={() => setShowSidebar(false)}
              className="p-1 hover:bg-gh-bg rounded"
            >
              <FiX className="text-gh-muted" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto">
            <QuestionHistory 
              history={history} 
              onQuestionClick={loadHistoryQuestion}
            />
          </div>
        </div>
      )}

      {/* Main Area */}
      <div className="flex-1 flex flex-col bg-gh-bg">
        {/* Header */}
        <div className="bg-gh-canvas border-b border-gh-border px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {!showSidebar && (
              <button
                onClick={() => setShowSidebar(true)}
                className="p-1.5 hover:bg-gh-bg rounded"
              >
                <FiMenu />
              </button>
            )}
            <div>
              <h2 className="text-sm font-semibold">Q&A Interface</h2>
              <p className="text-xs text-gh-muted">
                Codebase: {codebaseId?.substring(0, 12)}...
              </p>
            </div>
          </div>
          <button
            onClick={handleNewUpload}
            className="btn btn-secondary text-xs"
          >
            <FiUpload className="inline mr-1.5" />
            New Upload
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-6">
          {messages.length === 0 ? (
            <div className="max-w-3xl mx-auto text-center py-16">
              <h3 className="text-xl font-semibold text-gh-text mb-3">
                Ready to answer your questions
              </h3>
              <p className="text-sm text-gh-muted mb-6">
                Ask anything about your codebase structure, logic, or implementation.
              </p>
              <div className="card p-4 text-left">
                <p className="text-xs font-medium text-gh-muted mb-2">EXAMPLES:</p>
                <div className="space-y-1.5 text-sm text-gh-text">
                  <p>→ Where is authentication implemented?</p>
                  <p>→ How does error handling work?</p>
                  <p>→ Show me the database schema</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`${
                    message.role === 'user'
                      ? 'ml-auto max-w-2xl'
                      : message.role === 'error'
                      ? 'max-w-2xl'
                      : 'max-w-full'
                  }`}
                >
                  {message.role === 'user' ? (
                    <div className="bg-gh-blue text-white px-4 py-2.5 rounded-md text-sm">
                      {message.content}
                    </div>
                  ) : message.role === 'error' ? (
                    <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-2.5 rounded-md text-sm">
                      {message.content}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="card px-4 py-3">
                        <p className="text-sm text-gh-text whitespace-pre-wrap">
                          {message.content}
                        </p>
                      </div>
                      
                      {message.references && message.references.length > 0 && (
                        <div className="space-y-3">
                          <p className="text-xs font-semibold text-gh-muted uppercase tracking-wide">
                            Code References
                          </p>
                          {message.references.map((ref, refIndex) => (
                            <CodeSnippet key={refIndex} reference={ref} />
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
              
              {loading && (
                <div className="card px-4 py-3 max-w-2xl">
                  <div className="flex items-center gap-2 text-sm text-gh-muted">
                    <div className="flex gap-1">
                      <span className="animate-bounce">●</span>
                      <span className="animate-bounce" style={{ animationDelay: '0.1s' }}>●</span>
                      <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>●</span>
                    </div>
                    <span>Searching codebase...</span>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input */}
        <div className="bg-gh-canvas border-t border-gh-border p-4">
          <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
            <div className="flex gap-2">
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Ask a question about your code..."
                className="input-field flex-1"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || !question.trim()}
                className="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FiSend className="inline" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default QAInterface