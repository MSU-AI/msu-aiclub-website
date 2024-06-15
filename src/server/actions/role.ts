"use server";

import { and, eq } from "drizzle-orm";
import { db } from "../db";
import { roles, userRoles } from "../db/schema";
import { revalidatePath } from "next/cache";

export async function adminCheck(userId: string | undefined) : Promise<boolean> {
    if (userId === undefined) {
        return false;
    }

    const user = await db.query.users.findFirst({
        where: (model, { eq }) => eq(model.id, userId),
        with: {
            roles: {
                with: {
                    role: true
                }
            }
        }
    })

    if (user === undefined || user.roles.length === 0) {
        return false;
    }

    const userRoles = user.roles.map(role => role.role.name);

    console.log("user", userRoles.includes("admin"));

    return userRoles.includes("admin");
}

export async function deleteRole(roleId: string) {
    const deletedId = await db.delete(roles)
    .where(eq(roles.id, roleId))
    .returning({ deletedId: roles.id }) ?? null;

    revalidatePath("/", "layout");
}

export async function addRole(userId: string, roleId: string) {
    try {
        const [ role ] = await db.insert(userRoles).values({
            userId,
            roleId,
        }).returning();
    
        if (role === undefined) {
            return null;
        }
    
        revalidatePath("/", "layout");
    
        return role.roleId;
    } catch (error) {
        console.log(error);
        return null;
    }
}

export async function removeFromRole(userId: string, roleId: string) {
    const deletedId = await db.delete(userRoles)
    .where(and(
        eq(userRoles.userId, userId), 
        eq(userRoles.roleId, roleId)
    ))
    .returning({ deletedId: userRoles.userId }) ?? null;

    revalidatePath("/", "layout");

    return deletedId !== null;
}