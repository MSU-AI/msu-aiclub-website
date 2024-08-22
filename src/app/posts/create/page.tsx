"use client";
import React, { useState } from "react";
import { useRouter } from 'next/navigation';
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";
import { createPost } from '~/server/actions/post';
import { toast } from "~/components/ui/use-toast";
import PostPreview from './postPreview';
import './postStyles.css'

export default function CreatePostPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [html, setHTML] = useState('');
  const router = useRouter();

  const editor = useCreateBlockNote({
    initialContent: [
      {
        type: "paragraph",
        content: "Start writing your post here...",
      },
    ],
  });

  const onChange = async () => {
    // Converts the editor's contents from Block objects to HTML and store to state.
    const htmlContent = await editor.blocksToHTMLLossy(editor.document);
    setHTML(htmlContent);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await createPost(title, html, description, thumbnailUrl);
    if (result) {
      toast({
        title: "Post created",
        description: "Your post has been successfully published.",
      });
      router.push(`/posts/${result}`);
    } else {
      toast({
        title: "Error",
        description: "Failed to create post. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background pt-28">
      <form onSubmit={handleSubmit} className="container mx-auto py-8">
        <div className="space-y-4 mb-8">
          <Input
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="text-4xl font-bold bg-background text-white w-full p-2 focus:outline-0 outline-0"
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
        </div>
        <div className="flex flex-col md:flex-row space-x-4 h-[calc(100vh-300px)]">
          <div className="w-full md:w-1/2 overflow-y-auto border rounded-md">
            <BlockNoteView
              editor={editor}
              onChange={onChange}
              theme="dark"
              className="h-full bg-background"
            />
          </div>
          <div className="w-full md:w-1/2 overflow-y-auto border rounded-md md:p-4">
            <PostPreview 
              title={title}
              description={description}
              thumbnailUrl={thumbnailUrl}
              content={html}
            />
          </div>
        </div>
        <div className="flex justify-end space-x-2 mt-4">
          <Button type="button" variant="outline" onClick={() => router.push('/posts')}>
            Cancel
          </Button>
          <Button type="submit">Publish</Button>
        </div>
      </form>
    </div>
  );
}
