import "~/styles/globals.css";

import { createClient } from "~/utils/supabase/server";
import { getProfileType } from "~/server/db/queries/profiles";
import { redirect } from "next/navigation";


export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();

  const { data } = await supabase.auth.getUser();  

  const userType: string | null = await getProfileType(data.user?.id);

//   Doesn't load CSS for some reason
//   if (userType !== "admin") {
//     redirect("/");
//   }

  return children;
}
