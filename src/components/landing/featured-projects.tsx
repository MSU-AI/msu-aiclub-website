"use client";

import React from 'react';
import { ProjectCard } from '~/app/projects/projectCard';

interface FeaturedProjectsProps {
  projects: any[];
  isAdmin: boolean;
  userId: string | null;
  scrollRef: React.RefObject<HTMLDivElement>
}

export function FeaturedProjects({ projects, isAdmin, userId, scrollRef }: FeaturedProjectsProps) {
 
  return (
    <section className="py-28" ref={scrollRef}>
      <h1 className="text-2xl lg:text-4xl font-semibold text-center text-white pb-14">Past projects</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            isAdmin={isAdmin}
            isMember={project.users.some((u: any) => u.id === userId)}
          />
        ))}
      </div>
    </section>
  );
}
