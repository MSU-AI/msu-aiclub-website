import { LandingContent } from '~/components/landing/landing-content';
import { createClient } from '~/utils/supabase/server';
import { getTopPostsWithUserInfo } from '~/server/db/queries/posts';
import { getTopApprovedProjects } from '~/server/db/queries/projects';

export default async function HomePage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  const isAdmin = user?.user_metadata?.memberType === 'admin';
  const userId = user?.id || null;

  const topPosts = await getTopPostsWithUserInfo(3);
  const topProjects = await getTopApprovedProjects(3);

  return (
    <LandingContent 
      topPosts={topPosts} 
      topProjects={topProjects} 
      isAdmin={isAdmin} 
      userId={userId}
    />
  );
}
