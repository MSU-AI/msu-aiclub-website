'use client';

import { Button, Navbar, NavbarBrand, NavbarContent, NavbarItem, NavbarMenu, NavbarMenuItem, NavbarMenuToggle } from "@nextui-org/react";
import Link from "next/link";
import { logout } from "~/server/actions/auth";
import { useState } from "react";
import  Image  from "next/image";
import { HoverBorderGradient } from "../ui/hover-border-gradient";
import { AvatarDropDown } from "./avatar-dropdown";

import {AccountData} from "~/types/profiles";

export default function NavBar({
    userMetadata
} : {
    userMetadata: AccountData | null
}) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const menuItems = {
        "posts": "Posts",
        "projects": "Projects",
        "about": "About",
        "contact": "Contact",
    }

    const userType = userMetadata?.memberType;

    return (
        <Navbar onMenuOpenChange={setIsMenuOpen} className="bg-inherit text-white z-[1000]">
            <NavbarContent>
                
                <NavbarItem>
                    <Link href="/">
                        <Image
                            src="/logo.png"
                            alt="MSU AI Club Logo"
                            width={55}
                            height={55}
                        />
                    </Link>
                </NavbarItem>
                <div className="px-6 flex gap-12 max-lg:hidden">
                <NavbarItem>
                    <Link color="foreground" href="/about">
                        About
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
                <NavbarItem >
                    <Link href="/events" aria-current="page">
                        Events
                    </Link>
                </NavbarItem> 
                </div>
            </NavbarContent>

            <NavbarContent justify="end">
                <NavbarMenuToggle
                    aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                    className="sm:hidden"
                />
                {(userType == "member" || userType == "admin") &&
                <NavbarItem>
                    <AvatarDropDown userMetadata={userMetadata}/>
                </NavbarItem>
                }
                {(userType != "member" && userType != "admin") &&
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
            }
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
