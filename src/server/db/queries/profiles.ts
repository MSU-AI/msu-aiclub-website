import { Profile } from "~/types/profiles";
import { db } from "..";

export async function getProfileType(supaId: string) {
    const profile: Profile | null = await db.query.profiles.findFirst({
        where: (model, { eq }) => eq(model.supaId, supaId),
    }) ?? null;

    return profile?.userType ?? null;
}