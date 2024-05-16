"use client";

import { Button } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { deletePost } from "~/server/actions/post";

export default function DeletButton({ 
    postId,
    userId
}: { 
    postId: string
    userId: string | undefined 
}) {
    const router = useRouter();

    const handleDelete = async () => {
        const res = await deletePost(postId, userId!);

        if (res) {
            router.push("/posts");
        } else {
            alert("Could not delete post");
        }
    }

    return (
        <Button onPress={() => handleDelete()}>
            Delete
        </Button>
    );
}
