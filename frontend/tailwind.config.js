/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                "primary": "#f9fafb", // Bone White
                "primary-dark": "#9ca3af",
                "background-dark": "#0a0a0a", // Deep Charcoal
                "background-black": "#000000",
                "accent": "#ef4444", // Optional blood red for highlights
            },
            fontFamily: {
                "display": ["Inter", "sans-serif"],
                "skull": ["Creepster", "cursive"] // Adding a more fitting font
            },
            borderRadius: {
                "DEFAULT": "4px",
                "lg": "8px",
                "xl": "12px",
                "full": "9999px"
            },
        },
    },
    plugins: [],
}
