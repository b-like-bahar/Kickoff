"use client";

import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPasswordSchema, ResetPasswordType } from "@/utils/validators";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PasswordInput } from "@/components/ui/password-input";
import { toast } from "@/utils/toast";
import { updatePasswordAction } from "@/app/(logged-in)/settings/settings-actions";
import { useTransition } from "react";

type ResetPasswordFormProps = {
  userId: string;
  userEmail: string;
};

export function ResetPasswordForm({ userEmail }: ResetPasswordFormProps) {
  const [isPending, startPasswordTransition] = useTransition();
  const form = useForm<ResetPasswordType>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  const { handleSubmit } = form;

  const onSubmit: SubmitHandler<ResetPasswordType> = async formValues => {
    const formData = new FormData();
    formData.append("newPassword", formValues.newPassword);
    formData.append("confirmNewPassword", formValues.confirmNewPassword);

    startPasswordTransition(async () => {
      const { error } = await updatePasswordAction(formData);
      if (error) {
        toast({
          type: "error",
          message: error,
        });
        return;
      } else {
        toast({
          type: "success",
          message: "Your password has been reset successfully",
        });
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-2">
          <FormLabel>Email</FormLabel>
          <Input value={userEmail} disabled />
          <FormDescription>Your email cannot be changed</FormDescription>
        </div>
        <FormField
          control={form.control}
          name="newPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>New Password</FormLabel>
              <FormControl>
                <PasswordInput placeholder="New Password" {...field} />
              </FormControl>
              <FormMessage />
              <FormDescription>
                Must contain at least 8 characters <br />
                Must contain at least 1 letter and 1 number <br />
                Must contain at least 1 special character
              </FormDescription>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmNewPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm New Password</FormLabel>
              <FormControl>
                <PasswordInput placeholder="Confirm New Password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isPending} className="w-full">
          {isPending ? "Resetting..." : "Reset Password"}
        </Button>
      </form>
    </Form>
  );
}
