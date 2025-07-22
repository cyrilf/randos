<script lang="ts" setup>
import type { NavigationMenuItem } from "@nuxt/ui";

const items = computed<NavigationMenuItem[]>(() => [
  {
    label: "Accueil",
    to: "/",
    icon: "i-heroicons-home",
  },
  {
    label: "À propos",
    to: "/a-propos",
    icon: "i-heroicons-information-circle",
  },
]);
</script>

<template>
  <UHeader>
    <template #title> <AppLogo class="w-12" /></template>

    <UNavigationMenu :items="items" />

    <template #right>
      <UColorModeButton />

      <!-- <UTooltip text="Open on GitHub" :kbds="['meta', 'G']">
        <UButton
          color="neutral"
          variant="ghost"
          to="https://github.com/nuxt/ui"
          target="_blank"
          icon="i-simple-icons-github"
          aria-label="GitHub"
        />
      </UTooltip> -->
    </template>
  </UHeader>
</template>
