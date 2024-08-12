"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { updateProject } from '~/server/actions/project';
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { TagInput } from "~/components/ui/tag-input";
import { toast } from "react-hot-toast";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";

interface ProjectEditFormProps {
  project: any; // Replace 'any' with your actual Project type
}

export function ProjectEditForm({ project }: ProjectEditFormProps) {
  const [title, setTitle] = useState(project.name);
  const [imageUrl, setImageUrl] = useState(project.thumbnailUrl);
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

  console.log("project", project);

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
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        placeholder="Project Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <div className="overflow-y-auto rounded">
        <BlockNoteView editor={editor} />
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
      <Button type="submit">Update Project</Button>
    </form>
  );
}
