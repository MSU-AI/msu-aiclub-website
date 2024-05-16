import { Button } from "@nextui-org/react";
import { getPostById } from "~/server/db/queries/posts";
import DeleteButton from "./deletPostButton";
import { createClient } from "~/utils/supabase/server";
import Link from "next/link";

export default async function PostPage({
    params
} : {
    params: {
        postId: string
    }
}) {
    const supabase = createClient();

    const { data } = await supabase.auth.getUser();

    const post = await getPostById(params.postId);

    if (!post) {
        return <div>Post not found</div>;
    }

    return (
        <>
        <div>
            Admin Post 
            {post.id} 
            {post.name} 
            {post.content}
        </div>
        <DeleteButton 
        postId={post.id} 
        userId={data?.user?.id}
        />
        <Link href={`/posts/${post.id}/edit`}>Edit</Link>
        </>
    )
}
