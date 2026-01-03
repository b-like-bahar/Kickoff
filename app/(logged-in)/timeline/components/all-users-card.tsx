"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heading3, Text } from "@/components/ui/typography";
import { Database } from "@/types/supabase";
import { routes } from "@/app/constants";
import Link from "next/link";
import { Users, ExternalLink } from "lucide-react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { getAvatarUrl } from "@/utils/client-utils";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

type AllUsersCardProps = {
  currentUserId: string;
  allProfiles: Profile[];
};

const AllUsersCard = ({ allProfiles }: AllUsersCardProps) => {
  return (
    <Card className="sticky shadow-md border border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          <Heading3>All Users</Heading3>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {allProfiles.length === 0 ? (
          <Text className="text-muted-foreground text-center py-2">No users to follow</Text>
        ) : (
          <div className="space-y-1">
            {allProfiles.map(user => {
              const userId = user.user_id || user.id;
              const userEmail = user.email || "User";

              return (
                <Link
                  key={user.id}
                  href={`${routes.protectedRoutes.userProfile}/${userId}`}
                  className="block group"
                >
                  <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors duration-200 border border-transparent hover:border-border/30">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={getAvatarUrl(user.avatar_url)} />
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <Text
                        size="sm"
                        weight="semibold"
                        className="text-foreground group-hover:text-primary transition-colors duration-200 truncate"
                      >
                        {userEmail}
                      </Text>
                      <Text size="xs" variant="muted" className="truncate">
                        View profile
                      </Text>
                    </div>
                    <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors duration-200 flex-shrink-0" />
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AllUsersCard;
