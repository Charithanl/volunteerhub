import { ApplicationStatus } from '@prisma/client';
import { prisma } from '../lib/prisma.js';
import { serializeApplication } from '../lib/serializers.js';
import { getClerkUserId } from '../utils/auth.js';

const applicationInclude = {
  event: {
    include: {
      organization: true,
      eventSkills: {
        include: {
          skill: true,
        },
      },
    },
  },
};

const getCurrentUser = async (request) => {
  const clerkUserId = getClerkUserId(request);
  return prisma.user.findUnique({
    where: { clerkUserId },
  });
};

export const listMyApplications = async (request, response) => {
  const user = await getCurrentUser(request);

  if (!user) {
    return response.json({ applications: [] });
  }

  const applications = await prisma.application.findMany({
    where: {
      userId: user.id,
      status: {
        not: ApplicationStatus.WITHDRAWN,
      },
    },
    include: applicationInclude,
    orderBy: {
      appliedAt: 'desc',
    },
  });

  response.json({
    applications: applications.map(serializeApplication),
  });
};

export const listApplications = async (_request, response) => {
  const applications = await prisma.application.findMany({
    where: {
      status: {
        not: ApplicationStatus.WITHDRAWN,
      },
    },
    include: applicationInclude,
    orderBy: {
      appliedAt: 'desc',
    },
  });

  response.json({
    applications: applications.map(serializeApplication),
  });
};

export const getMyApplicationById = async (request, response) => {
  const user = await getCurrentUser(request);

  if (!user) {
    return response.status(404).json({
      message: 'Application not found.',
    });
  }

  const application = await prisma.application.findFirst({
    where: {
      id: request.params.applicationId,
      userId: user.id,
      status: {
        not: ApplicationStatus.WITHDRAWN,
      },
    },
    include: applicationInclude,
  });

  if (!application) {
    return response.status(404).json({
      message: 'Application not found.',
    });
  }

  response.json({
    application: serializeApplication(application),
  });
};

export const withdrawMyApplication = async (request, response) => {
  const user = await getCurrentUser(request);

  if (!user) {
    return response.status(404).json({
      message: 'Application not found.',
    });
  }

  const application = await prisma.application.findFirst({
    where: {
      id: request.params.applicationId,
      userId: user.id,
      status: {
        in: [ApplicationStatus.PENDING, ApplicationStatus.APPROVED],
      },
    },
  });

  if (!application) {
    return response.status(404).json({
      message: 'Only pending or approved applications can be withdrawn.',
    });
  }

  await prisma.application.update({
    where: { id: application.id },
    data: {
      status: ApplicationStatus.WITHDRAWN,
      withdrawnAt: new Date(),
    },
  });

  response.json({
    message: 'Application withdrawn successfully.',
  });
};
