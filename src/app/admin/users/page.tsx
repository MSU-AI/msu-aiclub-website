import { getAllUsers } from "~/server/db/queries/users";
import UserView from "./userView";

export default async function AdminUsersPage() {

    const users = await getAllUsers();

    return (
        users.map((user) => (
            <div key={user.id} className="flex flex-row justify-between items-center">
                <UserView userId={user.id} />
            </div>
        ))
    );
}

