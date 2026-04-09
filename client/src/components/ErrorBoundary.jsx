import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  reset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={styles.container}>
          <div style={styles.card}>
            <h1 style={styles.title}>Oops! Something went wrong</h1>
            <p style={styles.message}>
              We're sorry for the inconvenience. An unexpected error occurred.
            </p>
            <p style={styles.error}>{this.state.error?.toString()}</p>
            <div style={styles.buttonGroup}>
              <button style={styles.btnPrimary} onClick={() => window.location.href = '/'}>
                Go to Home
              </button>
              <button style={styles.btnSecondary} onClick={this.reset}>
                Try Again
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    background: '#f5f5f5',
    padding: '1rem',
  },
  card: {
    background: '#fff',
    borderRadius: '12px',
    padding: '2rem',
    maxWidth: '500px',
    boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
    textAlign: 'center',
  },
  title: {
    fontSize: '28px',
    color: '#1a1a2e',
    marginBottom: '1rem',
  },
  message: {
    fontSize: '14px',
    color: '#6b7280',
    marginBottom: '0.75rem',
    lineHeight: '1.6',
  },
  error: {
    fontSize: '12px',
    color: '#dc2626',
    background: '#fee2e2',
    padding: '0.75rem',
    borderRadius: '8px',
    marginBottom: '1.5rem',
    wordBreak: 'break-word',
  },
  buttonGroup: {
    display: 'flex',
    gap: '0.75rem',
    justifyContent: 'center',
  },
  btnPrimary: {
    padding: '10px 20px',
    background: '#1a6fc4',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  btnSecondary: {
    padding: '10px 20px',
    background: '#e6f1fb',
    color: '#1a6fc4',
    border: '1px solid #dbeafe',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
  },
};

export default ErrorBoundary;
