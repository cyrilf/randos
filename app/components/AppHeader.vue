<script lang="ts" setup>
import type { NavigationMenuItem } from "@nuxt/ui";

const items = computed<NavigationMenuItem[]>(() => [
  {
    label: "Accueil",
    to: "/",
    icon: "i-lucide-home",
  },
  {
    label: "À propos",
    to: "/a-propos",
    icon: "i-lucide-info",
  },
]);
</script>

<template>
  <header class="bg-default/75 border-default sticky top-0 z-50 h-16 border-b backdrop-blur">
    <div class="mx-auto flex h-full w-full max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
      <div class="flex items-center gap-1.5 lg:flex-1">
        <NuxtLink to="/">
          <AppLogo class="w-12" />
        </NuxtLink>
      </div>

      <UNavigationMenu :items="items" />

      <div class="flex items-center justify-end gap-1.5 lg:flex-1">
        <ColorModeButton />
        <!-- <UButton aria-label="Open menu" color="neutral" variant="ghost" icon="i-lucide-menu" class="sm:hidden" /> -->
      </div>
    </div>
  </header>
</template>
