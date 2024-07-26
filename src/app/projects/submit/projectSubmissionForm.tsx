"use client"

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createProject } from '~/server/actions/project';
import { createClient } from '~/utils/supabase/client';
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { toast } from "react-hot-toast";
import { TagInput } from "~/components/ui/tag-input";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";

export function ProjectSubmissionForm() {
  const [title, setTitle] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [liveSiteUrl, setLiveSiteUrl] = useState('');
  const [techStack, setTechStack] = useState<string[]>([]);
  const [collaborators, setCollaborators] = useState('');
  const [html, setHTML] = useState('');
  const router = useRouter();

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

  const handleSubmit = async (e: React.FormEvent) => {
    console.log(e);
    e.preventDefault();
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast.error("You must be logged in to submit a project");
      return;
    }

    const collaboratorArray = collaborators.split(',').map(item => item.trim());
    const userIds = [user.id, ...collaboratorArray];

    try {
      const newProject = await createProject(
        title,
        html, // Use the HTML content from the markdown editor
        imageUrl,
        videoUrl,
        techStack,
        userIds,
        githubUrl,
        liveSiteUrl
      );

      if (newProject) {
        toast.success("Project submitted successfully!");
        router.push('/projects');
      } else {
        toast.error("Failed to submit project");
      }
    } catch (error) {
      console.error("Error submitting project:", error);
      toast.error("An error occurred while submitting the project");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        placeholder="Project Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <div className="overflow-y-auto rounded">
        <BlockNoteView
          editor={editor}
          onChange={onChange}
          theme="dark"
        />
      </div>
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
      <Input
        placeholder="Collaborator IDs (comma-separated)"
        value={collaborators}
        onChange={(e) => setCollaborators(e.target.value)}
      />
      <Button type="submit">Submit Project</Button>
    </form>
  );
}
