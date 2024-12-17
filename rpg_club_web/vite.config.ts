import { defineConfig } from "vitest/config";
import { sveltekit } from "@sveltejs/kit/vite";

export default defineConfig({
    plugins: [sveltekit()],

    server: {
        fs: {
            // Allow serving files from one level up to the project root
            allow: ["../rpg_club_core/pkg"],
        },
    },

    test: {
        include: ["src/**/*.test.ts"],
    },
});
