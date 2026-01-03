-- ============================================================================
-- KICKOFF: CLEAN BASE SCHEMA (SINGLE MIGRATION)
-- ============================================================================
-- This file represents the final desired state of the database as if created
-- fresh today (no follow-up "drop/rename" migrations needed).
--
-- Included:
-- - profiles (email + avatar_url)
-- - tweets
-- - tweet_comments
-- - tweets_with_comments_view
-- - avatar storage bucket + RLS policies + cleanup trigger
--
-- Not included:
-- - follows, tweet_likes (removed)
-- - profiles.username/name/bio (removed)
-- - theme preference (removed)
-- ============================================================================

-- Ensure pgcrypto for gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;

-- =============================================
-- TABLES
-- =============================================

CREATE TABLE "public"."profiles" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "user_id" uuid,
  "email" text,
  "created_at" timestamp with time zone DEFAULT now(),
  "avatar_url" text
);

ALTER TABLE "public"."profiles" ENABLE ROW LEVEL SECURITY;

CREATE TABLE "public"."tweets" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "created_at" timestamp with time zone NOT NULL DEFAULT now(),
  "user_id" uuid NOT NULL,
  "tweet_text" text NOT NULL
);

ALTER TABLE "public"."tweets" ENABLE ROW LEVEL SECURITY;

CREATE TABLE "public"."tweet_comments" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "created_at" timestamp with time zone NOT NULL DEFAULT now(),
  "comment_text" text NOT NULL,
  "tweet_id" uuid NOT NULL,
  "user_id" uuid NOT NULL
);

ALTER TABLE "public"."tweet_comments" ENABLE ROW LEVEL SECURITY;

-- =============================================
-- INDEXES / CONSTRAINTS
-- =============================================

CREATE UNIQUE INDEX profiles_pkey ON public.profiles USING btree (id);
ALTER TABLE "public"."profiles" ADD CONSTRAINT "profiles_pkey" PRIMARY KEY USING INDEX "profiles_pkey";

CREATE UNIQUE INDEX profiles_user_id_key ON public.profiles USING btree (user_id);
ALTER TABLE "public"."profiles" ADD CONSTRAINT "profiles_user_id_key" UNIQUE USING INDEX "profiles_user_id_key";

ALTER TABLE "public"."profiles"
  ADD CONSTRAINT "profiles_user_id_fkey"
  FOREIGN KEY (user_id) REFERENCES auth.users(id)
  ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;
ALTER TABLE "public"."profiles" VALIDATE CONSTRAINT "profiles_user_id_fkey";

CREATE UNIQUE INDEX tweets_pkey ON public.tweets USING btree (id);
ALTER TABLE "public"."tweets" ADD CONSTRAINT "tweets_pkey" PRIMARY KEY USING INDEX "tweets_pkey";

ALTER TABLE "public"."tweets"
  ADD CONSTRAINT "tweets_user_id_fkey"
  FOREIGN KEY (user_id) REFERENCES auth.users(id)
  ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;
ALTER TABLE "public"."tweets" VALIDATE CONSTRAINT "tweets_user_id_fkey";

CREATE UNIQUE INDEX tweet_comments_pkey ON public.tweet_comments USING btree (id);
ALTER TABLE "public"."tweet_comments" ADD CONSTRAINT "tweet_comments_pkey" PRIMARY KEY USING INDEX "tweet_comments_pkey";

ALTER TABLE "public"."tweet_comments"
  ADD CONSTRAINT "tweet_comments_tweet_id_fkey"
  FOREIGN KEY (tweet_id) REFERENCES tweets(id)
  ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;
ALTER TABLE "public"."tweet_comments" VALIDATE CONSTRAINT "tweet_comments_tweet_id_fkey";

ALTER TABLE "public"."tweet_comments"
  ADD CONSTRAINT "tweet_comments_user_id_fkey"
  FOREIGN KEY (user_id) REFERENCES auth.users(id)
  ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;
ALTER TABLE "public"."tweet_comments" VALIDATE CONSTRAINT "tweet_comments_user_id_fkey";

-- =============================================
-- FUNCTIONS & TRIGGERS
-- =============================================

SET check_function_bodies = off;

-- New-user profile bootstrap
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  INSERT INTO public.profiles (id, user_id, email, created_at, avatar_url)
  VALUES (gen_random_uuid(), NEW.id, NEW.email, now(), '/generic-profile-avatar.svg')
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS new_user_trigger ON auth.users;
CREATE TRIGGER new_user_trigger
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();

-- =============================================
-- VIEWS
-- =============================================

CREATE OR REPLACE VIEW "public"."tweets_with_comments_view" AS
SELECT
  t.id AS tweet_id,
  t.tweet_text,
  t.created_at AS tweet_created_at,
  t.user_id AS tweet_user_id,

  tp.email AS tweet_author_email,
  tp.avatar_url AS tweet_author_avatar,
  tp.created_at AS tweet_author_created_at,

  (
    SELECT jsonb_agg(
      jsonb_build_object(
        'id', c.id,
        'comment_text', c.comment_text,
        'created_at', c.created_at,
        'user_id', c.user_id,
        'user_email', cp.email,
        'user_avatar', cp.avatar_url,
        'user_created_at', cp.created_at
      )
      ORDER BY c.created_at DESC
    )
    FROM public.tweet_comments c
    JOIN public.profiles cp ON c.user_id = cp.user_id
    WHERE c.tweet_id = t.id
  ) AS comments,

  (
    SELECT count(*)::int
    FROM public.tweet_comments c
    WHERE c.tweet_id = t.id
  ) AS comment_count
FROM public.tweets t
JOIN public.profiles tp ON t.user_id = tp.user_id
ORDER BY t.created_at DESC;

GRANT SELECT ON "public"."tweets_with_comments_view" TO "anon";
GRANT SELECT ON "public"."tweets_with_comments_view" TO "authenticated";
GRANT SELECT ON "public"."tweets_with_comments_view" TO "service_role";

-- =============================================
-- PERMISSIONS & GRANTS
-- =============================================

-- tweet_comments
GRANT SELECT ON TABLE "public"."tweet_comments" TO "anon";
GRANT DELETE ON TABLE "public"."tweet_comments" TO "authenticated";
GRANT INSERT ON TABLE "public"."tweet_comments" TO "authenticated";
GRANT SELECT ON TABLE "public"."tweet_comments" TO "authenticated";
GRANT UPDATE ON TABLE "public"."tweet_comments" TO "authenticated";
GRANT DELETE ON TABLE "public"."tweet_comments" TO "service_role";
GRANT INSERT ON TABLE "public"."tweet_comments" TO "service_role";
GRANT REFERENCES ON TABLE "public"."tweet_comments" TO "service_role";
GRANT SELECT ON TABLE "public"."tweet_comments" TO "service_role";
GRANT TRIGGER ON TABLE "public"."tweet_comments" TO "service_role";
GRANT TRUNCATE ON TABLE "public"."tweet_comments" TO "service_role";
GRANT UPDATE ON TABLE "public"."tweet_comments" TO "service_role";

-- profiles
GRANT SELECT ON TABLE "public"."profiles" TO "anon";
GRANT DELETE ON TABLE "public"."profiles" TO "authenticated";
GRANT INSERT ON TABLE "public"."profiles" TO "authenticated";
GRANT SELECT ON TABLE "public"."profiles" TO "authenticated";
GRANT UPDATE ON TABLE "public"."profiles" TO "authenticated";
GRANT DELETE ON TABLE "public"."profiles" TO "service_role";
GRANT INSERT ON TABLE "public"."profiles" TO "service_role";
GRANT REFERENCES ON TABLE "public"."profiles" TO "service_role";
GRANT SELECT ON TABLE "public"."profiles" TO "service_role";
GRANT TRIGGER ON TABLE "public"."profiles" TO "service_role";
GRANT TRUNCATE ON TABLE "public"."profiles" TO "service_role";
GRANT UPDATE ON TABLE "public"."profiles" TO "service_role";

-- tweets
GRANT SELECT ON TABLE "public"."tweets" TO "anon";
GRANT DELETE ON TABLE "public"."tweets" TO "authenticated";
GRANT INSERT ON TABLE "public"."tweets" TO "authenticated";
GRANT SELECT ON TABLE "public"."tweets" TO "authenticated";
GRANT UPDATE ON TABLE "public"."tweets" TO "authenticated";
GRANT DELETE ON TABLE "public"."tweets" TO "service_role";
GRANT INSERT ON TABLE "public"."tweets" TO "service_role";
GRANT REFERENCES ON TABLE "public"."tweets" TO "service_role";
GRANT SELECT ON TABLE "public"."tweets" TO "service_role";
GRANT TRIGGER ON TABLE "public"."tweets" TO "service_role";
GRANT TRUNCATE ON TABLE "public"."tweets" TO "service_role";
GRANT UPDATE ON TABLE "public"."tweets" TO "service_role";

-- =============================================
-- ROW LEVEL SECURITY POLICIES
-- =============================================

-- tweet_comments
DROP POLICY IF EXISTS "Enable delete for users based on user_id" ON "public"."tweet_comments";
DROP POLICY IF EXISTS "Enable insert for users based on user_id" ON "public"."tweet_comments";
DROP POLICY IF EXISTS "Enable read access for all users" ON "public"."tweet_comments";
DROP POLICY IF EXISTS "Enable update for users based on user_id" ON "public"."tweet_comments";

CREATE POLICY "Enable delete for users based on user_id"
ON "public"."tweet_comments"
AS PERMISSIVE
FOR DELETE
TO authenticated
USING ((auth.uid() = user_id));

CREATE POLICY "Enable insert for users based on user_id"
ON "public"."tweet_comments"
AS PERMISSIVE
FOR INSERT
TO authenticated
WITH CHECK ((auth.uid() = user_id));

CREATE POLICY "Enable read access for all users"
ON "public"."tweet_comments"
AS PERMISSIVE
FOR SELECT
TO public
USING (true);

CREATE POLICY "Enable update for users based on user_id"
ON "public"."tweet_comments"
AS PERMISSIVE
FOR UPDATE
TO authenticated
USING ((auth.uid() = user_id));

-- profiles
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON "public"."profiles";
DROP POLICY IF EXISTS "Users can delete their own profile" ON "public"."profiles";
DROP POLICY IF EXISTS "Users can insert their own profile" ON "public"."profiles";
DROP POLICY IF EXISTS "Users can update their own profile" ON "public"."profiles";

CREATE POLICY "Profiles are viewable by everyone"
ON "public"."profiles"
AS PERMISSIVE
FOR SELECT
TO public
USING (true);

CREATE POLICY "Users can delete their own profile"
ON "public"."profiles"
AS PERMISSIVE
FOR DELETE
TO authenticated
USING ((auth.uid() = user_id));

CREATE POLICY "Users can insert their own profile"
ON "public"."profiles"
AS PERMISSIVE
FOR INSERT
TO authenticated
WITH CHECK ((auth.uid() = user_id));

CREATE POLICY "Users can update their own profile"
ON "public"."profiles"
AS PERMISSIVE
FOR UPDATE
TO authenticated
USING ((auth.uid() = user_id));

-- tweets
DROP POLICY IF EXISTS "Enable delete for users based on user_id" ON "public"."tweets";
DROP POLICY IF EXISTS "Enable insert for users based on user_id" ON "public"."tweets";
DROP POLICY IF EXISTS "Enable read access for all users" ON "public"."tweets";
DROP POLICY IF EXISTS "Enable update for users based on user_id" ON "public"."tweets";

CREATE POLICY "Enable delete for users based on user_id"
ON "public"."tweets"
AS PERMISSIVE
FOR DELETE
TO authenticated
USING ((auth.uid() = user_id));

CREATE POLICY "Enable insert for users based on user_id"
ON "public"."tweets"
AS PERMISSIVE
FOR INSERT
TO authenticated
WITH CHECK ((auth.uid() = user_id));

CREATE POLICY "Enable read access for all users"
ON "public"."tweets"
AS PERMISSIVE
FOR SELECT
TO public
USING (true);

CREATE POLICY "Enable update for users based on user_id"
ON "public"."tweets"
AS PERMISSIVE
FOR UPDATE
TO authenticated
USING ((auth.uid() = user_id));

-- =============================================
-- AVATAR STORAGE (BUCKET + POLICIES + CLEANUP)
-- =============================================

-- Create/configure bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'avatars',
  'avatars',
  true,
  1048576, -- 1 MB
  ARRAY['image/jpeg','image/jpg','image/png','image/webp']
) ON CONFLICT (id) DO NOTHING;

UPDATE storage.buckets SET public = true WHERE id = 'avatars';

-- RLS policies on storage.objects
DROP POLICY IF EXISTS "Allow authenticated users to upload avatars" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to update avatars" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to delete avatars" ON storage.objects;
DROP POLICY IF EXISTS "Allow public read access to avatars" ON storage.objects;

CREATE POLICY "Allow authenticated users to upload avatars"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'avatars'
  AND (
    (left(name, length(auth.uid()::text)) = auth.uid()::text
     AND substr(name, length(auth.uid()::text) + 1, 1) = '-')
    OR auth.role() = 'service_role'
  )
);

CREATE POLICY "Allow authenticated users to update avatars"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'avatars'
  AND (
    (left(name, length(auth.uid()::text)) = auth.uid()::text
     AND substr(name, length(auth.uid()::text) + 1, 1) = '-')
    OR auth.role() = 'service_role'
  )
)
WITH CHECK (
  bucket_id = 'avatars'
  AND (
    (left(name, length(auth.uid()::text)) = auth.uid()::text
     AND substr(name, length(auth.uid()::text) + 1, 1) = '-')
    OR auth.role() = 'service_role'
  )
);

CREATE POLICY "Allow authenticated users to delete avatars"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'avatars'
  AND (
    (left(name, length(auth.uid()::text)) = auth.uid()::text
     AND substr(name, length(auth.uid()::text) + 1, 1) = '-')
    OR auth.role() = 'service_role'
  )
);

CREATE POLICY "Allow public read access to avatars"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'avatars');

GRANT SELECT, INSERT, UPDATE, DELETE ON storage.objects TO authenticated;
GRANT SELECT ON storage.objects TO anon;

-- Normalize legacy/default avatar URLs to NULL (client renders fallback)
UPDATE public.profiles
SET avatar_url = NULL
WHERE avatar_url IS NULL
   OR avatar_url = 'https://avatar.iran.liara.run/public/98'
   OR avatar_url LIKE '%avatar.iran.liara.run%'
   OR avatar_url = '/default-avatar.svg';

-- Cleanup avatar files on user delete
CREATE OR REPLACE FUNCTION public.delete_user_avatar_files()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  user_avatar_url TEXT;
  avatar_object_name TEXT;
BEGIN
  BEGIN
    SELECT avatar_url INTO user_avatar_url
    FROM public.profiles
    WHERE user_id = OLD.id;

    IF user_avatar_url IS NOT NULL AND position('/avatars/' IN user_avatar_url) > 0 THEN
      avatar_object_name := split_part(
        regexp_replace(user_avatar_url, '^.*?/avatars/', ''),
        '?',
        1
      );

      IF avatar_object_name IS NOT NULL AND avatar_object_name != '' THEN
        DELETE FROM storage.objects
        WHERE bucket_id = 'avatars'
          AND name = avatar_object_name;
      END IF;
    END IF;

    DELETE FROM storage.objects
    WHERE bucket_id = 'avatars'
      AND name LIKE OLD.id::text || '-%';
  EXCEPTION
    WHEN OTHERS THEN
      RAISE WARNING 'Avatar cleanup failed for user %: %', OLD.id, SQLERRM;
  END;

  RETURN OLD;
END;
$$;

DROP TRIGGER IF EXISTS trigger_delete_user_avatar ON auth.users;
CREATE TRIGGER trigger_delete_user_avatar
BEFORE DELETE ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.delete_user_avatar_files();

GRANT SELECT ON public.profiles TO postgres;
GRANT DELETE ON storage.objects TO postgres;
GRANT USAGE ON SCHEMA storage TO postgres;
