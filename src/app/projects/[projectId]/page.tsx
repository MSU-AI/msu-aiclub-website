import { getProjectById } from "~/server/db/queries/projects"

export default async function ProjectPage({
    params
} : {
    params: {
        projectId: string
    }
}) {
    const project = await getProjectById(params.projectId);

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
        </div>
    )
}