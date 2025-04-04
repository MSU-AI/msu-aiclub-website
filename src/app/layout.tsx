import "~/styles/globals.css";
import { GeistSans } from "geist/font/sans";
import NavBar from "~/components/nav/NavBar";
import { createClient } from "~/utils/supabase/server";
import { Toaster } from "~/components/ui/toaster";
import { ThemeProvider } from "~/components/theme-provider";
import ShopProvider from "~/components/shop/shop-provider";
import ShopCart from "~/components/shop/shop-cart"; // Import the ShopCart component
import { isAdmin } from "~/server/actions/auth";

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
  
  // Convert user_metadata to AccountData type
  const userMetadata = data.user?.user_metadata ? {
    memberType: data.user.user_metadata.memberType as string,
    firstName: data.user.user_metadata.firstName as string,
    lastName: data.user.user_metadata.lastName as string,
    country: data.user.user_metadata.country as string,
    university: data.user.user_metadata.university as string,
    major: data.user.user_metadata.major as string,
    schoolYear: data.user.user_metadata.schoolYear as string,
    discordUsername: data.user.user_metadata.discordUsername as string,
    githubUrl: data.user.user_metadata.githubUrl as string,
    linkedinUrl: data.user.user_metadata.linkedinUrl as string,
    personalWebsite: data.user.user_metadata.personalWebsite as string,
    flowerProfile: data.user.user_metadata.flowerProfile as string,
    profilePictureUrl: data.user.user_metadata.profilePictureUrl as string | undefined,
  } : null;
  
  // Check if user is admin
  const isUserAdmin = await isAdmin();
  
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body className="">
        <ThemeProvider attribute="class" defaultTheme="system">
          <ShopProvider>
            <Toaster />
            <NavBar userMetadata={userMetadata ?? null} isAdmin={isUserAdmin} />
            {children}
            
            {/* Global ShopCart component */}
            <ShopCart />
          </ShopProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
