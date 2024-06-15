"use server";

import { eq } from "drizzle-orm";
import { db } from "../db";
import { comments, projects } from "../db/schema";
import { revalidatePath } from "next/cache";

export async function deleteComment(commentId: string) {
    const deletedId = await db.delete(comments)
    .where(eq(comments.id, commentId))
    .returning({ deletedId: comments.id }) ?? null;

    revalidatePath("/", "layout");

    return deletedId !== null;
}