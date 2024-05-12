import { getPostById } from "~/server/db/queries/posts";

export default async function PostPage({
    params
} : {
    params: {
        postId: string
    }
}) {
    const post = await getPostById(params.postId);

    if (post === null) {
        return <div>Post not found</div>;
    }

    return (
        <div>
            Post
            {post.name}
            {post.content}
        </div>
    )
}