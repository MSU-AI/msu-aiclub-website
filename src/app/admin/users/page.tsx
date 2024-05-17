import { getAllProfiles } from '~/server/db/queries/profiles'
import MembersTable from './membersTable'
import type { Profile } from "~/types/profiles";

export default async function AdminUsersPage() {

    const profiles = await getAllProfiles();

    return (
        <MembersTable profiles={profiles} />
    );
}

