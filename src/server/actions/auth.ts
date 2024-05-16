"use server";

import { redirect } from "next/navigation";
import { createClient } from "~/utils/supabase/server";
import { db } from "../db";
import { profiles } from "../db/schema";
import { getProfileType } from "../db/queries/profiles";
/**
 * Logs a user in
 * @param email the email of the user
 * @param password the password of the user
 * Redirects to user's dashboard based on type
 * Defined in constants/userTypeRedirect.ts
 */
export async function login(email: string, password: string): Promise<b> {

  const supabase = createClient();
  
  try {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    
    if (error) throw error;

    const userType = await getProfileType(data.user.id);
    
  } catch (error) {
    result = { error };
    redirect('/auth/login?message=' + encodeURIComponent(error.message));
  }

  redirect('/');
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

    if (error) {
      redirect('/auth/register?message=' + error.message);
    }

    await db.insert(profiles).values({
      supaId: data!.user!.id,
      userType: "member",
    });

    const userType = await getProfileType(data!.user!.id);
  
    redirect('/');
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
