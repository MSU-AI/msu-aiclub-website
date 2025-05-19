"use client"

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "~/components/ui/dropdown-menu";
import { Button } from "~/components/ui/button";
import { MoreHorizontal, Edit, Trash2, Check } from "lucide-react";
import { approveProject, deleteProject } from '~/server/actions/project';
import { Tag } from "~/components/ui/tag";
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from "~/components/ui/card";



interface ProjectCardProps {
  project: any; // Replace 'any' with your actual Project type
  isAdmin: boolean;
  isMember: boolean;
  onStatusChange?: () => void;
}

export function ProjectCard({ project, isAdmin, isMember, onStatusChange }: ProjectCardProps) {
  const router = useRouter();

  const handleApprove = async () => {
    await approveProject(project.id);
    onStatusChange?.();
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      await deleteProject(project.id);
      onStatusChange?.();
    }
  };

  const handleEdit = () => {
    router.push(`/projects/edit/${project.id}`);
  };

  return (
    <Card className="overflow-hidden h-full flex flex-col relative">
      {isAdmin && project.status === 'pending' && (
        <div className="absolute top-2 left-2 bg-yellow-500 text-white px-2 py-1 rounded-full text-sm z-10">
          Pending
        </div>
      )}
      
      <div className="w-full h-48 relative">
        <Image 
          src={project.thumbnailUrl && project.thumbnailUrl.trim() !== '' ? project.thumbnailUrl : 'https://placehold.co/600x400/e2e8f0/475569?text=No+Image+Available'} 
          alt={project.name}
          fill
          className="object-cover"
        />
      </div>
      
      <CardHeader>
        <CardTitle className="text-xl hover:text-primary transition-colors">
          <Link href={`/projects/${project.id}`}>{project.name}</Link>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-grow">
        <div className="overflow-x-auto whitespace-nowrap pb-2">
          {project.skills.map((skill: string, index: number) => (
            <div key={index} className="inline-block mr-2 mb-2">
              <Tag 
                text={skill}
                colorIndex={index}
              />
            </div>
          ))}
        </div>
      </CardContent>
      
      <CardFooter>
        <Button variant="outline" asChild className="w-full">
          <Link href={`/projects/${project.id}`}>View Details</Link>
        </Button>
      </CardFooter>
      
      {(isAdmin || isMember) && (
        <div className="absolute top-2 right-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0 bg-background/80 backdrop-blur-sm">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4 text-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {isAdmin && project.status === 'pending' && (
                <DropdownMenuItem onClick={handleApprove}>
                  <Check className="mr-2 h-4 w-4" />
                  <span>Approve</span>
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={handleEdit}>
                <Edit className="mr-2 h-4 w-4" />
                <span>Edit</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDelete} className="text-red-600">
                <Trash2 className="mr-2 h-4 w-4" />
                <span>Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </Card>
  );
}
