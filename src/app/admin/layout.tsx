import "~/styles/globals.css";

import { createClient } from "~/utils/supabase/server";
import { redirect } from "next/navigation";
import { adminCheck } from "~/server/actions/role";


export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();

  const { data } = await supabase.auth.getUser();  

  const isAdmin = await adminCheck(data?.user?.id);

   if (!isAdmin) {
      redirect("/");
   }

  return children;
}
