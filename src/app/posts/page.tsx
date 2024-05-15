import { getPosts } from "~/server/db/queries/posts";
import { examplePosts } from "./examplePosts";
import PostCard from "./postCard";

export default async function PostsPage() {
    const posts = await getPosts();

    const workshopPosts = examplePosts.filter((post: any) => post.type === "workshop");
    const memberPosts = examplePosts.filter((post: any) => post.type === "member");

    return (
        <div className="min-h-screen w-screen p-10 flex flex-row gap-10">
            <div className="flex flex-col gap-10 w-[65vw]">
                <p className="text-2xl font-bold text-white">Our Posts</p>
                {workshopPosts.map((post: any) => (
                    <div className="w-[60vw] h-[20vh]">
                        <PostCard post={post} />
                    </div>
                ))}
            </div>
            <div className="fixed right-10 w-[30vw] h-[80vh] bg-stone-700 rounded-lg p-3">
                <p className="text-2xl font-bold text-white">Member Posts</p>
                <div className="overflow-y-scroll flex flex-col gap-5 h-[70vh] hide-scrollbar">
                    {memberPosts.map((post: any) => (
                        <div className="">
                            <PostCard post={post} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
