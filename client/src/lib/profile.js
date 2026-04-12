import { formatMemberSince } from './formatters';

export const defaultProfile = {
  firstName: 'Volunteer',
  lastName: '',
  email: '',
  phone: '',
  location: 'Add your location',
  memberSince: '',
  education: 'Add your education details',
  bio: 'Tell people about the causes you care about and the kind of volunteering you enjoy.',
  skills: ['Teamwork', 'Communication'],
};

export const createProfileFromClerkUser = (user) => ({
  ...defaultProfile,
  firstName: user?.firstName || defaultProfile.firstName,
  lastName: user?.lastName || '',
  email: user?.primaryEmailAddress?.emailAddress || '',
});

export const normalizeProfileForUi = (profile, fallbackProfile = defaultProfile) => ({
  ...fallbackProfile,
  ...profile,
  memberSince: formatMemberSince(profile?.memberSince) || fallbackProfile.memberSince,
  skills: Array.isArray(profile?.skills) && profile.skills.length > 0 ? profile.skills : fallbackProfile.skills,
});
