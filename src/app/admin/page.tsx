import { Button } from "@nextui-org/react";
import Link from "next/link";

export default function AdminPage() {
    console.log("admin page");
    return (
        <div className="flex flex-col justify-center items-center w-100">
            <h1 className="text-white text-2xl text-bold"> Sup ai club fam </h1>
            <Button as={Link} href="/admin/users"> Users </Button>
        </div>
    );
}
