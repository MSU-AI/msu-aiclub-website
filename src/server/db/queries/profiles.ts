import { Profile, userTypeEnum } from "~/types/profiles";
import { db } from "..";

/**
 * Gets the user type of a user based on their supaId
 * @param supaId the supaId of the user
 * @returns the user type "guest" | "member" | "admin"
 */
export async function getProfileType(supaId: string | undefined) : Promise<string | null> {
    if (supaId === undefined) {
        return null;
    }

    const profile: Profile | null = await db.query.profiles.findFirst({
        where: (model, { eq }) => eq(model.supaId, supaId),
    }) ?? null;

    return profile?.userType ?? "guest";
}