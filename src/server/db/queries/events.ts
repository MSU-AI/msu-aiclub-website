"use server"

import { eq, sql, inArray } from "drizzle-orm";
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

/**
 * Get attendance data for all users across all events
 * This is used by the attendance tracking dashboard
 */
export async function getUserEventsAttendance() {
  try {
    // Get all attendance records with event details for better performance
    // This fetches all the data in a single query rather than requiring separate lookups
    const attendanceRecords = await db.query.userEvents.findMany({
      with: {
        event: {
          columns: {
            id: true,
            title: true,
            time: true,
            hidden: true
          }
        }
      },
      orderBy: (userEvents, { desc }) => [desc(userEvents.createdAt)]
    });
    
    // Map the records to the format expected by the client
    return attendanceRecords.map(record => ({
      id: record.id,
      userId: record.userId,
      eventId: record.eventId,
      createdAt: record.createdAt
    }));
  } catch (error) {
    console.error("Error getting user attendance data:", error);
    return [];
  }
}

/**
 * Get attendance data for specific events
 * @param eventIds Array of event IDs to filter by
 */
export async function getAttendanceForEvents(eventIds: string[]) {
  if (!eventIds.length) {
    return [];
  }
  
  try {
    const attendanceData = await db.query.userEvents.findMany({
      where: inArray(userEvents.eventId, eventIds),
      with: {
        user: true,
        event: true
      }
    });
    
    return attendanceData;
  } catch (error) {
    console.error("Error getting attendance for events:", error);
    return [];
  }
}

/**
 * Get attendance data for a specific member
 * @param userId User ID to get attendance for
 */
export async function getMemberAttendance(userId: string) {
  if (!userId) {
    return [];
  }
  
  try {
    const memberAttendance = await db.query.userEvents.findMany({
      where: eq(userEvents.userId, userId),
      with: {
        event: true
      },
      orderBy: (userEvents, { desc }) => [desc(userEvents.createdAt)]
    });
    
    return memberAttendance;
  } catch (error) {
    console.error("Error getting member attendance:", error);
    return [];
  }
}

/**
 * Get attendance counts for all events
 * This function returns each event with its total attendance count
 */
export async function getEventAttendanceCounts() {
  try {
    // Use SQL to get counts grouped by event ID
    const result = await db
      .select({
        eventId: userEvents.eventId,
        count: sql<number>`count(*)`
      })
      .from(userEvents)
      .groupBy(userEvents.eventId)
      .execute();
    
    // Create a map of event ID to attendance count
    const attendanceMap = new Map<string, number>();
    result.forEach(row => {
      attendanceMap.set(row.eventId, row.count);
    });
    
    return attendanceMap;
  } catch (error) {
    console.error("Error getting event attendance counts:", error);
    return new Map<string, number>();
  }
}
