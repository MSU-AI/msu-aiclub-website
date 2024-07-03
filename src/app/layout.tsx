import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import NavBar from "~/components/nav/NavBar";
import { Providers } from "~/app/providers";
import { createClient } from "~/utils/supabase/server";
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

  console.log('user data', data.user?.user_metadata?.memberType)

  return (
    <html lang="en" className={`${GeistSans.variable} dark`}>
      <body className="">
          <Toaster />
          <NavBar userType={data.user?.user_metadata?.memberType ? "member" : null} />
          {children}
      </body>
    </html>
  );
}
