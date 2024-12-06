"use client"

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createProject } from '~/server/actions/project';
import { uploadImage } from '~/server/actions/helpers';
import { Input, Button, Autocomplete, AutocompleteItem, Chip } from "@nextui-org/react";
import { toast } from "react-hot-toast";
import { TagInput } from "~/components/ui/tag-input";
import { useCreateBlockNote } from "@blocknote/react";
import dynamic from 'next/dynamic';
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";
import { User } from '@supabase/supabase-js';
import { Image } from "lucide-react";

const BlockNoteView = dynamic(() => import("@blocknote/mantine").then(mod => mod.BlockNoteView), { ssr: false });

export function ProjectSubmissionForm({
  users,
  user
} : {
  users: User[];
  user: User;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [liveSiteUrl, setLiveSiteUrl] = useState('');
  const [techStack, setTechStack] = useState<string[]>([]);
  const [collaborators, setCollaborators] = useState<User[]>([]);
  const [html, setHTML] = useState('');
  const [isClient, setIsClient] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const editor = useCreateBlockNote({
    initialContent: [
      {
        type: "paragraph",
        content: "Start writing your project description here...",
      },
    ],
  });

  const onChange = async () => {
    const htmlContent = await editor.blocksToHTMLLossy(editor.document);
    setHTML(htmlContent);
  };

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

    setImageFile(file);
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
      setImageFile(null);
      setImageUrl('');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async () => {
    if (!title) {
      toast.error('Please enter a project title');
      return;
    }

    if (!imageUrl) {
      toast.error('Please upload a project image');
      return;
    }

    if (!html) {
      toast.error('Please enter a project description');
      return;
    }

    console.log("Submitting project");

    const userIds = [user.id, ...collaborators.map(c => c.id)];

    try {
      console.log("Creating project");
      const newProject = await createProject(
        title,
        html,
        imageUrl,
        videoUrl,
        techStack,
        userIds,
        githubUrl,
        liveSiteUrl
      );

      if (newProject) {
        console.log("Project submitted successfully!");
        toast.success("Project submitted successfully!");
        router.push('/projects');
      } else {
        console.log("Failed to submit project");
        toast.error("Failed to submit project");
      }
    } catch (error) {
      console.error("Error submitting project:", error);
      toast.error("An error occurred while submitting the project");
    }
  };

  const handleCollaboratorSelect = useCallback((key: React.Key) => {
    const selectedUser = users.find(u => u.email === key);
    if (selectedUser && !collaborators.some(c => c.id === selectedUser.id)) {
      setCollaborators(prev => [...prev, selectedUser]);
    }
  }, [users, collaborators]);

  const handleCollaboratorRemove = useCallback((userId: string) => {
    setCollaborators(prev => prev.filter(c => c.id !== userId));
  }, []);

  const availableUsers = users.filter(user => 
    !collaborators.some(c => c.id === user.id)
  );

  return (
    <div className="space-y-4 max-w-4xl mx-auto p-4">
      <div className="space-y-2">
        <label htmlFor="title" className="text-sm font-medium">
          Project Title *
        </label>
        <Input
          id="title"
          placeholder="Enter your project title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      {isClient && (
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Project Description *
          </label>
          <div className="overflow-y-auto rounded border">
            <BlockNoteView
              editor={editor}
              onChange={onChange}
              theme="dark"
            />
          </div>
        </div>
      )}
      
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
              <p className="text-xs text-secondary-foreground">
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
          placeholder="Enter video URL"
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
          placeholder="Enter GitHub repository URL"
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
          placeholder="Enter live site URL"
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
          placeholder="Enter technologies (separate with comma)"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">
          Collaborators
        </label>
        <Autocomplete
          placeholder="Select collaborators"
          onSelectionChange={handleCollaboratorSelect}
        >
          {availableUsers.map((user) => (
            <AutocompleteItem key={user.email} value={user.email}>
              {user.email}
            </AutocompleteItem>
          ))}
        </Autocomplete>
        <div className="flex flex-wrap gap-2">
          {collaborators.map(user => (
            <Chip key={user.id} onClose={() => handleCollaboratorRemove(user.id)}>
              {user.email}
            </Chip>
          ))}
        </div>
      </div>

      <div className="pt-4">
        <Button 
          onPress={handleSubmit}
          isLoading={isUploading}
          size="lg"
          color="primary"
          className="w-full"
        >
          Submit Project
        </Button>
      </div>
    </div>
  );
}
