import Link from "next/link";
import { getPosts } from "~/server/db/queries/posts";
import type { Post } from "~/types/posts";
import { getProfileType } from "~/server/db/queries/profiles";
import { createClient } from "~/utils/supabase/server";

export default async function PostsPage() {
    const posts = await getPosts();
    
    const supabase = createClient();

    const { data } = await supabase.auth.getUser();  

    const userType: string | null = await getProfileType(data.user?.id);

    console.log(userType);
    
    return (
        <div>
            Posts
            {posts.map((post: Post) => (
                <Link href={`/member/posts/${post.id}`} key={post.id}>
                    {post.name}
                </Link>
            ))}
        </div>
    )
}
