import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: 'class',
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#0F2A43",
        canvas: "#EEF2F1",
        accent: "#E8821E",
        accentDeep: "#C2660E",
        success: "#1B8A5A",
        successBg: "#E4F4EC",
        danger: "#C0392B",
        dangerBg: "#FBEAE8",
        catNumerik: "#2E6F95",
        catLogika: "#6B4FA0",
        catVerbal: "#117A73",
        catSituasional: "#C2660E",
      },
    },
  },
  plugins: [],
};
export default config;
