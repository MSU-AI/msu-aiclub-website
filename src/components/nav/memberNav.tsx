'use client';

import { Button, Navbar, NavbarBrand, NavbarContent, NavbarItem, Tab, Tabs } from "@nextui-org/react";
import { usePathname } from "next/navigation";
import { logout } from "~/server/actions/auth";
import Link from 'next/link';


export default function MemberNav({
  userType
} : {
  userType: string
}) {
    const pathname = usePathname();

    return (
        <Navbar className="bg-slate-900">
        <NavbarBrand>
          <Link href="/" className="text-black bg-white text-bold">
            MSU AI Club
          </Link>
        </NavbarBrand>
        <NavbarContent className="hidden sm:flex gap-4" justify="center">
          <NavbarItem>
            <Tabs aria-label="Options" selectedKey={pathname}>
                <Tab as={Link} key="/member" title="Home" href="/member"></Tab>
                <Tab as={Link} key="/member/posts" title="My Posts" href="/member/posts"></Tab>
                <Tab as={Link} key="/member/projects" title="My Projects" href="/member/projects"></Tab>
            </Tabs>
          </NavbarItem>
        </NavbarContent>
        <NavbarContent justify="end">
          {userType == "admin" && (
            <NavbarItem>
              <Link href="/admin" className="text-white">
                Admin Dashboard
              </Link>
            </NavbarItem>
          )}
          <NavbarItem>
            <Button 
            variant="shadow" 
            className="text-white"
            onPress={async () => { await logout();}}
            >
              Logout
            </Button>
          </NavbarItem>
        </NavbarContent>
      </Navbar>
    )
}