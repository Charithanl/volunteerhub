import { prisma } from '../lib/prisma.js';
import { serializeProfile } from '../lib/serializers.js';
import { getClerkUserId } from '../utils/auth.js';

const getProfileInclude = () => ({
  profile: true,
  volunteerSkills: {
    include: {
      skill: true,
    },
  },
});

const uniqueSkills = (skills = []) => {
  const cleanedSkills = skills
    .map((skill) => skill.trim())
    .filter(Boolean);

  return [...new Set(cleanedSkills)];
};

export const getMyProfile = async (request, response) => {
  const clerkUserId = getClerkUserId(request);

  const user = await prisma.user.findUnique({
    where: { clerkUserId },
    include: getProfileInclude(),
  });

  response.json({
    profile: serializeProfile(user),
  });
};

export const upsertMyProfile = async (request, response) => {
  const clerkUserId = getClerkUserId(request);
  const {
    email,
    firstName = '',
    lastName = '',
    phone = '',
    location = '',
    education = '',
    bio = '',
    skills = [],
  } = request.body;

  const existingUser = await prisma.user.findUnique({
    where: { clerkUserId },
  });

  const resolvedEmail = email?.trim() || existingUser?.email;

  if (!resolvedEmail) {
    return response.status(400).json({
      message: 'Email is required the first time a profile is saved.',
    });
  }

  const user = existingUser
    ? await prisma.user.update({
        where: { clerkUserId },
        data: {
          email: resolvedEmail,
          firstName: firstName.trim(),
          lastName: lastName.trim(),
        },
      })
    : await prisma.user.create({
        data: {
          clerkUserId,
          email: resolvedEmail,
          firstName: firstName.trim(),
          lastName: lastName.trim(),
        },
      });

  await prisma.volunteerProfile.upsert({
    where: { userId: user.id },
    create: {
      userId: user.id,
      phone: phone.trim(),
      location: location.trim(),
      education: education.trim(),
      bio: bio.trim(),
      memberSince: new Date(),
    },
    update: {
      phone: phone.trim(),
      location: location.trim(),
      education: education.trim(),
      bio: bio.trim(),
    },
  });

  await prisma.volunteerSkill.deleteMany({
    where: { userId: user.id },
  });

  const skillsToSave = uniqueSkills(skills);

  if (skillsToSave.length > 0) {
    const savedSkills = await Promise.all(
      skillsToSave.map((skillName) =>
        prisma.skill.upsert({
          where: { name: skillName },
          update: {},
          create: { name: skillName },
        }),
      ),
    );

    await prisma.volunteerSkill.createMany({
      data: savedSkills.map((skill) => ({
        userId: user.id,
        skillId: skill.id,
      })),
    });
  }

  const updatedUser = await prisma.user.findUnique({
    where: { id: user.id },
    include: getProfileInclude(),
  });

  response.json({
    message: 'Profile saved successfully.',
    profile: serializeProfile(updatedUser),
  });
};
