import Link from "next/link";
import { getProjects } from "~/server/db/queries/projects";
import type { Project } from "~/types/projects";
import { exampleProjects } from "./exampleProjects";
import { ProjectCard } from "./projectCard";

export default async function ProjectsPage() {
    const projects = await getProjects();

    console.log(projects);
    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <p className="text-white text-5xl">Our Projects</p>
            <div className="flex flex-col items-center justify-center p-10 text-black min-h-screen">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {exampleProjects.map((project: Project) => (
                        <ProjectCard key={project.id} project={project} />
                    ))}
                </div>
            </div>
        </div>
    );
}
