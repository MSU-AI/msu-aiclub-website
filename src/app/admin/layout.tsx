import "~/styles/globals.css";

import { createClient } from "~/utils/supabase/server";
import { redirect } from "next/navigation";
import { adminCheck } from "~/server/actions/role";
import { isAdmin } from "~/server/actions/auth";


export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const isUserAdmin = await isAdmin();

   if (!isUserAdmin) {
    redirect("/");
   }

  return children;
}
