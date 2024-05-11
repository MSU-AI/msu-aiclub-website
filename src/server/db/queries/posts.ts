"use server";

import { Profile } from "~/types/profiles";
import { db } from "..";
import { Project } from "~/types/projects";
import { Post } from "~/types/posts";

export async function getUserPosts(userId: string) {
    if (!userId) {
        return [];
    }
    
    const profile: Profile | null = await db.query.profiles.findFirst({
        where: (model, { eq }) => eq(model.supaId, userId),
        with: {
            posts: true
        }
    }) ?? null;

    return profile?.posts ?? [];
}

export async function getPosts() {
    const posts: Post[] = await db.query.posts.findMany();

    return posts;
}