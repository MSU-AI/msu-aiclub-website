// server/actions/comment.tsx

"use server";
import { db } from "~/server/db"
import { comments } from "../db/schema";
import { eq } from "drizzle-orm";
import { Comment } from "~/types/comments";
import { revalidatePath } from "next/cache";

/**
 * Deletes a comment
 * @param commentId the id of the comment
 * @param userId the supaId of the user
 * @returns true if the comment was deleted, false otherwise
 */
export async function deleteComment(commentId: string | null, userId: string): Promise<boolean> {
    if (commentId === null) {
        return false;
    }
    const comment: Comment | null = await db.query.comments.findFirst({
        where: (model, { eq }) => eq(model.id, commentId),
    }) ?? null;
    if (comment === null || comment.userId !== userId) {
        return false;
    }
    const deletedId = await db.delete(comments)
        .where(eq(comments.id, commentId))
        .returning({ deletedId: comments.id }) ?? null;
    revalidatePath("/posts", "page");
    
    return deletedId !== null;
}

/**
 * Creates a comment
 * @param supaId the supaId of the user
 * @param postId the id of the post
 * @param content the content of the comment
 * @returns the id of the comment if it was created, null otherwise
 */
export async function createComment(
    supaId: string | undefined,
    postId: string,
    content: string
): Promise<string | null> {
    if (supaId === undefined) {
        return null;
    }
    
    const [ comment ]: Comment[] | undefined = await db.insert(comments).values({
        userId: supaId,
        postId,
        content,
        createdAt: new Date(),
    }).returning();
    if (comment === undefined) {
        return null;
    }
    revalidatePath("/posts", "page");
    return comment.id;
}

/**
 * Updates a comment
 * @param supaId the supaId of the user
 * @param commentId the id of the comment
 * @param content the content of the comment
 * @returns the id of the comment if it was updated, null otherwise
 */
export async function updateComment(
    supaId: string | undefined,
    commentId: string,
    content: string
): Promise<string | null> {
    if (commentId === null || supaId === undefined) {
        return null;
    }
    const [ comment ]: Comment[] | undefined = await db.update(comments)
        .set({ content })
        .where(eq(comments.id, commentId))
        .returning();
    if (comment === undefined) {
        return null;
    }
    revalidatePath("/posts", "page");
    return comment.id;
}
