'use client';

import { Button, Navbar, NavbarBrand, NavbarContent, NavbarItem, NavbarMenu, NavbarMenuItem, NavbarMenuToggle } from "@nextui-org/react";
import Link from "next/link";
import { useState } from "react";

/**
 * Determines the right side nav based on user type.
 * @param userType the user type.
 * - If user is an admin, show admin and member dashboards.
 * - If user is a member, show member dashboard.
 * - If user is a guest, show nothing (maybe mailing list later).
 * - If user is not logged in, show login and register buttons.
 */
function RightSideNav({
    userType
} : {
    userType: string | null
}) {
    if (userType == "admin") {
        return (
            <>
            <NavbarItem>
                <Link href="/admin">
                    Admin Dashboard
                </Link>
            </NavbarItem>
            <NavbarItem>
                <Link href="/member">
                    Member Dashboard
                </Link>
            </NavbarItem>
            </>
        )
    } else if (userType == "member") {
        return (
            <NavbarItem>
                <Link href="/member">
                    Dashboard
                </Link>
            </NavbarItem>
        )
    } else if (userType == "guest") {
        return null;
    } else {
        return (
            <>
            <NavbarItem>
                <Link href="/auth/login">
                    Login
                </Link>
            </NavbarItem>
            <NavbarItem>
                <Link href="/auth/register">
                    Register
                </Link>
            </NavbarItem>
            </>
        );
    }
}

export default function PublicNav({
    userType
} : {
    userType: string | null
}) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const menuItems = {
        "posts": "Posts",
        "projects": "Projects",
        "about": "About",
        "contact": "Contact",
    }

    return (
        <Navbar onMenuOpenChange={setIsMenuOpen} className="bg-inherit text-white">
            <NavbarContent>
                <NavbarMenuToggle
                    aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                    className="sm:hidden"
                />
                <NavbarBrand>
                    <Link href="/">
                        <p className="font-bold text-inherit">MSU AI CLUB</p>
                    </Link>
                </NavbarBrand>
            </NavbarContent>

            <NavbarContent className="hidden sm:flex gap-4" justify="center">
                <NavbarItem>
                    <Link color="foreground" href="/posts">
                        POSTS
                    </Link>
                </NavbarItem>
                <NavbarItem isActive>
                    <Link href="/projects" aria-current="page">
                        PROJECTS
                    </Link>
                </NavbarItem>
                <NavbarItem>
                    <Link color="foreground" href="/about">
                        ABOUT
                    </Link>
                </NavbarItem>
            </NavbarContent>
            
            <NavbarContent justify="end">
                <RightSideNav userType={userType} />
            </NavbarContent>

            <NavbarMenu>
                {Object.entries(menuItems).map(([url, text], index) => (
                    <NavbarMenuItem key={`${url}-${index}`}>
                        <Link
                            color={
                                index === 2 ? "primary" : index === Object.entries(menuItems).length - 1 ? "danger" : "foreground"
                            }
                            className="w-full"
                            href={`/${url}`}
                        >
                            {text}
                        </Link>
                    </NavbarMenuItem>
                ))}
            </NavbarMenu>
        </Navbar>
    );
}