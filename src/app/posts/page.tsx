import { Suspense } from 'react';
import { getPostsWithUserInfo } from '~/server/db/queries/posts';
import PostList from './postList';
import CreatePostButton from './createPostButton';
import SearchButton from './searchButton';
import { createClient } from '~/utils/supabase/server';
import { isAdmin } from '~/server/actions/auth';
import Pagination from './pagination';
import { headers } from 'next/headers';

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
  
  const { posts, totalCount } = await getPostsWithUserInfo(limit, offset, query);
  
  const isUserAdmin = await isAdmin();

  const totalPages = Math.ceil(totalCount / limit);

  // Get the host from headers
  const host = headers().get('host') || 'localhost:3000';
  const protocol = process?.env.NODE_ENV === 'development' ? 'http' : 'https';

  // Construct the full base URL for pagination
  const baseUrl = `${protocol}://${host}/posts` + (query ? `?query=${encodeURIComponent(query)}` : '');

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
      {totalPages > 1 && (
        <Pagination currentPage={page} totalPages={totalPages} baseUrl={baseUrl} />
      )}
    </div>
  );
}