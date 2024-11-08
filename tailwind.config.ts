import type { Config } from "tailwindcss";
import {withUt} from "uploadthing/tw"
import animate from "tailwindcss-animate"
const config: Config = withUt({
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: 'hsl(0, 0%, 100%)',
        foreground: 'hsl(224, 71.4%, 4.1%)',
        card: 'hsl(0, 0%, 100%)',
        cardForeground: 'hsl(224, 71.4%, 4.1%)',
        popover: 'hsl(0, 0%, 100%)',
        popoverForeground: 'hsl(224, 71.4%, 4.1%)',
        primary: 'hsl(262.1, 83.3%, 57.8%)',
        primaryForeground: 'hsl(210, 20%, 98%)',
        secondary: 'hsl(220, 14.3%, 95.9%)',
        secondaryForeground: 'hsl(220.9, 39.3%, 11%)',
        muted: 'hsl(220, 14.3%, 95.9%)',
        mutedForeground: 'hsl(220, 8.9%, 46.1%)',
        accent: 'hsl(220, 14.3%, 95.9%)',
        accentForeground: 'hsl(220.9, 39.3%, 11%)',
        destructive: 'hsl(0, 84.2%, 60.2%)',
        destructiveForeground: 'hsl(210, 20%, 98%)',
        border: 'hsl(220, 13%, 91%)',
        input: 'hsl(220, 13%, 91%)',
        ring: 'hsl(262.1, 83.3%, 57.8%)',
      },
      borderRadius: {
        lg: '0.5rem',
        md: 'calc(0.5rem - 2px)',
        sm: 'calc(0.5rem - 4px)',
      },
    },
  },
  plugins: [animate],
});

export default config;
