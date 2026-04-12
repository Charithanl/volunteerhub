import { beforeEach, describe, expect, test, vi } from 'vitest';
import React from 'react';
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import Applications from './Applications';
import ApplicationDetails from './ApplicationDetails';
import { applicationsApi } from '../../lib/api';

const getTokenMock = vi.fn();

vi.mock('@clerk/react', () => ({
  useAuth: () => ({
    getToken: getTokenMock,
    isLoaded: true,
    isSignedIn: true,
  }),
}));

vi.mock('../../components/volunteer/Topbar', () => ({
  default: () => <div>Topbar</div>,
}));

vi.mock('../../lib/api', () => ({
  applicationsApi: {
    listMyApplications: vi.fn(),
    getMyApplicationById: vi.fn(),
    withdrawMyApplication: vi.fn(),
  },
}));

const applicationListResponse = {
  applications: [
    {
      id: 'application-1',
      status: 'APPROVED',
      notes: 'Your spot is confirmed.',
      event: {
        id: 'event-1',
        title: 'Annual Tree Plantation Drive 2026',
        date: '2026-04-12T08:00:00.000Z',
        startTime: '2026-04-12T08:00:00.000Z',
        endTime: '2026-04-12T12:00:00.000Z',
        location: 'Sector 21, Gurugram',
        capacity: 50,
        spotsFilled: 31,
        category: 'Environment',
        difficulty: 'Low - Medium',
        minAge: 14,
        language: 'Hindi / English',
        certificateProvided: true,
        organization: {
          name: 'Green Earth Foundation',
          isVerified: true,
          foundedYear: 2010,
        },
        skills: ['Teamwork', 'Communication'],
      },
    },
  ],
};

const applicationDetailsResponse = {
  application: applicationListResponse.applications[0],
};

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
    getTokenMock.mockResolvedValue('test-token');
    applicationsApi.listMyApplications.mockResolvedValue(applicationListResponse);
    applicationsApi.getMyApplicationById.mockResolvedValue(applicationDetailsResponse);
    applicationsApi.withdrawMyApplication.mockResolvedValue({ message: 'Application withdrawn successfully.' });
  });

  test('opens the selected event details page when view is clicked', async () => {
    renderApplicationsFlow();

    const targetCard = await screen.findByText('Annual Tree Plantation Drive 2026');
    fireEvent.click(within(targetCard.closest('.app-card')).getByRole('link', { name: 'View' }));

    expect(await screen.findByRole('heading', { name: 'Annual Tree Plantation Drive 2026' })).toBeInTheDocument();
    expect(screen.getByText(/Your spot is confirmed/i)).toBeInTheDocument();
    expect(screen.getByText(/Organized by Green Earth Foundation/i)).toBeInTheDocument();
  });

  test('withdraw removes the application from the list through the API', async () => {
    renderApplicationsFlow();

    expect(await screen.findByText('Annual Tree Plantation Drive 2026')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /withdraw annual tree plantation drive 2026/i }));

    await waitFor(() => {
      expect(applicationsApi.withdrawMyApplication).toHaveBeenCalledWith('application-1', 'test-token');
    });

    expect(screen.queryByText('Annual Tree Plantation Drive 2026')).not.toBeInTheDocument();
  });
});
