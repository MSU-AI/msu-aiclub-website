"use server";

import { db } from "..";
import { Post } from "~/types/posts";

/**
 * Gets all the posts assocated with a user
 * @param userId the supaId of the user
 * @returns an array of Post objects
 */
export async function getUserPosts(userId: string) : Promise<Post[]> {
    if (!userId) {
        return [];
    }
    
    const posts = await db.query.posts.findMany({
        where: (model, { eq }) => eq(model.profileId, userId),
    }) ?? [];

    return posts;
}

/**
 * Gets all posts
 * @returns an array of Post objects
 */
export async function getPosts() : Promise<Post[]> {
    const posts: Post[] = await db.query.posts.findMany();

    return posts;
}