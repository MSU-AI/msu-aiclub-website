import { Button, Navbar, NavbarBrand, NavbarContent, NavbarItem, Tab, Tabs } from "@nextui-org/react";
import { usePathname } from "next/navigation";
import { logout } from "~/server/actions/auth";
import Link from 'next/link';

export default function AdminNav({
    userType
} : {
    userType: string | null
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
                <Tab as={Link} key="/admin" title="Home" href="/member"></Tab>
                <Tab as={Link} key="/admin/posts" title="Manage Posts" href="/admin/posts"></Tab>
                <Tab as={Link} key="/admin/projects" title="Manage Projects" href="/admin/projects"></Tab>
                <Tab as={Link} key="/admin/users" title="Manage Users" href="/admin/users"></Tab>
            </Tabs>
          </NavbarItem>
        </NavbarContent>
        <NavbarContent justify="end">
            <NavbarItem>
              <Link href="/member" className="text-white">
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
        </NavbarContent>
      </Navbar>
    )
}