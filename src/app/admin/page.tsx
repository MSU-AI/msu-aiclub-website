import { Button } from "@nextui-org/react";
import Link from "next/link";
import Logout from "./logout";
import { getUserProjects } from "~/server/db/queries/projects";
import { createClient } from "~/utils/supabase/server";

export default async function AdminPage() {
    const supabase = createClient();

    const { data } = await supabase.auth.getUser();

    return (
        <div className="flex flex-col justify-center items-center w-100">
            <h1 className="text-white text-2xl text-bold"> Sup ai club fam </h1>
            <Logout />
            <Button as={Link} href="/admin/users"> Users </Button>
            <Button as={Link} href="/admin/projects"> Projects </Button>
        </div>
    );
}
