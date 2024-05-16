import Link from "next/link";
import { getProjects } from "~/server/db/queries/projects";
import { createClient } from "~/utils/supabase/server";
import { getProfileType } from "~/server/db/queries/profiles";
import type { Project } from "~/types/projects";
import { exampleProjects } from "./exampleProjects";
import { ProjectCard } from "./projectCard";

export default async function ProjectsPage() {

    const supabase = createClient();

    const { data } = await supabase.auth.getUser();

    const userType: string | null = await getProfileType(data.user?.id);

    const projects = await getProjects();
/*
    return (
        <div>
            {projects.map((project) => (
                <Link href={`/projects/${project.id}`}>{project.name}</Link>
            ))}

            { userType === "admin" && <Link href="/projects/new">New Project</Link> } 
        </div>
    )
*/
    return (
        <div className="flex flex-col items-center justify-center p-10 text-black min-h-screen">
            Projects
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {exampleProjects.map((project: Project) => (
                    <ProjectCard key={project.id} project={project} />
                ))}
            </div>
        </div>
    );
}
