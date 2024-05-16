import { getPostById } from "~/server/db/queries/posts";
import EditPostForm from "./editForm";
import { createClient } from "~/utils/supabase/server";

export default async function EditPostPage({
    params
} : {
    params: {
        postId: string
    }
}) {
    const supaBase = createClient();

    const { data } = await supaBase.auth.getUser();

    const post = await getPostById(params.postId);

    if (!post) {
        return <div>Post not found</div>;
    }

    return (
        <EditPostForm 
        supaId={data?.user?.id}
        post={post}
        />
    )
}