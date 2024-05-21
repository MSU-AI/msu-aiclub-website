import { db } from "../db";

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