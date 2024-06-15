"use server";

import { revalidatePath } from "next/cache";
import { db } from "../db";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";

export async function deleteUser(userId: string) {
    const deletedId = await db.delete(users)
    .where(eq(users.id, userId))
    .returning({ deletedId: users.id }) ?? null;

    revalidatePath("/", "layout");
}