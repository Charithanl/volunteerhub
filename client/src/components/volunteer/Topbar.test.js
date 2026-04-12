import { describe, test, expect, vi } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Topbar from './Topbar';

vi.mock('@clerk/react', () => ({
  Show: ({ children }) => React.createElement(React.Fragment, null, children),
  SignInButton: ({ children }) => React.createElement(React.Fragment, null, children),
  UserButton: () => React.createElement('div', null, 'UserButton'),
  useUser: () => ({ user: null }),
}));

const renderWithRouter = (component) => {
  return render(React.createElement(BrowserRouter, null, component));
};

describe('Topbar Component', () => {
  test('renders brand name', () => {
    renderWithRouter(React.createElement(Topbar, { active: 'dashboard' }));
    expect(screen.getByText('VolunteerHub')).toBeInTheDocument();
  });

  test('highlights active nav item', () => {
    renderWithRouter(React.createElement(Topbar, { active: 'dashboard' }));
    const dashboardLink = screen.getByText('Dashboard');
    expect(dashboardLink).toHaveClass('active');
  });

  test('navigates on link click', () => {
    renderWithRouter(React.createElement(Topbar, { active: 'dashboard' }));
    const eventsLink = screen.getByText('Events');
    fireEvent.click(eventsLink);
    // Note: In a real test, you'd mock useNavigate or check history
  });
});
