"use server";

import { db } from "~/server/db"
import { posts } from "../db/schema";
import { eq } from "drizzle-orm";
import { Post } from "~/types/posts";
import { revalidatePath } from "next/cache";


import { createClient } from "~/utils/supabase/server";
/**
 * Deletes a post
 * @param postId the id of the post
 * @param userId the supaId of the user
 * @returns true if the post was deleted, false otherwise
 */
export async function deletePost(postId: string | null, userId: string) : Promise<boolean> {
    if (postId === null) {
        return false;
    }

    const post: Post | null = await db.query.posts.findFirst({
        where: (model, { eq }) => eq(model.id, postId),
    }) ?? null;

    if (post === null) {
        return false;
    }

    if (post.profileId !== userId) {
        return false;
    }

    const deletedId = await db.delete(posts)
    .where(eq(posts.id, postId))
    .returning({ deletedId: posts.id }) ?? null;

    revalidatePath("/posts", "page");
    
    return deletedId !== null;
}

/**
 * Creates a post
 * @param supaId the supaId of the user
 * @param name the name of the post
 * @param content the content of the post
 * @returns the id of the post if it was created, null otherwise
 */
export async function createPost(supaId: string | undefined, name: string, content: string) 
: Promise<string | null> {
    if (supaId === undefined) {
        return null;
    }
    
    const [ post ]: Post[] | undefined = await db.insert(posts).values({
        profileId: supaId,
        name,
        content,
    }).returning();

    if (post === undefined) {
        return null;
    }

    revalidatePath("/posts", "page");

    return post.id;
}

/**
 * Updates a post
 * @param supaId the supaId of the user
 * @param postId the id of the post
 * @param name the name of the post
 * @param content the content of the post
 * @returns the id of the post if it was updated, null otherwise
 */
export async function updatePost
(supaId: string | undefined, postId: string, name: string, content: string) 
: Promise<string | null> {
    if (postId === null || supaId === undefined) {
        return null;
    }

    const [ post ]: Post[] | undefined = await db.update(posts)
    .set({ name, content })
    .where(eq(posts.id, postId))
    .returning();

    if (post === undefined) {
        return null;
    }

    revalidatePath("/posts", "page");

    return post.id;
}
