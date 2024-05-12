"use client";

import { useRouter } from "next/navigation";
import { createPost } from "~/server/actions/post";
import PostForm from "../postForm";


export default function NewPostForm({
    supaId
} : {
    supaId: string | undefined
}) {
    const router = useRouter();

    const handleSubmit = async (name: string, content: string) => {
        const res = await createPost(supaId!, name, content);

        if (res !== null) {
            router.push(`/member/posts/${res}`);
        } else {
            alert("Could not create post");
        }
    }

    return (
        <div>
            <PostForm 
            supaId={supaId}
            handleSubmit={handleSubmit}
            />
        </div>
    )
}