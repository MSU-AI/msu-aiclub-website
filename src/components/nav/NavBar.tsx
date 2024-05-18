'use client';

import { Button, Navbar, NavbarBrand, NavbarContent, NavbarItem, NavbarMenu, NavbarMenuItem, NavbarMenuToggle } from "@nextui-org/react";
import Link from "next/link";
import { logout } from "~/server/actions/auth";
import { useState } from "react";
import  Image  from "next/image";
import { HoverBorderGradient } from "../ui/hover-border-gradient";
import { AvatarDropDown } from "./avatar-dropdown";

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
                <AvatarDropDown userType={userType}/>
            </NavbarItem> 
            </>
        )
    } else if (userType == "member") {
        return (
          <>
            <NavbarItem>
                <AvatarDropDown userType={userType}/>
            </NavbarItem> 
          </>
        )
    } else {
        return (
            <>
            <NavbarItem>
                <Link href="/auth/register">
                    <HoverBorderGradient
                        containerClassName="rounded-full"
                        as="button"
                        className="bg-black text-white flex items-center space-x-2"
                    >
                        <span>Join Us</span>
                    </HoverBorderGradient>
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
                <NavbarItem>
                    <Link href="/">
                        <Image
                            src="/logo.svg"
                            alt="MSU AI Club Logo"
                            width={35}
                            height={35}
                        />
                    </Link>
                </NavbarItem>
                <NavbarItem>
                    <Link color="foreground" href="/posts">
                        Posts
                    </Link>
                </NavbarItem>
                <NavbarItem >
                    <Link href="/projects" aria-current="page">
                        Projects
                    </Link>
                </NavbarItem>
                <NavbarItem>
                    <Link color="foreground" href="/about">
                        About
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
