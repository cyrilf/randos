import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: ["@nuxt/eslint", "@nuxt/image", "@nuxt/ui"],
  vite: {
    plugins: [tailwindcss()],
  },
  runtimeConfig: {
    notionApiKey: "", // can be overridden by NUXT_NOTION_API_KEY environment variable
    notionDatabaseId: "", // can be overridden by NUXT_NOTION_DATABASE_ID environment variable
    appBaseUrl: "", // can be overridden by NUXT_APP_BASE_URL environment variable
    public: {
      myMapsEmbedUrl: "", // can be overridden by NUXT_PUBLIC_MY_MAPS_EMBED environment variable,
      githubWorkflowApiUrl: "", // can be overridden by NUXT_PUBLIC_GITHUB_WORKFLOW_API_URL environment variable
    },
  },
  css: ["~/assets/css/main.css", "vue-3-fullscreen-image-directive-plugin/style.css"],
  experimental: {
    viewTransition: true,
    appManifest: false,
  },

  icon: {
    provider: "none",
    clientBundle: {
      scan: true,
    },
  },

  ssr: true,
  nitro: {
    prerender: {
      crawlLinks: true,
      failOnError: false,
      routes: ["/admin/build-hooks"],
    },
  },
});
