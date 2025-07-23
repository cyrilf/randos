import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: ["@nuxt/eslint", "@nuxt/image", "@nuxt/ui-pro"],
  vite: {
    plugins: [tailwindcss()],
  },
  runtimeConfig: {
    notionApiKey: "", // can be overridden by NUXT_NOTION_API_KEY environment variable
    notionDatabaseId: "", // can be overridden by NUXT_NOTION_DATABASE_ID environment variable
    appBaseUrl: "", // can be overridden by NUXT_APP_BASE_URL environment variable
    public: {
      myMapsEmbed: "", // can be overridden by NUXT_PUBLIC_MY_MAPS_EMBED environment variable,
    },
  },
  css: ["~/assets/css/main.css", "vue-3-fullscreen-image-directive-plugin/style.css"],
  experimental: {
    viewTransition: true,
  },

  ssr: true,
});
