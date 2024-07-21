"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { updatePost } from '~/server/actions/post';
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { toast } from "react-hot-toast";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";

interface PostEditFormProps {
  post: any; // Replace 'any' with your actual Post type
}

export function PostEditForm({ post }: PostEditFormProps) {
  const [title, setTitle] = useState(post.title);
  const [description, setDescription] = useState(post.description);
  const [thumbnailUrl, setThumbnailUrl] = useState(post.thumbnailUrl);
  const [html, setHTML] = useState(post.content);
  const router = useRouter();

  const editor = useCreateBlockNote();

  const loadInitialHTML = useCallback(async () => {
    const blocks = await editor.tryParseHTMLToBlocks(post.content);
    editor.replaceBlocks(editor.document, blocks);
  }, [editor, post.content]);

  useEffect(() => {
    loadInitialHTML();
  }, [loadInitialHTML]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const updatedHTML = await editor.blocksToHTMLLossy(editor.document);

    try {
      await updatePost(post.userId, post.id, title, updatedHTML, description, thumbnailUrl);
      toast.success("Post updated successfully!");
      router.push(`/posts/${post.id}`);
    } catch (error) {
      console.error("Error updating post:", error);
      toast.error("An error occurred while updating the post");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        placeholder="Post Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <Input
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />
      <Input
        placeholder="Thumbnail URL"
        value={thumbnailUrl}
        onChange={(e) => setThumbnailUrl(e.target.value)}
      />
      <div className="overflow-y-auto rounded">
        <BlockNoteView editor={editor} />
      </div>
      <Button type="submit">Update Post</Button>
    </form>
  );
}
