"use server"
import { createClient } from '~/utils/supabase/server';

export async function getUserEmails() {
  const supabase = createClient();

  try {
    const { data: users, error } = await supabase.auth.admin.listUsers();

    if (error) {
      console.error('Error fetching users:', error);
      return [];
    }

    // Filter out users without email and map to just the email addresses
    const emails = users
      .filter(user => user.email)
      .map(user => user.email as string);

    return emails;
  } catch (error) {
    console.error('Error in fetchUserEmails:', error);
    return [];
  }
}
