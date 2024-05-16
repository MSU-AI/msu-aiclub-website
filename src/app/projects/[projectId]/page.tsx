import { getProjectById } from "~/server/db/queries/projects";
import { createClient } from "~/utils/supabase/server";
import { getProfileType } from "~/server/db/queries/profiles";
import DeleteProjectButton from "./deleteProjectButton";

export default async function AdminProjectPage({
    params
} : {
    params: {
        projectId: string
    }
}) {
    const supabase = createClient();

    const { data } = await supabase.auth.getUser();

    const project = await getProjectById(params.projectId);

    const userType: string | null = await getProfileType(data.user?.id);

    console.log(project);

    if (project === null) {
        return <div>Project not found</div>;
    }

    return (
        <div>
            Project
            {project.name}
            {project.description}
            {project.profiles?.map((profile) => (
                <div key={profile.supaId}>
                    User {profile.supaId}
                </div>
            ))}
            {userType === "admin" && 
            <DeleteProjectButton projectId={project.id} supaId={data!.user!.id} />
            }
        </div>


    )
}
