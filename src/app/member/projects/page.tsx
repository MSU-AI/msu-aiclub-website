import { getUserProject } from "~/server/db/queries/projects";
import type { Project } from "~/types/projects";
import { createClient } from "~/utils/supabase/server";

export default async function ProjectsPage() {
    const supabase = createClient();

    const { data } = await supabase.auth.getUser();

    const project = await getUserProject(data?.user?.id ?? "");

    if (project === null) {
        return (
            <div>
                No project
            </div>
        )
    }


    console.log(project);
    return (
        <div>
            Projects
            {project?.name}
            {project?.description}
            {project?.profiles?.map((profile) => {
                return (
                    <div key={profile.supaId}>
                        {profile.supaId}
                    </div>
                )
            })}
        </div>
    )
}