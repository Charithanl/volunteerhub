import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Show, SignInButton, UserButton, useUser } from '@clerk/react'
import './Topbar.css'

const navItems = [
  { name: 'Dashboard', path: '/' },
  { name: 'Events', path: '/event' },
  { name: 'Applications', path: '/applications' },
  { name: 'Profile', path: '/profile' },
]

const Topbar = ({ active }) => {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const { user } = useUser()

  return (
    <>
      <header className="topbar">
        <Link className="brand" to="/">
          <div className="brand-dot">
            <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/></svg>
          </div>
          <span className="brand-name">VolunteerHub</span>
        </Link>

        <div className="nav-history">
          <button onClick={() => navigate(-1)} aria-label="Go back" className="history-btn">←</button>
          <button onClick={() => navigate(1)} aria-label="Go forward" className="history-btn">→</button>
        </div>

        <button className="hamburger md:hidden" onClick={() => setOpen(true)} aria-label="Open menu">
          <svg viewBox="0 0 24 24" fill="currentColor" height="24" width="24"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
        </button>

        <nav className="nav-links hidden md:flex" role="navigation" aria-label="Main navigation">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={item.name.toLowerCase() === active ? 'active' : ''}
              aria-current={item.name.toLowerCase() === active ? 'page' : undefined}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="topbar-right">
          <button
            className="notif-btn"
            aria-label="Notifications"
            title="View notifications"
          >
            <svg viewBox="0 0 24 24"><path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/></svg>
            <div className="notif-badge" aria-hidden="true"></div>
          </button>
          <Show when="signed-out">
            <SignInButton mode="modal">
              <button className="avatar avatar-btn" aria-label="Sign in or sign up">
                pf
              </button>
            </SignInButton>
          </Show>
          <Show when="signed-in">
            <UserButton />
          </Show>
        </div>
      </header>

      {open && (
        <div className="mobile-menu-overlay" onClick={() => setOpen(false)}>
          <aside className="mobile-menu" onClick={(e) => e.stopPropagation()}>
            <div className="mobile-menu-header">
              <h3>Menu</h3>
              <button onClick={() => setOpen(false)} aria-label="Close menu">✕</button>
            </div>
            <nav className="mobile-nav">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={item.name.toLowerCase() === active ? 'active' : ''}
                  onClick={() => setOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </aside>
        </div>
      )}
    </>
  )
}

export default Topbar
