"use server";

import { redirect } from "next/navigation";
import { createClient } from "~/utils/supabase/server";
import { getURL } from "../helpers";
import { AccountData } from "~/types/profiles";
import { getRoles } from "../db/queries/roles";
import { cookies } from "next/headers";
import { PENDING_USER } from "~/constants/cookies";
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
 * Confirms a user's email with OTP
 * @param email email of the user
 * @param otp otp of the user
 * @returns redirects to the home page if successful, and back to login page if not
 */
export async function confirmEmail(
  email: string,
  otp: string
) : Promise<void> {
  const supabase = createClient();

  const { error } = await supabase.auth.verifyOtp({
    email,
    token: otp,
    type: 'signup',
  });

  if (error) {
    redirect('/confirm?message=' + error.message);
  }

  await deletePendingUser();

  redirect('/additional-info');
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

    await setPendingUser(email);
  
    return null;
}

export async function setPendingUser(email: string) : Promise<void> {
  cookies().set(PENDING_USER, email, { 
    httpOnly: true, 
    secure: true, 
    sameSite: 'strict',
    maxAge: 3600
  })
}

export async function getPendingUser() : Promise<string | undefined> {
  return cookies().get(PENDING_USER)?.value;
}

export async function deletePendingUser() : Promise<void> {
  cookies().delete(PENDING_USER);
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

  console.log("auth url: ", redirectUrl)
  console.log('ahahahaha')

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


/**
 * Checks if the usser is an admin
 */
export async function isAdmin(): Promise<boolean> {
    const supabase = createClient();
    const { data, error } = await supabase.auth.getUser();

    if (error) {
        return false;
    }

    const roles = await getRoles(data.user.id);

    return roles.includes('admin') || roles.includes('board');
}


/**
 * Sends a password reset email to the user
 * @param email the email of the user
 * @returns null if successful, or an error message if not
 */
export async function requestPasswordReset(email: string): Promise<string | null> {
  if (!email) {
    return "Please enter your email address";
  }
  
  const supabase = createClient();
  
  // Use the callback route which is meant to handle auth redirects
  const redirectUrl = getURL('/auth/callback?next=/auth/reset-password');
  
  // Log for debugging
  console.log("Reset password redirect URL:", redirectUrl);
  
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: redirectUrl,
  });

  if (error) console.log(error);

  return error ? error.message : null;
}

/**
 * Resets a user's password
 * @param password the new password
 * @returns null if successful, or an error message if not
 */
export async function resetPassword(password: string): Promise<string | null> {
  if (!password) {
    return "Please enter a new password";
  }
  
  if (password.length < 6) {
    return "Password must be at least 6 characters";
  }
  
  const supabase = createClient();
  
  const { error } = await supabase.auth.updateUser({
    password,
  });

  return error ? error.message : null;
}

/**
 * Checks if the reset password request is valid
 * @returns true if valid, false if not
 */
export async function validateResetRequest(): Promise<boolean> {
  const supabase = createClient();
  
  const { data, error } = await supabase.auth.getSession();
  
  if (error ?? !data.session) {
    return false;
  }
  
  return true;
}


