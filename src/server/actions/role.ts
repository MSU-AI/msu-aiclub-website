"use server"

import { revalidatePath } from "next/cache";
import { db } from "../db";
import { users, roles, userRoles } from "../db/schema";
import { eq, and } from "drizzle-orm";

export async function adminCheck(userId: string | undefined): Promise<boolean> {
    if (userId === undefined) {
        return false;
    }

    try {
        const userWithRole = await db
            .select({
                userId: users.id,
                roleName: roles.name
            })
            .from(users)
            .leftJoin(userRoles, eq(users.id, userRoles.userId))
            .leftJoin(roles, eq(userRoles.roleId, roles.id))
            .where(and(
                eq(users.id, userId),
                eq(roles.name, "admin")
            ))
            .limit(1);

        return userWithRole.length > 0;
    } catch (error) {
        console.error("Error checking admin status:", error);
        return false;
    }
}


export async function assignAdminRole(userId: string): Promise<boolean> {
  try {
    // First, get the admin role ID
    let adminRole = await db
      .select()
      .from(roles)
      .where(eq(roles.name, "admin"))
      .limit(1)
      .then(rows => rows[0]);

    if (!adminRole) {
      // If admin role doesn't exist, create it
      const [newAdminRole] = await db
        .insert(roles)
        .values({ name: "admin" })
        .returning();
      adminRole = newAdminRole;
    }

    if (!adminRole) {
      console.error("Failed to create or find admin role");
      return false;
    }

    // Now assign the admin role to the user
    await db.insert(userRoles).values({
      userId: userId,
      roleId: adminRole.id,
    }).onConflictDoNothing();

    return true;
  } catch (error) {
    console.error("Error assigning admin role:", error);
    return false;
  }
}

//comment

export async function removeRole(userId: string, roleId: string): Promise<boolean> {

  console.log("Removing role", roleId, "from user", userId);
  try {
    await db.delete(userRoles)
      .where(and(
        eq(userRoles.userId, userId),
        eq(userRoles.roleId, roleId)
      ));

    revalidatePath("/members", "page");
    return true;
  } catch (error) {
    console.error("Error removing role:", error);
    return false;
  }
}

export async function addRole(userId: string, roleName: string): Promise<boolean> {
  try {

    console.log("Adding role", roleName);
    const role = await db
      .select()
      .from(roles)
      .where(eq(roles.name, roleName))
      .limit(1)
      .then(rows => rows[0]);

    if (!role) {
      console.log("Role not found, creating new role", roleName);
      const [newRole] = await db.insert(roles).values({
        name: roleName,
      }).returning();

      if (!newRole) {
        console.error("Failed to create role");
        return false;
      }

      await db.insert(userRoles).values({
        userId: userId,
        roleId: newRole.id,
      }).onConflictDoNothing();
    } else {
      await db.insert(userRoles).values({
        userId: userId,
        roleId: role.id,
      }).onConflictDoNothing();
    }

    revalidatePath("/members", "page");
    return true;
  } catch (error) {
    console.error("Error adding role:", error);
    return false;
  }
}