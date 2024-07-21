import React from 'react';
import { getCommentsWithReplies } from '~/server/db/queries/comment';
import CommentContent from '~/components/posts/commentSection';
import { createClient } from '~/utils/supabase/server';

export default async function CommentSection({ postId }: { postId: string }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const userId = user?.id;
  const comments = await getCommentsWithReplies(postId);
  return <CommentContent initialComments={comments} postId={postId} userId={userId} />;
}
