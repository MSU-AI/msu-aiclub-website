"use server"

import { db } from "~/server/db";
import { projects, userProjects, projectSkills } from "~/server/db/schema";
import { eq } from "drizzle-orm";

export async function createProject(
  title: string,
  description: string,
  imageUrl: string,
  videoUrl: string,
  techStack: string[],
  userIds: string[],
  githubUrl: string,
  liveSiteUrl: string
) {
  console.log("Creating project with title", title);

  const [newProject] = await db.insert(projects).values({
    name: title,
    description,
    thumbnailUrl: imageUrl,
    videoUrl,
    githubUrl,
    liveSiteUrl,
  }).returning();

  console.log("Past new project", newProject);

  if (newProject) {
    // Add project skills
    if (techStack.length > 0) {
      await db.insert(projectSkills).values(
        techStack.map((skill) => ({
          projectId: newProject.id,
          skillName: skill,
        }))
      );
    }

    console.log("Past project skills", projectSkills);

    // Filter out empty strings from userIds
    const filteredUserIds = userIds.filter(userId => userId.trim() !== '');

    console.log(filteredUserIds);
    console.log(newProject.id)

    // Add project users
    if (filteredUserIds.length > 0) {
      await db.insert(userProjects).values(
        filteredUserIds.map((userId, index) => ({
          userId,
          projectId: newProject.id,
          role: index === 0 ? "creator" : "member", // Assuming the first user is the creator
        }))
      );
    }

    console.log("Past project users", userProjects);
  }

  return newProject;
}



export async function approveProject(projectId: string) {
  await db.update(projects)
    .set({ status: "approved" })
    .where(eq(projects.id, projectId));
}

export async function rejectProject(projectId: string) {
  await db.update(projects)
    .set({ status: "rejected" })
    .where(eq(projects.id, projectId));
}


export async function deleteProject(projectId: string) {
  // Start a transaction to ensure all operations succeed or fail together
  return await db.transaction(async (tx) => {
    await tx.delete(userProjects)
      .where(eq(userProjects.projectId, projectId));

    await tx.delete(projectSkills)
      .where(eq(projectSkills.projectId, projectId));

    await tx.delete(projects)
      .where(eq(projects.id, projectId));
  });
}


export async function updateProject(
  projectId: string,
  title: string,
  description: string,
  imageUrl: string,
  videoUrl: string,
  techStack: string[],
  githubUrl: string,
  liveSiteUrl: string
) {
  return await db.transaction(async (tx) => {
    // Update the project
    await tx.update(projects)
      .set({
        name: title,
        description,
        thumbnailUrl: imageUrl,
        videoUrl,
        githubUrl,
        liveSiteUrl,
      })
      .where(eq(projects.id, projectId));

    // Delete existing skills and insert new ones
    await tx.delete(projectSkills)
      .where(eq(projectSkills.projectId, projectId));

    await tx.insert(projectSkills)
      .values(techStack.map(skill => ({
        projectId,
        skillName: skill,
      })));
  });
}
