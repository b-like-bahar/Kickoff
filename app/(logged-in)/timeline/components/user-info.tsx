import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Text } from "@/components/ui/typography";
import React from "react";

type UserInfoProps = {
  avatar: string;
  name: string;
  username?: string;
  className?: string;
  horizontal?: boolean;
  showOnlyAvatar?: boolean;
  testId?: string;
};

export function UserInfo({
  avatar,
  name,
  username,
  className,
  horizontal = false,
  showOnlyAvatar = false,
  testId,
}: UserInfoProps) {
  if (showOnlyAvatar) {
    return (
      <Avatar className={`h-8 w-8 ${className || ""}`}>
        <AvatarImage data-testid={testId} src={avatar} alt="User avatar" />
      </Avatar>
    );
  }

  return horizontal ? (
    <div className={`flex items-center gap-2 min-h-[40px] ${className || ""}`}>
      <Avatar className="h-10 w-10">
        <AvatarImage data-testid={testId} src={avatar} alt="User avatar" />
      </Avatar>
      <Text weight="semibold">{name}</Text>
      {username && (
        <Text size="sm" variant="muted">
          {username}
        </Text>
      )}
    </div>
  ) : (
    <div className={`flex items-center gap-3 min-h-[48px] ${className || ""}`}>
      <Avatar className="h-10 w-10">
        <AvatarImage data-testid={testId} src={avatar} alt="User avatar" />
      </Avatar>
      <div className="flex flex-col justify-center">
        <Text weight="semibold">{name}</Text>
        {username && (
          <Text size="sm" variant="muted">
            {username}
          </Text>
        )}
      </div>
    </div>
  );
}
