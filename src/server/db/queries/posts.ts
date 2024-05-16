"use server";

import { db } from "..";
import { Post } from "~/types/posts";

/**
 * Gets all the posts assocated with a user
 * @param supaId the supaId of the user or null
 * @returns an array of Post objects
 */
export async function getUserPosts(supaId: string | null) : Promise<Post[]> {
    if (supaId === null) {
        return [];
    }
    
    const posts = await db.query.posts.findMany({
        where: (model, { eq }) => eq(model.profileId, supaId),
    }) ?? [];

    return posts;
}

/**
 * Gets a post by its id
 * @param postId the id of the post
 * @returns a Post object or null if not found
 */
export async function getPostById(postId: string) : Promise<Post | null> {
    const post = await db.query.posts.findFirst({
        where: (model, { eq }) => eq(model.id, postId),
    }) ?? null;

    return post;
}

/**
 * Gets all posts
 * @returns an array of Post objects
 */
export async function getPosts() : Promise<Post[]> {
    const posts: Post[] = await db.query.posts.findMany();

    return posts;
}
