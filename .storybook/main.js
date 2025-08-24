

/** @type { import('@storybook/nextjs-vite').StorybookConfig } */
const config = {
  "stories": [
    "../**/*.mdx",
    "../**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  "addons": [
    "@chromatic-com/storybook",
    "@storybook/addon-docs",
    "@storybook/addon-a11y",
    "@storybook/addon-vitest",
    "@storybook/addon-styling-webpack"
  ],
  "framework": {
    "name": "@storybook/nextjs-vite",
    "options": {}
  },
  "staticDirs": [
    "..\\public"
  ]
};
export default config;