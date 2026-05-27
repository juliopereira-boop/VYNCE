import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/**/*.{ts,tsx}',
    // Scan the shared UI library so its Tailwind classes are generated.
    '../../packages/ui/src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Vynce brand — verde-petróleo/esmeralda (inspirado em CRMs imobiliários
        // de alto padrão): confiança, sofisticação e modernidade.
        brand: {
          50: '#e9faf4',
          100: '#c7f1e4',
          200: '#93e6cd',
          300: '#57d6b2',
          400: '#1ec39a',
          500: '#00b389',
          600: '#009e8a',
          700: '#1f7a6b',
          800: '#006b5c',
          900: '#1f3a35',
          950: '#0f2420',
        },
      },
      fontFamily: {
        sans: [
          'var(--font-inter)',
          'Inter',
          'Lato',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
        display: [
          'var(--font-sora)',
          'var(--font-inter)',
          'Sora',
          'ui-sans-serif',
          'system-ui',
          'sans-serif',
        ],
      },
      boxShadow: {
        card: '0 3px 24px 0 rgb(15 23 42 / 0.06)',
        'card-hover': '0 8px 30px 0 rgb(15 23 42 / 0.12)',
      },
    },
  },
  plugins: [],
};

export default config;
