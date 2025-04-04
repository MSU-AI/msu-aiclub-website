"use server"

import { db } from "~/server/db";
import type { Member } from "~/types/attendance";

/**
 * Get all members (users) from the database
 * This is used by the attendance tracking dashboard
 */
export async function getAllMembers() {
  try {
    const members = await db.query.users.findMany({
      columns: {
        id: true,
        email: true,
        raw_user_meta_data: true
      }
    });
    
    // Process members to ensure consistent formatting
    return members.map(member => {
      const metaData = (member.raw_user_meta_data || {}) as Record<string, string>;
      return {
        id: member.id,
        email: member.email,
        name: metaData.name ?? metaData.full_name ?? member.email.split('@')[0],
        raw_user_meta_data: metaData
      } as Member;
    });
  } catch (error) {
    console.error("Error getting members:", error);
    return [];
  }
}
