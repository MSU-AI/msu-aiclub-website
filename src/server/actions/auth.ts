"use server";

import { redirect } from "next/navigation";
import { createClient } from "~/utils/supabase/server";
import { db } from "../db";
import { profiles } from "../db/schema";

export async function login(email: string, password: string) {
    const supabase = createClient();
  
    const userData = {
      email,
      password
    };
  
    const { error } = await supabase.auth.signInWithPassword(userData);
  
    if (error) {
      redirect('/auth/login?message=' + error.message);
    }
  
    redirect('/member');
}

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

    redirect('/member');
}

export async function logout() {
    const supabase = createClient();
  
    const { error } = await supabase.auth.signOut();
  
    if (error) {
      redirect('/error?message=' + error.message);
    }

    redirect('/');
  }