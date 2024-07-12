"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { EditorContent, EditorRoot } from "novel";
import { createPost } from '~/server/actions/post';
import { defaultExtensions } from "./extensions";


export function CreatePostForm({ onClose }: { onClose: () => void }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState<any>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const markdownContent = content ? JSON.stringify(content) : '';
    const result = await createPost(title, markdownContent, description);
    if (result) {
      router.refresh();
      onClose();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        placeholder="Title"
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
      <div className="h-[400px] overflow-y-auto border rounded-md">
        <EditorRoot>
          <EditorContent
            extensions={defaultExtensions}
            initialContent={content}
            onUpdate={({ editor }) => {
              const json = editor.getJSON();
              setContent(json);
            }}
          />
        </EditorRoot>
      </div>
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">Save</Button>
      </div>
    </form>
  );
}
