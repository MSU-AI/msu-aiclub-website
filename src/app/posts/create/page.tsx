"use client";
import React, { useState, useRef } from "react";
import { useRouter } from 'next/navigation';
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";
import { createPost } from '~/server/actions/post';
import { uploadImage } from '~/server/actions/helpers';
import { toast } from "~/components/ui/use-toast";
import PostPreview from './postPreview';
import { Image } from "lucide-react";
import './postStyles.css';

export default function CreatePostPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
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

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Error",
        description: "Image size should be less than 5MB",
        variant: "destructive",
      });
      return;
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Error",
        description: "Please upload an image file",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const uploadedUrl = await uploadImage(formData);
      setThumbnailUrl(uploadedUrl);
      toast({
        title: "Success",
        description: "Image uploaded successfully",
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Error",
        description: "Failed to upload image",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const onChange = async () => {
    const htmlContent = await editor.blocksToHTMLLossy(editor.document);
    setHTML(htmlContent);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await createPost(title, html, description, thumbnailUrl);
    if (result) {
      toast({
        title: "Success",
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

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />

          <div 
            onClick={triggerFileInput}
            className={`
              border-2 border-dashed rounded-lg p-6
              ${thumbnailUrl ? 'border-green-500' : 'border-gray-300'}
              hover:border-gray-400 cursor-pointer
              transition-colors duration-200
              flex flex-col items-center justify-center
              ${isUploading ? 'opacity-50' : ''}
              h-[200px]
            `}
          >
            {!thumbnailUrl && (
              <div className="text-center">
                <Image className="mx-auto mb-4 w-12 h-12 text-gray-400" />
                <div className="mb-2 text-sm font-medium">
                  {isUploading ? 'Uploading...' : 'Click to upload thumbnail image'}
                </div>
                <p className="text-xs text-secondary-foreground">
                  PNG, JPG, GIF up to 5MB
                </p>
              </div>
            )}
            
            {thumbnailUrl && !isUploading && (
              <div className="relative group w-full h-full">
                <img
                  src={thumbnailUrl}
                  alt="Thumbnail preview"
                  className="w-full h-full object-cover rounded"
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center rounded">
                  <p className="text-white text-sm">Click to change image</p>
                </div>
              </div>
            )}
          </div>
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
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => router.push('/posts')}
          >
            Cancel
          </Button>
          <Button 
            type="submit"
            disabled={isUploading}
          >
            Publish
          </Button>
        </div>
      </form>
    </div>
  );
}
