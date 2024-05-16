"use client";

import { Button, Input, Textarea } from "@nextui-org/react";
import { useState } from "react";


export default function PostForm({
    supaId,
    prevName = null,
    prevContent = null,
    handleSubmit
} : {
    supaId: string | undefined
    prevName?: string | null
    prevContent?: string | null
    handleSubmit: (name: string, content: string) => void
}) {
    const [name, setName] = useState(prevName ?? "");
    const [content, setContent] = useState(prevContent ?? "");

    return (
        <div>
            <Input 
            placeholder="Post name" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            />
            <Textarea 
            placeholder="Post content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            />
            <Button onPress={() => handleSubmit(name, content)}>
                Post
            </Button>
        </div>
    )
}