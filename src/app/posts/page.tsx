import { Suspense } from 'react';
import { getPostsWithUserInfo } from '~/server/db/queries/posts';
import PostList from './postList';
import CreatePostButton from './createPostButton';
import { createClient } from '~/utils/supabase/server';
import { isAdmin } from '~/server/actions/auth';
import Link from 'next/link';
import { Button } from '~/components/ui/button';

export default async function PostsPage({
  searchParams,
}: {
  searchParams: { query?: string; page?: string };
}) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const userId = user?.id;
  
  const posts = await getPostsWithUserInfo();

  console.log(posts.length)
  
  const isUserAdmin = await isAdmin();

  return (
    <div>
      <main className="flex-grow pt-16">
        <section className="py-24 bg-secondary/30">
          <div className="container px-4 mx-auto text-center">
            <h1 className="text-4xl font-bold mb-6">Posts</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Read the latest articles, tutorials, and announcements from the MSU AI Club.
            </p>
            {isUserAdmin && (
              <div className="mt-8">
                <Button asChild>
                  <Link href="/posts/create">Write New Post</Link>
                </Button>
              </div>
            )}
          </div>
        </section>
        
        <section className="py-16">
          <div className="container px-4 mx-auto">
            <PostList posts={posts} isAdmin={isUserAdmin} userId={userId} />
          </div>
        </section>
      </main>
    </div>
  );
}
