import React, { lazy, Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import ErrorBoundary from './components/ErrorBoundary'
import './App.css'

// Lazy load route components for code splitting
const Dashboard = lazy(() => import('./pages/volunteer/Dashboard'))
const EventDetails = lazy(() => import('./pages/volunteer/EventDetails'))
const Applications = lazy(() => import('./pages/volunteer/Applications'))
const Profile = lazy(() => import('./pages/volunteer/Profile'))

const LoadingFallback = () => (
  <div className="loading-fallback">
    <div className="loading-fallback-inner">
      <div className="loading-spinner">⏳</div>
      <p>Loading page...</p>
    </div>
  </div>
)

const App = () => {
  return (
    <ErrorBoundary>
      <Router>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/event" element={<EventDetails />} />
            <Route path="/applications" element={<Applications />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </Suspense>
      </Router>
    </ErrorBoundary>
  )
}

export default App