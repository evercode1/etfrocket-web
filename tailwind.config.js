/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],

    theme: {
        extend: {
            colors: {
                brand: {
                    background: "#0c1324",
                    surface: "#191f31",
                    surfaceLow: "#151b2d",
                    surfaceHigh: "#23293c",
                    surfaceHighest: "#2e3447",
                    primary: "#a4e6ff",
                    primaryStrong: "#00d1ff",
                    secondary: "#c0c1ff",
                    text: "#dce1fb",
                    muted: "#bbc9cf",
                    outline: "#3c494e",
                    danger: "#ffb4ab",
                },
            },

            fontFamily: {
                display: ["Sora", "sans-serif"],
                body: ["Geist", "sans-serif"],
                mono: ["JetBrains Mono", "monospace"],
            },

            boxShadow: {
                glow: "0 0 40px -10px rgba(0, 209, 255, 0.25)",
            },
        },
    },

    plugins: [],
};
