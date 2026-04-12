import React, { memo, useEffect, useMemo, useState } from 'react';
import { useAuth } from '@clerk/react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import LoadingSpinner from '../../components/LoadingSpinner';
import Topbar from '../../components/volunteer/Topbar';
import { applicationsApi } from '../../lib/api';
import { formatDisplayDate, formatDuration } from '../../lib/formatters';
import './Applications.css';

const statusMap = {
  all: () => true,
  pending: (app) => app.status === 'pending',
  approved: (app) => app.status === 'approved',
  attended: (app) => app.status === 'attended',
  rejected: (app) => app.status === 'rejected',
};

const statusLabel = {
  pending: 'pill-pending',
  approved: 'pill-approved',
  attended: 'pill-attended',
  rejected: 'pill-rejected',
};

const statusText = {
  pending: 'Pending',
  approved: 'Approved',
  attended: 'Attended',
  rejected: 'Rejected',
};

const categoryPresentation = {
  Environment: { icon: '🌳', colorBar: 'bar-green', colorBg: '#d1fae5' },
  Health: { icon: '🏥', colorBar: 'bar-blue', colorBg: '#e0f2fe' },
  Education: { icon: '📚', colorBar: 'bar-amber', colorBg: '#fef3c7' },
  'Food & Nutrition': { icon: '🍱', colorBar: 'bar-blue', colorBg: '#e6f1fb' },
  'Arts & Culture': { icon: '🎨', colorBar: 'bar-red', colorBg: '#fee2e2' },
};

const mapApplicationToCard = (application) => {
  const event = application.event || {};
  const visual = categoryPresentation[event.category] || { icon: '📅', colorBar: 'bar-blue', colorBg: '#e6f1fb' };
  const normalizedStatus = application.status?.toLowerCase() || 'pending';

  return {
    id: application.id,
    title: event.title || 'Untitled event',
    org: event.organization?.name || 'Organization',
    date: formatDisplayDate(event.date),
    location: event.location || 'Location TBD',
    hours: formatDuration(event.startTime, event.endTime) || 'Schedule TBD',
    status: normalizedStatus,
    icon: visual.icon,
    colorBar: visual.colorBar,
    colorBg: visual.colorBg,
  };
};

const Applications = () => {
  const { getToken, isLoaded: authLoaded, isSignedIn } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [withdrawingId, setWithdrawingId] = useState('');

  useEffect(() => {
    if (!feedbackMessage && !errorMessage) {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      setFeedbackMessage('');
      setErrorMessage('');
    }, 3000);

    return () => window.clearTimeout(timer);
  }, [errorMessage, feedbackMessage]);

  useEffect(() => {
    if (!location.state?.feedbackMessage) {
      return;
    }

    setFeedbackMessage(location.state.feedbackMessage);
    navigate(location.pathname, { replace: true, state: null });
  }, [location.pathname, location.state, navigate]);

  useEffect(() => {
    if (!authLoaded) {
      return;
    }

    let ignore = false;

    const loadApplications = async () => {
      setIsLoading(true);
      setErrorMessage('');

      if (!isSignedIn) {
        if (!ignore) {
          setApplications([]);
          setIsLoading(false);
        }
        return;
      }

      try {
        const token = await getToken();
        const response = await applicationsApi.listMyApplications(token);

        if (!ignore) {
          setApplications((response.applications || []).map(mapApplicationToCard));
        }
      } catch (error) {
        if (!ignore) {
          setErrorMessage(error.message || 'Unable to load your applications right now.');
          setApplications([]);
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    };

    loadApplications();

    return () => {
      ignore = true;
    };
  }, [authLoaded, getToken, isSignedIn]);

  const filteredApps = useMemo(() => {
    return applications
      .filter(statusMap[selectedStatus])
      .filter((app) => {
        const q = searchQuery.trim().toLowerCase();
        if (!q) return true;
        return (
          app.title.toLowerCase().includes(q) ||
          app.org.toLowerCase().includes(q)
        );
      });
  }, [applications, searchQuery, selectedStatus]);

  const stats = useMemo(() => {
    const approved = applications.filter((a) => a.status === 'approved').length;
    const pending = applications.filter((a) => a.status === 'pending').length;
    const attended = applications.filter((a) => a.status === 'attended').length;
    const rejected = applications.filter((a) => a.status === 'rejected').length;

    return { total: applications.length, approved, pending, attended, rejected };
  }, [applications]);

  const handleWithdraw = async (applicationId) => {
    if (!isSignedIn) {
      setErrorMessage('Sign in to manage your applications.');
      return;
    }

    const applicationToRemove = applications.find((app) => app.id === applicationId);
    if (!applicationToRemove) {
      return;
    }

    try {
      setWithdrawingId(applicationId);
      const token = await getToken();
      await applicationsApi.withdrawMyApplication(applicationId, token);
      setApplications((current) => current.filter((app) => app.id !== applicationId));
      setFeedbackMessage(`${applicationToRemove.title} has been withdrawn.`);
      setErrorMessage('');
    } catch (error) {
      setErrorMessage(error.message || 'Unable to withdraw this application right now.');
    } finally {
      setWithdrawingId('');
    }
  };

  return (
    <div className="event-details">
      <Topbar active="applications" />

      <div className="page-header">
        <div>
          <h1>My Applications</h1>
          <p>Track and manage all your volunteer applications</p>
        </div>
        <Link to="/event" className="btn-browse">
          <svg viewBox="0 0 24 24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" /></svg>
          Browse events
        </Link>
      </div>

      {(feedbackMessage || errorMessage) && (
        <div className={`applications-feedback ${errorMessage ? 'is-error' : ''}`} role="status" aria-live="polite">
          {errorMessage || feedbackMessage}
        </div>
      )}

      {isLoading && <LoadingSpinner message="Loading your applications..." />}

      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-icon icon-blue">
            <svg viewBox="0 0 24 24" fill="#1a6fc4"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 3c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm7 13H5v-.23c0-.62.28-1.2.76-1.58C7.47 15.82 9.64 15 12 15s4.53.82 6.24 2.19c.48.38.76.97.76 1.58V19z" /></svg>
          </div>
          <div className="stat-info">
            <div className="val">{stats.total}</div>
            <div className="lbl">Total applied</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon icon-green">
            <svg viewBox="0 0 24 24" fill="#059669"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" /></svg>
          </div>
          <div className="stat-info">
            <div className="val">{stats.approved}</div>
            <div className="lbl">Approved</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon icon-amber">
            <svg viewBox="0 0 24 24" fill="#d97706"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" /></svg>
          </div>
          <div className="stat-info">
            <div className="val">{stats.pending}</div>
            <div className="lbl">Pending</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon icon-red">
            <svg viewBox="0 0 24 24" fill="#dc2626"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" /></svg>
          </div>
          <div className="stat-info">
            <div className="val">{stats.rejected}</div>
            <div className="lbl">Rejected</div>
          </div>
        </div>
      </div>

      <div className="filter-bar">
        <span className="filter-label">Filter:</span>
        <div className="filter-tabs" role="group" aria-label="Filter applications by status">
          {['all', 'pending', 'approved', 'attended', 'rejected'].map((status) => (
            <button
              key={status}
              className={`ftab ${selectedStatus === status ? 'active' : ''}`}
              onClick={() => setSelectedStatus(status)}
              aria-pressed={selectedStatus === status}
              aria-label={`Filter by ${status === 'all' ? 'all applications' : status} status`}
            >
              {status === 'all' ? 'All' : status[0].toUpperCase() + status.slice(1)} ({status === 'all' ? stats.total : stats[status]})
            </button>
          ))}
        </div>
        <div className="search-box">
          <label htmlFor="search-applications" style={{ display: 'none' }}>Search applications</label>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" /></svg>
          <input
            id="search-applications"
            type="text"
            placeholder="Search events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search applications by event name or organization"
          />
        </div>
      </div>

      <div className="app-grid">
        {filteredApps.length === 0 ? (
          <div className="empty-state">
            <svg viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 3c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm7 13H5v-.23c0-.62.28-1.2.76-1.58C7.47 15.82 9.64 15 12 15s4.53.82 6.24 2.19c.48.38.76.97.76 1.58V19z" /></svg>
            <h3>{isSignedIn ? 'No applications found' : 'Sign in to view your applications'}</h3>
            <p>{isSignedIn ? 'Apply to an event to see it here.' : 'Your applications will appear here after you sign in and apply to an event.'}</p>
          </div>
        ) : (
          filteredApps.map((app) => (
            <div key={app.id} className="app-card" data-status={app.status}>
              <div className="app-left">
                <div className={`app-color-bar ${app.colorBar}`}></div>
                <div className="app-icon" style={{ background: app.colorBg }}>
                  {app.icon}
                </div>
                <div className="app-info">
                  <div className="app-title">{app.title}</div>
                  <div className="app-org">{app.org}</div>
                  <div className="app-tags">
                    <span className="tag tag-date">📅 {app.date}</span>
                    <span className="tag tag-loc">📍 {app.location}</span>
                    <span className="tag tag-hrs">{app.hours}</span>
                  </div>
                </div>
              </div>
              <div className="app-right">
                <span className={`status-pill ${statusLabel[app.status] || 'pill-pending'}`}>
                  {statusText[app.status] || app.status}
                </span>
                <div className="app-actions">
                  <Link to={`/applications/${app.id}`} className="btn-sm btn-outline-sm app-action-link">
                    View
                  </Link>
                  {app.status === 'approved' || app.status === 'pending' ? (
                    <button
                      type="button"
                      className="btn-sm btn-danger-sm"
                      onClick={() => handleWithdraw(app.id)}
                      aria-label={`Withdraw ${app.title}`}
                      disabled={withdrawingId === app.id}
                    >
                      {withdrawingId === app.id ? 'Withdrawing...' : 'Withdraw'}
                    </button>
                  ) : null}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="cert-banner">
        <div className="cert-banner-left">
          <svg viewBox="0 0 24 24"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" /></svg>
          <div>
            <h4>You have {stats.attended} certificates ready to download!</h4>
            <p>Certificates are available for all attended events</p>
          </div>
        </div>
        <button className="btn-cert">Download all</button>
      </div>
    </div>
  );
};

export default memo(Applications);
