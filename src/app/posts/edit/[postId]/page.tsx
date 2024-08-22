import { getPostById } from '~/server/db/queries/posts';
import { PostEditForm } from './postEditForm';
import { createClient } from '~/utils/supabase/server';

export default async function EditPostPage({ params }: { params: { postId: string } }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  const post = await getPostById(params.postId);

  if (!post) {
    return <div>Post not found</div>;
  }

  const isAdmin = user?.user_metadata?.memberType === 'admin';
  const isAuthor = post.userId === user?.id;

  if (!isAdmin && !isAuthor) {
    return <div>You don't have permission to edit this post</div>;
  }

  return (
    <div className="max-w-[1024px] mx-auto py-8 px-4 pt-28">
      <h1 className="text-2xl font-bold mb-6">Edit Post: {post.title}</h1>
      <PostEditForm post={post} />
    </div>
  );
}
