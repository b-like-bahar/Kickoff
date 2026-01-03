import { Home } from "lucide-react";
import { Text } from "@/components/ui/typography";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import Link from "next/link";
import { routes } from "@/app/constants";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { getAvatarUrl } from "@/utils/client-utils";

export function Navbar({ avatarUrl, userId }: { avatarUrl: string | null; userId: string }) {
  const displayAvatarUrl = getAvatarUrl(avatarUrl);
  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto h-16 flex items-center justify-between px-4 lg:px-0">
        {/* Left - App Icon/Logo */}
        <div className="flex items-center space-x-2">
          <Link
            href={routes.protectedRoutes.timeline}
            className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Home className="h-5 w-5 text-primary-foreground" />
            </div>
            <Text className="font-bold">Your logo</Text>
          </Link>
        </div>

        {/* Right - Avatar */}
        <div className="flex items-center space-x-4">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href={routes.protectedRoutes.settings}
                  data-testid="navbar-avatar-settings-link"
                >
                  <Button variant="secondary">Settings</Button>
                </Link>
              </TooltipTrigger>
              <TooltipContent>Go to settings</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <Link href={`${routes.protectedRoutes.userProfile}/${userId}`}>
            <Avatar className="h-8 w-8">
              <AvatarImage data-testid="navbar-avatar" src={displayAvatarUrl} alt="User avatar" />
            </Avatar>
          </Link>
        </div>
      </div>
    </nav>
  );
}
