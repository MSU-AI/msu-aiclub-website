import { getUsers } from "~/server/db/queries/user";
import MembersPageClient from "./clientPage";
import { isAdmin } from "~/server/actions/auth";

export default async function MembersPage() {
    const members = await getUsers();
    const isUserAdmin = await isAdmin();

    return (
    <MembersPageClient 
        members={members}
        isAdmin={isUserAdmin}
    />
    );
}