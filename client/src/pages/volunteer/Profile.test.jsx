import { beforeEach, describe, expect, test, vi } from 'vitest';
import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Profile from './Profile';

vi.mock('../../components/volunteer/Topbar', () => ({
  default: () => <div>Topbar</div>,
}));

const renderProfile = () => render(
  <MemoryRouter>
    <Profile />
  </MemoryRouter>,
);

describe('Profile page', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  test('saves updated personal information and reflects it on the page', () => {
    renderProfile();

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

    expect(screen.getByText('Ananya NL')).toBeInTheDocument();
    expect(screen.getByText('ananya@example.com')).toBeInTheDocument();
    expect(screen.getAllByText(/Hyderabad, Telangana/i).length).toBeGreaterThan(0);

    const storedProfile = JSON.parse(window.localStorage.getItem('volunteerhub-profile'));
    expect(storedProfile.firstName).toBe('Ananya');
    expect(storedProfile.location).toBe('Hyderabad, Telangana');
  });

  test('adds a skill and persists it', () => {
    renderProfile();

    fireEvent.change(screen.getByLabelText(/add a new skill/i), {
      target: { value: 'Public Speaking' },
    });
    fireEvent.click(screen.getByRole('button', { name: /\+ add skill/i }));

    expect(screen.getByText('Public Speaking')).toBeInTheDocument();

    const storedProfile = JSON.parse(window.localStorage.getItem('volunteerhub-profile'));
    expect(storedProfile.skills).toContain('Public Speaking');
  });
});
