import { createClient } from "~/utils/supabase/server";
import { ExampleVideo } from "./exampleVideo";
import { Button, Chip } from "@nextui-org/react";
import Link from "next/link";

export default async function AdminProjectPage({
    project
} : {
    project: any
}) {
    const supabase = createClient();

    const { data } = await supabase.auth.getUser();

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
                {/* {project.profileIds?.map((profileId: any) => (
                    <ProfileCard profile={profileId} />
                ))} */}
            </div>
        </div>
        </div>
    )
}
