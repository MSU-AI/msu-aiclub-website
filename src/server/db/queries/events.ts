"use server"

import { eq, sql } from "drizzle-orm";
import { db } from "~/server/db";
import { events, userEvents } from "../schema";


export const getEvents = async (isAdmin = false) => {
  if (isAdmin) {
    return db.query.events.findMany();
  }
  return db.query.events.findMany({
    where: eq(events.hidden, false)
  });
}

export const getEventById = async (id: string | undefined) => {
    if (!id) {
        return null;
    }

    const event = await db.query.events.findFirst({
        where: eq(events.id, id),
    });

    return event;
};

export const getUserPoints = async (userId: string | undefined) => {
    if (!userId) {
        return 0;
    }

    const userEvent = await db.query.userEvents.findMany({
        where: eq(userEvents.userId, userId),
        with: {
            event: true
        }
    })

    console.log("userEvent", userEvent);
};

export async function getEventSignupCount(eventId: string | undefined) {
  console.log("eventId", eventId);

  if (!eventId) {
    console.error("No event ID provided");
    return null;
  } 

  try {
    const result = await db
      .select({ count: sql<number>`cast(count(*) as integer)` })
      .from(userEvents)
      .where(eq(userEvents.eventId, eventId))
      .execute();

    console.log("result", result);

    return result[0]?.count ?? 0;
  } catch (error) {
    console.error("Error getting event signup count:", error);
    return null;
  }
}
