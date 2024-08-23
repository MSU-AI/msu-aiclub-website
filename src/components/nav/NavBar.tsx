'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from "next/link";
import Image from "next/image";
import { usePathname } from 'next/navigation';
import { HoverBorderGradient } from "../ui/hover-border-gradient";
import { AvatarDropDown } from "./avatar-dropdown";
import { AccountData } from "~/types/profiles";
import { shouldShowNavbar } from "~/utils/navigation";
import { Menu } from 'lucide-react';
import { Button } from '../ui/button';


export default function NavBar({
    userMetadata
}: {
    userMetadata: AccountData | null
}) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const pathname = usePathname();
    const navRefs = useRef<{ [key: string]: HTMLAnchorElement | null }>({});
    const gradientRef = useRef<HTMLDivElement | null>(null);

    const userType = userMetadata?.memberType;

    const navItems = [
        { name: "About", path: "/about" },
        { name: "Posts", path: "/posts" },
        { name: "Projects", path: "/projects" },
        { name: "Events", path: "/events" },
        { name: "Members", path: "/members" },
    ];

    const updateGradientPosition = () => {
        const activeLink = navRefs.current[pathname];
        if (activeLink && gradientRef.current) {
            const rect = activeLink.getBoundingClientRect();
            gradientRef.current.style.width = `${rect.width}px`;
            gradientRef.current.style.left = `${rect.left + window.scrollX}px`;
        }
    };

    useEffect(() => {
        updateGradientPosition();
        window.addEventListener('resize', updateGradientPosition);

        return () => {
            window.removeEventListener('resize', updateGradientPosition);
        };
    }, [pathname]);

    if (!shouldShowNavbar(pathname)) {
        return null;
    }

    return (
        <div className="fixed top-0 left-0 w-full z-[80] bg-background border-b border-border">
            <div className="max-w-screen-lg flex items-center justify-between mx-auto px-4 py-2">
                <div className="flex items-center">
                    <Link href="/">
                        <Image
                            src="/logo.png"
                            alt="MSU AI Club Logo"
                            width={55}
                            height={55}
                        />
                    </Link>
                    <ul className="hidden md:flex space-x-6 ml-8">
                        {navItems.map((item) => (
                            <li key={item.path}>
                                <Link
                                    href={item.path}
                                    ref={(el) => (navRefs.current[item.path] = el)}
                                    className={` hover:text-foreground/70 ${
                                        pathname === item.path ? 'font-bold' : ''
                                    }`}
                                >
                                    {item.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="flex items-center space-x-4">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="md:hidden "
                    >
                        <Menu />
                    </Button>

                    {(userType === "member" || userType === "admin") ? (
                        <AvatarDropDown userMetadata={userMetadata} />
                    ) : (
                        <Link href="/auth/register">
                            <HoverBorderGradient
                                containerClassName="rounded-full"
                                as="button"
                                className="bg-black  px-4 py-2"
                            >
                                <span>Join Us</span>
                            </HoverBorderGradient>
                        </Link>
                    )}
                </div>
            </div>
            {isMenuOpen && (
                <div className="md:hidden">
                    <ul className="flex flex-col items-center py-4">
                        {navItems.map((item) => (
                            <li key={item.path} className="py-2">
                                <Link
                                    href={item.path}
                                    className=" hover:text-accent"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    {item.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            <div
                ref={gradientRef}
                className="absolute bottom-0 h-0.5 bg-gradient-to-r from-transparent via-foreground to-transparent transition-all duration-300"
                style={{ width: '0px', left: '0px' }}
            ></div>
        </div>
    );
}
