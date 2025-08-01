import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { logout, useAuth } from "../hooks/use-auth";
import { Button } from "./ui/button";
import { LogOut } from "lucide-react";

export function UserPopover() {
  const { user } = useAuth();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className="*:data-[slot=avatar]:ring-background flex -space-x-2 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:grayscale">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>{user?.name?.[0]?.toUpperCase()}</AvatarFallback>
          </Avatar>
        </div>
      </PopoverTrigger>
      <PopoverContent className="max-w-40">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="leading-none font-medium">{user?.name}</h4>
            <p className="text-muted-foreground text-sm">{user?.email}</p>
          </div>
          <div className="flex justify-center">
            <Button size="sm" variant="ghost" onClick={logout}>
              <LogOut /> Logout
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
