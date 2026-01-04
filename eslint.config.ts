import nextConfig from "eslint-config-next";
import prettierConfig from "eslint-config-prettier";

const nextConfigs = Array.isArray(nextConfig) ? nextConfig : [nextConfig];
const nextConfigsWithOverrides = nextConfigs.map(config => {
  if (config?.name === "next/typescript") {
    return {
      ...config,
      rules: {
        ...config.rules,
        "@typescript-eslint/no-explicit-any": "error",
        "@typescript-eslint/no-unused-vars": "error",
        "@typescript-eslint/no-empty-object-type": "error",
      },
    };
  }

  return config;
});

const config = [
  {
    ignores: [
      "**/node_modules/**",
      "**/.next/**",
      "**/out/**",
      "**/dist/**",
      "**/build/**",
      "**/coverage/**",
    ],
  },
  // `eslint-config-next` (v16+) exports a Flat Config array, so we can spread it directly.
  ...nextConfigsWithOverrides,
  {
    name: "kickoff/no-console",
    rules: {
      "no-console": "error",
    },
  },
  {
    name: "prettier",
    rules: prettierConfig.rules,
  },
];

export default config;
