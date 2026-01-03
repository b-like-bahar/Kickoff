import { z } from "zod";

const emailValidator = z.string().email();

const passwordValidator = z
  .string()
  .min(8, "Password must be at least 8 characters long")
  .regex(
    /^(?=.*[0-9])(?=.*[!@#$%^&*])/,
    "Password must contain at least 8 characters, one number and one special character"
  );

export const signInFormSchema = z.object({
  email: emailValidator,
  password: passwordValidator,
});

export type SignInFormType = z.infer<typeof signInFormSchema>;

export const signUpFormSchema = z
  .object({
    email: emailValidator,
    password: passwordValidator,
    confirmPassword: z.string(),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Passwords do not match",
        path: ["confirmPassword"],
      });
    }
  });

export type SignUpFormType = z.infer<typeof signUpFormSchema>;

export const forgotPasswordSchema = z.object({
  email: emailValidator,
});

export type ForgotPasswordType = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z
  .object({
    newPassword: passwordValidator,
    confirmNewPassword: z.string(),
  })
  .superRefine((data, ctx) => {
    if (data.newPassword !== data.confirmNewPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Passwords do not match",
        path: ["confirmNewPassword"],
      });
    }
  });

export type ResetPasswordType = z.infer<typeof resetPasswordSchema>;

export const tweetFormSchema = z.object({
  tweet_text: z
    .string()
    .min(1, "Tweet cannot be empty")
    .max(280, "Tweet cannot exceed 280 characters"),
});

export type TweetFormType = z.infer<typeof tweetFormSchema>;

export const commentFormSchema = z.object({
  comment_text: z
    .string()
    .min(1, "Comment cannot be empty")
    .max(280, "Comment cannot exceed 280 characters"),
});

export type CommentFormType = z.infer<typeof commentFormSchema>;

export const avatarFileSchema = z.object({
  avatar: z
    .instanceof(File)
    .refine(file => file.size < 1 * 1024 * 1024, "File size must be less than 1MB")
    .refine(
      file => ["image/jpeg", "image/png", "image/webp", "image/jpg"].includes(file.type),
      "Only JPEG, PNG and WebP image formats are allowed"
    ),
});

export type AvatarFileType = z.infer<typeof avatarFileSchema>;
