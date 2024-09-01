"use server"

import { db } from "~/server/db";
import { eq } from "drizzle-orm";
import { eventAnswers, eventQuestions, events } from "../schema";


export async function getQuestionsForEvent(eventId: string | undefined) {
  if (!eventId) return [];
  const questions = await db.query.eventQuestions.findMany({
    where: eq(eventQuestions.eventId, eventId),
  })

  if (!questions) return [];

  return questions;
}

export const submitAnswers = async (eventId: string, userId: string, answers: any) => {
  const results = await Promise.all(answers.map(async (answer: any) => {

    return await db.insert(eventAnswers).values({
      eventId: eventId,
      questionId: answer.questionId,
      userId: userId,
      answer: answer.answer,
    });
  }));

  return results;
}