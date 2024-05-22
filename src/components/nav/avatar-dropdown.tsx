"use client"

import { Button } from "~/components/ui/button"
import { logout } from "~/server/actions/auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"

export function AvatarDropDown({ userType } : { userType: string | null }) {
  const handleProfileClick = () => {
    console.log("Profile clicked");
    // Add your navigation logic or any other action here
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="cursor-pointer">
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>PF</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={handleProfileClick}>
            Profile
          </DropdownMenuItem>
          {userType === "admin" && 
          <DropdownMenuItem href={"/admin"}>
            Admin Dashboard
          </DropdownMenuItem>
          }
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={async () => { await logout();}}>
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ) 
}

