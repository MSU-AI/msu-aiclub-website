import Link from "next/link";
import { getProjects } from "~/server/db/queries/projects";
import { createClient } from "~/utils/supabase/server";
import { getProfileType } from "~/server/db/queries/profiles";

export default async function AdminProjectsPage() {

    const supabase = createClient();

    const { data } = await supabase.auth.getUser();

    const userType: string | null = await getProfileType(data.user?.id);

    const projects = await getProjects();

    return (
        <div>
            {projects.map((project) => (
                <Link href={`/projects/${project.id}`}>{project.name}</Link>
            ))}

            { userType === "admin" && <Link href="/projects/new">New Project</Link> } 
        </div>
    )
}
