import { getUsers } from '~/server/actions/users';
import MembersTable from './membersTable'
import { getRoles } from '~/server/actions/role';

export default async function AdminUsersPage() {
    const users = await getUsers();
    const roles = await getRoles();

    console.log(users);

    return (
        <MembersTable profiles={users} roles={roles} />
    );
}

