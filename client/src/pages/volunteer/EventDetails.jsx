import React, { memo, useState } from 'react';
import { Link } from 'react-router-dom';
import Topbar from '../../components/volunteer/Topbar';
import LoadingSpinner from '../../components/LoadingSpinner';
import './EventDetails.css';

const EventDetails = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleApply = async () => {
    setIsLoading(true);
    // Simulate async action (API call)
    setTimeout(() => {
      alert('Application submitted! You will receive a confirmation email shortly.');
      setIsLoading(false);
    }, 2000);
  };
  return (
    <div className="event-details">
      <Topbar active="events" />

      {/* BREADCRUMB */}
      <div className="breadcrumb">
        <Link to="/">Dashboard</Link>
        <span>›</span>
        <Link to="/event">Events</Link>
        <span>›</span>
        Tree Plantation Drive
      </div>

      {/* HERO */}
      <div className="hero">
        <div className="hero-inner">
          <div className="event-category">Environment</div>
          <h1>Annual Tree Plantation Drive 2026</h1>
          <div className="hero-org">Organised by Green Earth Foundation</div>
        </div>
      </div>

      {/* META ROW */}
      <div className="meta-row">
        <div className="meta-card">
          <div className="meta-label">Date</div>
          <div className="meta-val">Apr 12, 2026</div>
        </div>
        <div className="meta-card">
          <div className="meta-label">Time</div>
          <div className="meta-val">8:00 – 12:00 AM</div>
        </div>
        <div className="meta-card">
          <div className="meta-label">Location</div>
          <div className="meta-val">Sector 21, Gurugram</div>
        </div>
        <div className="meta-card">
          <div className="meta-label">Duration</div>
          <div className="meta-val">4 hours</div>
        </div>
      </div>

      {/* BODY GRID */}
      <div className="body-grid">

        {/* MAIN COLUMN */}
        <div className="main-col">

          <div className="card">
            <h3>About this event</h3>
            <p className="desc">
              Join us for our annual tree plantation drive aimed at increasing green cover across Gurugram. Volunteers will plant saplings, learn about native species, and help restore degraded areas near the Aravalli biodiversity zone.
              <br/><br/>
              The event is open to all age groups. Families, students, and corporate groups are all welcome. All equipment including gloves, spades, and saplings will be provided on the day. Refreshments will be available throughout the morning.
            </p>
          </div>

          <div className="card">
            <h3>Skills required</h3>
            <div className="skills-wrap">
              <span className="skill-tag tag-blue">Teamwork</span>
              <span className="skill-tag tag-teal">Physical fitness</span>
              <span className="skill-tag tag-purple">Environmental awareness</span>
              <span className="skill-tag tag-coral">First aid (preferred)</span>
              <span className="skill-tag tag-amber">Communication</span>
            </div>
          </div>

          <div className="card">
            <h3>What to bring</h3>
            <ul className="bring-list">
              <li>Comfortable outdoor clothing you don't mind getting dirty</li>
              <li>Water bottle (at least 1 litre recommended)</li>
              <li>Sunscreen and a hat — it will be warm!</li>
              <li>Government-issued ID for volunteer registration</li>
              <li>Enthusiasm and a willingness to make a difference</li>
            </ul>
          </div>

        </div>

        {/* SIDE COLUMN */}
        <div className="side-col">

          <div className="card">
            <h3>Register now</h3>
            <div className="spots-row">
              <span className="spots-lbl">Spots filled</span>
              <span className="spots-cnt">31 / 50</span>
            </div>
            <div className="progress-track">
              <div className="progress-fill"></div>
            </div>
            <button className="btn-apply" onClick={handleApply} disabled={isLoading} aria-label="Apply now for this event">Apply now</button>
            <button className="btn-save" aria-label="Save this event to your favorites">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z"/>
              </svg>
              Save event
            </button>
          </div>

          <div className="card">
            <h3>Organiser</h3>
            <div className="org-row">
              <div className="org-avatar">GE</div>
              <div>
                <div className="org-name">Green Earth Foundation</div>
                <div className="org-sub">Verified NGO · Est. 2010</div>
              </div>
            </div>
          </div>

          <div className="card">
            <h3>Event details</h3>
            <table className="info-table">
              <tbody>
                <tr><td>Category</td><td>Environment</td></tr>
                <tr><td>Difficulty</td><td>Low – Medium</td></tr>
                <tr><td>Volunteers needed</td><td>50</td></tr>
                <tr><td>Min. age</td><td>14 years</td></tr>
                <tr><td>Language</td><td>Hindi / English</td></tr>
              </tbody>
            </table>
            <div className="cert-badge">
              <svg viewBox="0 0 24 24">
                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/>
              </svg>
              Certificate provided
            </div>
          </div>

        </div>
      </div>
      {isLoading && <LoadingSpinner message="Submitting your application..." />}
    </div>
  );
};

export default memo(EventDetails);