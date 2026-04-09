import React from 'react'
import './LoadingSpinner.css'

const LoadingSpinner = ({ message = 'Loading...' }) => {
  return (
    <div className="loading-spinner-overlay">
      <div className="loading-spinner-container">
        <div className="spinner"></div>
        <p>{message}</p>
      </div>
    </div>
  )
}

export default LoadingSpinner
