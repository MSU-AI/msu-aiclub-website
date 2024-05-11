import { getPosts } from "~/server/db/queries/posts";
import type { Post } from "~/types/posts";

export default async function PostsPage() {
    const posts = await getPosts();

    return (
        <div>
            Posts
            {posts.map((post: Post) => (
                <div key={post.id}>
                    {post.name}
                </div>
            ))}
        </div>
    )
}