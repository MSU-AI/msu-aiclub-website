import { approveProject, rejectProject } from '~/server/actions/project';
import { getPendingProjects } from '~/server/db/queries/projects';
import { Button } from "~/components/ui/button";

export default async function AdminProjectsPage() {
  const pendingProjects = await getPendingProjects();

  console.log(pendingProjects);

  const handleApprove = async (projectId: string) => {
    'use server'
    await approveProject(projectId);
    // You might want to add a way to refresh the page or update the UI here
  };

  const handleReject = async (projectId: string) => {
    'use server'
    await rejectProject(projectId);
    // You might want to add a way to refresh the page or update the UI here
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Pending Projects</h1>
      {pendingProjects.length === 0 ? (
        <p>No pending projects found.</p>
      ) : (
        <div className="space-y-4">
          {pendingProjects.map((project) => (
            <div key={project.id} className="border p-4 rounded-lg">
              <h2 className="text-xl font-semibold">{project.name}</h2>
              <p className="text-gray-600">{project.description}</p>
              <div className="mt-2">
                <p><strong>Thumbnail URL:</strong> {project.thumbnailUrl || 'N/A'}</p>
                <p><strong>Video URL:</strong> {project.videoUrl || 'N/A'}</p>
                <p><strong>GitHub URL:</strong> {project.githubUrl || 'N/A'}</p>
                <p><strong>Created At:</strong> {new Date(project.createdAt).toLocaleString()}</p>
              </div>
              <div className="mt-2">
                <strong>Skills:</strong>
                <ul className="list-disc list-inside">
                  {project.skills.map((skill, index) => (
                    <li key={index}>{skill}</li>
                  ))}
                </ul>
              </div>
              <div className="mt-2">
                <strong>Team Members:</strong>
                <ul className="list-disc list-inside">
                  {project.users.map((user, index) => (
                    <li key={index}>
                      {user.fullName} ({user.role}) - {user.email}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-4 space-x-2">
                <form action={handleApprove.bind(null, project.id)} className="inline-block">
                  <Button type="submit" className="bg-green-500 hover:bg-green-600 text-white">
                    Approve
                  </Button>
                </form>
                <form action={handleReject.bind(null, project.id)} className="inline-block">
                  <Button type="submit" className="bg-red-500 hover:bg-red-600 text-white">
                    Reject
                  </Button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
