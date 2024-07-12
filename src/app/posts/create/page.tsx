"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { EditorContent, EditorRoot } from "novel";
import { defaultExtensions } from "./extensions";
import { createPost } from '~/server/actions/post';
import ReactMarkdown from 'react-markdown';
import { toast } from "~/components/ui/use-toast";

export default function CreatePostPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [content, setContent] = useState<any>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const markdownContent = content ? JSON.stringify(content) : '';
    const result = await createPost(title, markdownContent, description, thumbnailUrl);
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

  const getMarkdownContent = (content: any): string => {
    if (!content || !content.content) return '';
    return content.content.map((block: any) => {
      if (block.type === 'paragraph') {
        return block.content?.map((item: any) => item.text).join('') || '';
      }
      // Add more conditions here for other block types if needed
      return '';
    }).join('\n\n');
  };

  return (
    <div className="min-h-screen bg-background">
      <form onSubmit={handleSubmit} className="container mx-auto py-8">
        <div className="space-y-4 mb-8">
          <Input
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="text-2xl font-bold"
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
        <div className="flex space-x-4">
          <div className="w-1/2 h-[calc(100vh-300px)] overflow-y-auto border rounded-md">
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
          <div className="w-1/2 h-[calc(100vh-300px)] overflow-y-auto border rounded-md p-4">
            <ReactMarkdown 
              className="prose max-w-none"
              components={{
                img: ({node, ...props}) => (
                  <div className="flex justify-center">
                    <img {...props} className="rounded-lg" />
                  </div>
                ),
                video: ({node, ...props}) => (
                  <div className="flex justify-center">
                    <video {...props} className="rounded-lg" />
                  </div>
                ),
              }}
            >
              {getMarkdownContent(content)}
            </ReactMarkdown>
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
