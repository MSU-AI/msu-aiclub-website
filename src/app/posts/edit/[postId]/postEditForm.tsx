"use client";
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { updatePost } from '~/server/actions/post';
import { uploadImage } from '~/server/actions/helpers';
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { toast } from "react-hot-toast";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import { Image } from "lucide-react";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";

interface PostEditFormProps {
  post: any; // Replace 'any' with your actual Post type
}

export function PostEditForm({ post }: PostEditFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState(post.title);
  const [description, setDescription] = useState(post.description);
  const [thumbnailUrl, setThumbnailUrl] = useState(post.thumbnailUrl);
  const [isUploading, setIsUploading] = useState(false);
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

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const uploadedUrl = await uploadImage(formData);
      setThumbnailUrl(uploadedUrl);
      toast.success('Image uploaded successfully!');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

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
    <form onSubmit={handleSubmit} className="space-y-4 max-w-4xl mx-auto p-4">
      <Input
        placeholder="Post Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        className="text-4xl font-bold bg-background w-full p-2 focus:outline-0 outline-0"
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

      <div className="space-y-2">
        <label className="text-sm font-medium">
          Post Thumbnail
        </label>
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

      <div className="overflow-y-auto rounded border">
        <BlockNoteView 
          editor={editor}
          theme="dark"
          className="min-h-[400px]"
        />
      </div>

      <Button 
        type="submit" 
        className="w-full"
        disabled={isUploading}
      >
        Update Post
      </Button>
    </form>
  );
}
