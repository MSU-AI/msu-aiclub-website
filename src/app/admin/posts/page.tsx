import Link from "next/link";
import { getPosts } from "~/server/db/queries/posts";

export default async function AdminPostsPage() {
    const posts = await getPosts();


    return (
        <div>
            admin posts page
            {posts.map((post) => (
                <div key={post.id}>
                    <Link href={`/member/posts/${post.id}`}>{post.name}</Link>
                </div>
            ))}
        </div>
    )
}