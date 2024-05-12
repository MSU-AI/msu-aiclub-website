import Link from "next/link";
import { getProjects } from "~/server/db/queries/projects";
import type { Project } from "~/types/projects";

export default async function ProjectsPage() {
    const projects = await getProjects();


    console.log(projects);
    return (
        <div>
            Projects
            {projects.map((project: Project) => (
                <Link href={`/projects/${project.id}`} key={project.id}>
                    {project.name}
                </Link>
            ))}
        </div>
    )
}