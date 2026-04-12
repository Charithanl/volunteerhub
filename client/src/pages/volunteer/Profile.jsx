import React, { memo, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Topbar from '../../components/volunteer/Topbar';
import './Profile.css';

const PROFILE_STORAGE_KEY = 'volunteerhub-profile';

const defaultProfile = {
  firstName: 'Charitha',
  lastName: 'NL',
  email: 'nlcharitha@gmail.com',
  phone: '+91 9036XXXXXX',
  location: 'Bengaluru, Karnataka',
  memberSince: 'Jan 2025',
  education: 'B.Tech CSE, 3rd Year',
  bio: 'Passionate about community development and environmental causes. Final year CSE student looking to make a positive impact through volunteering. I believe that small acts of kindness can create big ripples of change.',
  skills: [
    'Teamwork',
    'First Aid',
    'Teaching',
    'Event Planning',
    'Communication',
    'Photography',
    'Data Entry',
  ],
};

const skillPaletteClasses = [
  'chip-blue',
  'chip-teal',
  'chip-purple',
  'chip-amber',
  'chip-coral',
];

const readStoredProfile = () => {
  if (typeof window === 'undefined') {
    return defaultProfile;
  }

  try {
    const storedProfile = window.localStorage.getItem(PROFILE_STORAGE_KEY);

    if (!storedProfile) {
      return defaultProfile;
    }

    const parsedProfile = JSON.parse(storedProfile);

    return {
      ...defaultProfile,
      ...parsedProfile,
      skills: Array.isArray(parsedProfile.skills) && parsedProfile.skills.length > 0
        ? parsedProfile.skills
        : defaultProfile.skills,
    };
  } catch {
    return defaultProfile;
  }
};

const sanitizeProfile = (profile) => ({
  ...profile,
  firstName: profile.firstName.trim() || defaultProfile.firstName,
  lastName: profile.lastName.trim() || defaultProfile.lastName,
  email: profile.email.trim() || defaultProfile.email,
  phone: profile.phone.trim() || defaultProfile.phone,
  location: profile.location.trim() || defaultProfile.location,
  education: profile.education.trim() || defaultProfile.education,
  bio: profile.bio.trim() || defaultProfile.bio,
});

const Profile = () => {
  const [profile, setProfile] = useState(() => readStoredProfile());
  const [formData, setFormData] = useState(() => readStoredProfile());
  const [editMode, setEditMode] = useState(false);
  const [newSkill, setNewSkill] = useState('');
  const [saveMessage, setSaveMessage] = useState('');
  const [skillError, setSkillError] = useState('');
  const skillInputRef = useRef(null);

  useEffect(() => {
    window.localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    if (!saveMessage && !skillError) {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      setSaveMessage('');
      setSkillError('');
    }, 2500);

    return () => window.clearTimeout(timer);
  }, [saveMessage, skillError]);

  const fullName = useMemo(
    () => `${profile.firstName} ${profile.lastName}`.trim(),
    [profile.firstName, profile.lastName],
  );

  const initials = useMemo(() => {
    return `${profile.firstName?.[0] || ''}${profile.lastName?.[0] || ''}`.toUpperCase() || 'V';
  }, [profile.firstName, profile.lastName]);

  const startEditing = () => {
    setFormData(profile);
    setEditMode(true);
    setSaveMessage('');
    setSkillError('');
  };

  const cancelEditing = () => {
    setFormData(profile);
    setEditMode(false);
  };

  const handleFormChange = (event) => {
    const { id, value } = event.target;
    setFormData((current) => ({
      ...current,
      [id]: value,
    }));
  };

  const handleSaveProfile = () => {
    const updatedProfile = sanitizeProfile(formData);
    setProfile(updatedProfile);
    setFormData(updatedProfile);
    setEditMode(false);
    setSaveMessage('Profile updated successfully.');
  };

  const handleAddSkill = () => {
    const trimmedSkill = newSkill.trim();

    if (!trimmedSkill) {
      setSkillError('Enter a skill before adding it.');
      return;
    }

    if (profile.skills.some((skill) => skill.toLowerCase() === trimmedSkill.toLowerCase())) {
      setSkillError('That skill is already listed.');
      return;
    }

    const nextSkills = [...profile.skills, trimmedSkill];

    setProfile((current) => ({
      ...current,
      skills: nextSkills,
    }));
    setFormData((current) => ({
      ...current,
      skills: nextSkills,
    }));
    setNewSkill('');
    setSkillError('');
    setSaveMessage(`Added ${trimmedSkill}.`);
    skillInputRef.current?.focus();
  };

  const handleRemoveSkill = (skillToRemove) => {
    const nextSkills = profile.skills.filter((skill) => skill !== skillToRemove);

    setProfile((current) => ({
      ...current,
      skills: nextSkills,
    }));
    setFormData((current) => ({
      ...current,
      skills: nextSkills,
    }));
    setSaveMessage(`Removed ${skillToRemove}.`);
  };

  return (
    <div className="profile-page">
      <Topbar active="profile" />

      <div className="hero-card">
        <div className="hero-banner">
          <button className="edit-cover-btn" onClick={() => alert('Cover edit placeholder')}>
            <svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" /></svg>
            Edit cover
          </button>
        </div>
        <div className="hero-body">
          <div className="avatar-wrap">
            <div className="avatar-lg">{initials}</div>
            <button className="avatar-edit" onClick={editMode ? cancelEditing : startEditing}>
              <svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" /></svg>
            </button>
          </div>

          <div className="hero-info">
            <div className="hero-info-left">
              <h2>{fullName}</h2>
              <div className="tagline">Passionate volunteer & community builder · {profile.location}</div>
              <div className="hero-badges">
                <span className="h-badge hb-blue">Verified Volunteer</span>
                <span className="h-badge hb-green">Top Contributor</span>
                <span className="h-badge hb-purple">42 hrs logged</span>
              </div>
            </div>
            <button className="btn-edit-profile" onClick={editMode ? cancelEditing : startEditing}>
              <svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" /></svg>
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

      {(saveMessage || skillError) && (
        <div className={`profile-feedback ${skillError ? 'is-error' : 'is-success'}`} role="status" aria-live="polite">
          {skillError || saveMessage}
        </div>
      )}

      <div className="body-grid">
        <div className="left-col">
          <div className="card">
            <div className="card-head">
              <h3>Personal info</h3>
              <button className="card-edit-btn" onClick={editMode ? cancelEditing : startEditing}>
                {editMode ? 'Cancel' : 'Edit'}
              </button>
            </div>
            <div className="info-row"><span className="info-lbl">Email</span><span className="info-val">{profile.email}</span></div>
            <div className="info-row"><span className="info-lbl">Phone</span><span className="info-val">{profile.phone}</span></div>
            <div className="info-row"><span className="info-lbl">Location</span><span className="info-val">{profile.location}</span></div>
            <div className="info-row"><span className="info-lbl">Member since</span><span className="info-val">{profile.memberSince}</span></div>
            <div className="info-row"><span className="info-lbl">Education</span><span className="info-val">{profile.education}</span></div>
          </div>

          <div className="card">
            <div className="card-head">
              <h3>Skills</h3>
              <button className="card-edit-btn" onClick={() => skillInputRef.current?.focus()}>
                Add skill
              </button>
            </div>
            <div className="skills-wrap">
              {profile.skills.map((skill, index) => (
                <span
                  key={skill}
                  className={`skill-chip ${skillPaletteClasses[index % skillPaletteClasses.length]}`}
                >
                  <span>{skill}</span>
                  <button
                    type="button"
                    className="skill-remove-btn"
                    onClick={() => handleRemoveSkill(skill)}
                    aria-label={`Remove ${skill}`}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <div className="skills-editor">
              <input
                ref={skillInputRef}
                className="skill-input"
                type="text"
                placeholder="Add a new skill"
                value={newSkill}
                onChange={(event) => setNewSkill(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    event.preventDefault();
                    handleAddSkill();
                  }
                }}
                aria-label="Add a new skill"
              />
              <button type="button" className="add-skill-btn" onClick={handleAddSkill}>
                + Add skill
              </button>
            </div>
          </div>

          <div className="card">
            <div className="card-head"><h3>Availability</h3><button className="card-edit-btn">Edit</button></div>
            <div className="avail-grid">
              <div className="avail-item"><span className="dot dot-on" />Monday</div>
              <div className="avail-item"><span className="dot dot-off" />Tuesday</div>
              <div className="avail-item"><span className="dot dot-on" />Wednesday</div>
              <div className="avail-item"><span className="dot dot-off" />Thursday</div>
              <div className="avail-item"><span className="dot dot-on" />Friday</div>
              <div className="avail-item"><span className="dot dot-on" />Saturday</div>
              <div className="avail-item"><span className="dot dot-on" />Sunday</div>
            </div>
          </div>

          <div className="danger-zone">
            <div className="card-head"><h3>Danger zone</h3></div>
            <button className="danger-btn" aria-label="Deactivate your account - this action is reversible">Deactivate account</button>
            <button className="danger-btn" aria-label="Delete your account permanently - this action cannot be undone">Delete account permanently</button>
          </div>
        </div>

        <div className="right-col">
          {editMode ? (
            <div className="card profile-editor-card">
              <div className="card-head">
                <h3>Edit profile</h3>
                <button className="card-edit-btn" onClick={cancelEditing} aria-label="Cancel editing">
                  Cancel
                </button>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="firstName" className="form-label">First name</label>
                  <input id="firstName" className="form-input" value={formData.firstName} onChange={handleFormChange} />
                </div>
                <div className="form-group">
                  <label htmlFor="lastName" className="form-label">Last name</label>
                  <input id="lastName" className="form-input" value={formData.lastName} onChange={handleFormChange} />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="email" className="form-label">Email address</label>
                <input id="email" type="email" className="form-input" value={formData.email} onChange={handleFormChange} />
              </div>
              <div className="form-group">
                <label htmlFor="phone" className="form-label">Phone number</label>
                <input id="phone" type="tel" className="form-input" value={formData.phone} onChange={handleFormChange} />
              </div>
              <div className="form-group">
                <label htmlFor="location" className="form-label">City / Location</label>
                <input id="location" className="form-input" value={formData.location} onChange={handleFormChange} />
              </div>
              <div className="form-group">
                <label htmlFor="bio" className="form-label">About / Bio</label>
                <textarea id="bio" className="form-input" value={formData.bio} onChange={handleFormChange} />
              </div>
              <div className="form-group">
                <label htmlFor="education" className="form-label">Education</label>
                <input id="education" className="form-input" value={formData.education} onChange={handleFormChange} />
              </div>
              <div className="profile-form-actions">
                <button className="secondary-btn" type="button" onClick={cancelEditing}>Cancel</button>
                <button className="save-btn" type="button" onClick={handleSaveProfile}>Save changes</button>
              </div>
            </div>
          ) : (
            <div className="card" id="aboutCard">
              <div className="card-head"><h3>About me</h3><button className="card-edit-btn" onClick={startEditing}>Edit</button></div>
              <p className="about-copy">
                {profile.bio}
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
              <div className="t-item"><div className="t-left"><div className="t-dot" /><div className="t-line" /></div><div className="t-right"><div className="t-title">Applied - Tree Plantation Drive</div><div className="t-org">Green Earth Foundation · Apr 12, 2026</div><div className="t-tags"><span className="t-tag green">Approved</span><span className="t-tag">Environment</span></div></div></div>
              <div className="t-item"><div className="t-left"><div className="t-dot green" /><div className="t-line" /></div><div className="t-right"><div className="t-title">Attended - Blood Donation Camp</div><div className="t-org">Red Cross Society · Mar 28, 2026</div><div className="t-tags"><span className="t-tag blue">Certificate earned</span><span className="t-tag">Health</span></div></div></div>
              <div className="t-item"><div className="t-left"><div className="t-dot green" /><div className="t-line" /></div><div className="t-right"><div className="t-title">Attended - River Clean-Up Campaign</div><div className="t-org">Clean India Mission · Feb 20, 2026</div><div className="t-tags"><span className="t-tag blue">Certificate earned</span><span className="t-tag">Environment</span></div></div></div>
              <div className="t-item"><div className="t-left"><div className="t-dot amber" /><div className="t-line" /></div><div className="t-right"><div className="t-title">Applied - Health Awareness Camp</div><div className="t-org">Swasthya Seva NGO · May 5, 2026</div><div className="t-tags"><span className="t-tag pending-tag">Pending</span><span className="t-tag">Health</span></div></div></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(Profile);
