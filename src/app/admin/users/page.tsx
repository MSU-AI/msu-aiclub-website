import MembersTable from './membersTable'
import type { Profile } from "~/types/profiles";

export default async function AdminUsersPage() {

    return (
        <MembersTable profiles={[]} />
    );
}

