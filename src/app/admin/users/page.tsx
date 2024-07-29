import { getUsers } from '~/server/db/queries/user';
import MembersTable from './membersTable'
import type { Profile } from "~/types/profiles";

export default async function AdminUsersPage() {

    const users = await getUsers();

    return (
        <MembersTable profiles={users} />
    );
}

