import { beforeEach, describe, expect, test, vi } from 'vitest';
import React from 'react';
import { fireEvent, render, screen, waitFor, waitForElementToBeRemoved } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Profile from './Profile';
import { profileApi } from '../../lib/api';

const getTokenMock = vi.fn();
const mockUser = {
  firstName: 'Charitha',
  lastName: 'NL',
  primaryEmailAddress: {
    emailAddress: 'nlcharitha@gmail.com',
  },
};

vi.mock('@clerk/react', () => ({
  useAuth: () => ({
    getToken: getTokenMock,
    isLoaded: true,
    isSignedIn: true,
  }),
  useUser: () => ({
    isLoaded: true,
    user: mockUser,
  }),
}));

vi.mock('../../components/volunteer/Topbar', () => ({
  default: () => <div>Topbar</div>,
}));

vi.mock('../../lib/api', () => ({
  profileApi: {
    getMyProfile: vi.fn(),
    saveMyProfile: vi.fn(),
  },
}));

const baseProfileResponse = {
  profile: {
    firstName: 'Charitha',
    lastName: 'NL',
    email: 'nlcharitha@gmail.com',
    phone: '+91 9036XXXXXX',
    location: 'Bengaluru, Karnataka',
    education: 'B.Tech CSE, 3rd Year',
    bio: 'Passionate about community development and environmental causes.',
    skills: ['Teamwork', 'Communication'],
    memberSince: '2025-01-01T00:00:00.000Z',
  },
};

const renderProfile = () => render(
  <MemoryRouter>
    <Profile />
  </MemoryRouter>,
);

describe('Profile page', () => {
  beforeEach(() => {
    getTokenMock.mockResolvedValue('test-token');
    profileApi.getMyProfile.mockResolvedValue(baseProfileResponse);
    profileApi.saveMyProfile.mockReset();
  });

  test('saves updated personal information through the API and reflects it on the page', async () => {
    profileApi.saveMyProfile.mockResolvedValue({
      profile: {
        ...baseProfileResponse.profile,
        firstName: 'Ananya',
        location: 'Hyderabad, Telangana',
        email: 'ananya@example.com',
      },
    });

    renderProfile();

    await waitForElementToBeRemoved(() => screen.getByText(/loading your profile/i));
    expect(screen.getByText('Charitha NL')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /edit profile/i }));
    fireEvent.change(screen.getByLabelText(/first name/i), {
      target: { value: 'Ananya' },
    });
    fireEvent.change(screen.getByLabelText(/city \/ location/i), {
      target: { value: 'Hyderabad, Telangana' },
    });
    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: 'ananya@example.com' },
    });

    fireEvent.click(screen.getByRole('button', { name: /save changes/i }));

    await waitFor(() => {
      expect(profileApi.saveMyProfile).toHaveBeenCalled();
    });

    expect(screen.getByText('Ananya NL')).toBeInTheDocument();
    expect(screen.getByText('ananya@example.com')).toBeInTheDocument();
    expect(screen.getAllByText(/Hyderabad, Telangana/i).length).toBeGreaterThan(0);
  });

  test('adds a skill through the API', async () => {
    profileApi.saveMyProfile.mockResolvedValue({
      profile: {
        ...baseProfileResponse.profile,
        skills: ['Teamwork', 'Communication', 'Public Speaking'],
      },
    });

    renderProfile();

    await waitForElementToBeRemoved(() => screen.getByText(/loading your profile/i));
    expect(screen.getByText('Charitha NL')).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText(/add a new skill/i), {
      target: { value: 'Public Speaking' },
    });
    fireEvent.click(screen.getAllByRole('button', { name: /add skill/i })[1]);

    await waitFor(() => {
      expect(profileApi.saveMyProfile).toHaveBeenCalled();
    });

    expect(screen.getByText('Public Speaking')).toBeInTheDocument();
  });
});
