import "~/styles/globals.css";
import { GeistSans } from "geist/font/sans";
import NavBar from "~/components/nav/NavBar";
import { createClient } from "~/utils/supabase/server";
import { Toaster } from "~/components/ui/toaster";
import { ThemeProvider } from "~/components/theme-provider";
import ShopProvider from "~/components/shop/shop-provider";
import ShopCart from "~/components/shop/shop-cart"; // Import the ShopCart component

export const metadata = {
  title: "MSU AI Club",
  description: "The hub for AI at MSU",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
  openGraph: {
    title: "MSU AI Club",
    description: "The hub for AI at MSU",
    images: [
      {
        url: "/join-light.png",
        width: 1200,
        height: 630,
        alt: "MSU AI Club Banner",
      },
    ],
  },
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
          <ShopProvider>
            <Toaster />
            <NavBar userMetadata={userMetadata ?? null} />
            {children}
            
            {/* Global ShopCart component */}
            <ShopCart />
          </ShopProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
