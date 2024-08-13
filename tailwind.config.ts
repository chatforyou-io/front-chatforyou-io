import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          normal: "#3A84F8",
          strong: "#005EEB",
          heavy: "#0054D1",
        },
        error: "#FF2727"
      },
    },
  },
  plugins: [],
  darkMode: "class",
};
export default config;
