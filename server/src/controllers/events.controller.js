import { ApplicationStatus, EventStatus } from '@prisma/client';
import { prisma } from '../lib/prisma.js';
import { serializeApplication, serializeEvent } from '../lib/serializers.js';
import { getClerkUserId } from '../utils/auth.js';

const eventInclude = {
  organization: true,
  eventSkills: {
    include: {
      skill: true,
    },
  },
};

export const listEvents = async (_request, response) => {
  const events = await prisma.event.findMany({
    where: { status: EventStatus.PUBLISHED },
    include: eventInclude,
    orderBy: { date: 'asc' },
  });

  response.json({
    events: events.map(serializeEvent),
  });
};

export const getEventById = async (request, response) => {
  const event = await prisma.event.findUnique({
    where: { id: request.params.eventId },
    include: eventInclude,
  });

  if (!event) {
    return response.status(404).json({
      message: 'Event not found.',
    });
  }

  response.json({
    event: serializeEvent(event),
  });
};

export const applyToEvent = async (request, response) => {
  const clerkUserId = getClerkUserId(request);
  let user = await prisma.user.findUnique({
    where: { clerkUserId },
  });

  if (!user) {
    const email = request.body?.email?.trim();

    if (!email) {
      return response.status(400).json({
        message: 'Email is required to create your volunteer account before applying.',
      });
    }

    user = await prisma.user.create({
      data: {
        clerkUserId,
        email,
        firstName: request.body?.firstName?.trim() || '',
        lastName: request.body?.lastName?.trim() || '',
      },
    });
  }

  const event = await prisma.event.findUnique({
    where: { id: request.params.eventId },
  });

  if (!event || event.status !== EventStatus.PUBLISHED) {
    return response.status(404).json({
      message: 'Event not found or not open for applications.',
    });
  }

  if (event.spotsFilled >= event.capacity) {
    return response.status(409).json({
      message: 'This event is already full.',
    });
  }

  const existingApplication = await prisma.application.findUnique({
    where: {
      userId_eventId: {
        userId: user.id,
        eventId: event.id,
      },
    },
  });

  if (existingApplication && existingApplication.status !== ApplicationStatus.WITHDRAWN) {
    return response.status(409).json({
      message: 'You have already applied to this event.',
    });
  }

  const application = existingApplication
    ? await prisma.application.update({
        where: { id: existingApplication.id },
        data: {
          status: ApplicationStatus.PENDING,
          withdrawnAt: null,
          notes: request.body?.notes?.trim() || null,
          appliedAt: new Date(),
        },
        include: {
          event: {
            include: eventInclude,
          },
        },
      })
    : await prisma.application.create({
        data: {
          userId: user.id,
          eventId: event.id,
          notes: request.body?.notes?.trim() || null,
        },
        include: {
          event: {
            include: eventInclude,
          },
        },
      });

  response.status(201).json({
    message: 'Application submitted successfully.',
    application: serializeApplication(application),
  });
};
