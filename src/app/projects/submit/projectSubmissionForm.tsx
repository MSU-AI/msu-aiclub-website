"use client"

import React, { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createProject } from '~/server/actions/project';
import { createClient } from '~/utils/supabase/client';
import { Input, Button, Autocomplete, AutocompleteItem, Chip } from "@nextui-org/react";
import { toast } from "react-hot-toast";
import { TagInput } from "~/components/ui/tag-input";
import { useCreateBlockNote } from "@blocknote/react";
import dynamic from 'next/dynamic';
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";
import { User } from '@supabase/supabase-js';

const BlockNoteView = dynamic(() => import("@blocknote/mantine").then(mod => mod.BlockNoteView), { ssr: false });

export function ProjectSubmissionForm({
  users,
  user
} : {
  users: User[];
  user: User;
}) {
  const [title, setTitle] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [liveSiteUrl, setLiveSiteUrl] = useState('');
  const [techStack, setTechStack] = useState<string[]>([]);
  const [collaborators, setCollaborators] = useState<User[]>([]);
  const [html, setHTML] = useState('');
  const [isClient, setIsClient] = useState(false);
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

  const handleSubmit = async () => {
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

  const availableUsers = users.filter(user => !collaborators.some(c => c.id === user.id));

  return (
    <div className="space-y-4">
      <Input
        placeholder="Project Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      {isClient && (
        <div className="overflow-y-auto rounded">
          <BlockNoteView
            editor={editor}
            onChange={onChange}
            theme="dark"
          />
        </div>
      )}
      <Input
        placeholder="Image URL"
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
      />
      <Input
        placeholder="Video URL"
        value={videoUrl}
        onChange={(e) => setVideoUrl(e.target.value)}
      />
      <Input
        placeholder="GitHub URL"
        value={githubUrl}
        onChange={(e) => setGithubUrl(e.target.value)}
      />
      <Input
        placeholder="Live Site URL"
        value={liveSiteUrl}
        onChange={(e) => setLiveSiteUrl(e.target.value)}
      />
      <TagInput
        tags={techStack}
        onTagsChange={setTechStack}
        placeholder="Enter tech stack (separate with comma)"
      />
      <Autocomplete
        label="Collaborators"
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
      <Button onPress={() => handleSubmit()}>Submit Project</Button>
    </div>
  );
}