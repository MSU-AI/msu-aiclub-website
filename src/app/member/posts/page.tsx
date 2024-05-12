import Link from "next/link";
import { getUserPosts } from "~/server/db/queries/posts";
import type { Post } from "~/types/posts";
import { createClient } from "~/utils/supabase/server";

export default async function PostsPage() {
    const supabase = createClient();

    const { data } = await supabase.auth.getUser();

    const posts = await getUserPosts(data?.user?.id ?? null);

    console.log(posts);

    return (
        <div>
            Posts
            {posts.map((post: Post) => (
                <div key={post.id}>
                    <Link href={`/member/posts/${post.id}`}>{post.name}</Link>
                </div>
            ))}
        </div>
    )
}