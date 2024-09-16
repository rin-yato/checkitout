import { radixColors } from "./src/lib/tailwind";
import defaultTheme from "tailwindcss/defaultTheme";

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./src/**/*.tsx", "index.html"],
  theme: {
    colors: {
      transparent: "transparent",
      current: "currentColor",
      black: "black",
      white: "white",

      border: "var(--border)",
      input: "var(--input)",
      ring: "var(--ring))",

      background: "var(--background)",
      foreground: "var(--foreground)",
      overlay: "var(--overlay)",
      surface: "var(--surface)",
      "panel-solid": "var(--panel-solid)",
      "panel-translucent": "var(--panel-translucent)",

      primary: {
        DEFAULT: "var(--primary)",
        foreground: "var(--primary-foreground)",

        hover: "var(--primary-hover)",
        active: "var(--primary-active)",
      },

      gray: {
        DEFAULT: "var(--gray)",
        foreground: "var(--gray-foreground)",

        hover: "var(--gray-hover)",
        active: "var(--gray-active)",
      },

      danger: {
        DEFAULT: "var(--danger)",
        foreground: "var(--danger-foreground)",

        hover: "var(--danger-hover)",
        active: "var(--danger-active)",
      },

      success: {
        DEFAULT: "var(--success)",
        foreground: "var(--success-foreground)",

        hover: "var(--success-hover)",
        active: "var(--success-active)",
      },
    },

    borderRadius: {
      DEFAULT: "var(--radius-3)",
      1: "var(--radius-1)",
      2: "var(--radius-2)",
      3: "var(--radius-3)",
      4: "var(--radius-4)",
      5: "var(--radius-5)",
      6: "var(--radius-6)",
      item: "max(var(--radius-2),var(--radius-full))",
      full: "9999px",
    },

    fontSize: {
      1: "var(--font-size-1)",
      2: "var(--font-size-2)",
      3: "var(--font-size-3)",
      4: "var(--font-size-4)",
      5: "var(--font-size-5)",
      6: "var(--font-size-6)",
      7: "var(--font-size-7)",
      8: "var(--font-size-8)",
      9: "var(--font-size-9)",
    },

    fontWeight: {
      light: "300",
      regular: "400",
      medium: "500",
      semibold: "600",
      bold: "700",
      DEFAULT: "400",
    },

    extend: {
      fontFamily: {
        sans: ["var(--font-family-sans)", ...defaultTheme.fontFamily.sans],
        mono: ["var(--font-family-mono)", ...defaultTheme.fontFamily.mono],
      },
      boxShadow: {
        1: "var(--shadow-1)",
        2: "var(--shadow-2)",
        3: "var(--shadow-3)",
        4: "var(--shadow-4)",
        5: "var(--shadow-5)",
        6: "var(--shadow-6)",
      },
      letterSpacing: {
        1: "var(--letter-spacing-1)",
        2: "var(--letter-spacing-2)",
        3: "var(--letter-spacing-3)",
        4: "var(--letter-spacing-4)",
        5: "var(--letter-spacing-5)",
        6: "var(--letter-spacing-6)",
        7: "var(--letter-spacing-7)",
        8: "var(--letter-spacing-8)",
        9: "var(--letter-spacing-9)",
      },
      lineHeight: {
        1: "var(--line-height-1)",
        2: "var(--line-height-2)",
        3: "var(--line-height-3)",
        4: "var(--line-height-4)",
        5: "var(--line-height-5)",
        6: "var(--line-height-6)",
        7: "var(--line-height-7)",
        8: "var(--line-height-8)",
        9: "var(--line-height-9)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("tailwindcss-radix")(), radixColors],
};
