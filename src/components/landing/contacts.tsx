"use client"
import { PinContainer } from "~/components/ui/3d-pin";
import { InstagramLogoIcon, LinkedInLogoIcon, DiscordLogoIcon, GitHubLogoIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { MailIcon } from "lucide-react";

interface Contact {
  name: string;
  href: string;
  title: string;
  icon: JSX.Element;
}

export const contacts: Contact[] = [
  {
    name: "Instagram",
    href: "https://www.instagram.com/msu_ai_club/?hl=en",
    title: "@msu_ai_club",
    icon: <InstagramLogoIcon />
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/company/75724713/",
    title: "msu-ai",
    icon: <LinkedInLogoIcon />
  },
  {
    name: "Discord",
    href: "https://dsc.gg/msuai",
    title: "dsc.gg/msuai",
    icon: <DiscordLogoIcon />
  },
  {
    name: "GitHub",
    href: "https://github.com/MSU-AI",
    title: "github/MSU-AI",
    icon: <GitHubLogoIcon />
  }
];


export function Contacts() {
  return (
    <div className="py-24 flex flex-col items-center">
    <h1 className="text-2xl lg:text-4xl font-semibold text-center pt-20 pb-4">Connect with us</h1>
    <Link className="text-muted-foreground flex items-center gap-2" href="mailto:team@msuaiclub.com">
      <MailIcon className="h-4 w-4" />
      team@msuaiclub.com
    </Link>
    <div className="flex flex-row flex-wrap items-center justify-center gap-16">
      {contacts.map((contact, index) => (
        <PinContainer key={index} title={`${contact.title}`} href={contact.href}>
          <div className="flex gap-4 items-center justify-center">
            {contact.icon}
            <p>{contact.name}</p>
          </div>
        </PinContainer>
      ))}
    </div>
  </div>
  );
}

