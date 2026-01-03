import { tweetsDb } from "@/db/db-tweets";
import { usersDb } from "@/db/db-users";
import { avatarsDb } from "@/db/db-avatars";

/**
 * Entry point for the database layer.
 *
 * This module acts as the interface between the database and the rest of the application.
 * No business logic should be implemented here—only database access and aggregation.
 */

export const db = {
  tweets: tweetsDb,
  users: usersDb,
  avatars: avatarsDb,
};
