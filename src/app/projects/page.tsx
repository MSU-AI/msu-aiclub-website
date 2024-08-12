import Link from 'next/link';
import { Button } from "~/components/ui/button";
import { getAllProjects } from '~/server/db/queries/projects';
import { ProjectCard } from './projectCard';
import { createClient } from '~/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { isAdmin } from '~/server/actions/auth';

export default async function ProjectsPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  const isUserAdmin = await isAdmin();
  const allProjects = await getAllProjects();

  // Filter projects based on user role
  const projects = isUserAdmin 
    ? allProjects 
    : allProjects.filter(project => project.status === 'approved');

  const handleStatusChange = async () => {
    'use server'
    revalidatePath('/projects');
  };

  return (
    <div className="max-w-[1024px] mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Projects</h1>
        <Link href="/projects/submit">
          <Button variant="secondary">Submit a Project</Button>
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <ProjectCard 
            key={project.id} 
            project={project} 
            isAdmin={isUserAdmin}
            isMember={project.users.some((u: any) => u.id === user?.id)}
            onStatusChange={handleStatusChange}
          />
        ))}
      </div>
    </div>
  );
}
