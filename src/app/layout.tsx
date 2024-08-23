import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import NavBar from "~/components/nav/NavBar";
import { Providers } from "~/app/providers";
import { createClient } from "~/utils/supabase/server";
import { Toaster } from "~/components/ui/toaster";
import { ThemeProvider } from "~/components/theme-provider";

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

  const userMetadata = data.user?.user_metadata;

  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body className="">
          <ThemeProvider attribute="class" defaultTheme="system">
          <Toaster />
          <NavBar userMetadata={userMetadata ??  null} />
          {children}
          </ThemeProvider>
      </body>
    </html>
  );
}
