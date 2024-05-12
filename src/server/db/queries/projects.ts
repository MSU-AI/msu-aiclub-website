"use server";

import { Profile } from "~/types/profiles";
import { db } from "..";
import { Project } from "~/types/projects";

/**
 * Gets all projects assocated with a user
 * @param userId the supaId of the user
 * @returns an array of Project objects
 */
export async function getUserProjects(supaId: string) : Promise<Project[]> {
    if (!supaId) {
        return [];
    }
    
    const profile: Profile | null = await db.query.profiles.findFirst({
        where: (model, { eq }) => eq(model.supaId, supaId),
    }) ?? null;

    if (profile == null || profile?.teamId == null) {
        return [];
    }

    const projects: Project[] = await db.query.projects.findMany({
        where: (model, { eq }) => eq(model.teamId, profile!.teamId!),
    })

    return projects;
}

/**
 * Gets all projects
 * @returns an array of Project objects
 */
export async function getProjects() : Promise<Project[]> {
    const projects: Project[] = await db.query.projects.findMany();

    return projects;
}