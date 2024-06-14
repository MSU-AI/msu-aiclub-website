import { db } from "..";

/**
 * Gets all users
 * @returns an array of User objects
 */
export async function getAllUsers() {
    const users = await db.query.users.findMany();

    return users;
}