import React, { memo, useMemo } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Topbar from '../../components/volunteer/Topbar';
import {
  APPLICATIONS_STORAGE_KEY,
  getStoredApplications,
} from '../../data/applications';
import './EventDetails.css';

const statusTheme = {
  pending: { background: '#fef3c7', color: '#92400e', label: 'Pending' },
  approved: { background: '#d1fae5', color: '#065f46', label: 'Approved' },
  attended: { background: '#e6f1fb', color: '#155da0', label: 'Attended' },
  rejected: { background: '#fee2e2', color: '#991b1b', label: 'Rejected' },
};

const ApplicationDetails = () => {
  const { applicationId } = useParams();
  const navigate = useNavigate();

  const application = useMemo(() => {
    const applications = getStoredApplications();
    return applications.find((item) => item.id === Number(applicationId));
  }, [applicationId]);

  if (!application) {
    return (
      <div className="event-details">
        <Topbar active="applications" />
        <div className="card" style={{ maxWidth: 720, margin: '2rem auto' }}>
          <h3>Application not found</h3>
          <p className="desc">
            This application may have been withdrawn already or no longer exists in your list.
          </p>
          <Link to="/applications" className="btn-apply" style={{ display: 'inline-block', textDecoration: 'none', width: 'auto', marginBottom: 0 }}>
            Back to applications
          </Link>
        </div>
      </div>
    );
  }

  const theme = statusTheme[application.status] || statusTheme.pending;
  const progressWidth = `${Math.min((application.spotsFilled / application.totalSpots) * 100, 100)}%`;

  const handleWithdraw = () => {
    const remainingApplications = getStoredApplications().filter((item) => item.id !== application.id);
    window.localStorage.setItem(APPLICATIONS_STORAGE_KEY, JSON.stringify(remainingApplications));
    navigate('/applications', {
      replace: true,
      state: {
        feedbackMessage: `${application.title} has been withdrawn.`,
      },
    });
  };

  return (
    <div className="event-details">
      <Topbar active="applications" />

      <div className="breadcrumb">
        <Link to="/">Dashboard</Link>
        <span>›</span>
        <Link to="/applications">Applications</Link>
        <span>›</span>
        <span>{application.title}</span>
      </div>

      <div className="hero">
        <div className="hero-inner">
          <div className="event-category">{application.category}</div>
          <h1>{application.title}</h1>
          <div className="hero-org">Organized by {application.org}</div>
        </div>
      </div>

      <div className="meta-row">
        <div className="meta-card">
          <div className="meta-label">Date</div>
          <div className="meta-val">{application.date}</div>
        </div>
        <div className="meta-card">
          <div className="meta-label">Time</div>
          <div className="meta-val">{application.time}</div>
        </div>
        <div className="meta-card">
          <div className="meta-label">Location</div>
          <div className="meta-val">{application.location}</div>
        </div>
        <div className="meta-card">
          <div className="meta-label">Duration</div>
          <div className="meta-val">{application.hours}</div>
        </div>
      </div>

      <div className="body-grid">
        <div className="main-col">
          <div className="card">
            <h3>About this event</h3>
            <p className="desc">
              {application.description}
              <br />
              <br />
              {application.descriptionExtra}
            </p>
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
            <p className="desc">{application.applicationStatusNote}</p>
          </div>

          <div className="card">
            <h3>Skills required</h3>
            <div className="skills-wrap">
              {application.skills.map((skill, index) => {
                const classes = ['tag-blue', 'tag-teal', 'tag-purple', 'tag-coral', 'tag-amber'];
                return (
                  <span key={skill} className={`skill-tag ${classes[index % classes.length]}`}>
                    {skill}
                  </span>
                );
              })}
            </div>
          </div>

          <div className="card">
            <h3>What to bring</h3>
            <ul className="bring-list">
              {application.bring.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="side-col">
          <div className="card">
            <h3>Application actions</h3>
            <div className="spots-row">
              <span className="spots-lbl">Spots filled</span>
              <span className="spots-cnt">{application.spotsFilled} / {application.totalSpots}</span>
            </div>
            <div className="progress-track">
              <div className="progress-fill" style={{ width: progressWidth }}></div>
            </div>
            <Link to="/applications" className="btn-save" style={{ textDecoration: 'none', marginBottom: 9 }}>
              Back to applications
            </Link>
            {(application.status === 'approved' || application.status === 'pending') && (
              <button
                type="button"
                className="btn-apply"
                onClick={handleWithdraw}
                style={{ background: '#dc2626', marginBottom: 0 }}
              >
                Withdraw application
              </button>
            )}
          </div>

          <div className="card">
            <h3>Organizer</h3>
            <div className="org-row">
              <div className="org-avatar">{application.orgAvatar}</div>
              <div>
                <div className="org-name">{application.org}</div>
                <div className="org-sub">{application.orgSub}</div>
              </div>
            </div>
          </div>

          <div className="card">
            <h3>Event details</h3>
            <table className="info-table">
              <tbody>
                <tr><td>Category</td><td>{application.category}</td></tr>
                <tr><td>Difficulty</td><td>{application.difficulty}</td></tr>
                <tr><td>Volunteers needed</td><td>{application.totalSpots}</td></tr>
                <tr><td>Min. age</td><td>{application.minAge}</td></tr>
                <tr><td>Language</td><td>{application.language}</td></tr>
              </tbody>
            </table>
            {application.certificate && (
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
