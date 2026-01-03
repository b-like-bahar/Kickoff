"use client";

import { UserInfo } from "@/app/(logged-in)/timeline/components/user-info";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { Text } from "@/components/ui/typography";
import { deleteCommentAction } from "@/app/(logged-in)/timeline/timeline-actions";
import { toast } from "@/utils/toast";
import { useTransition } from "react";
import { getAvatarUrl } from "@/utils/client-utils";

type TweetCommentsProps = {
  comment: {
    id: string;
    comment_text: string;
    user_id: string;
    user_email: string;
    user_avatar: string | null;
  };
  currentUserId?: string;
};

export default function TweetComments({ comment, currentUserId }: TweetCommentsProps) {
  const [isPending, startTransition] = useTransition();
  const isOwner = currentUserId === comment.user_id;

  const handleDeleteComment = () => {
    const formData = new FormData();
    formData.append("commentId", comment.id);

    startTransition(async () => {
      const { error } = await deleteCommentAction(formData);
      if (error) {
        toast({
          type: "error",
          message: error,
        });
      } else {
        toast({
          type: "success",
          message: "Comment deleted successfully",
        });
      }
    });
  };

  return (
    <div
      className="flex items-start gap-3 p-2 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors duration-200"
      data-testid="comment-container"
    >
      <UserInfo
        avatar={getAvatarUrl(comment.user_avatar)}
        name={comment.user_email || "User"}
        showOnlyAvatar
        className="mt-1 flex-shrink-0"
        testId="comment-author-avatar"
      />
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start gap-2">
          <div className="flex-1 min-w-0">
            <Text size="sm" weight="semibold" className="text-foreground">
              {comment.user_email}
            </Text>
            <Text size="sm" className="break-words text-muted-foreground leading-relaxed mt-1">
              {comment.comment_text}
            </Text>
          </div>
          {isOwner && (
            <Button
              data-testid="delete-comment-button"
              variant="ghost"
              size="icon"
              onClick={handleDeleteComment}
              disabled={isPending}
              className="flex-shrink-0 text-muted-foreground hover:text-destructive"
            >
              <Trash className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
