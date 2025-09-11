import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import flowbiteReact from "flowbite-react/plugin/vite";

// https://vite.dev/config/

export default defineConfig({
  server: {
    open: true, // opens browser automatically
    // host: true,
    port: 5173 // or whatever you prefer
  },
  plugins: [tailwindcss(), react(), flowbiteReact()]
});