import React, { memo, useState } from 'react';
import { Link } from 'react-router-dom';
import Topbar from '../../components/volunteer/Topbar';
import LoadingSpinner from '../../components/LoadingSpinner';
import './Profile.css';

const Profile = () => {
  const [editMode, setEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const toggleEditMode = () => setEditMode((prev) => !prev);

  const handleSaveProfile = async () => {
    setIsLoading(true);
    // Simulate async action (API call)
    setTimeout(() => {
      alert('Profile updated successfully!');
      setIsLoading(false);
      setEditMode(false);
    }, 2000);
  };

  return (
    <div className="profile-page">
      <Topbar active="profile" />

      <div className="hero-card">
        <div className="hero-banner">
          <button className="edit-cover-btn" onClick={() => alert('Cover edit placeholder')}>
            <svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
            Edit cover
          </button>
        </div>
        <div className="hero-body">
          <div className="avatar-wrap">
            <div className="avatar-lg">C</div>
            <button className="avatar-edit" onClick={toggleEditMode}>
              <svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
            </button>
          </div>

          <div className="hero-info">
            <div className="hero-info-left">
              <h2>Charitha</h2>
              <div className="tagline">Passionate volunteer & community builder · Gurugram, Haryana</div>
              <div className="hero-badges">
                <span className="h-badge hb-blue">Verified Volunteer</span>
                <span className="h-badge hb-green">Top Contributor</span>
                <span className="h-badge hb-purple">42 hrs logged</span>
              </div>
            </div>
            <button className="btn-edit-profile" onClick={toggleEditMode}>
              <svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
              {editMode ? 'Cancel' : 'Edit profile'}
            </button>
          </div>

          <div className="hero-stats">
            <div className="hstat"><div className="num">8</div><div className="lbl">Applications</div></div>
            <div className="hstat"><div className="num">5</div><div className="lbl">Events attended</div></div>
            <div className="hstat"><div className="num">42h</div><div className="lbl">Hours volunteered</div></div>
            <div className="hstat"><div className="num">4</div><div className="lbl">Certificates</div></div>
          </div>
        </div>
      </div>

      <div className="body-grid">
        <div className="left-col">
          <div className="card">
            <div className="card-head">
              <h3>Personal info</h3>
              <button className="card-edit-btn" onClick={toggleEditMode}>Edit</button>
            </div>
            <div className="info-row"><span className="info-lbl">Email</span><span className="info-val">nlcharitha@gmail.com</span></div>
            <div className="info-row"><span className="info-lbl">Phone</span><span className="info-val">+91 9036XXXXXX</span></div>
            <div className="info-row"><span className="info-lbl">Location</span><span className="info-val">Bengaluru, Karnataka</span></div>
            <div className="info-row"><span className="info-lbl">Member since</span><span className="info-val">Jan 2025</span></div>
            <div className="info-row"><span className="info-lbl">Education</span><span className="info-val">B.Tech CSE, 3rd Year</span></div>
          </div>

          <div className="card">
            <div className="card-head"><h3>Skills</h3><button className="card-edit-btn">Manage</button></div>
            <div className="skills-wrap">
              <span className="skill-chip chip-blue">Teamwork</span>
              <span className="skill-chip chip-teal">First Aid</span>
              <span className="skill-chip chip-purple">Teaching</span>
              <span className="skill-chip chip-amber">Event Planning</span>
              <span className="skill-chip chip-coral">Communication</span>
              <span className="skill-chip chip-blue">Photography</span>
              <span className="skill-chip chip-teal">Data Entry</span>
              <button className="add-skill-btn">+ Add skill</button>
            </div>
          </div>

          <div className="card">
            <div className="card-head"><h3>Availability</h3><button className="card-edit-btn">Edit</button></div>
            <div className="avail-grid">
              <div className="avail-item"><span className="dot dot-on"/>Monday</div>
              <div className="avail-item"><span className="dot dot-off"/>Tuesday</div>
              <div className="avail-item"><span className="dot dot-on"/>Wednesday</div>
              <div className="avail-item"><span className="dot dot-off"/>Thursday</div>
              <div className="avail-item"><span className="dot dot-on"/>Friday</div>
              <div className="avail-item"><span className="dot dot-on"/>Saturday</div>
              <div className="avail-item"><span className="dot dot-on"/>Sunday</div>
            </div>
          </div>

          <div className="danger-zone">
            <div className="card-head"><h3>Danger zone</h3></div>
            <button className="danger-btn" aria-label="Deactivate your account - this action is reversible">Deactivate account</button>
            <button className="danger-btn" aria-label="Delete your account permanently - this action cannot be undone">Delete account permanently</button>
          </div>
        </div>

        <div className="right-col">
          {editMode && (
            <div className="card" style={{ border: '2px solid #1a6fc4' }}>
              <div className="card-head"><h3>Edit profile</h3><button className="card-edit-btn" onClick={toggleEditMode} aria-label="Cancel editing">✕ Cancel</button></div>
              <div className="form-row">
                <div className="form-group"><label htmlFor="first-name" className="form-label">First name</label><input id="first-name" className="form-input" defaultValue="Charitha" aria-label="Enter your first name"/></div>
                <div className="form-group"><label htmlFor="last-name" className="form-label">Last name</label><input id="last-name" className="form-input" defaultValue="nl" aria-label="Enter your last name"/></div>
              </div>
              <div className="form-group"><label htmlFor="email" className="form-label">Email address</label><input id="email" type="email" className="form-input" defaultValue="nlcharitha@gmail.com" aria-label="Enter your email address"/></div>
              <div className="form-group"><label htmlFor="phone" className="form-label">Phone number</label><input id="phone" type="tel" className="form-input" defaultValue="+91 90361 XXXXX" aria-label="Enter your phone number"/></div>
              <div className="form-group"><label htmlFor="location" className="form-label">City / Location</label><input id="location" className="form-input" defaultValue="Bengaluru, Karnataka" aria-label="Enter your city or location"/></div>
              <div className="form-group"><label htmlFor="bio" className="form-label">About / Bio</label><textarea id="bio" className="form-input" aria-label="Enter your biography or about section">Passionate about community development and environmental causes. Final year CSE student looking to make a positive impact through volunteering.</textarea></div>
              <div className="form-group"><label htmlFor="education" className="form-label">Education</label><input id="education" className="form-input" defaultValue="B.Tech CSE, 3rd Year" aria-label="Enter your education details"/></div>
              <button className="save-btn" onClick={handleSaveProfile} disabled={isLoading} aria-label="Save profile changes">Save changes</button>
            </div>
          )}

          {!editMode && (
            <div className="card" id="aboutCard">
              <div className="card-head"><h3>About me</h3><button className="card-edit-btn" onClick={toggleEditMode}>Edit</button></div>
              <p style={{ fontSize: '13px', color: '#4b5563', lineHeight: 1.8 }}>
                Passionate about community development and environmental causes. Final year CSE student looking to make a positive impact through volunteering. I believe that small acts of kindness can create big ripples of change.
              </p>
            </div>
          )}

          <div className="card">
            <div className="card-head"><h3>Achievements</h3></div>
            <div className="achiev-grid">
              <div className="achiev-item achiev-blue"><div className="achiev-icon">🌟</div><div className="achiev-name">Top Volunteer</div><div className="achiev-sub">March 2026</div></div>
              <div className="achiev-item achiev-green"><div className="achiev-icon">🌳</div><div className="achiev-name">Eco Warrior</div><div className="achiev-sub">5 eco events</div></div>
              <div className="achiev-item achiev-amber"><div className="achiev-icon">🏅</div><div className="achiev-name">50 Hours Club</div><div className="achiev-sub">42h / 50h</div></div>
              <div className="achiev-item achiev-purple"><div className="achiev-icon">📚</div><div className="achiev-name">Educator</div><div className="achiev-sub">Teaching events</div></div>
            </div>
          </div>

          <div className="card">
            <div className="card-head"><h3>My impact</h3></div>
            <div className="progress-row"><div className="pr-head"><span>Environmental</span><span>3 events</span></div><div className="pr-track"><div className="pr-fill fill-teal" style={{ width: '60%' }} /></div></div>
            <div className="progress-row"><div className="pr-head"><span>Education & literacy</span><span>2 events</span></div><div className="pr-track"><div className="pr-fill fill-purple" style={{ width: '40%' }} /></div></div>
            <div className="progress-row"><div className="pr-head"><span>Health & welfare</span><span>2 events</span></div><div className="pr-track"><div className="pr-fill fill-blue" style={{ width: '40%' }} /></div></div>
            <div className="progress-row"><div className="pr-head"><span>Food & nutrition</span><span>1 event</span></div><div className="pr-track"><div className="pr-fill fill-teal" style={{ width: '20%' }} /></div></div>
          </div>

          <div className="card">
            <div className="card-head"><h3>Recent activity</h3><Link to="/applications" style={{ fontSize: '12px', color: '#1a6fc4', textDecoration: 'none', fontWeight: 500 }}>See all →</Link></div>
            <div className="timeline">
              <div className="t-item"><div className="t-left"><div className="t-dot"/><div className="t-line"/></div><div className="t-right"><div className="t-title">Applied — Tree Plantation Drive</div><div className="t-org">Green Earth Foundation · Apr 12, 2026</div><div className="t-tags"><span className="t-tag green">Approved</span><span className="t-tag">Environment</span></div></div></div>
              <div className="t-item"><div className="t-left"><div className="t-dot green"/><div className="t-line"/></div><div className="t-right"><div className="t-title">Attended — Blood Donation Camp</div><div className="t-org">Red Cross Society · Mar 28, 2026</div><div className="t-tags"><span className="t-tag blue">Certificate earned</span><span className="t-tag">Health</span></div></div></div>
              <div className="t-item"><div className="t-left"><div className="t-dot green"/><div className="t-line"/></div><div className="t-right"><div className="t-title">Attended — River Clean-Up Campaign</div><div className="t-org">Clean India Mission · Feb 20, 2026</div><div className="t-tags"><span className="t-tag blue">Certificate earned</span><span className="t-tag">Environment</span></div></div></div>
              <div className="t-item"><div className="t-left"><div className="t-dot amber"/><div className="t-line"/></div><div className="t-right"><div className="t-title">Applied — Health Awareness Camp</div><div className="t-org">Swasthya Seva NGO · May 5, 2026</div><div className="t-tags"><span className="t-tag" style={{ background: '#fef3c7', color: '#92400e' }}>Pending</span><span className="t-tag">Health</span></div></div></div>
            </div>
          </div>
        </div>
      </div>
      {isLoading && <LoadingSpinner message="Saving your profile..." />}
    </div>
  );
};

export default memo(Profile);
