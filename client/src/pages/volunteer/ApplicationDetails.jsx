import React, { memo, useEffect, useMemo, useState } from 'react';
import { useAuth } from '@clerk/react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import LoadingSpinner from '../../components/LoadingSpinner';
import Topbar from '../../components/volunteer/Topbar';
import { applicationsApi } from '../../lib/api';
import { formatDisplayDate, formatDuration, formatTimeRange, titleToInitials } from '../../lib/formatters';
import './EventDetails.css';

const statusTheme = {
  pending: { background: '#fef3c7', color: '#92400e', label: 'Pending' },
  approved: { background: '#d1fae5', color: '#065f46', label: 'Approved' },
  attended: { background: '#e6f1fb', color: '#155da0', label: 'Attended' },
  rejected: { background: '#fee2e2', color: '#991b1b', label: 'Rejected' },
};

const categoryStyles = ['tag-blue', 'tag-teal', 'tag-purple', 'tag-coral', 'tag-amber'];

const ApplicationDetails = () => {
  const { applicationId } = useParams();
  const navigate = useNavigate();
  const { getToken, isLoaded: authLoaded, isSignedIn } = useAuth();
  const [application, setApplication] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!authLoaded) {
      return;
    }

    let ignore = false;

    const loadApplication = async () => {
      setIsLoading(true);
      setErrorMessage('');

      if (!isSignedIn) {
        if (!ignore) {
          setApplication(null);
          setIsLoading(false);
        }
        return;
      }

      try {
        const token = await getToken();
        const response = await applicationsApi.getMyApplicationById(applicationId, token);

        if (!ignore) {
          setApplication(response.application || null);
        }
      } catch (error) {
        if (!ignore) {
          setErrorMessage(error.message || 'Unable to load this application right now.');
          setApplication(null);
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    };

    loadApplication();

    return () => {
      ignore = true;
    };
  }, [applicationId, authLoaded, getToken, isSignedIn]);

  const event = application?.event;
  const statusKey = application?.status?.toLowerCase() || 'pending';
  const theme = statusTheme[statusKey] || statusTheme.pending;
  const progressWidth = useMemo(() => {
    if (!event?.capacity) {
      return '0%';
    }

    return `${Math.min((event.spotsFilled / event.capacity) * 100, 100)}%`;
  }, [event?.capacity, event?.spotsFilled]);

  const handleWithdraw = async () => {
    if (!isSignedIn) {
      setErrorMessage('Sign in to manage your application.');
      return;
    }

    try {
      setIsWithdrawing(true);
      const token = await getToken();
      await applicationsApi.withdrawMyApplication(applicationId, token);
      navigate('/applications', {
        replace: true,
        state: {
          feedbackMessage: `${event?.title || 'The application'} has been withdrawn.`,
        },
      });
    } catch (error) {
      setErrorMessage(error.message || 'Unable to withdraw this application right now.');
    } finally {
      setIsWithdrawing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="event-details">
        <Topbar active="applications" />
        <LoadingSpinner message="Loading application details..." />
      </div>
    );
  }

  if (!application || !event) {
    return (
      <div className="event-details">
        <Topbar active="applications" />
        <div className="card" style={{ maxWidth: 720, margin: '2rem auto' }}>
          <h3>{isSignedIn ? 'Application not found' : 'Sign in required'}</h3>
          <p className="desc">
            {isSignedIn
              ? errorMessage || 'This application may have been withdrawn already or no longer exists in your list.'
              : 'Sign in to view your application details.'}
          </p>
          <Link to="/applications" className="btn-apply" style={{ display: 'inline-block', textDecoration: 'none', width: 'auto', marginBottom: 0 }}>
            Back to applications
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="event-details">
      <Topbar active="applications" />

      <div className="breadcrumb">
        <Link to="/">Dashboard</Link>
        <span>›</span>
        <Link to="/applications">Applications</Link>
        <span>›</span>
        <span>{event.title}</span>
      </div>

      {errorMessage && (
        <div className="card" style={{ marginBottom: '1rem', border: '1px solid #fecaca', color: '#991b1b' }}>
          {errorMessage}
        </div>
      )}

      <div className="hero">
        <div className="hero-inner">
          <div className="event-category">{event.category || 'Volunteer event'}</div>
          <h1>{event.title}</h1>
          <div className="hero-org">Organized by {event.organization?.name || 'Organization'}</div>
        </div>
      </div>

      <div className="meta-row">
        <div className="meta-card">
          <div className="meta-label">Date</div>
          <div className="meta-val">{formatDisplayDate(event.date)}</div>
        </div>
        <div className="meta-card">
          <div className="meta-label">Time</div>
          <div className="meta-val">{formatTimeRange(event.startTime, event.endTime) || 'To be announced'}</div>
        </div>
        <div className="meta-card">
          <div className="meta-label">Location</div>
          <div className="meta-val">{event.location}</div>
        </div>
        <div className="meta-card">
          <div className="meta-label">Duration</div>
          <div className="meta-val">{formatDuration(event.startTime, event.endTime) || 'Schedule TBD'}</div>
        </div>
      </div>

      <div className="body-grid">
        <div className="main-col">
          <div className="card">
            <h3>About this event</h3>
            <p className="desc">{event.description}</p>
          </div>

          <div className="card">
            <h3>Your application</h3>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '6px 12px',
                borderRadius: 999,
                background: theme.background,
                color: theme.color,
                fontSize: 12,
                fontWeight: 600,
                marginBottom: 12,
              }}
            >
              Status: {theme.label}
            </div>
            <p className="desc">
              {application.notes || 'Your application is recorded and synced with your account.'}
            </p>
          </div>

          <div className="card">
            <h3>Skills required</h3>
            <div className="skills-wrap">
              {(event.skills || []).map((skill, index) => (
                <span key={skill} className={`skill-tag ${categoryStyles[index % categoryStyles.length]}`}>
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="side-col">
          <div className="card">
            <h3>Application actions</h3>
            <div className="spots-row">
              <span className="spots-lbl">Spots filled</span>
              <span className="spots-cnt">{event.spotsFilled} / {event.capacity}</span>
            </div>
            <div className="progress-track">
              <div className="progress-fill" style={{ width: progressWidth }}></div>
            </div>
            <Link to="/applications" className="btn-save" style={{ textDecoration: 'none', marginBottom: 9 }}>
              Back to applications
            </Link>
            {(statusKey === 'approved' || statusKey === 'pending') && (
              <button
                type="button"
                className="btn-apply"
                onClick={handleWithdraw}
                style={{ background: '#dc2626', marginBottom: 0 }}
                disabled={isWithdrawing}
              >
                {isWithdrawing ? 'Withdrawing...' : 'Withdraw application'}
              </button>
            )}
          </div>

          <div className="card">
            <h3>Organizer</h3>
            <div className="org-row">
              <div className="org-avatar">{titleToInitials(event.organization?.name)}</div>
              <div>
                <div className="org-name">{event.organization?.name}</div>
                <div className="org-sub">
                  {event.organization?.isVerified ? 'Verified organizer' : 'Organizer'}
                  {event.organization?.foundedYear ? ` · Est. ${event.organization.foundedYear}` : ''}
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <h3>Event details</h3>
            <table className="info-table">
              <tbody>
                <tr><td>Category</td><td>{event.category || 'General'}</td></tr>
                <tr><td>Difficulty</td><td>{event.difficulty || 'TBD'}</td></tr>
                <tr><td>Volunteers needed</td><td>{event.capacity}</td></tr>
                <tr><td>Min. age</td><td>{event.minAge ? `${event.minAge} years` : 'No restriction'}</td></tr>
                <tr><td>Language</td><td>{event.language || 'TBD'}</td></tr>
              </tbody>
            </table>
            {event.certificateProvided && (
              <div className="cert-badge">
                <svg viewBox="0 0 24 24">
                  <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" />
                </svg>
                Certificate provided
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(ApplicationDetails);
