"use client";

import { Button } from "@nextui-org/react";
import { logout } from "~/server/actions/auth";

export default function Logout() {
    return (
        <Button onPress={() => logout()}> Logout </Button>
    )
}