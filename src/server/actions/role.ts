"use server";

import { db } from "../db";
import { roles, userRoles } from "../db/schema";

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

export async function getRoles() : Promise<any[]> {
    const roles = await db.query.roles.findMany();
    return roles;
}

export async function addUserRoles(userId: string | undefined, roleIds: string[]) : Promise<void> {
    if (roleIds.length === 0 || userId === undefined) {
        return;
    }

    for (const roleId of roleIds) {
        await db.insert(userRoles).values({
            userId,
            roleId
        });
    }
}

export async function addRole(roleName: string) : Promise<void> {
    if (roleName === "") {
        return;
    }

    const role = await db.insert(roles).values({
        name: roleName
    }).returning();
}