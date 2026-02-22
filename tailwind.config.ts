import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        sand: {
          50: "#F7F5F2",
          100: "#EFEAE4",
          200: "#E2D8CD"
        },
        ink: {
          900: "#1E1E1E",
          700: "#3B3B3B",
          500: "#5A5A5A"
        },
        calm: {
          500: "#5B7C99",
          100: "#DCE7F0"
        }
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Helvetica",
          "Arial",
          "sans-serif"
        ]
      }
    }
  },
  plugins: []
};

export default config;
