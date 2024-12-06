"use client";
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { updateProject } from '~/server/actions/project';
import { uploadImage } from '~/server/actions/helpers';
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { TagInput } from "~/components/ui/tag-input";
import { toast } from "react-hot-toast";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import { Image } from "lucide-react";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";

interface ProjectEditFormProps {
  project: any; // Replace 'any' with your actual Project type
}

export function ProjectEditForm({ project }: ProjectEditFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState(project.name);
  const [imageUrl, setImageUrl] = useState(project.thumbnailUrl);
  const [isUploading, setIsUploading] = useState(false);
  const [videoUrl, setVideoUrl] = useState(project.videoUrl);
  const [githubUrl, setGithubUrl] = useState(project.githubUrl);
  const [liveSiteUrl, setLiveSiteUrl] = useState(project.liveSiteUrl);
  const [techStack, setTechStack] = useState<string[]>(project.projectSkills.map(s => s.skillName));
  const router = useRouter();
  const editor = useCreateBlockNote();

  const loadInitialHTML = useCallback(async () => {
    const blocks = await editor.tryParseHTMLToBlocks(project.description);
    editor.replaceBlocks(editor.document, blocks);
  }, [editor, project.description]);

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
      setImageUrl(uploadedUrl);
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
      await updateProject(
        project.id,
        title,
        updatedHTML,
        imageUrl,
        videoUrl,
        techStack,
        githubUrl,
        liveSiteUrl
      );
      toast.success("Project updated successfully!");
      router.push('/projects');
    } catch (error) {
      console.error("Error updating project:", error);
      toast.error("An error occurred while updating the project");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-4xl mx-auto p-4">
      <div className="space-y-2">
        <label htmlFor="title" className="text-sm font-medium">
          Project Title *
        </label>
        <Input
          id="title"
          placeholder="Project Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">
          Project Description *
        </label>
        <div className="overflow-y-auto rounded border">
          <BlockNoteView editor={editor} />
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />

      <div className="space-y-2">
        <label className="text-sm font-medium">
          Project Image *
        </label>
        <div 
          onClick={triggerFileInput}
          className={`
            border-2 border-dashed rounded-lg p-6
            ${imageUrl ? 'border-green-500' : 'border-gray-300'}
            hover:border-gray-400 cursor-pointer
            transition-colors duration-200
            flex flex-col items-center justify-center
            ${isUploading ? 'opacity-50' : ''}
          `}
        >
          {!imageUrl && (
            <div className="text-center">
              <Image className="mx-auto mb-4 w-12 h-12 text-gray-400" />
              <div className="mb-2 text-sm font-medium">
                {isUploading ? 'Uploading...' : 'Click to upload project image'}
              </div>
              <p className="text-xs text-gray-500">
                PNG, JPG, GIF up to 5MB
              </p>
            </div>
          )}
          
          {imageUrl && !isUploading && (
            <div className="relative group w-full">
              <img
                src={imageUrl}
                alt="Project preview"
                className="w-full h-48 object-cover rounded"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center rounded">
                <p className="text-white text-sm">Click to change image</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="video" className="text-sm font-medium">
          Video URL (Optional)
        </label>
        <Input
          id="video"
          placeholder="Video URL"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="github" className="text-sm font-medium">
          GitHub URL (Optional)
        </label>
        <Input
          id="github"
          placeholder="GitHub URL"
          value={githubUrl}
          onChange={(e) => setGithubUrl(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="live-site" className="text-sm font-medium">
          Live Site URL (Optional)
        </label>
        <Input
          id="live-site"
          placeholder="Live Site URL"
          value={liveSiteUrl}
          onChange={(e) => setLiveSiteUrl(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">
          Tech Stack
        </label>
        <TagInput
          tags={techStack}
          onTagsChange={setTechStack}
          placeholder="Enter tech stack (separate with comma)"
        />
      </div>

      <div className="pt-4">
        <Button 
          type="submit"
          disabled={isUploading}
          className="w-full"
        >
          Update Project
        </Button>
      </div>
    </form>
  );
}
