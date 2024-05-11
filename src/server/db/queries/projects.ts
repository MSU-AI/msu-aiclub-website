"use server";

import { Profile } from "~/types/profiles";
import { db } from "..";
import { Project } from "~/types/projects";

export async function getUserProjects(userId: string) {
    if (!userId) {
        return [];
    }
    
    const profile: Profile | null = await db.query.profiles.findFirst({
        where: (model, { eq }) => eq(model.supaId, userId),
    }) ?? null;

    if (!profile?.teamId) {
        return [];
    }

    const projects: Project[] = await db.query.projects.findMany({
        where: (model, { eq }) => eq(model.teamId, profile?.teamId ?? ""),
    })

    console.log(projects);

    return projects;
}

export async function getProjects() {
    const projects: Project[] = await db.query.projects.findMany();

    return projects;
}