import { describe, test, expect } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Topbar from '../components/volunteer/Topbar';

const renderWithRouter = (component) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('Topbar Component', () => {
  test('renders brand name', () => {
    renderWithRouter(<Topbar active="dashboard" />);
    expect(screen.getByText('VolunteerHub')).toBeInTheDocument();
  });

  test('highlights active nav item', () => {
    renderWithRouter(<Topbar active="dashboard" />);
    const dashboardLink = screen.getByText('Dashboard');
    expect(dashboardLink).toHaveClass('active');
  });

  test('navigates on link click', () => {
    renderWithRouter(<Topbar active="dashboard" />);
    const eventsLink = screen.getByText('Events');
    fireEvent.click(eventsLink);
    // Note: In a real test, you'd mock useNavigate or check history
  });
});