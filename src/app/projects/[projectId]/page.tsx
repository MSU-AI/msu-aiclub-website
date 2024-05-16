import { getProjectById } from "~/server/db/queries/projects";
import { createClient } from "~/utils/supabase/server";
import { getProfileType } from "~/server/db/queries/profiles";
import DeleteProjectButton from "./deleteProjectButton";
import { exampleProjects } from "../exampleProjects";
import { exampleProfiles } from "~/app/exampleProfiles";
import { ExampleVideo } from "./exampleVideo";
import { Button, Card, CardFooter, CardHeader, Chip } from "@nextui-org/react";
import Link from "next/link";
import { Image } from "@nextui-org/react";
import { ProfileCard } from "./profileCard";

export default async function AdminProjectPage({
    params
} : {
    params: {
        projectId: string
    }
}) {
    const supabase = createClient();

    const { data } = await supabase.auth.getUser();

    // const project = await getProjectById(params.projectId);

    const project = exampleProjects.find((project) => project.id === params.projectId);

    if (!project) {
        return <div>Project not found</div>;
    }

    // Get the profiles for the current project
    const profiles = project.profileIds.map(profileId => 
        exampleProfiles.find(profile => profile.supaId === profileId)
    );

    const userType: string | null = await getProfileType(data.user?.id);

    console.log(project);

    if (project === null) {
        return <div>Project not found</div>;
    }

    return (
        <div className="flex flex-row items-center p-2 justify-center min-h-screen">
        <div className="flex flex-col items-start justify-start gap-4 p-2 min-h-screen text-white">
            <ExampleVideo videoUrl={project.videoURL} />
            <div className="flex flex-row items-center justify-between gap-2">
                {project.skills && project.skills.map((skill: string) => (
                    <Chip>{skill}</Chip>
                ))}
            </div>
            <Button as={Link} href={project.gitHubURL}>View the Github</Button>
        </div>
        <div className="flex flex-col items-center justify-start p-2 min-h-screen">
            <p className="text-3xl">Project Team</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                {profiles?.map((profile) => (
                    <ProfileCard profile={profile} />
                ))}
            </div>
        </div>
        </div>
    )
}
