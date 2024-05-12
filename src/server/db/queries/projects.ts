"use server";

import { Profile } from "~/types/profiles";
import { db } from "..";
import { Project } from "~/types/projects";

/**
 * Gets project assocated with a user
 * @param userId the supaId of the user
 * @returns Project associated with the user or null
 */
export async function getUserProject(supaId: string) : Promise<Project | null> {
    if (!supaId) {
        return null;
    }
    
    const profile: Profile | null = await db.query.profiles.findFirst({
        where: (model, { eq }) => eq(model.supaId, supaId),
        with: {
            project: true
        }
    }) ?? null;

    if (profile == null || profile.project == null) {
        return null;
    }

    return profile.project;
}

/**
 * Gets a project by its id
 * @param projectId the id of the project
 * @returns a Project object or null if not found
 */
export async function getProjectById(projectId: string) : Promise<Project | null> {
    const project: Project | null = await db.query.projects.findFirst({
        where: (model, { eq }) => eq(model.id, projectId),
        with: {
            profiles: true
        }
    }) ?? null;

    return project;
}

/**
 * Gets all projects
 * @returns an array of Project objects
 */
export async function getProjects() : Promise<Project[]> {
    const projects: Project[] = await db.query.projects.findMany();

    return projects;
}