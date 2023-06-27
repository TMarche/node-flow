/** @type {import('tailwindcss').Config} */
export default {
    content: ["./src/**/*.{html,js,jsx,tsx}"],
    theme: {
        extend: {
            rotate: {
                270: "270deg",
            },
            boxShadow: {
                "source-initial": "0 0 0 0 rgb(251,146,60)",
                "source-hover": "0 0 0 4px rgb(251,146,60)",
                "storage-initial": "0 0 0 0 rgb(254,215,170)",
                "storage-hover": "0 0 0 4px rgb(254,215,170)",
                "extractor-initial": "0 0 0 0 rgb(191,219,254)",
                "extractor-hover": "0 0 0 4px rgb(191,219,254)",
            },
        },
    },
    plugins: [],
};
