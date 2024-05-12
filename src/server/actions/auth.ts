"use server";

import { redirect } from "next/navigation";
import { createClient } from "~/utils/supabase/server";
import { db } from "../db";
import { profiles } from "../db/schema";
import { getProfileType } from "../db/queries/profiles";
import { userTypeRedirect } from "~/constants/userTypeRedirect";

/**
 * Logs a user in
 * @param email the email of the user
 * @param password the password of the user
 * Redirects to user's dashboard based on type
 * Defined in constants/userTypeRedirect.ts
 */
export async function login(email: string, password: string) : Promise<void> {
    const supabase = createClient();
  
    const userData = {
      email,
      password
    };
  
    const { data, error } = await supabase.auth.signInWithPassword(userData);
  
    if (error) {
      redirect('/auth/login?message=' + error.message);
    }

    const userType = await getProfileType(data!.user!.id);
  
    redirect(userTypeRedirect(userType));
}

/**
 * Registers a user
 * @param email the email of the user
 * @param password the password of the user
 */
export async function register(email: string, password: string) {
    const supabase = createClient();

    const userData = {
      email,
      password
    };

    const { data, error } = await supabase.auth.signUp(userData);

    await db.insert(profiles).values({
      supaId: data!.user!.id,
      userType: "member",
    });

    if (error) {
      redirect('/auth/register?message=' + error.message);
    }

    const userType = await getProfileType(data!.user!.id);
  
    redirect(userTypeRedirect(userType));
}

/**
 * Logs a user out
 */
export async function logout() {
    const supabase = createClient();
  
    const { error } = await supabase.auth.signOut();
  
    if (error) {
      redirect('/error?message=' + error.message);
    }

    redirect('/');
  }