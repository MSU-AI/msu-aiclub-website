"use server";

import { Profile } from "~/types/profiles";
import { db } from "..";
import { Project } from "~/types/projects";
import { projects } from "../schema";

/**
 * Gets project assocated with a user
 * @param userId the supaId of the user
 * @returns Project associated with the user or null
 */
export async function getUserProjects(supaId: string | undefined) : Promise<Project[] | null> {
    if (!supaId) {
        return null;
    }
    
    const profile = await db.query.users.findFirst({
        where: (model, { eq }) => eq(model.id, supaId),
        with: {
            projects: {
                with: {
                    project: true
                }
            }
        }
    }) ?? null;

    if (profile == null || profile.projects == null) {
        return null;
    }

    const projects = profile.projects.map((project) => project.project);

    return projects;
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
            users: true
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