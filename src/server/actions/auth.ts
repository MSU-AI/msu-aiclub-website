"use server";

import { redirect } from "next/navigation";
import { createClient } from "~/utils/supabase/server";
import { getURL } from "../helpers";
import { AccountData } from "~/types/profiles";
/**
 * Logs a user in
 * @param email the email of the user
 * @param password the password of the user
 * returns null if successful, or an error message if not
 */
export async function login(email: string, password: string): Promise<string | null> {
  const supabase = createClient();
  
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  return error ? error.message : null;
}

/**
 * Registers a user
 * @param email the email of the user
 * @param password the password of the user
 * @returns null if successful, or an error message if not
 */
export async function register(email: string, password: string) : Promise<string | null> {
    const supabase = createClient();

    const userData = {
      email,
      password
    };

    const { data, error } = await supabase.auth.signUp(userData);

    if (error) {
      return error.message;
    }
  
    return null;
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

/**
 * Completes a user's account
 */
export async function completeAccount(data: AccountData) {
    const supabase = createClient();
    
    if (!data.firstName || !data.lastName) {
        return 'Please enter your first and last name';
    }

    const {error} = await supabase.auth.updateUser({
      data: {
        memberType: 'member',
        firstName: data.firstName,
        lastName: data.lastName,
        fullName: `${data.firstName} ${data.lastName}`,
        country: data.country,
        university: data.university,
        major: data.major,
        schoolYear: data.schoolYear,
        discordUsername: data.discordUsername,
        githubUrl: data.githubUrl,
        linkedinUrl: data.linkedinUrl,
        personalWebsite: data.personalWebsite,
        flowerProfile: data.flowerProfile
      }
    });
    if (error) {
        return error.message;
    }

    return null;
}


/**
 * Updates a user's profile
 * @param data The updated user data
 * @returns null if successful, or an error message if not
 */
export async function updateProfile(data: Partial<AccountData>): Promise<string | null> {
    const supabase = createClient();
    
    const { error } = await supabase.auth.updateUser({
        data: {
            firstName: data.firstName,
            lastName: data.lastName,
            fullName: data.firstName && data.lastName ? `${data.firstName} ${data.lastName}` : undefined,
            country: data.country,
            university: data.university,
            major: data.major,
            schoolYear: data.schoolYear,
            discordUsername: data.discordUsername,
            githubUrl: data.githubUrl,
            linkedinUrl: data.linkedinUrl,
            personalWebsite: data.personalWebsite,
            profilePictureUrl: data.profilePictureUrl
        }
    });

    if (error) {
        return error.message;
    }
    return null;
}

/**
 * Logs in a user with Google
 * @returns redirects to the home page if successful, and back to login page if not
 */
export async function loginWithGoogle(
) : Promise<void> {
  const supabase = createClient();

  const redirectUrl = getURL('/auth/callback');

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: redirectUrl,
    },
  })

  if (error) {
    redirect('/login?message=' + error.message);
  }

  redirect(data.url)
}

/**
 * make current user an admin (this is for development purposes only)
 */
export async function makeAdmin() {
    const supabase = createClient();
    
    const { error } = await supabase.auth.updateUser({
        data: {
           memberType: 'admin'
        }
    });

    if (error) {
        return error.message;
    }
    return null;
}

