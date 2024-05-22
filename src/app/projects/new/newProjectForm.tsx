"use client";

import React, { useState } from "react";
import { Button, Input, Select, SelectItem, Textarea, Selection as NextUISelection } from "@nextui-org/react";
import { Profile } from "~/types/profiles";

{/* import { createProject } from "~/server/actions/project"; */}

import { useRouter } from "next/navigation";

export default function NewProjectForm(){
    return (
        <>
            <p className="text-8xl">HI</p>
        </>
    );
    )
}
/*
 
 
export default function NewProjectForm({
    profiles
} : {
    profiles: Profile[]
}) {
    const router = useRouter();

    console.log(profiles);

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [values, setValues] = useState<string[] | undefined>([]);

    async function handleSubmit() {
        if (values == undefined || values.length === 0) {
            alert("Please select at least one member");
            return;
        }
        const projectId = await createProject(name, description, values);

        if (projectId !== null) {
            router.push(`/projects/${projectId}`);
        } else {
            alert("Project creation failed");
        }
    }

    return (
        <div>
            <Input 
            placeholder="Project name" 
            onChange={(e) => setName(e.target.value)}
            />
            <Textarea 
            placeholder="Project Description"
            onChange={(e) => setDescription(e.target.value)}
            />
            <Select
                label="Members"
                selectedKeys={values}
                placeholder="Select members"
                selectionMode="multiple"
                className="max-w-xs text-black"
                onSelectionChange={(newSelection) => setValues([...newSelection].map(String))}
            >
            {profiles.map((profile) => (
                <SelectItem key={profile.supaId} textValue={profile.supaId}>
                    <div className="flex gap-2 items-center">
                        {profile.supaId}
                    </div>
                </SelectItem>
            ))}
            </Select>
            <Button onPress={() => handleSubmit()}>
                Make Project
            </Button>
        </div>
    );
}

*/

