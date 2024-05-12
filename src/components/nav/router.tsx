"use client";

import { usePathname } from "next/navigation";
import { ADMIN_PREFIX, MEMBER_PREFIX, AUTH_PREFIX } from "~/constants/navUrls";
import AdminNav from "./adminNav";
import MemberNav from "./memberNav";
import PublicNav from "./publicNav";

export default function NavRouter({
    userType
} : {
    userType: string
}) {
    const path = usePathname();

    if (path?.startsWith(ADMIN_PREFIX)) {
        return <AdminNav userType={userType} />
    } else if (path?.startsWith(MEMBER_PREFIX)) {
        return <MemberNav userType={userType} />
    } else if (path?.startsWith(AUTH_PREFIX)) {
        return null;
    } else {
        return <PublicNav userType={userType} />
    }
}