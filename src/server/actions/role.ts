"use server"

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
