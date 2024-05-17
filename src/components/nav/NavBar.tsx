'use client';

import { Button, Navbar, NavbarBrand, NavbarContent, NavbarItem, NavbarMenu, NavbarMenuItem, NavbarMenuToggle } from "@nextui-org/react";
import Link from "next/link";
import { logout } from "~/server/actions/auth";
import { useState } from "react";

function RightSideNav({ userType } : { userType: string | null }) {

    if (userType == "admin") {
        return (
            <>
            <NavbarItem>
                <Link href="/admin">
                    Admin Dashboard
                </Link>
            </NavbarItem>
            <NavbarItem>
                <Link href="/admin/users">
                    Member Dashboard
                </Link>
            </NavbarItem>
            <NavbarItem>
            <Button 
            variant="shadow" 
            className="text-white"
            onPress={async () => { await logout();}}
            >
              Logout
            </Button>
          </NavbarItem> 
            </>
        )
    } else if (userType == "member") {
        return (
            <>
            <NavbarItem>
            <Button 
            variant="shadow" 
            className="text-white"
            onPress={async () => { await logout();}}
            >
              Logout
            </Button>
          </NavbarItem> 
          </>
        )
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

export default function NavBar({
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
