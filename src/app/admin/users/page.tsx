import { getAllUsers } from "~/server/db/queries/users";
import { Link as LinkIcon } from "lucide-react";
import Link from "next/link";

export default async function AdminUsersPage() {

    const users = await getAllUsers();

    return (
        users.map((user) => (
            <div key={user.id} className="flex flex-col justify-between items-center">
                <Link href={`/admin/users/${user.id}`} className="flex flex-row justify-between items-center">
                    {user.id}
                    <LinkIcon/>
                </Link>
            </div>
        ))
    );
}

