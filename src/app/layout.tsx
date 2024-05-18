import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import NavBar from "~/components/nav/NavBar";
import { Providers } from "~/app/providers";
import { createClient } from "~/utils/supabase/server";
import { getProfileType } from "~/server/db/queries/profiles";
import { Toaster } from "react-hot-toast";

export const metadata = {
  title: "MSU AI Club",
  description: "Insert description here",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();

  const { data } = await supabase.auth.getUser();  

  const userType: string | null = await getProfileType(data.user?.id);

  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body className="overflow-x-hidden">
        <Providers>  
          <Toaster />
          <NavBar userType={userType} />
          {children}
        </Providers>
      </body>
    </html>
  );
}
