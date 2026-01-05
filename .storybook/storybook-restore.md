# Storybook Configuration - Restore When Next.js 16 is Supported

**Status**: Storybook is currently disabled because Storybook 8.6.x does not support Next.js 16.

## Files in this directory

All Storybook configuration files are commented out and ready to be restored when Storybook adds Next.js 16 support:

- `main.ts` - Main Storybook configuration (commented out)
- `preview.ts` - Storybook preview configuration (commented out)
- `vitest.setup.ts` - Vitest setup for Storybook tests (commented out)

## Steps to restore Storybook

When Storybook releases a version that supports Next.js 16:

1. **Install Storybook dependencies** in `package.json` (add to `devDependencies`):
   ```json
   "@chromatic-com/storybook": "^3",
   "@storybook/addon-essentials": "^8.6.12",
   "@storybook/addon-onboarding": "^8.6.12",
   "@storybook/addon-themes": "^8.6.12",
   "@storybook/blocks": "^8.6.12",
   "@storybook/experimental-addon-test": "^8.6.12",
   "@storybook/experimental-nextjs-vite": "^8.6.12",
   "@storybook/nextjs": "^8.6.12",
   "@storybook/react": "^8.6.12",
   "@storybook/test": "^8.6.12",
   "eslint-plugin-storybook": "^0.12.0",
   "storybook": "^8.6.12"
   ```

2. **Add Storybook scripts** to `package.json` (add to `scripts`):
   ```json
   "storybook": "storybook dev -p 6006",
   "build-storybook": "storybook build"
   ```

3. **Add Storybook ESLint config** to `package.json` (add to `eslintConfig.extends`):
   ```json
   "extends": [
     "plugin:storybook/recommended"
   ]
   ```

4. **Uncomment the Storybook configuration files**:
   - Uncomment all code in `.storybook/main.ts`
   - Uncomment all code in `.storybook/preview.ts`
   - Uncomment all code in `.storybook/vitest.setup.ts` (if using Vitest for Storybook tests)

5. **Update `vitest.config.ts`**:
   - Uncomment the Storybook-related imports and configuration
   - See comments in `vitest.config.ts` for details

6. **Update `tsconfig.json`**:
   - Remove `"stories"` from the `exclude` array to allow TypeScript to compile story files
   - Remove `".storybook"` from the `exclude` array to allow TypeScript to compile Storybook config files

7. **Update `next.config.ts`** (optional):
   - Remove or comment out the `webpack` configuration that ignores the `stories` directory (lines 27-33)

8. **Run**:
   ```bash
   pnpm install
   pnpm storybook
   ```

## Checking for Next.js 16 support

- Check [Storybook GitHub releases](https://github.com/storybookjs/storybook/releases)
- Check [Storybook documentation](https://storybook.js.org/)
- Check [Storybook Next.js preset documentation](https://storybook.js.org/docs/get-started/frameworks/nextjs)
