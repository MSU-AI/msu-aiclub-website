"use server";

import { and, eq } from "drizzle-orm";
import { db } from "../db";
import { projects, userProjects } from "../db/schema";
import { revalidatePath } from "next/cache";

export async function deleteProject(projectId: string) {
    const deletedId = await db.delete(projects)
    .where(eq(projects.id, projectId))
    .returning({ deletedId: projects.id }) ?? null;

    revalidatePath("/", "layout");

    return deletedId !== null;
}

export async function addToProject(userId: string, projectId: string) {
    try {
        const [ project ] = await db.insert(userProjects).values({
            userId,
            projectId,
        }).returning();

        if (project === undefined) {
            return null;
        }
    
        revalidatePath("/", "layout");
    
        return project.projectId;
    } catch (error) {
        console.log(error);
        return null;
    }
}

export async function removeFromProject(userId: string, projectId: string) {
    const deletedId = await db.delete(userProjects)
    .where(and(
        eq(userProjects.userId, userId), 
        eq(userProjects.projectId, projectId)
    ))
    .returning({ deletedId: userProjects.userId }) ?? null;

    revalidatePath("/", "layout");

    return deletedId !== null;
}