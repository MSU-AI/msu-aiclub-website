"use client";

import React, { useState } from 'react';
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
import { MoreHorizontal, Edit, Trash2, Check, LayoutGridIcon, LayoutListIcon } from "lucide-react";
import { approveProject, deleteProject } from '~/server/actions/project';
import { Tag } from "~/components/ui/tag";
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from "~/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";

interface ProjectListProps {
  projects: any[];
  isAdmin: boolean;
  userId?: string;
}

export default function ProjectList({ projects, isAdmin, userId }: ProjectListProps) {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // Helper function to get excerpt from content and strip HTML tags
  const getExcerpt = (content: string) => {
    if (!content) return '';
    // Strip HTML tags and limit to 150 characters
    return content.replace(/<[^>]*>/g, '').substring(0, 150) + '...';
  };

  const handleApprove = async (projectId: string) => {
    await approveProject(projectId);
    // Refresh the page to show updated status
    router.refresh();
  };

  const handleDelete = async (projectId: string) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      await deleteProject(projectId);
      // Refresh the page to remove deleted project
      router.refresh();
    }
  };

  const handleEdit = (projectId: string) => {
    router.push(`/projects/edit/${projectId}`);
  };

  const isMember = (project: any) => {
    return project.users.some((u: any) => u.id === userId);
  };

  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <div className="flex-grow"></div>
        <div className="flex items-center gap-4">
          <div className="flex items-center border rounded-md overflow-hidden">
            <Button 
              variant={viewMode === 'grid' ? "default" : "ghost"} 
              size="icon" 
              onClick={() => setViewMode('grid')} 
              className="rounded-none"
            >
              <LayoutGridIcon className="h-4 w-4" />
            </Button>
            <Button 
              variant={viewMode === 'list' ? "default" : "ghost"} 
              size="icon" 
              onClick={() => setViewMode('list')} 
              className="rounded-none"
            >
              <LayoutListIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {projects.length === 0 ? (
        <div className="flex justify-center items-center py-24 border border-dashed border-muted rounded-lg">
          <p className="text-muted-foreground">No projects found. Be the first to submit one!</p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <Card key={project.id} className="overflow-hidden h-full flex flex-col relative">
              {isAdmin && project.status === 'pending' && (
                <div className="absolute top-2 left-2 bg-yellow-500 text-white px-2 py-1 rounded-full text-sm z-10">
                  Pending
                </div>
              )}
              
              <div className="w-full h-48 relative">
                <Image 
                  src={project.thumbnailUrl && project.thumbnailUrl.trim() !== '' ? project.thumbnailUrl : 'https://placehold.co/600x400/e2e8f0/475569?text=No+Image+Available'}
                  alt={project.title}
                  fill
                  className="object-cover"
                />
              </div>
              
              <CardHeader>
                <CardTitle className="text-xl hover:text-primary transition-colors">
                  <Link href={`/projects/${project.id}`}>{project.name}</Link>
                </CardTitle>
                <div className="overflow-x-auto whitespace-nowrap pb-2">
                  {project.skills.slice(0, 3).map((skill: string, index: number) => (
                    <div key={index} className="inline-block mr-2 mb-2">
                      <Tag 
                        text={skill}
                        colorIndex={index}
                      />
                    </div>
                  ))}
                  {project.skills.length > 3 && (
                    <div className="inline-block">
                      <span className="text-sm text-muted-foreground">+{project.skills.length - 3} more</span>
                    </div>
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="flex-grow">
                <p className="text-muted-foreground line-clamp-3">
                  {getExcerpt(project.description || project.content || '')}
                </p>
              </CardContent>
              
              <CardFooter>
                <Button variant="outline" asChild className="w-full">
                  <Link href={`/projects/${project.id}`}>View Details</Link>
                </Button>
              </CardFooter>
              
              {(isAdmin || isMember(project)) && (
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
                        <DropdownMenuItem onClick={() => handleApprove(project.id)}>
                          <Check className="mr-2 h-4 w-4" />
                          <span>Approve</span>
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem onClick={() => handleEdit(project.id)}>
                        <Edit className="mr-2 h-4 w-4" />
                        <span>Edit</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDelete(project.id)} className="text-red-600">
                        <Trash2 className="mr-2 h-4 w-4" />
                        <span>Delete</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {projects.map((project) => (
            <div key={project.id} className="w-full border rounded-lg overflow-hidden">
              <div className="flex w-full justify-between">
                <Link href={`/projects/${project.id}`} className="flex items-center w-full">
                  <div className="w-52 h-32 flex justify-center relative shrink-0">
                    <Image 
                      src={project.thumbnailUrl && project.thumbnailUrl.trim() !== '' ? project.thumbnailUrl : 'https://placehold.co/600x400/e2e8f0/475569?text=No+Image+Available'}
                      alt={project.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-4 flex-grow">
                    <h2 className="text-2xl font-bold mb-2 line-clamp-1 hover:text-primary transition-colors">{project.name}</h2>
                    <p className="text-muted-foreground">{getExcerpt(project.description || project.content || '')}</p>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {project.skills.map((skill: string, index: number) => (
                        <Tag 
                          key={index}
                          text={skill}
                          colorIndex={index}
                        />
                      ))}
                    </div>
                    {isAdmin && project.status === 'pending' && (
                      <div className="inline-block bg-yellow-500 text-white px-2 py-1 rounded-full text-sm mt-2">
                        Pending
                      </div>
                    )}
                  </div>
                </Link>
                {(isAdmin || isMember(project)) && (
                  <div className="flex items-center p-4 gap-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4 text-foreground" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {isAdmin && project.status === 'pending' && (
                          <DropdownMenuItem onClick={() => handleApprove(project.id)}>
                            <Check className="mr-2 h-4 w-4" />
                            <span>Approve</span>
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem onClick={() => handleEdit(project.id)}>
                          <Edit className="mr-2 h-4 w-4" />
                          <span>Edit</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDelete(project.id)} className="text-red-600">
                          <Trash2 className="mr-2 h-4 w-4" />
                          <span>Delete</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
