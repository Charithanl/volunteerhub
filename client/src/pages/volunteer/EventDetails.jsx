import React, { memo, useEffect, useMemo, useState } from 'react';
import { useAuth, useUser } from '@clerk/react';
import { Link, useNavigate } from 'react-router-dom';
import LoadingSpinner from '../../components/LoadingSpinner';
import Topbar from '../../components/volunteer/Topbar';
import { eventsApi } from '../../lib/api';
import { formatDisplayDate, formatDuration, formatTimeRange, titleToInitials } from '../../lib/formatters';
import './EventDetails.css';

const tagClasses = ['tag-blue', 'tag-teal', 'tag-purple', 'tag-coral', 'tag-amber'];

const EventDetails = () => {
  const navigate = useNavigate();
  const { getToken, isLoaded: authLoaded, isSignedIn } = useAuth();
  const { user, isLoaded: userLoaded } = useUser();
  const [event, setEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isApplying, setIsApplying] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let ignore = false;

    const loadEvent = async () => {
      setIsLoading(true);
      setErrorMessage('');

      try {
        const response = await eventsApi.listEvents();
        const firstEvent = response.events?.[0] || null;

        if (!ignore) {
          setEvent(firstEvent);
        }
      } catch (error) {
        if (!ignore) {
          setErrorMessage(error.message || 'Unable to load events right now.');
          setEvent(null);
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    };

    loadEvent();

    return () => {
      ignore = true;
    };
  }, []);

  const progressWidth = useMemo(() => {
    if (!event?.capacity) {
      return '0%';
    }

    return `${Math.min((event.spotsFilled / event.capacity) * 100, 100)}%`;
  }, [event?.capacity, event?.spotsFilled]);

  const handleApply = async () => {
    if (!authLoaded || !userLoaded) {
      return;
    }

    if (!isSignedIn) {
      setErrorMessage('Sign in to apply for this event.');
      return;
    }

    if (!event) {
      setErrorMessage('No event is available to apply to right now.');
      return;
    }

    try {
      setIsApplying(true);
      setErrorMessage('');
      const token = await getToken();

      await eventsApi.applyToEvent(event.id, token, {
        email: user?.primaryEmailAddress?.emailAddress || '',
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
      });

      navigate('/applications', {
        state: {
          feedbackMessage: `Application submitted for ${event.title}.`,
        },
      });
    } catch (error) {
      setErrorMessage(error.message || 'Unable to submit your application right now.');
    } finally {
      setIsApplying(false);
    }
  };

  if (isLoading) {
    return (
      <div className="event-details">
        <Topbar active="events" />
        <LoadingSpinner message="Loading event details..." />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="event-details">
        <Topbar active="events" />
        <div className="card" style={{ maxWidth: 720, margin: '2rem auto' }}>
          <h3>No event available</h3>
          <p className="desc">{errorMessage || 'Seed some events on the backend to see opportunities here.'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="event-details">
      <Topbar active="events" />

      <div className="breadcrumb">
        <Link to="/">Dashboard</Link>
        <span>›</span>
        <Link to="/event">Events</Link>
        <span>›</span>
        {event.title}
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
            <h3>Skills required</h3>
            <div className="skills-wrap">
              {(event.skills || []).map((skill, index) => (
                <span key={skill} className={`skill-tag ${tagClasses[index % tagClasses.length]}`}>
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="card">
            <h3>What to bring</h3>
            <ul className="bring-list">
              <li>Comfortable outdoor clothing you do not mind getting dirty</li>
              <li>Water bottle and basic sun protection</li>
              <li>Government-issued ID for volunteer registration</li>
              <li>A positive attitude and readiness to help</li>
            </ul>
          </div>
        </div>

        <div className="side-col">
          <div className="card">
            <h3>Register now</h3>
            <div className="spots-row">
              <span className="spots-lbl">Spots filled</span>
              <span className="spots-cnt">{event.spotsFilled} / {event.capacity}</span>
            </div>
            <div className="progress-track">
              <div className="progress-fill" style={{ width: progressWidth }}></div>
            </div>
            <button className="btn-apply" onClick={handleApply} disabled={isApplying} aria-label="Apply now for this event">
              {isApplying ? 'Submitting...' : 'Apply now'}
            </button>
            <button className="btn-save" aria-label="Save this event to your favorites">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z" />
              </svg>
              Save event
            </button>
          </div>

          <div className="card">
            <h3>Organizer</h3>
            <div className="org-row">
              <div className="org-avatar">{titleToInitials(event.organization?.name)}</div>
              <div>
                <div className="org-name">{event.organization?.name}</div>
                <div className="org-sub">
                  {event.organization?.isVerified ? 'Verified NGO' : 'Organizer'}
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

export default memo(EventDetails);
