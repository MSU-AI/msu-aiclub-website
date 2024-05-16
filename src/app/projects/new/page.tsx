import { getAllProfiles } from "~/server/db/queries/profiles";
import NewProjectForm from "./newProjectForm";

export default async function NewProjectPage() {
    const profiles = await getAllProfiles();

    return (
        <div>
            <NewProjectForm profiles={profiles} />
        </div>
    )
}