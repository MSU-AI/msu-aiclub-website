import Link from 'next/link';
import { Button } from "~/components/ui/button";
import { getAllProjects } from '~/server/db/queries/projects';
import { createClient } from '~/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { isAdmin } from '~/server/actions/auth';
import { Footer } from '~/components/landing/footer';
import ProjectList from './projectList';

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
    <div>
      <main className="flex-grow pt-16">
        <section className="py-24 bg-secondary/30">
          <div className="container px-4 mx-auto text-center">
            <h1 className="text-4xl font-bold mb-6">Projects</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Explore the innovative projects created by members of the MSU AI Club.
            </p>
            <div className="mt-8">
              <Link href="/projects/submit">
                <Button>Submit a Project</Button>
              </Link>
            </div>
          </div>
        </section>
        
        <section className="py-16">
          <div className="container px-4 mx-auto">
            <ProjectList 
              projects={projects} 
              isAdmin={isUserAdmin} 
              userId={user?.id}
            />
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
