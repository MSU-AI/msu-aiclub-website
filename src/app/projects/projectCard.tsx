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

const TAG_COLORS = [
  'bg-blue-200 text-blue-800',
  'bg-green-200 text-green-800',
  'bg-yellow-200 text-yellow-800',
  'bg-red-200 text-red-800',
  'bg-purple-200 text-purple-800',
];

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
    <div className="p-2 rounded-lg hover:shadow-lg transition-shadow duration-300 relative">
      {isAdmin && project.status === 'pending' && (
        <div className="absolute top-2 left-2 bg-yellow-500 text-white px-2 py-1 rounded-full text-sm z-10">
          Pending
        </div>
      )}
      <Link href={`/projects/${project.id}`}>
        <div className="w-full h-48 relative mb-4 rounded-lg overflow-hidden">
          <Image 
            src={project.thumbnailUrl || '/placeholder-image.jpg'} 
            alt={project.name}
            layout="fill"
            objectFit="cover"
          />
        </div>
        <h2 className="text-xl font-semibold mb-2">{project.name}</h2>
        <div className="overflow-x-auto whitespace-nowrap pb-2">
          {project.skills.map((skill: string, index: number) => (
            <span 
              key={index} 
              className={`inline-block ${TAG_COLORS[index % TAG_COLORS.length]} px-2 py-1 rounded-full text-sm mr-2 mb-2`}
            >
              {skill}
            </span>
          ))}
        </div>
      </Link>
      {(isAdmin || isMember) && (
        <div className="absolute top-2 right-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
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
    </div>
  );
}
