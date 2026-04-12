import { EventStatus, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const seedEvents = [
  {
    organization: {
      name: 'Green Earth Foundation',
      description: 'Community-led environmental restoration and sustainability drives.',
      isVerified: true,
      foundedYear: 2010,
    },
    event: {
      title: 'Annual Tree Plantation Drive 2026',
      description:
        'Join us for our annual tree plantation drive aimed at increasing green cover across Gurugram. Volunteers will plant saplings, learn about native species, and help restore degraded areas near the Aravalli biodiversity zone. All equipment including gloves, spades, and saplings will be provided on the day. Refreshments and a short orientation session will also be included before the activity begins.',
      date: new Date('2026-04-12T08:00:00.000Z'),
      startTime: new Date('2026-04-12T08:00:00.000Z'),
      endTime: new Date('2026-04-12T12:00:00.000Z'),
      location: 'Sector 21, Gurugram',
      capacity: 50,
      spotsFilled: 31,
      category: 'Environment',
      difficulty: 'Low - Medium',
      minAge: 14,
      language: 'Hindi / English',
      certificateProvided: true,
      status: EventStatus.PUBLISHED,
      skills: ['Teamwork', 'Physical fitness', 'Environmental awareness', 'First aid', 'Communication'],
    },
  },
  {
    organization: {
      name: 'TechForGood NGO',
      description: 'Digital inclusion and community learning programs for underserved groups.',
      isVerified: true,
      foundedYear: 2017,
    },
    event: {
      title: 'Digital Literacy Workshop',
      description:
        'Help run a beginner-friendly digital literacy workshop for students and working adults learning basic computer and internet skills. Volunteers will guide participants through practice sessions, support device setup, and answer simple technology questions.',
      date: new Date('2026-04-18T10:00:00.000Z'),
      startTime: new Date('2026-04-18T10:00:00.000Z'),
      endTime: new Date('2026-04-18T16:00:00.000Z'),
      location: 'Community Centre, Delhi',
      capacity: 30,
      spotsFilled: 18,
      category: 'Education',
      difficulty: 'Low',
      minAge: 16,
      language: 'Hindi / English',
      certificateProvided: true,
      status: EventStatus.PUBLISHED,
      skills: ['Teaching', 'Patience', 'Basic computer skills', 'Communication'],
    },
  },
  {
    organization: {
      name: 'Swasthya Seva NGO',
      description: 'Rural health outreach and awareness camps across North India.',
      isVerified: true,
      foundedYear: 2012,
    },
    event: {
      title: 'Health Awareness Camp',
      description:
        'Help the outreach team organize a rural awareness camp focused on preventive care, nutrition, and basic health screening support. Volunteers may assist with patient flow, registration desks, and awareness material distribution throughout the day.',
      date: new Date('2026-05-05T08:30:00.000Z'),
      startTime: new Date('2026-05-05T08:30:00.000Z'),
      endTime: new Date('2026-05-05T16:30:00.000Z'),
      location: 'Village Mewat, Haryana',
      capacity: 25,
      spotsFilled: 14,
      category: 'Health',
      difficulty: 'Medium',
      minAge: 18,
      language: 'Hindi',
      certificateProvided: true,
      status: EventStatus.PUBLISHED,
      skills: ['Communication', 'Empathy', 'Event support', 'Data entry'],
    },
  },
];

const seed = async () => {
  const existingEvents = await prisma.event.count();

  if (existingEvents > 0) {
    console.log('Seed skipped: events already exist.');
    return;
  }

  for (const entry of seedEvents) {
    const organization = await prisma.organization.create({
      data: entry.organization,
    });

    const event = await prisma.event.create({
      data: {
        organizationId: organization.id,
        title: entry.event.title,
        description: entry.event.description,
        date: entry.event.date,
        startTime: entry.event.startTime,
        endTime: entry.event.endTime,
        location: entry.event.location,
        capacity: entry.event.capacity,
        spotsFilled: entry.event.spotsFilled,
        category: entry.event.category,
        difficulty: entry.event.difficulty,
        minAge: entry.event.minAge,
        language: entry.event.language,
        certificateProvided: entry.event.certificateProvided,
        status: entry.event.status,
      },
    });

    for (const skillName of entry.event.skills) {
      const skill = await prisma.skill.upsert({
        where: { name: skillName },
        update: {},
        create: { name: skillName },
      });

      await prisma.eventSkill.create({
        data: {
          eventId: event.id,
          skillId: skill.id,
        },
      });
    }
  }

  console.log('Seed complete: organizations, events, and skills created.');
};

seed()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
