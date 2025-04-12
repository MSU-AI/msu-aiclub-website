import { db } from '~/server/db';
import { userEvents } from '../schema';
import { eq } from 'drizzle-orm';

import { DbUser } from '../types';

export async function getUsers(): Promise<DbUser[]> {
  const results = await db.query.users.findMany({
    with: {
      roles: {
        with: {
          role: true
        }
      },
      projects: {
        with: {
          project: true
        }
      },
      events: {
        with: {
          event: true
        }
      }
    }
  });

  return results.map(user => ({
    id: user.id,
    email: user.email,
    metadata: user.raw_user_meta_data,
    // Add user_metadata to match the expected structure in ProjectSubmissionForm
    user_metadata: {
      full_name: user.raw_user_meta_data?.full_name || ''
    },
    roles: user.roles.map(ur => ({
      id: ur.role.id,
      name: ur.role.name || '',
      ...ur.role
    })),
    projects: user.projects.map(up => ({
      id: up.project.id,
      name: up.project.name || '',
      ...up.project
    })),
    // Only count points from visible events
    points: user.events.reduce((acc, event) => {
      if (!event.event || event.event.hidden) return acc;
      return acc + (event.event.points || 0);
    }, 0),
  }));
}

export async function getUserPoints(userId: string) {
  const userEventResults = await db.query.userEvents.findMany({
    where: eq(userEvents.userId, userId),
    with: {
      event: true
    }
  });

  // Calculate total points (including hidden events)
  const totalPoints = userEventResults.reduce((acc, ue) => {
    return acc + (ue.event?.points || 0);
  }, 0);

  // Calculate visible points (only non-hidden events)
  const visiblePoints = userEventResults.reduce((acc, ue) => {
    if (!ue.event || ue.event.hidden) return acc;
    return acc + ue.event.points;
  }, 0);

  return {
    totalPoints,
    visiblePoints
  };
}

