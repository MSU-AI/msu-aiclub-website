import Link from 'next/link';
import { Button } from "~/components/ui/button";
import { getApprovedProjects } from '~/server/db/queries/projects';

export default async function ProjectsPage() {
  const approvedProjects = await getApprovedProjects();

  return (
    <div className="max-w-[1024px] mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Projects</h1>
        <Link href="/projects/submit">
          <Button variant={"secondary"}>Submit a Project</Button>
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {approvedProjects.map((project) => (
          <div key={project.id} className="border p-4 rounded-lg">
            <h2 className="text-xl font-semibold">{project.name}</h2>
            <p>{project.description}</p>
            {/* Add more project details as needed */}
          </div>
        ))}
      </div>
    </div>
  );
}
