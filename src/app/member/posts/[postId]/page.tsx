import { getPostById } from "~/server/db/queries/posts";

export default async function PostPage({
    params
} : {
    params: {
        postId: string
    }
}) {
    const post = await getPostById(params.postId);

    if (!post) {
        return <div>Post not found</div>;
    }

    return (
        <div>
            Member Post
            {post.id}
            {post.name}
        </div>
    )
}