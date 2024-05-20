import "~/styles/globals.css";

import { createClient } from "~/utils/supabase/server";
import { redirect } from "next/navigation";


export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();

  const { data } = await supabase.auth.getUser();  

  // const userType: string | null = await getProfileType(data.user?.id);

  // if (userType !== "admin") {
  //    redirect("/");
  // }

  return children;
}
