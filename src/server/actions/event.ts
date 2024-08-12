"use server"

import { db } from "../db";
import { eq } from "drizzle-orm";
import { events, userEvents } from "../db/schema";

export async function addUserToEvent(
    eventId: string, 
    userId: string,
    code: string
) {

    const event = await db.query.events.findFirst({
        where: eq(events.id, eventId),
    });

    if (event === undefined || event.code !== code) {
        return null;
    }

    await db.insert(userEvents).values({
        userId,
        eventId,
    }).returning();

    return event.id;
}

export async function createEvent(
    title: string,
    description: string,
    time: Date,
    place: string,
    points: number,
    photo: string,
    code: string,
) {
    const event = await db.insert(events).values({
        title,
        description,
        time,
        place,
        points,
        photo,
        code,
    }).returning();

    if (event === undefined || event.length === 0) {
        return null;
    }

    return event[0]?.id ?? null;
}