"use client";

import { useRouter } from "next/navigation";
import { updatePost } from "~/server/actions/post";
import PostForm from "../../postForm";
import { Post } from "~/types/posts";


export default function EditPostForm({
    supaId,
    post
} : {
    supaId: string | undefined,
    post: Post
}) {
    const router = useRouter();

    const handleSubmit = async (name: string, content: string) => {
        const res = await updatePost(supaId!, post?.id, name, content);

        if (res !== null) {
            router.push(`/posts/${res}`);
        } else {
            alert("Could not create post");
        }
    }

    return (
        <div>
            <PostForm 
            supaId={supaId}
            prevName={post?.name}
            prevContent={post?.content}
            handleSubmit={handleSubmit}
            />
        </div>
    )
}
