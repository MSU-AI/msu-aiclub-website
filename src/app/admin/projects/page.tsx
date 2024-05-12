import Link from "next/link";
import { getProjects } from "~/server/db/queries/projects";

export default async function AdminProjectsPage() {
    const projects = await getProjects();

    return (
        <div>
            {projects.map((project) => (
                <Link href={`/admin/projects/${project.id}`}>{project.name}</Link>
            ))}
            <Link href="/admin/projects/new">New Project</Link>
        </div>
    )
}