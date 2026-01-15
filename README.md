# Kickoff

A production-ready Next.js starter template inspired by Twitter, featuring authentication, SEO optimization, analytics, error tracking, UI components, Supabase integration, and e2e testing. Built to help developers ship their applications faster, clone this repo and customize it to fit your needs without starting from scratch.

## Features

- ⚡️ Next.js 16 with App Router
- ⚛️ React 19
- 🎨 Tailwind CSS 4 with animation support
- 🧩 Radix UI components
- 🎯 TypeScript 5
- 📝 ESLint 9 + Prettier 3
- 🐶 Husky 9 for git hooks (with lint-staged)
- 🎭 Playwright for E2E testing
- 🗄️ Supabase (authentication, database, storage)
- 📊 PostHog analytics integration
- 🔄 TanStack Query (React Query) for data fetching
- ✅ Zod for schema validation
- 📋 React Hook Form for form management
- 🔍 SEO utilities (metadata, sitemap, robots)

## Prerequisites

- Node.js 20 or later
- pnpm 8 or later
- Docker Desktop (for local Supabase)
- Supabase CLI (macOS): `brew install supabase/tap/supabase`

## Code Formatting

This project uses Prettier for code formatting. To ensure consistent formatting across your development environment:

1. Install the Prettier extension for your code editor:
   - [VS Code](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

2. Configure your editor to format on save and use the project's Prettier configuration.

The project's Prettier configuration is defined in `.prettierrc` and will be automatically used when running `pnpm format`.

## Getting Started

1. Clone the repository:

```bash
git clone <repository-url>
cd Kickoff
```

2. Install dependencies:

```bash
pnpm install
```

3. Set up environment variables:

```bash
cp .env.example .env
```

4. Start Supabase locally:

```bash
pnpm supabase:start
pnpm supabase:db:reset
pnpm supabase:generate:types
```

5. Update your `.env` (values come from `supabase status`):

```bash
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:55321
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_publishable_key
SUPABASE_SERVICE_ROLE_KEY=your_secret_key
```

**Note**: When you run `supabase status`, you'll see "publishable" and "secret" keys. The **publishable** key is your `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and the **secret** key is your `SUPABASE_SERVICE_ROLE_KEY`.

Optional (SEO + auth redirect URLs):

```bash
# Canonical public URL for SEO (used by metadataBase, sitemap, robots)
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Used by Supabase auth redirects / callback URLs
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3000
```

Optional (analytics via PostHog):

```bash
NEXT_PUBLIC_POSTHOG_KEY=...
NEXT_PUBLIC_POSTHOG_HOST=...
POSTHOG_API_KEY=...
POSTHOG_ENV_ID=...
```

6. Start the development server:

```bash
pnpm dev
```

### Supabase Commands

The project includes several Supabase-related commands to help with local development:

- `pnpm supabase:start` - Starts the local Supabase development environment. This will spin up all necessary Docker containers.

- `pnpm supabase:stop` - Stops all running Supabase services. Use this when you want to free up system resources or restart the services.

- `pnpm supabase:db:push` - Pushes your local schema changes to a linked/remote Supabase project (if you choose to link one).

- `pnpm supabase:db:reset` - Resets your local Supabase database to a clean state. This will drop all data and recreate the database schema from scratch. Useful during development when you want to start fresh or after making significant schema changes.

Local URLs (from `supabase/config.toml`):

- App: `http://localhost:3000`
- Supabase API: `http://127.0.0.1:55321`
- Supabase DB: `postgresql://postgres:postgres@127.0.0.1:55322/postgres`
- Supabase Studio: `http://127.0.0.1:55323`
- Inbucket (local email UI): `http://127.0.0.1:55324`

## Database Migrations

This repo intentionally keeps **one clean migration**:

- `supabase/migrations/20250630032807_twitter_clone_schema.sql`

When you change the schema:

```bash
pnpm supabase:db:reset
pnpm supabase:generate:types
```

## Storybook

**Note**: Storybook is currently not compatible with Next.js 16. The project includes Storybook stories in the `stories/` directory that were created when the project used Next.js 15. These stories are preserved for future use once Storybook adds official support for Next.js 16.

Storybook 8.6.x officially supports Next.js up to version 15. When Storybook releases a version that supports Next.js 16, you can restore Storybook by:

1. Installing Storybook dependencies (see `.storybook/storybook-restore.md` for the complete list)
2. Uncommenting the Storybook configuration files in `.storybook/`
3. Uncommenting the Storybook configuration in `vitest.config.ts`
4. Following the restoration instructions in `.storybook/storybook-restore.md`

All Storybook configuration code is preserved in commented form in the relevant files and ready to be restored when compatible.

To check for Storybook updates and Next.js 16 compatibility, visit the [Storybook GitHub releases](https://github.com/storybookjs/storybook/releases) or [Storybook documentation](https://storybook.js.org/).

## Available Scripts

- `pnpm dev` - Start the development server
- `pnpm build` - Build the application for production
- `pnpm start` - Start the production server
- `pnpm lint` - Run ESLint
- `pnpm format` - Format code with Prettier
- `pnpm typecheck` - Run TypeScript type checking

## Project Structure

- `app/` - Next.js app router pages and layouts
- `components/` - Reusable React components
- `stories/` - Storybook stories
- `hooks/` - Custom React hooks
- `utils/` - Shared utilities (Supabase clients, validators, logging)
- `db/` / `data/` - Data access layer
- `public/` - Static assets
- `supabase/` - Local Supabase config, migrations, seed

## Testing

This project uses Playwright for end-to-end testing to ensure application functionality and user experience quality.

### End-to-End Testing with Playwright

To run the e2e tests:

```bash
pnpm e2e        # Run e2e tests
pnpm e2e:ui     # Run e2e tests with interactive UI
pnpm e2e:report # Show test results report
```

### First-Time Setup

Before running e2e tests for the first time, you need to install Playwright browsers:

```bash
pnpm exec playwright install
```

This will download the necessary browser binaries (Chromium, Firefox, WebKit) that Playwright uses for testing.

### Running Tests

1. Make sure your local development environment is set up (follow the "Getting Started" section above)
2. Run the tests:
   ```bash
   pnpm e2e
   ```

The development server will automatically start when running tests.

## Recommended

To maintain a high-quality and consistent codebase, please follow these best practices:

- **Component Documentation**: When Storybook support for Next.js 16 is available, add a Storybook story for every new component in the `components/ui` folder. The existing stories in `stories/components/ui/` serve as examples and will be usable once Storybook is reinstalled.

Feel free to expand this section with more best practices as the project evolves.

## Supabase Best Practices

When working with Supabase locally, follow these best practices to ensure a smooth development experience:

1. **Database Schema Management**
   - Keep your database schema changes in version control
   - Use `supabase:db:push` frequently to keep your local database in sync with your schema changes
   - Before pushing schema changes, test them locally first
   - Use `supabase:db:reset` when you need a clean slate, but be aware it will delete all data

2. **Environment Variables**
   - Never commit your `.env` file to version control
   - Keep a `.env.example` file with placeholder values
   - Use different environment variables for development and production

3. **Local Development**
   - Start Supabase services at the beginning of your development session
   - Stop Supabase services when you're done to free up system resources or if you're working in other projects
   - If you encounter issues, try stopping and restarting the services
   - Keep Docker Desktop running while working with Supabase

4. **Data Management**
   - Use Row Level Security (RLS) policies from the start
   - Always test RLS policies locally before deploying
   - Use the Supabase dashboard (available at `http://127.0.0.1:55323`) to manage your local database
   - Use seed data for development and testing

5. **TypeScript Types**
   - Generate types after any schema changes using `supabase gen types typescript --local > types/supabase.ts`
   - Keep your types in a dedicated `types` directory
   - Update types whenever you:
     - Create new tables
     - Modify existing tables (add/remove columns)
     - Change column types
     - Add or modify RLS policies
   - Use the generated types in your database queries for better type safety
   - Consider creating custom type utilities for common database operations
   - Never modify the generated types file directly

6. **Performance**
   - Monitor your local database size
   - Use `supabase:db:reset` periodically to clean up test data
   - Keep your Supabase CLI and Docker images up to date

7. **Troubleshooting**
   - If services fail to start, check Docker Desktop is running
   - Use `docker ps` to verify all required containers are running
   - Check the Supabase logs in Docker Desktop for detailed error messages
   - If issues persist, try `supabase:stop` followed by `supabase:start`

Remember that your local Supabase instance is for development only. Always test your changes in a staging environment before deploying to production.

## 📚 Architecture & Documentation

This template includes comprehensive documentation covering architecture, SEO, and analytics:

- **[Server Components Architecture](docs/server-components-architecture.md)** - Server-side rendering patterns, data fetching, actions, revalidation, and loading states
- **[SEO Strategy](docs/seo-strategy.md)** - Metadata management, sitemap generation, robots.txt configuration, and performance optimization
- **[Product Analytics](docs/product-analytics.md)** - PostHog integration for tracking user interactions and product metrics
