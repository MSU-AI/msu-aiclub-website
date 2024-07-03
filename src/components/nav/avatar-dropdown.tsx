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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip"
import { AccountData } from "~/types/profiles";

export function AvatarDropDown({ userMetadata } : { userMetadata: AccountData | null}) {
  const handleProfileClick = () => {
    console.log("Profile clicked");
    // Add your navigation logic or any other action here
  };
  const userType = userMetadata?.memberType;
  const flower = userMetadata?.flowerProfile;
  let level = null;
  if (flower) {
      const match = flower.match(/lvl(\d+)\.png$/);
      if (match && match[1]) {
          level = parseInt(match[1], 10);
      }
  }
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="cursor-pointer">
                <AvatarImage src={userMetadata?.flowerProfile ?? "https://github.com/shadcn.png"} />
                <AvatarFallback>PF</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Level {level}</DropdownMenuLabel>
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
        </TooltipTrigger>
        <TooltipContent>
          <p>Level {level ?? 'Unknown'}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ) 
}
