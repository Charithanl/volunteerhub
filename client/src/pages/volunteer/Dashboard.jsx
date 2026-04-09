import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import Topbar from '../../components/volunteer/Topbar';
import './Dashboard.css';

const Dashboard = () => {
  return (
    <div className="dashboard">
      <Topbar active="dashboard" />

      {/* WELCOME BANNER */}
      <div className="welcome">
        <div className="welcome-text">
          <h2>Hello, Charitha! 👋</h2>
          <p>You have 3 upcoming events this month. Keep up the great work!</p>
        </div>
        <div className="welcome-pill">April 2026</div>
      </div>

      {/* STATS */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="value">24</div>
          <div className="label">Total events</div>
          <div className="badge badge-blue">Active</div>
        </div>
        <div className="stat-card">
          <div className="value">8</div>
          <div className="label">My participations</div>
          <div className="badge badge-green">+2 this month</div>
        </div>
        <div className="stat-card">
          <div className="value">42h</div>
          <div className="label">Hours logged</div>
          <div className="badge badge-amber">Top 15%</div>
        </div>
      </div>

      {/* QUICK ACTIONS */}
      <div className="section-head">
        <h3>Quick actions</h3>
      </div>
      <div className="action-grid">
        <Link className="action-card" to="/event">
          <div className="action-icon icon-blue">
            <svg viewBox="0 0 24 24" fill="#1a6fc4">
              <path d="M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z"/>
            </svg>
          </div>
          <h4>View events</h4>
          <p>Browse all open opportunities</p>
          <div className="arrow">→</div>
        </Link>
        <Link className="action-card" to="/applications">
          <div className="action-icon icon-teal">
            <svg viewBox="0 0 24 24" fill="#059669">
              <path d="M9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm2-7h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z"/>
            </svg>
          </div>
          <h4>My applications</h4>
          <p>Track your submissions</p>
          <div className="arrow">→</div>
        </Link>
        <Link className="action-card" to="/profile">
          <div className="action-icon icon-purple">
            <svg viewBox="0 0 24 24" fill="#7c3aed">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
          </div>
          <h4>Profile</h4>
          <p>Manage your info &amp; skills</p>
          <div className="arrow">→</div>
        </Link>
      </div>

      {/* RECENT EVENTS */}
      <div className="section-head">
        <h3>Recent events</h3>
        <Link className="see-all" to="/event">See all →</Link>
      </div>
      <div className="recent-card">
        <div className="event-row">
          <div className="event-dot dot-blue"></div>
          <div className="event-info">
            <div className="event-name">Tree Plantation Drive</div>
            <div className="event-meta">Apr 12 · Sector 21, Gurugram</div>
          </div>
          <div className="status-badge status-open">Open</div>
        </div>
        <div className="event-row">
          <div className="event-dot dot-green"></div>
          <div className="event-info">
            <div className="event-name">Blood Donation Camp</div>
            <div className="event-meta">Mar 28 · Civil Hospital, Indore</div>
          </div>
          <div className="status-badge status-done">Attended</div>
        </div>
        <div className="event-row">
          <div className="event-dot dot-amber"></div>
          <div className="event-info">
            <div className="event-name">Digital Literacy Workshop</div>
            <div className="event-meta">Apr 18 · Community Centre</div>
          </div>
          <div className="status-badge status-pending">Pending</div>
        </div>
        <div className="event-row">
          <div className="event-dot dot-blue"></div>
          <div className="event-info">
            <div className="event-name">Food Distribution Drive</div>
            <div className="event-meta">Apr 22 · Railway Station, Bhopal</div>
          </div>
          <div className="status-badge status-open">Open</div>
        </div>
      </div>
    </div>
  );
};

export default memo(Dashboard);