"use server"

import { db } from "~/server/db";
import { projects } from "~/server/db/schema";
import { eq, desc } from "drizzle-orm";
import { createClient } from "~/utils/supabase/server";


export async function getPendingProjects() {
  const pendingProjects = await db.query.projects.findMany({
    where: eq(projects.status, "pending"),
    orderBy: [desc(projects.createdAt)],
    with: {
      projectSkills: true,
      userProjects: true,
    },
  });

  const supabase = createClient();

  const projectsWithUserData = await Promise.all(
    pendingProjects.map(async (project) => {
      const users = await Promise.all(
        project.userProjects.map(async (pu) => {
          const { data: userData } = await supabase.auth.admin.getUserById(pu.userId);
          return userData?.user ? {
            id: userData.user.id,
            email: userData.user.email,
            fullName: `${userData.user.user_metadata.firstName || ''} ${userData.user.user_metadata.lastName || ''}`.trim(),
            memberType: userData.user.user_metadata.memberType,
            role: pu.role,
          } : null;
        })
      );

      return {
        ...project,
        users: users.filter(Boolean),
        skills: project.projectSkills.map(ps => ps.skillName),
      };
    })
  );

  return projectsWithUserData;
}

export async function getProjectById(projectId: string) {
  const project = await db.query.projects.findFirst({
    where: eq(projects.id, projectId),
    with: {
      projectSkills: true,
      userProjects: true,
    },
  });

  if (!project) return null;

  const supabase = createClient();

  const users = await Promise.all(
    project.userProjects.map(async (pu) => {
      const { data: userData } = await supabase.auth.admin.getUserById(pu.userId);
      return userData?.user ? {
        id: userData.user.id,
        email: userData.user.email,
        fullName: `${userData.user.user_metadata.firstName || ''} ${userData.user.user_metadata.lastName || ''}`.trim(),
        memberType: userData.user.user_metadata.memberType,
        role: pu.role,
      } : null;
    })
  );

  return {
    ...project,
    skills: project.projectSkills.map(ps => ps.skillName),
    users: users.filter(Boolean),
  };
}

export async function getApprovedProjects() {
  const approvedProjects = await db.query.projects.findMany({
    where: eq(projects.status, "approved"),
    orderBy: [desc(projects.createdAt)],
    with: {
      projectSkills: true,
      userProjects: true,
    },
  });

  const supabase = createClient();

  const projectsWithUserData = await Promise.all(
    approvedProjects.map(async (project) => {
      const users = await Promise.all(
        project.userProjects.map(async (pu) => {
          const { data: userData } = await supabase.auth.admin.getUserById(pu.userId);
          return userData?.user ? {
            id: userData.user.id,
            email: userData.user.email,
            fullName: `${userData.user.user_metadata.firstName || ''} ${userData.user.user_metadata.lastName || ''}`.trim(),
            memberType: userData.user.user_metadata.memberType,
            role: pu.role,
          } : null;
        })
      );

      return {
        ...project,
        users: users.filter(Boolean),
        skills: project.projectSkills.map(ps => ps.skillName),
      };
    })
  );

  return projectsWithUserData;
}
