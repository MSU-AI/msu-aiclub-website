"use server";

import { db } from "~/server/db"
import { posts, likes } from "../db/schema";
import { eq, and, sql } from "drizzle-orm";
import { Post } from "~/types/posts";
import { revalidatePath } from "next/cache";
import { createClient } from "~/utils/supabase/server";

/**
 * Deletes a post
 * @param postId the id of the post
 */
export async function deletePost(postId: string): Promise<void> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || user.user_metadata.memberType !== 'admin') {
    throw new Error("Unauthorized");
  }

  await db.delete(posts).where(eq(posts.id, postId));
}


/**
 * Creates a post
 * @param supaId the supaId of the user
 * @param name the name of the post
 * @param content the content of the post
 * @returns the id of the post if it was created, null otherwise
 */
export async function createPost(title: string, content: string, description: string, thumbnailUrl: string): Promise<string | null> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  try {
    const result = await db.insert(posts).values({
      userId: user.id,
      title,
      description,
      content,
      thumbnailUrl,
    }).returning();

    const newPost = result[0];
    
    if (!newPost) {
      throw new Error("Failed to create post: No post returned");
    }

    return newPost.id;
  } catch (error) {
    console.error("Failed to create post:", error);
    return null;
  }
}
/**
 * Updates a post
 * @param supaId the supaId of the user
 * @param postId the id of the post
 * @param name the name of the post
 * @param content the content of the post
 * @returns the id of the post if it was updated, null otherwise
 */
export async function updatePost(
    userId: string, 
    postId: string, 
    title: string, 
    content: string,
    description: string,
    thumbnailUrl: string
) : Promise<string | null> {
    if (postId === null || userId === undefined) {
        return null;
    }

    const [ post ] = await db.update(posts)
    .set({ title, content, description, thumbnailUrl })
    .where(and(eq(posts.id, postId), eq(posts.userId, userId)))
    .returning();

    if (post === undefined) {
        return null;
    }

    revalidatePath("/posts", "page");

    return post.id;
}


export async function likePost(postId: string): Promise<void> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  const existingLike = await db.query.likes.findFirst({
    where: and(eq(likes.postId, postId), eq(likes.userId, user.id)),
  });

  if (existingLike) {
    // Unlike the post
    await db.delete(likes).where(eq(likes.id, existingLike.id));
    await db.update(posts)
      .set({ 
        likes: sql`${posts.likes} - 1`
      })
      .where(eq(posts.id, postId));
  } else {
    // Like the post
    await db.insert(likes).values({ postId, userId: user.id });
    await db.update(posts)
      .set({ 
        likes: sql`${posts.likes} + 1`
      })
      .where(eq(posts.id, postId));
  }
}


