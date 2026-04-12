import { beforeEach, describe, expect, test, vi } from 'vitest';
import React from 'react';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import Applications from './Applications';
import ApplicationDetails from './ApplicationDetails';

vi.mock('../../components/volunteer/Topbar', () => ({
  default: () => <div>Topbar</div>,
}));

const renderApplicationsFlow = (initialEntries = ['/applications']) => render(
  <MemoryRouter initialEntries={initialEntries}>
    <Routes>
      <Route path="/applications" element={<Applications />} />
      <Route path="/applications/:applicationId" element={<ApplicationDetails />} />
    </Routes>
  </MemoryRouter>,
);

describe('Applications page', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  test('opens the selected event details page when view is clicked', () => {
    renderApplicationsFlow();

    const targetCard = screen.getByText('Annual Tree Plantation Drive 2026').closest('.app-card');
    fireEvent.click(within(targetCard).getByRole('link', { name: 'View' }));

    expect(screen.getByRole('heading', { name: 'Annual Tree Plantation Drive 2026' })).toBeInTheDocument();
    expect(screen.getByText(/Your spot is confirmed/i)).toBeInTheDocument();
    expect(screen.getByText(/Organized by Green Earth Foundation/i)).toBeInTheDocument();
  });

  test('withdraw removes the application from the list and local storage', () => {
    renderApplicationsFlow();

    fireEvent.click(screen.getByRole('button', { name: /withdraw annual tree plantation drive 2026/i }));

    expect(screen.queryByText('Annual Tree Plantation Drive 2026')).not.toBeInTheDocument();

    const storedApplications = JSON.parse(window.localStorage.getItem('volunteerhub-applications'));
    expect(storedApplications.some((application) => application.id === 1)).toBe(false);
  });
});
