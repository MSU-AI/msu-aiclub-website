"use client";

import { deleteProject } from "~/server/actions/project";

import { Button } from "@nextui-org/react"
import { useRouter } from "next/navigation";

export default function DeleteProjectButton({
    projectId,
    supaId
} : {
    projectId: string
    supaId: string
}) {
    const router = useRouter();

    const handleDelete = async () => {
        const success = await deleteProject(projectId, supaId);

        if (success) {
            router.push("/projects");
        } else {
            alert("Project deletion failed");
        }
    }

    return (
        <Button onPress={() => handleDelete()}>Delete</Button>
    )
}       
