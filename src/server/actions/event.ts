"use server"

import { db } from "../db";
import { and, eq } from "drizzle-orm";
import { eventQuestions, events, userEvents } from "../db/schema";

export async function addUserToEvent(
    eventId: string, 
    userId: string,
    code: string
) {

    const userEvent = await db.query.userEvents.findFirst({
        where: and(
            eq(userEvents.userId, userId),
            eq(userEvents.eventId, eventId)
        )
    });

    if (userEvent) {
        return "already-registered";
    }

    const event = await db.query.events.findFirst({
        where: eq(events.id, eventId),
    });

    if (event === undefined || event.code !== code) {
        console.log("Invalid code");
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
    questions: { question: string; required: boolean }[]
) {
    const [event] = await db.insert(events).values({
        title,
        description,
        time,
        place,
        points,
        photo,
        code,
    }).returning();

    if (event) {
        await Promise.all(questions.map(q => 
            db.insert(eventQuestions).values({
                eventId: event.id,
                question: q.question,
                required: q.required,
            })
        ));
    }

    return event?.id ?? null;
}

export async function deleteEvent(
    id: string
) { 
    const event = await db.delete(events).where(eq(events.id, id)).returning();

    if (event === undefined || event.length === 0) {
        return null;
    }

    return event[0]?.id ?? null;
}

export async function editEvent(
    id: string,
    title: string,
    photo: string,
    description: string,
    time: Date,
    place: string,
    points: number,
    questions: { id?: string; question: string; required: boolean }[]
) {
    await db.transaction(async (tx) => {
        await tx.update(events).set({
            title,
            photo,
            description,
            time,
            place,
            points,
        }).where(eq(events.id, id));

        // Delete existing questions not in the new list
        await tx.delete(eventQuestions)
            .where(and(
                eq(eventQuestions.eventId, id),
                eq(eventQuestions.id, id),
            ));

        // Update or insert questions
        for (const q of questions) {
            if (q.id) {
                await tx.update(eventQuestions)
                    .set({ question: q.question, required: q.required })
                    .where(eq(eventQuestions.id, q.id));
            } else {
                await tx.insert(eventQuestions)
                    .values({
                        eventId: id,
                        question: q.question,
                        required: q.required,
                    });
            }
        }
    });

    return id;
}

