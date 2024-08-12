import { getProjectById } from '~/server/db/queries/projects';
import { ProjectEditForm } from './projectEditForm';
import { createClient } from '~/utils/supabase/server';
import { isAdmin } from '~/server/actions/auth';

export default async function EditProjectPage({ params }: { params: { projectId: string } }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  const project = await getProjectById(params.projectId);

  if (!project) {
    return <div>Project not found</div>;
  }

  const isUserAdmin = isAdmin();
  const isMember = project.userProjects.some((u: any) => u.id === user?.id);

  if (!isUserAdmin && !isMember) {
    return <div>You don't have permission to edit this project</div>;
  }

  return (
    <div className="max-w-[1024px] mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Edit Project: {project.name}</h1>
      <ProjectEditForm project={project} />
    </div>
  );
}
