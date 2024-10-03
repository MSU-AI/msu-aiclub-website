import { Suspense } from 'react';
import { getPostsWithUserInfo } from '~/server/db/queries/posts';
import PostList from './postList';
import CreatePostButton from './createPostButton';
import SearchButton from './searchButton';
import { createClient } from '~/utils/supabase/server';
import { isAdmin } from '~/server/actions/auth';

export default async function PostsPage({
  searchParams,
}: {
  searchParams: { query?: string; page?: string };
}) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const query = searchParams.query;
  const page = parseInt(searchParams.page || '1', 10);
  const limit = 10;
  const offset = (page - 1) * limit;
  
  const posts = await getPostsWithUserInfo(limit, offset, query);
  
  const isUserAdmin = await isAdmin();

  return (
    <div className="max-w-[1024px] mx-auto px-4 py-8 pt-28">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Posts</h1>
        <div className="flex items-center space-x-4">
          <SearchButton />
          {isUserAdmin && <CreatePostButton />}
        </div>
      </div>
      {query && (
        <p className="mb-4">
          Search results for: <strong>{query}</strong>
        </p>
      )}
      <Suspense fallback={<div>Loading posts...</div>}>
        <PostList posts={posts} isAdmin={isUserAdmin} />
      </Suspense>
    </div>
  );
}