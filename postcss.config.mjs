const config = {
  plugins: {
    // Use the PostCSS wrapper package for Tailwind so Next's loader doesn't try to load
    // the `tailwindcss` runtime plugin directly. Ensure `@tailwindcss/postcss` is installed.
    "@tailwindcss/postcss": {},
    autoprefixer: {},
  },
};

export default config;