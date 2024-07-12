import { db } from "~/server/db";
import { comments, users } from "~/server/db/schema";
import { eq, desc } from "drizzle-orm";
import { createClient } from "~/utils/supabase/server";

export async function getCommentById(commentId: string) {
  const [comment] = await db.select()
    .from(comments)
    .where(eq(comments.id, commentId))
    .leftJoin(users, eq(comments.userId, users.id));
  
  if (comment && comment.users) {
    const supabase = createClient();
    const { data: userData } = await supabase.auth.admin.getUserById(comment.users.id);
    const fullName = userData?.user?.user_metadata
      ? `${userData.user.user_metadata.firstName || ''} ${userData.user.user_metadata.lastName || ''}`.trim()
      : '';
    
    return {
      ...comment,
      user: {
        ...comment.users,
        fullName
      }
    };
  }
  
  return comment;
}

export async function getCommentsByPostId(postId: string) {
  const commentsData = await db.select({
    id: comments.id,
    content: comments.content,
    createdAt: comments.createdAt,
    user: users,
  })
  .from(comments)
  .where(eq(comments.postId, postId))
  .leftJoin(users, eq(comments.userId, users.id))
  .orderBy(desc(comments.createdAt));

  const supabase = createClient();

  // Fetch user metadata for all comments
  const userMetadata = await Promise.all(
    commentsData.map(comment => comment.user ? supabase.auth.admin.getUserById(comment.user.id) : null)
  );

  // Combine comment data with user metadata
  return commentsData.map((comment, index) => ({
    ...comment,
    user: comment.user ? {
      ...comment.user,
      fullName: userMetadata[index]?.data?.user?.user_metadata
        ? `${userMetadata[index]?.data?.user?.user_metadata.firstName || ''} ${userMetadata[index]?.data?.user?.user_metadata.lastName || ''}`.trim()
        : ''
    } : null
  }));
}
