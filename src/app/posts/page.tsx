import Link from "next/link";
import { getUserPosts } from "~/server/db/queries/posts";
import type { Post } from "~/types/posts";
import { createClient } from "~/utils/supabase/server";
import MakePostButton from "./makePostButton";
import { getProfileType } from "~/server/db/queries/profiles";

export default async function PostsPage() {
    const supabase = createClient();

    const { data } = await supabase.auth.getUser();

    const userType: string | null = await getProfileType(data.user?.id);

    const posts = await getUserPosts(data?.user?.id ?? null);
    

    return (
        <div>
            Posts
            {posts.map((post: Post) => (
                <div key={post.id}>
                    <Link href={`/posts/${post.id}`}>{post.name}</Link>
                </div>
            ))}
            {  userType === "admin" && <MakePostButton /> }
        </div>
    )
}
