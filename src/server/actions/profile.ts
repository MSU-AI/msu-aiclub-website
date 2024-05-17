"use server";

import { db } from "~/server/db"
import { profiles } from "../db/schema";
import { eq } from "drizzle-orm";
import { Profile } from "~/types/profiles";
import { revalidatePath } from "next/cache";

import { createClient } from "~/utils/supabase/server";

/**
 * Deletes a profile
 * @param supaId the id of the profile
 * @param userId the supaId of the user
 * @returns true if the profile was deleted, false otherwise
 */
export async function deleteProfile(supaId: string | null) : Promise<boolean> {

    const supabase = createClient();

    console.log("Deleting profile with id: ", supaId);
    if (supaId === null) {
        return false;
    }

    const profile: Profile | null = await db.query.profiles.findFirst({
        where: (model, { eq }) => eq(model.supaId, supaId),
    }) ?? null;

    console.log("Profile: ", profile)

    if (profile === null) {
        return false;
    }

    const deletedId = await db.delete(profiles)
    .where(eq(profiles.supaId, supaId))
    .returning({ deletedId: profiles.supaId }) ?? null;

    try {
        const { data, error } = await supabase.auth.admin.deleteUser(supaId);
    } catch (error) {
        console.error("Error deleting user: ", error);
        return false;
    }

    revalidatePath("/admin/users", "page");
    
    console.log("Deleted profile with id: ", deletedId);
    
    return deletedId !== null;
}

