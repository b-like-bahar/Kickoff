"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";
import { Heading4, Text } from "@/components/ui/typography";
import { useState, useTransition } from "react";
import { toast } from "@/utils/toast";
import { deleteAccountAction } from "@/app/(logged-in)/settings/settings-actions";
import { routes } from "@/app/constants";
import { useRouter } from "next/navigation";

export function DeleteAccountCard() {
  const [isPending, startDeleteAccountTransition] = useTransition();
  const [dialogOpen, setDialogOpen] = useState(false);
  const router = useRouter();

  const handleDeleteAccount = async () => {
    startDeleteAccountTransition(async () => {
      const { error } = await deleteAccountAction();
      if (error) {
        toast({
          type: "error",
          message: error,
        });
      } else {
        toast({
          type: "success",
          message: "Account deleted successfully",
        });
        router.push(routes.publicRoutes.home);
      }
    });
  };

  return (
    <Card className="border-destructive/20 bg-destructive/5 p-4 flex flex-col gap-4">
      <div className="flex flex-col gap-3 flex-1">
        <div className="flex gap-2">
          <AlertTriangle className="h-5 w-5 text-destructive flex-shrink-0 mt-1" />
          <Heading4 className="text-destructive">Delete Account</Heading4>
        </div>
        <Text size="sm" weight="medium" variant="muted">
          Once you delete your account, all your data will be permanently removed. This includes
          your profile, tweets, comments, and all other account information.
        </Text>
      </div>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <div className="flex justify-center sm:justify-end">
            <Button className="w-full " variant="destructive">
              Delete Account
            </Button>
          </div>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-destructive text-center text-2xl font-bold">
              Delete Account
            </DialogTitle>
            <DialogDescription className="text-center pt-2">
              Are you absolutely sure you want to delete your account? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-center gap-2 mt-2">
            <Button
              variant="outline"
              className="w-full sm:w-auto"
              onClick={() => setDialogOpen(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              className="w-full sm:w-auto"
              onClick={handleDeleteAccount}
              disabled={isPending}
            >
              {isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
