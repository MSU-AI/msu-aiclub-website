import Link from "next/link";
import { getPosts } from "~/server/db/queries/posts";
import type { Post } from "~/types/posts";
import { examplePosts } from "./examplePosts";

export default async function PostsPage() {
    const posts = await getPosts();

    return (
        <div className="min-h-screen text-white">
            Posts
            {examplePosts.map((post: any) => (
                <Link href={`/member/posts/${post.id}`} key={post.id}>
                    {post.name}
                </Link>
            ))}
        </div>
    )
}