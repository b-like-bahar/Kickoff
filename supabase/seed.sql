-- ============================================================================
-- SEED DATA FOR Kickoff APPLICATION
-- ============================================================================
-- This file seeds the database with test users and tweets
-- for development and testing purposes.
-- ============================================================================

-- ============================================================================
-- CLEANUP: Clear existing data
-- ============================================================================
DELETE FROM public.tweet_comments;
DELETE FROM public.tweets;
DELETE FROM public.profiles;
DELETE FROM auth.identities;
DELETE FROM auth.users;

-- ============================================================================
-- SECTION 1: AUTH USERS
-- ============================================================================
-- Create test users in the auth.users table
-- All users have the same password: Password123!

INSERT INTO
  auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    recovery_sent_at,
    last_sign_in_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token
  )
VALUES 
    -- e2e test user
    (
        '00000000-0000-0000-0000-000000000000',
        'c36fc6f0-3e4a-4bdc-8778-f66bc79ad563',
        'authenticated',
        'authenticated',
        'e2e@example.com',
        crypt('Password123!', gen_salt('bf')),
        current_timestamp,
        current_timestamp,
        current_timestamp,
        '{"provider":"email","providers":["email"]}',
        '{"name":"E2E Test User"}',
        current_timestamp,
        current_timestamp,
        '', '', '', ''
    ),
    -- Alex Johnson
    (
        '00000000-0000-0000-0000-000000000000',
        'c36fc6f0-3e4a-4bdc-8778-f66bc79ad562',
        'authenticated',
        'authenticated',
        'alex@example.com',
        crypt('Password123!', gen_salt('bf')),
        current_timestamp,
        current_timestamp,
        current_timestamp,
        '{"provider":"email","providers":["email"]}',
        '{"name":"Alex Johnson"}',
        current_timestamp,
        current_timestamp,
        '', '', '', ''
    ),
    -- Sarah Williams
    (
        '00000000-0000-0000-0000-000000000000',
        '73fd6c8c-1b7e-418c-a573-1c95b8ea042e',
        'authenticated',
        'authenticated',
        'sarah@example.com',
        crypt('Password123!', gen_salt('bf')),
        current_timestamp,
        current_timestamp,
        current_timestamp,
        '{"provider":"email","providers":["email"]}',
        '{"name":"Sarah Williams"}',
        current_timestamp,
        current_timestamp,
        '', '', '', ''
    ),
    -- Michael Chen
    (
        '00000000-0000-0000-0000-000000000000',
        '28a8c3c5-4e6f-4f1c-9d36-1d9f4b6f6d2b',
        'authenticated',
        'authenticated',
        'michael@example.com',
        crypt('Password123!', gen_salt('bf')),
        current_timestamp,
        current_timestamp,
        current_timestamp,
        '{"provider":"email","providers":["email"]}',
        '{"name":"Michael Chen"}',
        current_timestamp,
        current_timestamp,
        '', '', '', ''
    ),
    -- Emma Davis
    (
        '00000000-0000-0000-0000-000000000000',
        'a7b8c9d0-e1f2-4a5b-9c8d-7e6f5a4b3c2d',
        'authenticated',
        'authenticated',
        'emma@example.com',
        crypt('Password123!', gen_salt('bf')),
        current_timestamp,
        current_timestamp,
        current_timestamp,
        '{"provider":"email","providers":["email"]}',
        '{"name":"Emma Davis"}',
        current_timestamp,
        current_timestamp,
        '', '', '', ''
    ),
    -- James Wilson
    (
        '00000000-0000-0000-0000-000000000000',
        'b8c9d0e1-f2a3-4b5c-8d9e-7f6a5b4c3d2e',
        'authenticated',
        'authenticated',
        'james@example.com',
        crypt('Password123!', gen_salt('bf')),
        current_timestamp,
        current_timestamp,
        current_timestamp,
        '{"provider":"email","providers":["email"]}',
        '{"name":"James Wilson"}',
        current_timestamp,
        current_timestamp,
        '', '', '', ''
    ),
    -- Default User
    (
        '00000000-0000-0000-0000-000000000000',
        'c47fc7f1-4f5b-4ced-9889-f77cd8aeb674',
        'authenticated',
        'authenticated',
        'user@mail.com',
        crypt('Password123!', gen_salt('bf')),
        current_timestamp,
        current_timestamp,
        current_timestamp,
        '{"provider":"email","providers":["email"]}',
        '{"name":"Default User"}',
        current_timestamp,
        current_timestamp,
        '', '', '', ''
    );

-- ============================================================================
-- SECTION 2: AUTH IDENTITIES
-- ============================================================================
-- Create corresponding auth identities for email authentication

INSERT INTO
  auth.identities (
    id,
    user_id,
    provider_id,
    identity_data,
    provider,
    last_sign_in_at,
    created_at,
    updated_at
  ) (
    SELECT
      gen_random_uuid(),
      id,
      id,
      format('{"sub":"%s","email":"%s"}', id::text, email)::jsonb,
      'email',
      current_timestamp,
      current_timestamp,
      current_timestamp
    FROM
      auth.users
  );

-- ============================================================================
-- SECTION 3: USER PROFILES
-- ============================================================================
-- Ensure all seeded users start with the default avatar until they upload a real one
-- Note: Profiles are already created by the handle_new_user() trigger with email
UPDATE public.profiles
SET avatar_url = '/generic-profile-avatar.svg';

-- ============================================================================
-- SECTION 4: TWEETS
-- ============================================================================
-- Insert 2 tweets for each user

INSERT INTO
  public.tweets (user_id, tweet_text, created_at)
SELECT
  user_id,
  tweet_text,
  created_at
FROM
  (
    VALUES
      -- Alex's Tweets
      (
        (SELECT user_id FROM public.profiles WHERE email = 'alex@example.com'),
        'Just started using this new Twitter clone! The UI is really clean and modern.',
        NOW() - INTERVAL '2 hours'
      ),
      (
        (SELECT user_id FROM public.profiles WHERE email = 'alex@example.com'),
        'Working on a new project using NextJS and Supabase. The combination is incredibly powerful!',
        NOW() - INTERVAL '1 day'
      ),
      
      -- Sarah's Tweets
      (
        (SELECT user_id FROM public.profiles WHERE email = 'sarah@example.com'),
        'Beautiful morning for a hike! Nature always inspires me.',
        NOW() - INTERVAL '3 hours'
      ),
      (
        (SELECT user_id FROM public.profiles WHERE email = 'sarah@example.com'),
        'Just finished reading "Atomic Habits" - highly recommend for anyone looking to build better habits.',
        NOW() - INTERVAL '2 days'
      ),
        
      -- Michael's Tweets
      (
        (SELECT user_id FROM public.profiles WHERE email = 'michael@example.com'),
        'Excited to announce I am joining a new tech startup next month! More details soon.',
        NOW() - INTERVAL '5 hours'
      ),
      (
        (SELECT user_id FROM public.profiles WHERE email = 'michael@example.com'),
        'The key to scalable code is simplicity. Always strive to make your code as simple as possible.',
        NOW() - INTERVAL '4 days'
      ),
      
      -- Emma's Tweets
      (
        (SELECT user_id FROM public.profiles WHERE email = 'emma@example.com'),
        'Just discovered the most amazing coffee shop downtown. Their cold brew is perfection!',
        NOW() - INTERVAL '12 hours'
      ),
      (
        (SELECT user_id FROM public.profiles WHERE email = 'emma@example.com'),
        'Learning TypeScript has transformed how I write JavaScript. Static typing is a game changer!',
        NOW() - INTERVAL '6 hours'
      ),
      
      -- James' Tweets
      (
        (SELECT user_id FROM public.profiles WHERE email = 'james@example.com'),
        'Watching the sunset at the beach. Some moments are just perfect.',
        NOW() - INTERVAL '1 hour'
      ),
      (
        (SELECT user_id FROM public.profiles WHERE email = 'james@example.com'),
        'Nothing better than a Saturday spent coding with good music and coffee.',
        NOW() - INTERVAL '8 hours'
      ),
      -- Default User's Tweets
      (
        (SELECT user_id FROM public.profiles WHERE email = 'user@mail.com'),
        'Hello world! Just joined this amazing platform. Looking forward to connecting with everyone!',
        NOW() - INTERVAL '30 minutes'
      ),
      (
        (SELECT user_id FROM public.profiles WHERE email = 'user@mail.com'),
        'Technology is amazing. What''s everyone working on today?',
        NOW() - INTERVAL '4 hours'
      ),
      (
        (SELECT user_id FROM public.profiles WHERE email = 'user@mail.com'),
        'Just finished a great book on software architecture. The principles are timeless!',
        NOW() - INTERVAL '1 day'
      )
  ) AS tweets (user_id, tweet_text, created_at);

-- ============================================================================
-- SECTION 5: COMMENTS
-- ============================================================================
-- Insert sample comments on various tweets

INSERT INTO
  public.tweet_comments (tweet_id, user_id, comment_text, created_at)
SELECT
  tweet_id,
  user_id,
  comment_text,
  created_at
FROM
  (
    VALUES
      -- Comments on Alex's first tweet
      (
        (SELECT id FROM public.tweets WHERE tweet_text LIKE '%Twitter clone%' LIMIT 1),
        (SELECT user_id FROM public.profiles WHERE email = 'sarah@example.com'),
        'I agree! The interface is really intuitive. Great work!',
        NOW() - INTERVAL '1 hour'
      ),
      (
        (SELECT id FROM public.tweets WHERE tweet_text LIKE '%Twitter clone%' LIMIT 1),
        (SELECT user_id FROM public.profiles WHERE email = 'michael@example.com'),
        'What features are you most excited about?',
        NOW() - INTERVAL '30 minutes'
      ),
      
      -- Comments on Sarah's hike tweet
      (
        (SELECT id FROM public.tweets WHERE tweet_text LIKE '%Beautiful morning for a hike%' LIMIT 1),
        (SELECT user_id FROM public.profiles WHERE email = 'alex@example.com'),
        'Sounds amazing! Which trail did you take?',
        NOW() - INTERVAL '2 hours'
      ),
      (
        (SELECT id FROM public.tweets WHERE tweet_text LIKE '%Beautiful morning for a hike%' LIMIT 1),
        (SELECT user_id FROM public.profiles WHERE email = 'emma@example.com'),
        'Nature is the best inspiration! Hope you took some photos.',
        NOW() - INTERVAL '1 hour 30 minutes'
      ),
      
      -- Comments on Michael's startup announcement
      (
        (SELECT id FROM public.tweets WHERE tweet_text LIKE '%joining a new tech startup%' LIMIT 1),
        (SELECT user_id FROM public.profiles WHERE email = 'james@example.com'),
        'Congratulations! That sounds exciting. What industry?',
        NOW() - INTERVAL '4 hours'
      ),
      (
        (SELECT id FROM public.tweets WHERE tweet_text LIKE '%joining a new tech startup%' LIMIT 1),
        (SELECT user_id FROM public.profiles WHERE email = 'alex@example.com'),
        'Best of luck with the new adventure!',
        NOW() - INTERVAL '3 hours'
      ),
      
      -- Comments on Emma's coffee shop tweet
      (
        (SELECT id FROM public.tweets WHERE tweet_text LIKE '%amazing coffee shop downtown%' LIMIT 1),
        (SELECT user_id FROM public.profiles WHERE email = 'sarah@example.com'),
        'I need to try that place! What''s the name?',
        NOW() - INTERVAL '11 hours'
      ),
      (
        (SELECT id FROM public.tweets WHERE tweet_text LIKE '%amazing coffee shop downtown%' LIMIT 1),
        (SELECT user_id FROM public.profiles WHERE email = 'michael@example.com'),
        'Cold brew is definitely the way to go!',
        NOW() - INTERVAL '10 hours'
      ),
      
      -- Comments on James's sunset tweet
      (
        (SELECT id FROM public.tweets WHERE tweet_text LIKE '%Watching the sunset at the beach%' LIMIT 1),
        (SELECT user_id FROM public.profiles WHERE email = 'emma@example.com'),
        'That sounds absolutely perfect! Enjoy the moment.',
        NOW() - INTERVAL '45 minutes'
      ),
      (
        (SELECT id FROM public.tweets WHERE tweet_text LIKE '%Watching the sunset at the beach%' LIMIT 1),
        (SELECT user_id FROM public.profiles WHERE email = 'sarah@example.com'),
        'Beach sunsets are magical. Which beach?',
        NOW() - INTERVAL '30 minutes'
      ),
      
      -- Comments on James's coding tweet
      (
        (SELECT id FROM public.tweets WHERE tweet_text LIKE '%Saturday spent coding%' LIMIT 1),
        (SELECT user_id FROM public.profiles WHERE email = 'alex@example.com'),
        'That''s my kind of Saturday! What are you working on?',
        NOW() - INTERVAL '7 hours'
      ),
      (
        (SELECT id FROM public.tweets WHERE tweet_text LIKE '%Saturday spent coding%' LIMIT 1),
        (SELECT user_id FROM public.profiles WHERE email = 'michael@example.com'),
        'Coffee + coding + good music = perfect productivity combo!',
        NOW() - INTERVAL '6 hours'
      ),
      
      -- Comments on Default User's tweets
      (
        (SELECT id FROM public.tweets WHERE tweet_text LIKE '%Hello world! Just joined%' LIMIT 1),
        (SELECT user_id FROM public.profiles WHERE email = 'alex@example.com'),
        'Welcome! Great to have you here!',
        NOW() - INTERVAL '25 minutes'
      ),
      (
        (SELECT id FROM public.tweets WHERE tweet_text LIKE '%Hello world! Just joined%' LIMIT 1),
        (SELECT user_id FROM public.profiles WHERE email = 'sarah@example.com'),
        'Welcome to the community! Looking forward to your posts.',
        NOW() - INTERVAL '20 minutes'
      ),
      (
        (SELECT id FROM public.tweets WHERE tweet_text LIKE '%Technology is amazing%' LIMIT 1),
        (SELECT user_id FROM public.profiles WHERE email = 'michael@example.com'),
        'Working on a new React component library. What about you?',
        NOW() - INTERVAL '3 hours 30 minutes'
      ),
      (
        (SELECT id FROM public.tweets WHERE tweet_text LIKE '%Technology is amazing%' LIMIT 1),
        (SELECT user_id FROM public.profiles WHERE email = 'emma@example.com'),
        'Building a mobile app with React Native!',
        NOW() - INTERVAL '3 hours'
      ),
      -- Comments by Default User on other tweets
      (
        (SELECT id FROM public.tweets WHERE tweet_text LIKE '%Twitter clone%' LIMIT 1),
        (SELECT user_id FROM public.profiles WHERE email = 'user@mail.com'),
        'This looks really promising! Can''t wait to try it out.',
        NOW() - INTERVAL '1 hour 30 minutes'
      ),
      (
        (SELECT id FROM public.tweets WHERE tweet_text LIKE '%Beautiful morning for a hike%' LIMIT 1),
        (SELECT user_id FROM public.profiles WHERE email = 'user@mail.com'),
        'That sounds wonderful! Nature is the best way to start the day.',
        NOW() - INTERVAL '2 hours 30 minutes'
      ),
      (
        (SELECT id FROM public.tweets WHERE tweet_text LIKE '%joining a new tech startup%' LIMIT 1),
        (SELECT user_id FROM public.profiles WHERE email = 'user@mail.com'),
        'Congratulations! That''s a big step. Best of luck!',
        NOW() - INTERVAL '4 hours 30 minutes'
      )
  ) AS comments (tweet_id, user_id, comment_text, created_at);

-- ============================================================================
-- SEED COMPLETE
-- ============================================================================
-- Database has been seeded with:
-- - 7 test users (including e2e test user and default user, all with password: Password123!)
-- - All users start with the default avatar (generic-profile-avatar.svg)
-- - 13 sample tweets (2 per regular user + 3 for default user)
-- - 19 sample comments on various tweets
-- ============================================================================
