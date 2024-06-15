import { db } from "..";

/**
 * Gets all users
 * @returns an array of User objects
 */
export async function getAllUsers() {
    const users = await db.query.users.findMany();

    return users;
}

/**
 * Gets a user by its id
 * @param userId the id of the user
 * @returns a User object or null if not found
 */
export async function getUserById(userId: string) {
    const user = await db.query.users.findFirst({
        where: (model, { eq }) => eq(model.id, userId),
        with: {
            projects: {
                with: {
                    project: true
                }
            },
            posts: true,
            comments: true,
            roles: {
                with: {
                    role: true
                }
            },
        }
    }) ?? null;

    return user;
}