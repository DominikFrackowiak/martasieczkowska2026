import type { StorybookConfig } from '@storybook-astro/framework';
import tailwindcss from '@tailwindcss/vite';

const config: StorybookConfig = {
 stories: [
  '../../front/src/**/*.stories.@(js|jsx|ts|tsx)',
 ],

 framework: {
  name: '@storybook-astro/framework',
  options: {},
 },

 async viteFinal(config) {
  config.plugins = config.plugins || [];
  config.plugins.push(tailwindcss());

  return config;
 },
};

export default config;