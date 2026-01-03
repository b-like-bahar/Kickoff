import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { isLocalhost } from "@/utils/global-utils";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getLocalhostCredentials = () => {
  if (!isLocalhost) return { email: "", password: "" };

  return {
    email: "user@mail.com",
    password: "Password123!",
  };
};

// Avatar utility functions
export const DEFAULT_AVATAR_URL = "/generic-profile-avatar.svg";

// Returns avatarUrl if provided (truthy), otherwise falls back to the default image.
export function getAvatarUrl(avatarUrl?: string | null): string {
  if (avatarUrl) {
    return avatarUrl;
  }
  return DEFAULT_AVATAR_URL;
}
