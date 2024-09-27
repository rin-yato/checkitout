import plugin from "tailwindcss/plugin";

const COLORS = {
  primary: "accent",
  gray: "gray",
  destructive: "red",
  success: "green",
  warning: "amber",
};

const SCALE = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

export const radixColors = plugin(() => {}, {
  theme: {
    extend: {
      colors: Object.entries(COLORS).reduce(
        (acc, [key, value]) => {
          for (const scale of SCALE) {
            acc[`${key}-${scale}`] = `var(--${value}-${scale})`;
            acc[`${key}-a${scale}`] = `var(--${value}-a${scale})`;
          }
          return acc;
        },
        {} as Record<string, string>,
      ),
    },
  },
});
