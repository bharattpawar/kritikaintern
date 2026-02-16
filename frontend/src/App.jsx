import { Routes, Route } from 'react-router-dom'
import Navbar from './components/navbar'
import Home from './pages/Home'
import QAInterface from './pages/QAInterface'
import Status from './pages/Status'

function App() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/qa" element={<QAInterface />} />
        <Route path="/status" element={<Status />} />
      </Routes>
    </div>
  )
}

export default App