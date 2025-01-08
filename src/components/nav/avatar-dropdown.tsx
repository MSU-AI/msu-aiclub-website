"use client"

import { logout } from "~/server/actions/auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"

import { AccountData } from "~/types/profiles";
import { useRouter } from 'next/navigation';
import ThemeSwitcher from "../ui/theme-switcher";
import { LogOut, User } from "lucide-react";

export function AvatarDropDown({ userMetadata } : { userMetadata: AccountData | null}) {
  
  const router = useRouter();

  const flower = userMetadata?.flowerProfile;
  let level = null;

  if (flower) {
      const match = flower.match(/lvl(\d+)\.png$/);
      if (match && match[1]) {
          level = parseInt(match[1], 6);
      }
  }

  const avatarSrc = userMetadata?.profilePictureUrl || userMetadata?.flowerProfile || "https://github.com/shadcn.png";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="cursor-pointer">
          <AvatarImage src={avatarSrc} />
          <AvatarFallback>PF</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Level {level}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => router.push("/profile")}>
            <User className="mr-1 h-5 w-5"/>
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem >
            <ThemeSwitcher />
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={async () => { await logout();}}>
          <LogOut className="mr-1 h-5 w-5" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ) 
}

