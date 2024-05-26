"use server";

import { eq } from "drizzle-orm";
import { db } from "../db";
import { users } from "../db/schema";

/**
 * Gets all users
 * @returns an array of user objects
 */
export async function getUsers() : Promise<any[]> {

    const users = await db.query.users.findMany({
        with: {
            roles: {
                with: {
                    role: true
                }
            },
            projects: {
                with: {
                    project: true
                }
            }
        }
    });
    return users;
}

export async function deleteUser(userId: string) : Promise<void> {
    await db.delete(users).where(eq(users.id, userId));
}