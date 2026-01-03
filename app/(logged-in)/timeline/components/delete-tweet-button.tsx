"use client";

import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { deleteTweetAction } from "@/app/(logged-in)/timeline/timeline-actions";
import { toast } from "@/utils/toast";
import { useTransition } from "react";

type DeleteTweetButtonProps = {
  tweetId: string;
  tweetUserId: string;
  currentUserId: string;
};

export default function DeleteTweetButton({
  tweetId,
  tweetUserId,
  currentUserId,
}: DeleteTweetButtonProps) {
  const [isPending, startTransition] = useTransition();
  const isOwner = currentUserId === tweetUserId;

  const handleDeleteTweet = () => {
    const formData = new FormData();
    formData.append("tweetId", tweetId);

    startTransition(async () => {
      const { error } = await deleteTweetAction(formData);
      if (error) {
        toast({
          type: "error",
          message: error,
        });
      } else {
        toast({
          type: "success",
          message: "Tweet deleted successfully",
        });
      }
    });
  };

  if (!isOwner) {
    return null;
  }

  return (
    <Button
      data-testid="delete-tweet-button"
      variant="ghost"
      size="icon"
      onClick={handleDeleteTweet}
      disabled={isPending}
      className="text-muted-foreground hover:text-destructive"
    >
      <Trash className="h-4 w-4" />
    </Button>
  );
}
