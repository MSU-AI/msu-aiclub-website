'use client';

import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Tab, Tabs } from "@nextui-org/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

function RightSideNav({
    userType
} : {
    userType: string
}) {
    if (userType == "admin") {
        return (
            <>
            <NavbarItem>
                <Link href="/admin" className="text-white">
                    Admin Dashboard
                </Link>
            </NavbarItem>
            <NavbarItem>
                <Link href="/member" className="text-white">
                    Member Dashboard
                </Link>
            </NavbarItem>
            </>
        )
    } else if (userType == "member") {
        return (
            <NavbarItem>
                <Link href="/member" className="text-white">
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
                <Link href="/auth/login" className="text-white">
                    Login
                </Link>
            </NavbarItem>
            <NavbarItem>
                <Link href="/auth/register" className="text-white">
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
    userType: string
}) {
    const pathname = usePathname();

    return (
        <Navbar>
        <NavbarBrand>
          <Link href="/" className="text-white text-bold">
            MSU AI Club
          </Link>
        </NavbarBrand>
        <NavbarContent className="hidden sm:flex gap-4" justify="center">
          <NavbarItem>
            <Tabs aria-label="Options" selectedKey={pathname}>
              <Tab as={Link} key="/posts" title="Posts" href="/posts"></Tab>
              <Tab as={Link} key="/projects" title="Our Work" href="/projects"></Tab>
              <Tab as={Link} key="/about" title="About" href="/about"></Tab>
            </Tabs>
          </NavbarItem>
        </NavbarContent>
        <NavbarContent justify="end">
            <RightSideNav userType={userType} />
        </NavbarContent>
      </Navbar>
    )
}