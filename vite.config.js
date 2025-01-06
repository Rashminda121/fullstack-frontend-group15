import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/socket.io": {
        // Match the path prefix of your socket.io requests
        target: "http://localhost:4000",
        ws: true, // Important for WebSockets
      },
    },
  },
});
