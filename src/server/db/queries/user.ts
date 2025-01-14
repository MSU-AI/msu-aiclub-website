import { db } from '~/server/db';
import { userRoles, userEvents } from '../schema';
import { User } from '@supabase/supabase-js';
import { eq } from 'drizzle-orm';

export async function getUsers() {
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
    roles: user.roles.map(ur => ur.role),
    projects: user.projects.map(up => up.project),
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

