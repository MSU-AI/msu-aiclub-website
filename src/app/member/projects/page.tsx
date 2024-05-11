import { getUserProjects } from "~/server/db/queries/projects";
import type { Project } from "~/types/projects";
import { createClient } from "~/utils/supabase/server";

export default async function ProjectsPage() {
    const supabase = createClient();

    const { data } = await supabase.auth.getUser();

    const projects = await getUserProjects(data?.user?.id ?? "");


    console.log(projects);
    return (
        <div>
            Projects
            {projects.map((project: Project) => (
                <div key={project.id}>
                    {project.name}
                </div>
            ))}
        </div>
    )
}