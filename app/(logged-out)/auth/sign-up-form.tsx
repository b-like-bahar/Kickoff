"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUpFormSchema, SignUpFormType } from "@/utils/validators";
import { useRouter } from "next/navigation";
import {
  Form,
  FormField,
  FormLabel,
  FormItem,
  FormMessage,
  FormDescription,
  FormControl,
} from "@/components/ui/form";
import { PasswordInput } from "@/components/ui/password-input";
import { routes } from "@/app/constants";
import { getLocalhostCredentials } from "@/utils/client-utils";
import { toast } from "@/utils/toast";
import { signUpAction } from "@/app/(logged-out)/auth/auth-actions";
import { useTransition } from "react";

const { email: localhostEmail, password: localhostPassword } = getLocalhostCredentials();

export function SignUpForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<SignUpFormType>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: {
      email: localhostEmail,
      password: localhostPassword,
      confirmPassword: localhostPassword,
    },
  });

  const { handleSubmit } = form;

  const onSubmit: SubmitHandler<SignUpFormType> = async formValues => {
    const formData = new FormData();
    formData.append("email", formValues.email);
    formData.append("password", formValues.password);
    formData.append("confirmPassword", formValues.confirmPassword);

    startTransition(async () => {
      const { error, data } = await signUpAction(formData);
      if (error) {
        toast({
          type: "error",
          message: error,
        });
        return;
      } else if (data) {
        toast({
          type: "success",
          message: "Account created successfully",
        });
        router.push(
          `${routes.publicRoutes.confirmationPage}?email=${encodeURIComponent(data.email)}&type=sign-up`
        );
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <PasswordInput placeholder="Password" {...field} />
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
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <PasswordInput placeholder="Confirm Password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isPending} className="w-full">
          {isPending ? "Creating account..." : "Create Account"}
        </Button>
      </form>
    </Form>
  );
}
