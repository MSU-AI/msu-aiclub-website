import { getPosts } from "~/server/db/queries/posts";
import { examplePosts } from "./examplePosts";
import PostCard from "./postCard";

export default async function PostsPage() {
    const posts = await getPosts();

    return (
        <div className="min-h-screen w-screen p-10 flex flex-row gap-10">
            <div className="flex flex-col gap-10">
            <p className="text-2xl font-bold text-white">Our Posts</p>
            {examplePosts.map((post: any) => (
                <PostCard post={post} />
            ))}
            </div>
            <div className="flex flex-col gap-10 w-[30vw] bg-white rounded-lg p-3">
                Hello
            </div>
        </div>
    )
}