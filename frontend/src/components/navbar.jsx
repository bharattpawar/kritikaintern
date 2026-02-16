import { Link, useLocation } from 'react-router-dom'
import { FiCode, FiActivity } from 'react-icons/fi'

function Navbar() {
  const location = useLocation()
  
  const isActive = (path) => location.pathname === path
  
  return (
    <nav className="bg-gh-canvas border-b border-gh-border sticky top-0 z-50">
      <div className="max-w-[1280px] mx-auto px-4">
        <div className="flex items-center h-16">
          <Link to="/" className="flex items-center gap-2 mr-8">
            <FiCode className="text-gh-blue text-xl" />
            <span className="text-base font-semibold">CodebaseQA</span>
          </Link>
          
          <div className="flex items-center gap-2">
            <Link
              to="/"
              className={`px-3 py-1.5 text-sm font-medium rounded transition-all hover:scale-125 ${
                isActive('/') 
                  ? 'bg-gh-bg' 
                  : 'hover:bg-gh-bg'
              }`}
            >
              Home
            </Link>
            <Link
              to="/qa"
              className={`px-3 py-1.5 text-sm font-medium rounded transition-all hover:scale-125 ${
                isActive('/qa') 
                  ? 'bg-gh-bg' 
                  : 'hover:bg-gh-bg'
              }`}
            >
              Q&A
            </Link>
            <Link
              to="/status"
              className={`px-3 py-1.5 text-sm font-medium rounded transition-all hover:scale-125 flex items-center gap-1.5 ${
                isActive('/status') 
                  ? 'bg-gh-bg' 
                  : 'hover:bg-gh-bg'
              }`}
            >
              <FiActivity className="text-sm" />
              <span>Status</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar