const formatDate = (value) => (value ? value.toISOString() : null);

export const serializeProfile = (user) => {
  if (!user) {
    return null;
  }

  return {
    id: user.id,
    clerkUserId: user.clerkUserId,
    email: user.email,
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    role: user.role,
    phone: user.profile?.phone || '',
    location: user.profile?.location || '',
    education: user.profile?.education || '',
    bio: user.profile?.bio || '',
    memberSince: formatDate(user.profile?.memberSince),
    skills: user.volunteerSkills.map((entry) => entry.skill.name),
  };
};

export const serializeEvent = (event) => ({
  id: event.id,
  title: event.title,
  description: event.description,
  date: formatDate(event.date),
  startTime: formatDate(event.startTime),
  endTime: formatDate(event.endTime),
  location: event.location,
  capacity: event.capacity,
  spotsFilled: event.spotsFilled,
  category: event.category,
  difficulty: event.difficulty,
  minAge: event.minAge,
  language: event.language,
  certificateProvided: event.certificateProvided,
  status: event.status,
  organization: event.organization
    ? {
        id: event.organization.id,
        name: event.organization.name,
        description: event.organization.description,
        isVerified: event.organization.isVerified,
        foundedYear: event.organization.foundedYear,
      }
    : null,
  skills: event.eventSkills.map((entry) => entry.skill.name),
});

export const serializeApplication = (application) => ({
  id: application.id,
  status: application.status,
  notes: application.notes,
  appliedAt: formatDate(application.appliedAt),
  withdrawnAt: formatDate(application.withdrawnAt),
  event: application.event ? serializeEvent(application.event) : null,
});
