import { createConfig } from '@tokenami/dev';

export default createConfig({
  include: ['./src/**/*.{js,jsx,ts,tsx,astro}'],
  grid: '0.25rem',
  theme: {
    color: {
      'gray-dark': '#222939'
    }
  }
});
