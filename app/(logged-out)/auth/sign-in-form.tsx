"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signInFormSchema, SignInFormType } from "@/utils/validators";
import { useRouter } from "next/navigation";
import { routes } from "@/app/constants";
import {
  Form,
  FormField,
  FormLabel,
  FormItem,
  FormMessage,
  FormControl,
} from "@/components/ui/form";
import { PasswordInput } from "@/components/ui/password-input";
import { getLocalhostCredentials } from "@/utils/client-utils";
import { toast } from "@/utils/toast";
import { useTransition } from "react";
import { signInAction } from "@/app/(logged-out)/auth/auth-actions";

const { email: localhostEmail, password: localhostPassword } = getLocalhostCredentials();

export function SignInForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<SignInFormType>({
    resolver: zodResolver(signInFormSchema),
    defaultValues: {
      email: localhostEmail,
      password: localhostPassword,
    },
  });

  const { handleSubmit } = form;

  const onSubmitForm: SubmitHandler<SignInFormType> = async formValues => {
    const formData = new FormData();
    formData.append("email", formValues.email);
    formData.append("password", formValues.password);

    startTransition(async () => {
      const { error } = await signInAction(formData);
      if (error) {
        toast({
          type: "error",
          message: error,
        });
      } else {
        toast({
          type: "success",
          message: "Signed in successfully",
        });
        router.push(routes.protectedRoutes.timeline);
      }
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit(onSubmitForm)}
        className="space-y-4 w-full flex flex-col justify-center items-center"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="w-full">
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
            <FormItem className="w-full">
              <FormLabel>Password</FormLabel>
              <FormControl>
                <PasswordInput placeholder="Password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex flex-col gap-3 w-full mt-4">
          <Button type="submit" variant="default" disabled={isPending}>
            {isPending ? "Signing in..." : "Sign in"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
