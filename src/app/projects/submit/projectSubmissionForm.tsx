"use client"

import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { createProject } from '~/server/actions/project';
import { uploadImage } from '~/server/actions/helpers';
import { Input, Tabs, Tab } from "@nextui-org/react";
import { Button } from "~/components/ui/button";
import { toast } from "react-hot-toast";
import { TagInput } from "~/components/ui/tag-input";
import { useCreateBlockNote } from "@blocknote/react";
import dynamic from 'next/dynamic';
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";
import type { User } from '@supabase/supabase-js';
import type { DbUser } from '~/server/db/types';
import { Image as LucideImage, Search, FileText, Users, Info } from "lucide-react";
import NextImage from 'next/image';
import { StoredFormData } from '~/types/projects';

const BlockNoteView = dynamic(() => import("@blocknote/mantine").then(mod => mod.BlockNoteView), { ssr: false });

export function ProjectSubmissionForm({
  users,
  user
} : {
  users: DbUser[];
  user: User;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  // Create a storage key based on user ID to avoid conflicts between users
  const storageKey = `project-submission-${user.id}`;
  
  // Initialize state with values from localStorage if available
  const [title, setTitle] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [liveSiteUrl, setLiveSiteUrl] = useState('');
  const [techStack, setTechStack] = useState<string[]>([]);
  const [collaborators, setCollaborators] = useState<DbUser[]>([]);
  const [html, setHTML] = useState('');
  const [isClient, setIsClient] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [activeTab, setActiveTab] = useState("details");
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  // Define type for form data stored in localStorage
  

  // Load saved form data from localStorage when component mounts
  useEffect(() => {
    setIsClient(true);
    
    // Only run on client-side
    if (typeof window !== 'undefined') {
      try {
        const savedData = localStorage.getItem(storageKey);
        if (savedData) {
          const parsedData = JSON.parse(savedData) as StoredFormData;
          
          // Restore form state from localStorage
          if (parsedData.title) setTitle(parsedData.title);
          if (parsedData.imageUrl) setImageUrl(parsedData.imageUrl);
          if (parsedData.videoUrl) setVideoUrl(parsedData.videoUrl);
          if (parsedData.githubUrl) setGithubUrl(parsedData.githubUrl);
          if (parsedData.liveSiteUrl) setLiveSiteUrl(parsedData.liveSiteUrl);
          if (parsedData.techStack) setTechStack(parsedData.techStack);
          if (parsedData.html) setHTML(parsedData.html);
          if (parsedData.activeTab) setActiveTab(parsedData.activeTab);
          
          // Don't restore collaborators as they need special handling with user objects
          
          toast.success("Restored your previous draft");
        }
      } catch (error) {
        console.error("Error loading saved form data:", error);
      }
    }
  }, [storageKey]);

  // Save form data to localStorage whenever relevant state changes
  useEffect(() => {
    if (isClient && typeof window !== 'undefined') {
      try {
        const formData: StoredFormData = {
          title,
          imageUrl,
          videoUrl,
          githubUrl,
          liveSiteUrl,
          techStack,
          html,
          activeTab,
          // Don't save collaborators as they're complex objects
        };
        localStorage.setItem(storageKey, JSON.stringify(formData));
      } catch (error) {
        console.error("Error saving form data:", error);
      }
    }
  }, [title, imageUrl, videoUrl, githubUrl, liveSiteUrl, techStack, html, activeTab, isClient, storageKey]);

  // Check if all required fields are filled
  const isFormValid = useMemo(() => {
    return Boolean(title && imageUrl && html);
  }, [title, imageUrl, html]);

  // Filter available users based on search query
  const filteredUsers = users.filter(user => {
    // First check if user is already a collaborator
    if (collaborators.some(c => c.id === user.id)) return false;
    
    // If no search query, include all non-collaborator users
    if (searchQuery === '') return true;
    
    // Convert search query to lowercase for case-insensitive comparison
    const query = searchQuery.toLowerCase();
    
    // Check if email includes search query
    const emailMatch = user.email ? user.email.toLowerCase().includes(query) : false;
    
    // Check if full name includes search query
    const nameMatch = user.user_metadata && typeof user.user_metadata === 'object' && 
      'full_name' in user.user_metadata && typeof user.user_metadata.full_name === 'string' ? 
      user.user_metadata.full_name.toLowerCase().includes(query) : false;
    
    return emailMatch || nameMatch;
  });

  const editor = useCreateBlockNote({
    initialContent: [
      {
        type: "heading",
        content: "Inspiration",
        props: { level: 2 }
      },
      { type: "paragraph", content: "" },
      {
        type: "heading",
        content: "What it does",
        props: { level: 2 }
      },
      { type: "paragraph", content: "" },
      {
        type: "heading",
        content: "How We Built It",
        props: { level: 2 }
      },
      { type: "paragraph", content: "" },
      {
        type: "heading",
        content: "Challenges we ran into",
        props: { level: 2 }
      },
      { type: "paragraph", content: "" },
      {
        type: "heading",
        content: "Accomplishments that we're proud of",
        props: { level: 2 }
      },
      { type: "paragraph", content: "" },
      {
        type: "heading",
        content: "What we learned",
        props: { level: 2 }
      },
      { type: "paragraph", content: "" },
      {
        type: "heading",
        content: "What's next",
        props: { level: 2 }
      },
      { type: "paragraph", content: "" },
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
    setIsUploading(true);

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
        // Clear the saved form data from localStorage after successful submission
        if (typeof window !== 'undefined') {
          localStorage.removeItem(storageKey);
        }
        
        console.log("Project submitted successfully!");
        toast.success("Project submitted successfully!");
        router.push('/projects');
      } else {
        console.log("Failed to submit project");
        toast.error("Failed to submit project");
        setIsUploading(false);
      }
    } catch (error) {
      console.error("Error submitting project:", error);
      toast.error("An error occurred while submitting the project");
      setIsUploading(false);
    }
  };

  const handleCollaboratorSelect = useCallback((key: React.Key | undefined) => {
    if (!key) return;
    const selectedUser = users.find(u => u.email === key);
    if (selectedUser && !collaborators.some(c => c.id === selectedUser.id)) {
      setCollaborators(prev => [...prev, selectedUser]);
    }
  }, [users, collaborators]);

  const handleCollaboratorRemove = useCallback((userId: string) => {
    setCollaborators(prev => prev.filter(c => c.id !== userId));
  }, []);

  // This is now handled by the filteredUsers variable

  return (
    <div className="container mx-auto px-4 md:px-2">
      <h1 className="text-2xl font-bold mb-6">Submit a New Project</h1>
      <Tabs 
        aria-label="Project Submission Tabs" 
        selectedKey={activeTab}
        onSelectionChange={(key) => setActiveTab(key as string)}
        className="mb-8"
        size="lg"
        variant="underlined"
      >
        <Tab
          key="details"
          title={
            <div className="flex items-center gap-2">
              <Info size={18} />
              <span>Project Details</span>
            </div>
          }
        >
          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">
                Project Title <span className="text-destructive">*</span>
              </label>
              <Input
                id="title"
                placeholder="Enter your project title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                size="lg"
                classNames={{
                  input: "text-lg"
                }}
              />
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
                Project Image <span className="text-destructive">*</span>
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
                    <LucideImage className="mx-auto mb-4 w-12 h-12 text-gray-400" />
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
                    <NextImage
                      src={imageUrl}
                      alt="Project preview"
                      className="w-full h-48 object-cover rounded"
                      width={400}
                      height={200}
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
              <div className="space-y-2">
                <TagInput
                  tags={techStack}
                  onTagsChange={(newTags) => {
                    // Handle paste functionality in the onChange handler
                    setTechStack(newTags);
                  }}
                  placeholder="Enter technologies (separate with comma or space)"
                />
                <div className="flex flex-wrap gap-2 mt-2">
                  {['React', 'Next.js', 'TypeScript', 'Python', 'TensorFlow', 'PyTorch', 'JavaScript', 'Node.js'].map(tech => (
                    <Button 
                      key={tech} 
                      variant="outline"
                      size="sm"
                      className="text-xs"
                      onClick={() => {
                        if (!techStack.includes(tech)) {
                          setTechStack(prev => [...prev, tech])
                        }
                      }}
                    >
                      + {tech}
                    </Button>
                  ))}
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  Click on common technologies above or paste a comma-separated list of technologies
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-8">
              <Button
                variant="default"
                onClick={() => setActiveTab("description")}
                className="flex items-center gap-2"
              >
                <span>Next: Add Description</span>
                <FileText size={16} />
              </Button>
            </div>
          </div>
        </Tab>
        <Tab
          key="description"
          title={
            <div className="flex items-center gap-2">
              <FileText size={18} />
              <span>Description</span>
            </div>
          }
        >
          <div className="space-y-6 py-4">
            {isClient && (
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Project Description <span className="text-destructive">*</span>
                </label>
                <div className="rounded border" style={{ minHeight: "900px", height: "calc(100vh - 300px)", position: "relative" }}>
                  <BlockNoteView
                    editor={editor}
                    onChange={onChange}
                    theme="dark"
                    className="bn-container"
                  />
                  <style jsx global>{`
                    .bn-container {
                      position: absolute;
                      top: 0;
                      left: 0;
                      right: 0;
                      bottom: 0;
                      width: 100%;
                      height: 100%;
                      overflow-y: auto;
                    }
                    .bn-container .ProseMirror {
                      min-height: 100%;
                      padding: 1rem;
                    }
                  `}</style>
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  Use the rich text editor above to describe your project in detail. The more information you provide, the better others can understand your work.
                </p>
              </div>
            )}

            <div className="flex justify-between gap-2 mt-8">
              <Button
                variant="outline"
                onClick={() => setActiveTab("details")}
                className="flex items-center gap-2"
              >
                <Info size={16} />
                <span>Back to Details</span>
              </Button>
              <Button
                variant="default"
                onClick={() => setActiveTab("collaborators")}
                className="flex items-center gap-2"
              >
                <span>Next: Add Collaborators</span>
                <Users size={16} />
              </Button>
            </div>
          </div>
        </Tab>
        <Tab
          key="collaborators"
          title={
            <div className="flex items-center gap-2">
              <Users size={18} />
              <span>Collaborators</span>
            </div>
          }
        >
          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Collaborators
              </label>
              <div className="border rounded-md p-4 space-y-4">
                <Input
                  placeholder="Search collaborators by name or email"
                  onChange={(e) => setSearchQuery(e.target.value)}
                  value={searchQuery}
                  startContent={<Search className="h-4 w-4 text-gray-400" />}
                  className="mb-2"
                />
                
                <div className="max-h-96 overflow-y-auto border rounded-md">
                  <div className="p-2 bg-gray-50 dark:bg-gray-800 sticky top-0 z-10 border-b">
                    <p className="text-xs font-medium">Selected Collaborators ({collaborators.length})</p>
                  </div>
                  <div className="p-2 space-y-1">
                    {collaborators.length === 0 ? (
                      <p className="text-sm text-gray-500 p-2">No collaborators selected</p>
                    ) : (
                      collaborators.map(user => (
                        <div key={user.id} className="flex items-center justify-between p-2 bg-gray-100 dark:bg-gray-700 rounded">
                          <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center">
                              {user.email && typeof user.email === 'string' ? user.email.charAt(0).toUpperCase() : 'U'}
                            </div>
                            <div>
                              <p className="text-sm font-medium">
                                {user.user_metadata && typeof user.user_metadata === 'object' && 
                                 'full_name' in user.user_metadata && typeof user.user_metadata.full_name === 'string' ? 
                                 user.user_metadata.full_name : 'User'}
                              </p>
                              <p className="text-xs text-gray-500">{user.email}</p>
                            </div>
                          </div>
                          <Button 
                            variant="destructive"
                            size="sm"
                            onClick={() => handleCollaboratorRemove(user.id)}
                          >
                            Remove
                          </Button>
                        </div>
                      ))
                    )}
                  </div>
                  
                  <div className="p-2 bg-gray-50 dark:bg-gray-800 sticky top-0 z-10 border-t border-b">
                    <p className="text-xs font-medium">Available Users ({filteredUsers.length})</p>
                  </div>
                  <div className="divide-y">
                    {filteredUsers.length === 0 ? (
                      <p className="text-sm text-gray-500 p-4 text-center">No users found {searchQuery ? `matching "${searchQuery}"` : ''}</p>
                    ) : (
                      filteredUsers.slice(0, 10).map((user) => (
                        <div 
                          key={user.id} 
                          className="flex items-center justify-between p-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                          onClick={() => handleCollaboratorSelect(user.email)}
                        >
                          <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 flex items-center justify-center">
                              {user.email && typeof user.email === 'string' ? user.email.charAt(0).toUpperCase() : 'U'}
                            </div>
                            <div>
                              <p className="text-sm font-medium">
                                {user.user_metadata && typeof user.user_metadata === 'object' && 
                                 'full_name' in user.user_metadata && typeof user.user_metadata.full_name === 'string' ? 
                                 user.user_metadata.full_name : 'User'}
                              </p>
                              <p className="text-xs text-gray-500">{user.email}</p>
                            </div>
                          </div>
                          <Button 
                            variant="default"
                            size="sm"
                          >
                            Add
                          </Button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
                
                <p className="text-xs text-gray-400 mt-1">
                  Search for users by name or email and click to add them as collaborators
                </p>
              </div>
            </div>

            <div className="flex justify-between gap-2 mt-8">
              <Button
                variant="outline"
                onClick={() => setActiveTab("description")}
                className="flex items-center gap-2"
              >
                <FileText size={16} />
                <span>Back to Description</span>
              </Button>
              <Button 
                onClick={handleSubmit}
                disabled={isUploading || !isFormValid}
                size="lg"
                variant="default"
                className="text-lg"
              >
                {isUploading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Loading...
                  </span>
                ) : "Submit Project"}
              </Button>
            </div>
          </div>
        </Tab>
      </Tabs>

      {/* Form validation status */}
      <div className="mt-8 border-t pt-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className={`w-4 h-4 rounded-full ${title ? 'bg-green-500' : 'bg-gray-300'}`}></div>
              <span className="text-sm">Project Details</span>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-4 h-4 rounded-full ${html ? 'bg-green-500' : 'bg-gray-300'}`}></div>
              <span className="text-sm">Description</span>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-4 h-4 rounded-full ${imageUrl ? 'bg-green-500' : 'bg-gray-300'}`}></div>
              <span className="text-sm">Project Image</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
