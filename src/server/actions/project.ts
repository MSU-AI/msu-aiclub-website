"use server";

import { db } from "~/server/db"

import { Profile } from "~/types/profiles";
import { profiles, projects } from "../db/schema";
import { Project } from "~/types/projects";
import { eq } from "drizzle-orm";

/**
 * Creates a project and associates it with the given users
 * @param name name of the project
 * @param content description of the project
 * @param userIds users to associate with the project
 * @returns project id if it was created, null otherwise
 */
export async function createProject(name: string, description: string, userIds: string[])
: Promise<string | null> {
    const [ project ]: Project[] | undefined = await db.insert(projects).values({
        name,
        description,
    }).returning();

    if (project === undefined) {
        return null;
    }

    {userIds.map(async (userId) => {
        const [ user ]: Profile[] | undefined = await db.update(profiles)
        .set({ projectId: project.id })
        .where(eq(profiles.supaId, userId))
        .returning();

        if (user === undefined) {
            return null;
        }
    })}
    
    return project.id;
}

export async function deleteProject(projectId: string, supaId: string | undefined)
 : Promise<boolean> {
    if (supaId === undefined) {
        return false;
    }

    const profile: Profile | null = await db.query.profiles.findFirst({
        where: (model, { eq }) => eq(model.supaId, supaId),
    }) ?? null;

    if (profile === null || profile.userType !== "admin") {
        return false;
    }

    const deletedId: Project[] | undefined = await db.delete(projects)
    .where(eq(projects.id, projectId))
    .returning();

    if (deletedId === undefined) {
        return false;
    }

    return true;
}