"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { commentFormSchema, type CommentFormType } from "@/utils/validators";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Text } from "@/components/ui/typography";
import { UserInfo } from "@/app/(logged-in)/timeline/components/user-info";
import { useTransition } from "react";
import { createCommentAction } from "@/app/(logged-in)/timeline/timeline-actions";
import { toast } from "@/utils/toast";
import { Database } from "@/types/supabase";
import { getAvatarUrl } from "@/utils/client-utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { MessageCircle } from "lucide-react";
import { useState } from "react";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

type CreateCommentDialogProps = {
  tweetId: string;
  userId: string;
  profile: Profile;
};

export default function CreateCommentDialog({
  tweetId,
  userId,
  profile,
}: CreateCommentDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const form = useForm<CommentFormType>({
    resolver: zodResolver(commentFormSchema),
    defaultValues: {
      comment_text: "",
    },
  });

  const characterCount = 280 - (form.watch("comment_text")?.length || 0);

  const onSubmit = async (data: CommentFormType) => {
    const formData = new FormData();
    formData.append("comment_text", data.comment_text);
    formData.append("tweetId", tweetId);
    formData.append("userId", userId);

    startTransition(async () => {
      const { error } = await createCommentAction(formData);
      if (error) {
        toast({
          type: "error",
          message: error,
        });
      } else {
        form.reset();
        setIsOpen(false);
        toast({
          type: "success",
          message: "Comment created successfully",
        });
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
          data-testid="comment-tweet-button"
        >
          <MessageCircle className="h-4 w-4" />
          Comment
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add a comment</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex gap-3">
              <UserInfo
                avatar={getAvatarUrl(profile.avatar_url)}
                name={profile.email || "User"}
                showOnlyAvatar
                className="mt-1"
              />
              <FormField
                control={form.control}
                name="comment_text"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Textarea
                        placeholder="Add a comment..."
                        className="min-h-[100px] resize-none"
                        {...field}
                        onChange={e => {
                          const text = e.target.value;
                          if (text.length <= 280) {
                            field.onChange(text);
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex justify-between items-center">
              <Text size="sm" variant="muted">
                {characterCount}
              </Text>
              <Button
                type="submit"
                disabled={characterCount === 0 || characterCount === 280 || isPending}
              >
                {isPending ? "Posting..." : "Comment"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
