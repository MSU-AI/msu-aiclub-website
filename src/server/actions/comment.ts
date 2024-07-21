"use server";

import { db } from "~/server/db"
import { comments, commentVotes } from "../db/schema";
import { eq, and, sql } from "drizzle-orm";
import { Comment } from "~/types/comments";
import { revalidatePath } from "next/cache";

export async function deleteComment(commentId: string | null, userId: string): Promise<boolean> {
    if (commentId === null) {
        return false;
    }

    const comment = await db.query.comments.findFirst({
        where: eq(comments.id, commentId),
        columns: {
            id: true,
            userId: true,
        }
    });

    if (!comment || comment.userId !== userId) {
        return false;
    }

    const result = await db.delete(comments)
        .where(eq(comments.id, commentId))
        .returning({ deletedId: comments.id });

    revalidatePath("/posts", "page");
    
    return result.length > 0;
}

export async function createComment(
    supaId: string | undefined,
    postId: string,
    content: string,
    parentId?: string
): Promise<string | null> {
    if (supaId === undefined) {
        return null;
    }
    
    const [ comment ]: Comment[] | undefined = await db.insert(comments).values({
        userId: supaId,
        postId,
        content,
        parentId,
        createdAt: new Date(),
    }).returning();

    if (comment === undefined) {
        return null;
    }

    revalidatePath("/posts", "page");
    return comment.id;
}

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

export async function voteComment(
  userId: string,
  commentId: string,
  voteType: 1 | -1 | 0
): Promise<boolean> {
  const existingVote = await db.query.commentVotes.findFirst({
    where: and(
      eq(commentVotes.userId, userId),
      eq(commentVotes.commentId, commentId)
    ),
  });

  if (existingVote) {
    if (existingVote.voteType === voteType) {
      // Remove the vote if it's the same type
      await db.delete(commentVotes)
        .where(eq(commentVotes.id, existingVote.id));
      voteType = 0;
    } else {
      // Update the vote type if it's different
      await db.update(commentVotes)
        .set({ voteType })
        .where(eq(commentVotes.id, existingVote.id));
    }
  } else if (voteType !== 0) {
    // Create a new vote
    await db.insert(commentVotes).values({
      userId,
      commentId,
      voteType,
    });
  }

  // Update the comment's vote counts
  await db.update(comments)
    .set({
      upvotes: sql`(SELECT COUNT(*) FROM ${commentVotes} WHERE ${commentVotes.commentId} = ${commentId} AND ${commentVotes.voteType} = 1)`,
      downvotes: sql`(SELECT COUNT(*) FROM ${commentVotes} WHERE ${commentVotes.commentId} = ${commentId} AND ${commentVotes.voteType} = -1)`,
    })
    .where(eq(comments.id, commentId));

  revalidatePath("/posts", "page");
  return true;
}
