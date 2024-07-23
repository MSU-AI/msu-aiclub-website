"use client"
import { PinContainer } from "~/components/ui/3d-pin";
import { InstagramLogoIcon, LinkedInLogoIcon, DiscordLogoIcon, GitHubLogoIcon } from "@radix-ui/react-icons";

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
    <div className="py-24">
    <h1 className="text-2xl lg:text-4xl font-bold text-center text-white py-20">Connect with us</h1>
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

