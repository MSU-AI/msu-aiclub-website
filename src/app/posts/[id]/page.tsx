import { getPostWithComments } from '~/server/db/queries/posts';
import { getCommentsWithReplies } from '~/server/db/queries/comment';
import PostContent from './postContent';
import CommentSection from './comment'; 
import { createClient } from '~/utils/supabase/server';

export default async function PostPage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const userId = user?.id;
  const post = await getPostWithComments(params.id);
  const comments = await getCommentsWithReplies(params.id, userId);

  if (!post) {
    return <div>Post not found</div>;
  }

  return (
    <>
      <PostContent initialPost={post} userId={userId}/>
      <CommentSection initialComments={comments} postId={params.id} userId={userId} />
    </>
  );
}
