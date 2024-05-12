import Link from "next/link";
import { getPosts } from "~/server/db/queries/posts";
import type { Post } from "~/types/posts";

export default async function PostsPage() {
    const posts = await getPosts();

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